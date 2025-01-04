import React, { useState, useEffect } from 'react';
import { Table, Breadcrumb, Row, Col, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProductWiseSaleDetailes = () => {
    const [data, setData] = useState([]);
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetProductWiseSaleDetail?fromDate=${fromDate}&toDate=${toDate}`)
                .then(response => {
                    setData(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the data!', error);
                });
        }
    }, [dates]);

    const handlePrint = () => {
        const printContent = document.getElementById('printableTable');
        if (printContent) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Print</title>');
            printWindow.document.write('<style>table { width: 100%; border-collapse: collapse; font-size: 8px; } th, td { border: 1px solid black; padding: 4px; text-align: left; } .ant-pagination { display: none; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        } else {
            console.error('Printable content not found');
        }
    };
    const handlePDFWithPreview = () => {
        const doc = new jsPDF('landscape');
        const totals = getTotals();
        const tableData = data.map((item, index) => [
            index + 1,
            moment(item.BillDate).format('DD/MM/YYYY'),
            item.JewelType,
            item.BillNo,
            item.TagNo,
            item.Mname,
            item.ProductName,
            item.Prefix,
            item.Pieces,
            item.Gwt.toFixed(3),
            item.Nwt.toFixed(3),
            item.Item_Cts,
            item.Item_Diamonds,
            item.Item_Uncuts,
            item.Amount.toFixed(2),
            item.Itemamt.toFixed(2),
            item.Totamt.toFixed(2),
            item.MANUFACTURER,
            item.Desc1,
            moment(item.TagDate).format('DD/MM/YYYY'),
            item.HUID,
            item.HSNCODE,
            item.PVALUE,
            item.SVALUE
        ]);
    
        tableData.push([
            'Total',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            totals.totalPCS,
            totals.totalGWT,
            totals.totalNWT,
            '',
            '',
            '',
            totals.totalAmount,
            totals.totalItemAmt,
            totals.totalTotAmt,
            '',
            '',
            '',
            '',
            '',
            '',
            ''
        ]);
    
        doc.autoTable({
            head: [['S. No', 'Bill Date', 'Jewel Type', 'Bill No', 'Tag No', 'Main Product', 'Product Name', 'Prefix', 'PCS', 'GWT', 'NWT', 'CTS', 'Dia CTS', 'Uncuts', 'Amount', 'Items Amt', 'Total Amt', 'Manufacturer', 'Description', 'Tag Date', 'HUID', 'HSN Code', 'PValue', 'SValue']],
            body: tableData,
            styles: { cellPadding: 1, fontSize: 5, lineColor: [200, 200, 200], lineWidth: 0.1, fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 5, fontStyle: 'normal' },
            footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [200, 200, 200], fontStyle: 'normal' },
            margin: { top: 5, bottom: 5 }
        });
    
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const previewWindow = window.open(pdfUrl, '_blank');
        previewWindow.document.write('<html><head><title>PDF Preview</title></head><body>');
        previewWindow.document.write('<iframe src="' + pdfUrl + '" width="100%" height="100%" style="border:none;"></iframe>');
        previewWindow.document.write('<button id="savePdf" style="position:fixed;top:10px;right:10px;">Save PDF</button>');
        previewWindow.document.write('</body></html>');
        previewWindow.document.close();
        previewWindow.onload = () => {
            previewWindow.document.getElementById('savePdf').onclick = () => {
                saveAs(pdfBlob, 'D:/PDF_PATH/product_wise_sale_details.pdf');
            };
        };
    };
    
    const handleExcel = async () => {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Product Wise Sale Details');
        const totals = getTotals();
    
        worksheet.columns = [
            { header: 'S. No', key: 'sno', width: 5 },
            { header: 'Bill Date', key: 'BillDate', width: 15 },
            { header: 'Jewel Type', key: 'JewelType', width: 15 },
            { header: 'Bill No', key: 'BillNo', width: 10 },
            { header: 'Tag No', key: 'TagNo', width: 10 },
            { header: 'Main Product', key: 'Mname', width: 15 },
            { header: 'Product Name', key: 'ProductName', width: 20 },
            { header: 'Prefix', key: 'Prefix', width: 10 },
            { header: 'PCS', key: 'Pieces', width: 10 },
            { header: 'GWT', key: 'Gwt', width: 10 },
            { header: 'NWT', key: 'Nwt', width: 10 },
            { header: 'CTS', key: 'Item_Cts', width: 10 },
            { header: 'Dia CTS', key: 'Item_Diamonds', width: 10 },
            { header: 'Uncuts', key: 'Item_Uncuts', width: 10 },
            { header: 'Amount', key: 'Amount', width: 15 },
            { header: 'Items Amt', key: 'Itemamt', width: 15 },
            { header: 'Total Amt', key: 'Totamt', width: 15 },
            { header: 'Manufacturer', key: 'MANUFACTURER', width: 20 },
            { header: 'Description', key: 'Desc1', width: 20 },
            { header: 'Tag Date', key: 'TagDate', width: 15 },
            { header: 'HUID', key: 'HUID', width: 10 },
            { header: 'HSN Code', key: 'HSNCODE', width: 15 },
            { header: 'PValue', key: 'PVALUE', width: 10 },
            { header: 'SValue', key: 'SVALUE', width: 10 }
        ];
    
        data.forEach((item, index) => {
            worksheet.addRow({
                sno: index + 1,
                BillDate: moment(item.BillDate).format('DD/MM/YYYY'),
                JewelType: item.JewelType,
                BillNo: item.BillNo,
                TagNo: item.TagNo,
                Mname: item.Mname,
                ProductName: item.ProductName,
                Prefix: item.Prefix,
                Pieces: item.Pieces,
                Gwt: item.Gwt.toFixed(3),
                Nwt: item.Nwt.toFixed(3),
                Item_Cts: item.Item_Cts,
                Item_Diamonds: item.Item_Diamonds,
                Item_Uncuts: item.Item_Uncuts,
                Amount: item.Amount.toFixed(2),
                Itemamt: item.Itemamt.toFixed(2),
                Totamt: item.Totamt.toFixed(2),
                MANUFACTURER: item.MANUFACTURER,
                Desc1: item.Desc1,
                TagDate: moment(item.TagDate).format('DD/MM/YYYY'),
                HUID: item.HUID,
                HSNCODE: item.HSNCODE,
                PVALUE: item.PVALUE,
                SVALUE: item.SVALUE
            });
        });
    
        worksheet.addRow({
            sno: 'Total',
            BillDate: '',
            JewelType: '',
            BillNo: '',
            TagNo: '',
            Mname: '',
            ProductName: '',
            Prefix: '',
            Pieces: totals.totalPCS,
            Gwt: totals.totalGWT,
            Nwt: totals.totalNWT,
            Item_Cts: '',
            Item_Diamonds: '',
            Item_Uncuts: '',
            Amount: totals.totalAmount,
            Itemamt: totals.totalItemAmt,
            Totamt: totals.totalTotAmt,
            MANUFACTURER: '',
            Desc1: '',
            TagDate: '',
            HUID: '',
            HSNCODE: '',
            PVALUE: '',
            SVALUE: ''
        });
    
        worksheet.getRow(1).font = { bold: true, size: 7 };
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                if (rowNumber === 1) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'D3D3D3' } // Light grey color
                    };
                }
                cell.font = { size: 8 };
            });
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'ProductWiseSaleDetails.xlsx');
    };
    

    const columns = [
        { title: 'S. No', key: 'sno', render: (_, __, index) => index + 1 },
        { title: 'Bill Date', dataIndex: 'BillDate', key: 'BillDate', render: (text) => moment(text).format('DD/MM/YYYY') },
        { title: 'Jewel Type', dataIndex: 'JewelType', key: 'JewelType' },
        { title: 'Bill No', dataIndex: 'BillNo', key: 'BillNo', align: 'right' },
        { title: 'Tag No', dataIndex: 'TagNo', key: 'TagNo', align: 'right' },
        { title: 'Main Product', dataIndex: 'Mname', key: 'Mname' },
        { title: 'Product Name', dataIndex: 'ProductName', key: 'ProductName' },
        { title: 'Prefix', dataIndex: 'Prefix', key: 'Prefix' },
        { title: 'PCS', dataIndex: 'Pieces', key: 'Pieces', align: 'right' },
        { title: 'GWT', dataIndex: 'Gwt', key: 'Gwt', align: 'right', render: (text) => text.toFixed(3) },
        { title: 'NWT', dataIndex: 'Nwt', key: 'Nwt', align: 'right', render: (text) => text.toFixed(3) },
        { title: 'CTS', dataIndex: 'Item_Cts', key: 'Item_Cts' },
        { title: 'Dia CTS', dataIndex: 'Item_Diamonds', key: 'Item_Diamonds' },
        { title: 'Uncuts', dataIndex: 'Item_Uncuts', key: 'Item_Uncuts' },
        { title: 'Amount', dataIndex: 'Amount', key: 'Amount', align: 'right', render: (text) => text.toFixed(2) },
        { title: 'Items Amt', dataIndex: 'Itemamt', key: 'Itemamt', align: 'right', render: (text) => text.toFixed(2) },
        { title: 'Total Amt', dataIndex: 'Totamt', key: 'Totamt' },
        { title: 'Manufacturer', dataIndex: 'MANUFACTURER', key: 'MANUFACTURER' },
        { title: 'Description', dataIndex: 'Desc1', key: 'Desc1' },
        { title: 'Tag Date', dataIndex: 'TagDate', key: 'TagDate', render: (text) => moment(text).format('DD/MM/YYYY') },
        { title: 'HUID', dataIndex: 'HUID', key: 'HUID' },
        { title: 'HSN Code', dataIndex: 'HSNCODE', key: 'HSNCODE' },
        { title: 'PValue', dataIndex: 'PVALUE', key: 'PVALUE' },
        { title: 'SValue', dataIndex: 'SVALUE', key: 'SVALUE' }
    ];

    const getTotals = () => {
        const totalPCS = data.reduce((sum, item) => sum + item.Pieces, 0);
        const totalGWT = data.reduce((sum, item) => sum + item.Gwt, 0).toFixed(3);
        const totalNWT = data.reduce((sum, item) => sum + item.Nwt, 0).toFixed(3);
        const totalAmount = data.reduce((sum, item) => sum + item.Amount, 0).toFixed(2);
        const totalItemAmt = data.reduce((sum, item) => sum + item.Itemamt, 0).toFixed(2);
        const totalTotAmt = data.reduce((sum, item) => sum + item.Totamt, 0).toFixed(2);

        return {
            totalPCS,
            totalGWT,
            totalNWT,
            totalAmount,
            totalItemAmt,
            totalTotAmt
        };
    };

    const { totalPCS, totalGWT, totalNWT, totalAmount, totalItemAmt, totalTotAmt } = getTotals();

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Product Wise Sale Details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ marginRight: 8 }}>Print</Button>
                    <Button icon={<FilePdfOutlined />} onClick={handlePDFWithPreview} style={{ marginRight: 8 }}>PDF</Button>
                    <Button icon={<FileExcelOutlined />} onClick={handleExcel} style={{ marginRight: 8 }}>Excel</Button>
                </Col>
            </Row>
            <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <Row gutter={16} justify="center">
                        <Col>
                            <DatePicker
                                selected={dates[0] || new Date()}
                                onChange={(date) => setDates([date, dates[1]])}
                                selectsStart
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="Start Date"
                                className="date-picker"
                                showIcon
                                icon="fa fa-calendar"
                                style={{ width: '100%', borderColor: 'lightgrey', align: "center" }}
                            />
                        </Col>
                        <Col>
                            <DatePicker
                                selected={dates[1] || new Date()}
                                onChange={(date) => setDates([dates[0], date])}
                                selectsEnd
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="End Date"
                                className="date-picker"
                                showIcon
                                icon="fa fa-calendar"
                                style={{ width: '100%', borderColor: 'lightgrey' }}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div style={{ marginTop: 16, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div
                    id="printableTable"
                    className="table-responsive scroll-horizontal"
                    style={{
                        maxHeight: "calc(99vh - 193.33px)",
                        overflowY: "auto",
                        overflowX: "auto",
                        marginTop: "20px",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    }}
                >
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={data}
                        rowKey="BillNo"
                        pagination={{
                            pageSize: 5,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            position: ["topRight"],
                            style: { margin: "16px 0" }
                        }}
                        rowClassName="table-row"
                        summary={() => data.length > 0 && (
                            <Table.Summary.Row>
                                <Table.Summary.Cell colSpan={8}>Total</Table.Summary.Cell>
                                <Table.Summary.Cell>{totalPCS}</Table.Summary.Cell>
                                <Table.Summary.Cell>{totalGWT}</Table.Summary.Cell>
                                <Table.Summary.Cell>{totalNWT}</Table.Summary.Cell>
                                <Table.Summary.Cell colSpan={3}></Table.Summary.Cell>
                                <Table.Summary.Cell>{totalAmount}</Table.Summary.Cell>
                                <Table.Summary.Cell>{totalItemAmt}</Table.Summary.Cell>
                                <Table.Summary.Cell>{totalTotAmt}</Table.Summary.Cell>
                                <Table.Summary.Cell colSpan={7}></Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                </div>
                <style jsx>{`
                    .table-row-light {
                        background-color: #f0f0f0;
                    }
                    .table-row-dark {
                        background-color: #ffffff;
                    }
                `}</style>
            </div>
        </>
    );
};

export default ProductWiseSaleDetailes;
