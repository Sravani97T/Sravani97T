import React, { useState, useEffect, forwardRef } from 'react';
import { Row, Col, Breadcrumb, Card, Button, Form } from 'antd';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import "./TableStyles.css";
import { FileExcelOutlined, FilePdfOutlined, PrinterOutlined } from "@ant-design/icons";

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const DayGlance = () => {
    const [groupedData, setGroupedData] = useState([]);
    const [dates, setDates] = useState([
        moment().startOf("day").toDate(), // Default From Date: Today
        moment().endOf("day").toDate(),   // Default To Date: Today
    ]);
    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=700,width=900');
        const currentDate = new Date().toLocaleDateString();

        printWindow.document.write('<html><head><title>Day Glance Report</title><style>');

        // Your custom print styles
        printWindow.document.write(`
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header h1 {
                margin: 0;
                font-size: 18px;
            }
            .header .date {
                font-size: 12px;
                margin-top: 5px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                overflow-x: auto;
            }
            th, td {
                padding: 3px 3px;
   text-align: right; 
                   border: 1px solid #3b3b3b;
                width: 100px;
                font-size: 10px;
            }
            th {
                background-color: #f4f4f4;
                font-weight: bold;
            }
            td {
                background-color: #f4f4f4;
                font-weight: bold;
                height: 10px;
            }
                 th:first-child, td:first-child {
            text-align: left; /* Keep first column left-aligned */
        }
            td.description {
                text-align: center;
            }
            td:last-child, th:last-child {
                border-right: 1px solid #000;
            }
            .group-header {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            .table-container {
                margin-top: 10px;
            }
        `);

        printWindow.document.write('</style></head><body>');

        // Header with report title and date
        printWindow.document.write(`
            <div class="header">
                <h1>Day Glance Report</h1>
                <p class="date">Date: ${currentDate}</p>
            </div>
        `);

        // Iterate over each key in groupedData (e.g., groupedData["DESCRIPTION-TRANSTYPE"])
        Object.keys(groupedData).forEach((key) => {
            const [DESCRIPTION, TRANSTYPE] = key.split('-');

            // Create a header for each group
            printWindow.document.write(`<div class="group-header">${DESCRIPTION} - ${TRANSTYPE}</div>`);

            // Start the table for the current group
            printWindow.document.write('<div class="table-container"><table>');

            // Add the table headers
            printWindow.document.write(`
                <thead>
                    <tr>
                        <th>BNO</th><th>PCS</th><th>G.WT</th><th>N.WT</th><th>TOT AMT</th>
                        <th>CGST</th><th>SGST</th><th>IGST</th><th>NET AMT</th><th>DIA CTS</th>
                        <th>OLD GOLD</th><th>OLD SILVER</th><th>SALE RTN</th><th>UPI</th>
                        <th>CUST ADV</th><th>CHEQUE</th><th>CARD</th><th>CASH</th><th>SCHEME</th>
                        <th>BALANCE</th><th>ONLINE</th>
                    </tr>
                </thead>
                <tbody>
            `);

            // Check if the grouped data has rows for this key
            if (groupedData[key] && Array.isArray(groupedData[key])) {
                // Iterate over the rows for the current group
                groupedData[key].forEach(item => {
                    printWindow.document.write(`
                        <tr>
                            <td>${item.BNO || ''}</td><td>${item.PCS || ''}</td>
                             <td>${item.GWT ? parseFloat(item.GWT)?.toFixed(3) : ''}</td>
                        <td>${item.NWT ? parseFloat(item.NWT)?.toFixed(3) : ''}</td>
                            <td>${item.TOTAMT || ''}</td>
                            <td>${item.CGST || ''}</td><td>${item.SGST || ''}</td><td>${item.IGST || ''}</td><td>${item.NETAMT || ''}</td><td>${item.DIACTS || ''}</td>
                            <td>${item.OLDGOLD || ''}</td><td>${item.OLDSILVER || ''}</td><td>${item.SALERTN || ''}</td><td>${item.UPI || ''}</td>
                            <td>${item.CUSTADV || ''}</td><td>${item.CHEQUE || ''}</td><td>${item.CARD || ''}</td><td>${item.CASH || ''}</td><td>${item.SCHEME || ''}</td>
                            <td>${item.BALANCE || ''}</td><td>${item.ONLINE || ''}</td>
                        </tr>
                        <tr>
                            <td colSpan="1" className="empty-border">${item.DATE ? moment(item.DATE).format('MM/DD/YYYY') : ''}</td>
                            <td colSpan="8" className="description">${item.PARTICULARS || ''}</td>
                            <td colSpan="12" className="empty-border"></td>
                        </tr>
                    `);
                });
            }

            // Close the table for the current group
            printWindow.document.write('</tbody></table></div><br>');
        });

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };


    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');
            // const fromDate = moment(dates[0]).format("DD-MM-YYYY");
            // const toDate = moment(dates[1]).format("DD-MM-YYYY");

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetdayGlance?fromDate=${fromDate}&toDate=${toDate}`)
                .then(response => {
                    const detailsData = response.data;
                    const grouped = detailsData.reduce((acc, item) => {
                        const key = `${item.TCODE}-${item.DESCRIPTION}-${item.TRANSTYPE}`;
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(item);
                        return acc;
                    }, {});
                    setGroupedData(grouped);
                })
                .catch(error => {
                    console.error('Error fetching day glance details:', error);
                });
        }
    }, [dates]);


    const handlePDFDownload = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // Landscape mode

        doc.setFontSize(14);
        doc.text('Day Glance Report', 140, 10, null, null, 'center');
        doc.setFontSize(10);
        doc.text(`Date Range: ${moment(dates[0]).format("DD-MM-YYYY")} - ${moment(dates[1]).format("DD-MM-YYYY")}`, 140, 18, null, null, 'center');

        let y = 25;

        Object.keys(groupedData).forEach((key) => {
            const [DESCRIPTION, TRANSTYPE] = key.split('-');

            // Section Title
            doc.setFontSize(10);
            doc.text(`${DESCRIPTION} - ${TRANSTYPE}`, 15, y);
            y += 5;

            const tableData = groupedData[key].map((item) => [
                item.BNO || '',
                item.PCS || '',
                (item.GWT || 0)?.toFixed(3),  // 3 decimal places
                (item.NWT || 0)?.toFixed(3),
                item.TOTAMT || '',
                item.CGST || '',
                item.SGST || '',
                item.IGST || '',
                item.NETAMT || '',
                item.DIACTS || '',
                item.OLDGOLD || '',
                item.OLDSILVER || '',
                item.SALERTN || '',
                item.UPI || '',
                item.CUSTADV || '',
                item.CHEQUE || '',
                item.CARD || '',
                item.CASH || '',
                item.SCHEME || '',
                item.BALANCE || '',
                item.ONLINE || '',
            ]);

            doc.autoTable({
                startY: y,
                head: [[
                    'BNO', 'PCS', 'G.WT', 'N.WT', 'TOT AMT', 'CGST', 'SGST', 'IGST', 'NET AMT',
                    'DIA CTS', 'OLD GOLD', 'OLD SILVER', 'SALE RTN', 'UPI', 'CUST ADV', 'CHEQUE',
                    'CARD', 'CASH', 'SCHEME', 'BALANCE', 'ONLINE'
                ]],
                body: tableData,
                theme: 'grid',
                styles: { fontSize: 7, halign: 'right' },
                headStyles: { fontSize: 7, fillColor: [80, 80, 80] }, // Smaller header font size
                margin: { top: 30 },
            });

            y = doc.autoTable.previous.finalY + 10; // Adjust position for next table
        });

        doc.save(`Day_Glance_Report_${moment().format("DD-MM-YYYY")}.pdf`);
    };
    const handleExcelDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "My App";
        workbook.created = new Date();

        Object.keys(groupedData).forEach((key) => {
            const [DESCRIPTION, TRANSTYPE] = key.split("-");
            const sheet = workbook.addWorksheet(`${DESCRIPTION} - ${TRANSTYPE}`);

            // Define Columns
            sheet.columns = [
                { header: "BNO", key: "BNO", width: 10 },
                { header: "PCS", key: "PCS", width: 8 },
                { header: "G.WT", key: "GWT", width: 10 },
                { header: "N.WT", key: "NWT", width: 10 },
                { header: "TOT AMT", key: "TOTAMT", width: 12 },
                { header: "CGST", key: "CGST", width: 10 },
                { header: "SGST", key: "SGST", width: 10 },
                { header: "IGST", key: "IGST", width: 10 },
                { header: "NET AMT", key: "NETAMT", width: 12 },
                { header: "DIA CTS", key: "DIACTS", width: 10 },
                { header: "OLD GOLD", key: "OLDGOLD", width: 12 },
                { header: "OLD SILVER", key: "OLDSILVER", width: 12 },
                { header: "SALE RTN", key: "SALERTN", width: 12 },
                { header: "UPI", key: "UPI", width: 10 },
                { header: "CUST ADV", key: "CUSTADV", width: 12 },
                { header: "CHEQUE", key: "CHEQUE", width: 12 },
                { header: "CARD", key: "CARD", width: 10 },
                { header: "CASH", key: "CASH", width: 10 },
                { header: "SCHEME", key: "SCHEME", width: 12 },
                { header: "BALANCE", key: "BALANCE", width: 12 },
                { header: "ONLINE", key: "ONLINE", width: 10 },
            ];

            // Add Header Styling
            sheet.getRow(1).font = { bold: true, size: 11, color: { argb: "FFFFFF" } };
            sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } };

            // Add Data Rows
            groupedData[key].forEach((item) => {
                sheet.addRow({
                    BNO: item.BNO || "",
                    PCS: item.PCS || "",
                    GWT: (item.GWT || 0)?.toFixed(3),  // 3 decimal places
                    NWT: (item.NWT || 0)?.toFixed(3),  // 3 decimal places
                    TOTAMT: item.TOTAMT || "",
                    CGST: item.CGST || "",
                    SGST: item.SGST || "",
                    IGST: item.IGST || "",
                    NETAMT: item.NETAMT || "",
                    DIACTS: item.DIACTS || "",
                    OLDGOLD: item.OLDGOLD || "",
                    OLDSILVER: item.OLDSILVER || "",
                    SALERTN: item.SALERTN || "",
                    UPI: item.UPI || "",
                    CUSTADV: item.CUSTADV || "",
                    CHEQUE: item.CHEQUE || "",
                    CARD: item.CARD || "",
                    CASH: item.CASH || "",
                    SCHEME: item.SCHEME || "",
                    BALANCE: item.BALANCE || "",
                    ONLINE: item.ONLINE || "",
                });
            });

            // Apply Right Alignment for Numeric Columns
            sheet.eachRow((row, rowNumber) => {
                if (rowNumber > 1) {  // Ignore header row
                    row.eachCell((cell) => {
                        cell.alignment = { horizontal: "right" };
                    });
                }
            });
        });

        // Generate Excel File
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `Day_Glance_Report_${moment().format("DD-MM-YYYY")}.xlsx`);
    };

    return (
        <div id="printableArea" style={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 10 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Day Glance</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>

            </Row>

            <Card
                className="day-glance-card"
                style={{
                    position: 'relative', // For positioning the triangular and diamond designs
                    background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)', // Blue gradient background
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    color: '#333',
                }}
            >
                {/* Triangular Design 1 */}
                <div
                    style={{
                        position: 'absolute',

                        width: '0',
                        height: '0',
                        borderLeft: '75px solid transparent',
                        borderRight: '75px solid transparent',
                        borderBottom: '150px solid rgba(255, 255, 255, 0.2)',
                    }}
                />
                {/* Diamond Design */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-77px',
                        right: '15px',
                        width: '150px',
                        height: '150px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'rotate(45deg)',
                    }}
                />
                {/* Triangular Design 2 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '-50px',
                        width: '0',
                        height: '0',
                        borderLeft: '100px solid transparent',
                        borderRight: '100px solid transparent',
                        borderTop: '200px solid rgba(255, 255, 255, 0.15)',

                    }}
                />

                <Row justify="center" gutter={16} style={{ marginBottom: 16 }}>
                    <Col>
                        <Form.Item label={<span style={{ color: "white" }}>From Date</span>}>

                            <DatePicker
                                selected={dates[0]}
                                dateFormat="dd MMM yyyy"
                                onChange={(date) => setDates([date, dates[1]])}
                                selectsStart
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="From Date"
                                customInput={<CustomInput />}
                                popperProps={{ positionFixed: true, style: { zIndex: 2 } }}
                            />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label={<span style={{ color: "white" }}>To Date</span>}>

                            <DatePicker
                                selected={dates[1]}
                                  dateFormat="dd MMM yyyy"
                                onChange={(date) => setDates([dates[0], date])}
                                selectsEnd
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="To Date"
                                customInput={<CustomInput />}
                                popperProps={{ positionFixed: true, style: { zIndex: 2 } }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="center" style={{ marginBottom: 16 }}>
                    <Col>
                        <Button onClick={handlePrint} style={{
                            marginLeft: 8,
                            backgroundColor: '#0052cc',
                            color: '#fff',
                            border: 'none',
                        }} type="primary" icon={<PrinterOutlined />}>
                            Print
                        </Button>
                        <Button
                            onClick={handlePDFDownload} style={{
                                marginLeft: 8,
                                backgroundColor: '#0052cc',
                                color: '#fff',
                                border: 'none',
                            }} icon={<FilePdfOutlined />}
                        >
                            PDF
                        </Button>
                        <Button onClick={handleExcelDownload} style={{
                            marginLeft: 8,
                            backgroundColor: '#0052cc',
                            color: '#fff',
                            border: 'none',
                        }} icon={<FileExcelOutlined />} type="default">
                            Excel
                        </Button>
                    </Col>
                </Row>
            </Card>

            {Object.keys(groupedData).map((key, index) => {
                const [DESCRIPTION, TRANSTYPE] = key.split('-');
                return (
                    <div key={index} className="table-container">
                        <h3>{`${DESCRIPTION} - ${TRANSTYPE}`}</h3>
                        <table className="responsive-table">
                            <thead>
                                <tr>
                                    <th>BNO</th>
                                    <th>PCS</th>
                                    <th>G.WT</th>
                                    <th>N.WT</th>
                                    <th>TOT AMT</th>
                                    <th>CGST</th>
                                    <th>SGST</th>
                                    <th>IGST</th>
                                    <th>NET AMT</th>
                                    <th>DIA CTS</th>
                                    <th>OLD GOLD</th>
                                    <th>OLD SILVER</th>
                                    <th>SALE RTN</th>
                                    <th>UPI</th>
                                    <th>CUST ADV</th>
                                    <th>CHEQUE</th>
                                    <th>CARD</th>
                                    <th>CASH</th>
                                    <th>SCHEME</th>
                                    <th>BALANCE</th>
                                    <th>ONLINE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedData[key].map((item, idx) => (
                                    <React.Fragment key={idx}>
                                        <tr>
                                            <td>{item.BNO}</td>
                                            <td>{item.PCS}</td>
                                            <td style={{ textAlign: 'right' }}>{parseFloat(item.GWT)?.toFixed(3)}</td>
                                            <td style={{ textAlign: 'right' }}>{parseFloat(item.NWT)?.toFixed(3)}</td>
                                            <td style={{ textAlign: 'right' }}>{item.TOTAMT}</td>
                                            <td style={{ textAlign: 'right' }}>{item.CGST}</td>
                                            <td style={{ textAlign: 'right' }}>{item.SGST}</td>
                                            <td style={{ textAlign: 'right' }}>{item.IGST}</td>
                                            <td style={{ textAlign: 'right' }}>{item.NETAMT}</td>
                                            <td>{item.DIACTS}</td>
                                            <td>{item.OLDGOLD}</td>
                                            <td>{item.OLDSILVER}</td>
                                            <td>{item.SALERTN}</td>
                                            <td style={{ textAlign: 'right' }}>{item.UPI}</td>
                                            <td>{item.CUSTADV}</td>
                                            <td>{item.CHEQUE}</td>
                                            <td>{item.CARD}</td>
                                            <td style={{ textAlign: 'right' }}>{item.CASH}</td>
                                            <td>{item.SCHEME}</td>
                                            <td style={{ textAlign: 'right' }}>{item.BALANCE}</td>
                                            <td style={{ textAlign: 'right' }}>{item.ONLINE}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="1" className="empty-border">{moment(item.DATE).format('MM/DD/YYYY')}</td>
                                            <td colSpan="8" className="description">{item.PARTICULARS}</td>
                                            <td colSpan="12" className="empty-border"></td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
            <style jsx>{`
                /* Basic table styling */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    overflow-x: auto;
                    display: block; 
                }

                /* Table headers and data cells */
                th, td {
                    padding: 3px 3px; 
                    text-align: left;
                    border: 1px solid #3b3b3b;
                    width: 100px;
                    font-size: 10px;
                }

                /* Table header styling */
                th {
                    background-color: #f4f4f4;
                    font-weight: bold;
                }
                td {
                  background-color: #f4f4f4;
                  font-weight: bold;
                  height: 10px; 
                }
                /* Remove left border for BNO column */
                td:first-child, th:first-child {
                    border-bottom: none; 
                }

                /* Add a left border to all columns except the first */
                td:not(:first-child), th:not(:first-child) {
                    border-left: 1px solid #2b2a2a; 
                }

                /* Make the description row have no border */
                /* td.empty-border {
                    border: none;
                } */

                /* Styling for the description text */
                td.description {
                    border-left: 1px solid #151313; 
                    text-align: center;
                }

                /* Optional: Add a right border for the last column */
                td:last-child, th:last-child {
                    border-right: 1px solid #000;
                }

                /* Ensures horizontal scrolling if there are more columns */
                .table-container {
                    overflow-x: auto; 
                    -webkit-overflow-scrolling: touch;
                }

                /* For responsive design: */a
                @media (max-width: 768px) {
                    table {
                        font-size: 12px; 
                    }
                    th, td {
                        padding: 6px; 
                    }
                    .table-container {
                        max-width: 100%;
                        overflow-x: scroll;
                    }
                }
            `}</style>
        </div>
    );
};

export default DayGlance;
