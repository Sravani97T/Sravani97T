import React, { useState, useEffect, useRef } from "react";
import { Select, Row, Col, Breadcrumb, Button, Card } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const { Option } = Select;

const CustomTable = () => {
    const [mainProduct, setMainProduct] = useState("GOLD");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [columnTotals, setColumnTotals] = useState({});
    const tableRef = useRef(null);

    useEffect(() => {
        axios
            .get(`${CREATE_jwel}/api/InventoryReports/GetStockBalances?suspennce=NO`)
            .then((response) => {
                setData(response.data.map((item) => item.MNAME));
            })
            .catch((error) => console.error("Error fetching MNAME options:", error));
    }, []);

    useEffect(() => {
        axios
            .get(`${CREATE_jwel}/api/InventoryReports/GetCounterChart?mName=${mainProduct}&suspennce=NO`)
            .then((response) => {
                const uniqueProducts = {};
                const totals = {};
                response.data.forEach(({ PRODUCTNAME, CNTCHARTDISPLAY, PCS }) => {
                    if (!uniqueProducts[PRODUCTNAME]) {
                        uniqueProducts[PRODUCTNAME] = { PRODUCTNAME, totalPCS: 0 };
                    }
                    uniqueProducts[PRODUCTNAME][CNTCHARTDISPLAY] = (uniqueProducts[PRODUCTNAME][CNTCHARTDISPLAY] || 0) + PCS;
                    uniqueProducts[PRODUCTNAME].totalPCS += PCS;

                    totals[CNTCHARTDISPLAY] = (totals[CNTCHARTDISPLAY] || 0) + PCS;
                });
                setFilteredData(Object.values(uniqueProducts));
                setColumnTotals(totals);
            })
            .catch((error) => console.error("Error fetching counter chart data:", error));
    }, [mainProduct]);

    // Print only the table
    const handlePrint = () => {
        const printContents = tableRef.current.innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = `<table border="1" style="width:100%; text-align:center; border-collapse:collapse;">${printContents}</table>`;
        window.print();
        document.body.innerHTML = originalContents;
    };

    const handlePDF = () => {
        const doc = new jsPDF("l", "mm", "a4"); // Landscape mode for wide table
        doc.text("Counter Chart Report", 14, 10);
    
        // Define table headers with S.No
        const headers = [
            "S.No",
            "Product Name",
            ...Array.from({ length: 13 }, (_, i) => `CNT-${i + 1}`),
            "Total"
        ];
    
        // Prepare table data with S.No
        const tableData = filteredData.map((item, index) => [
            index + 1, // S.No
            item.PRODUCTNAME,
            ...Array.from({ length: 13 }, (_, i) => item[`CNT${i + 1}`] || ""),
            item.totalPCS
        ]);
    
        // Add total row
        const totalRow = [
            "", // Empty S.No for total row
            "Total",
            ...Array.from({ length: 13 }, (_, i) => columnTotals[`CNT${i + 1}`] || ""),
            Object.values(columnTotals).reduce((sum, value) => sum + value, 0)
        ];
    
        // Generate table
        autoTable(doc, {
            head: [headers],
            body: [...tableData, totalRow],
            startY: 20,
            styles: { fontSize: 8, cellPadding: 2, valign: "middle", halign: "center" },
            headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontSize: 9, fontStyle: "bold" },
            columnStyles: { 1: { halign: "left" } }, // Align Product Name to the left
        });
    
        // Open PDF preview
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, "_blank");
    };
    

    const handleExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Counter Chart Report");
    
        // Define table headers with S.No
        const headers = [
            "S.No",
            "Product Name",
            ...Array.from({ length: 13 }, (_, i) => `CNT-${i + 1}`),
            "Total",
        ];
    
        // Apply styling for header row
        const headerRow = worksheet.addRow(headers);
        headerRow.font = { bold: true, size: 10 };
        headerRow.alignment = { horizontal: "center", vertical: "middle" };
        headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "DCDCDC" } }; // Light Grey Background
        headerRow.eachCell((cell) => {
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
    
        // Prepare table data with S.No
        filteredData.forEach((item, index) => {
            const rowData = [
                index + 1, // S.No
                item.PRODUCTNAME,
                ...Array.from({ length: 13 }, (_, i) => item[`CNT${i + 1}`] || ""),
                item.totalPCS,
            ];
            worksheet.addRow(rowData).alignment = { horizontal: "center", vertical: "middle" };
        });
    
        // Add total row with styling
        const totalRowData = [
            "", // Empty S.No for total row
            "Total",
            ...Array.from({ length: 13 }, (_, i) => columnTotals[`CNT${i + 1}`] || ""),
            Object.values(columnTotals).reduce((sum, value) => sum + value, 0),
        ];
        const totalRow = worksheet.addRow(totalRowData);
        totalRow.font = { bold: true };
        totalRow.alignment = { horizontal: "center", vertical: "middle" };
        totalRow.eachCell((cell) => {
            cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        });
    
        // Auto adjust column width
        worksheet.columns.forEach((column) => { column.width = 12; });
        worksheet.getColumn(2).width = 25; // Make "Product Name" wider
    
        // Generate and download Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "CounterChartReport.xlsx");
    };
    

    return (
        <div>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Counter Chart</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Card style={{ width: "100%", marginBottom: 16, backgroundColor: "#7b80a1" }}>
                <Row justify="space-between" align="middle">
                    {/* Left side: Dropdown */}
                    <Col>
                        <Select
                            value={mainProduct}
                            onChange={setMainProduct}
                            style={{ width: 200 }} // Fixed width for dropdown
                        >
                            {data.map((item) => (
                                <Option key={item} value={item}>
                                    {item}
                                </Option>
                            ))}
                        </Select>
                    </Col>

                    {/* Right side: Buttons */}
                    <Col>
                        <Button onClick={handlePrint} type="primary">
                            Print
                        </Button>
                        <Button
                            onClick={handlePDF}
                            style={{
                                marginLeft: 8,
                                backgroundColor: "#0052cc",
                                color: "#fff",
                                border: "none",
                            }}
                        >
                            PDF Preview
                        </Button>
                        <Button
                            onClick={handleExcel}
                            style={{
                                marginLeft: 8,
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                            }}
                        >
                            Excel
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <div ref={tableRef}>
    <table border="1" style={{ width: "100%", textAlign: "center", borderCollapse: "collapse" }}>
        <thead>
            <tr>
                <th style={{ height: "30px", padding: "6px", textAlign: "center", fontSize: "14px" }}>S.No</th>
                <th style={{ height: "30px", padding: "6px", textAlign: "center", fontSize: "14px" }}>Product Name</th>
                {Array.from({ length: 13 }, (_, i) => (
                    <th key={i} style={{ height: "50px", padding: "6px", textAlign: "center", fontSize: "14px" }}>CNT-{i + 1}</th>
                ))}
                <th style={{ height: "50px", padding: "6px", textAlign: "center", fontSize: "14px" }}>Total</th>
            </tr>
        </thead>

        <tbody>
            {filteredData.map((item, index) => (
                <tr key={index}>
                    <td style={{ textAlign: "center" }}>{index + 1}</td> {/* Serial Number */}
                    <td style={{ textAlign: "left" }}>{item.PRODUCTNAME}</td>
                    {Array.from({ length: 13 }, (_, i) => (
                        <td key={i}>{item[`CNT${i + 1}`] || ""}</td>
                    ))}
                    <td style={{ textAlign: "center" }}>{item.totalPCS}</td>
                </tr>
            ))}
            <tr style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                <td style={{ textAlign: "center" }}></td> {/* Empty S.No for total row */}
                <td style={{ textAlign: "center" }}>Total</td>
                {Array.from({ length: 13 }, (_, i) => (
                    <td key={i} style={{ textAlign: "center" }}>{columnTotals[`CNT${i + 1}`] || ""}</td>
                ))}
                <td style={{ textAlign: "center" }}>
                    {Object.values(columnTotals).reduce((sum, value) => sum + value, 0)}
                </td>
            </tr>
        </tbody>
    </table>
</div>

        </div>
    );
};

export default CustomTable;
