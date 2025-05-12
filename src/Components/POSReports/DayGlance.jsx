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
import { CREATE_jwel } from "../../Config/Config";

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

        // Custom print styles
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
            }
            th, td {
                padding: 3px 3px;
                text-align: right;
                border: 1px solid #3b3b3b;
                font-size: 10px;
                background-color: white;
            }
            th {
                background-color: #f0f0f0; /* Light grey header */
                font-weight: bold;
            }
            td:first-child, th:first-child {
                text-align: left;
            }
            td.description {
                text-align: center;
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

        // Report header
        printWindow.document.write(`
            <div class="header">
                <h1>Day Glance Report</h1>
                <p class="date">Date: ${currentDate}</p>
            </div>
        `);

        Object.keys(groupedData).forEach((key) => {
            // Print group header directly without splitting
            printWindow.document.write(`<div class="group-header">${key}</div>`);

            // Start group table
            printWindow.document.write('<div class="table-container"><table>');

            // Table headers
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

            // Table body rows
            groupedData[key]?.forEach(item => {
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
                        <td style="border: 1px solid #3b3b3b;">${item.BDATE ? moment(item.BDATE).format('DD/MM/YYYY') : ''}</td>
                        <td colspan="8" class="description" style="border: 1px solid #3b3b3b;">${item.PARTICULARS || ''}</td>
                        <td colspan="12" style="border: 1px solid #3b3b3b;"></td>
                    </tr>
                `);
            });

            printWindow.document.write('</tbody></table></div><br>');
        });

        // Overall Totals
        const overallTotals = Object.keys(groupedData).reduce((acc, key) => {
            groupedData[key].forEach(item => {
                acc.NETAMT += parseFloat(item.NETAMT || 0);
                acc.CGST += parseFloat(item.CGST || 0);
                acc.SGST += parseFloat(item.SGST || 0);
                acc.IGST += parseFloat(item.IGST || 0);
                acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                acc.PCS += parseFloat(item.PCS || 0);
                acc.GWT += parseFloat(item.GWT || 0);
                acc.NWT += parseFloat(item.NWT || 0);
                acc.UPI += parseFloat(item.UPI || 0);
                acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                acc.CARD += parseFloat(item.CARD || 0);
                acc.CASH += parseFloat(item.CASH || 0);
                acc.SCHEME += parseFloat(item.SCHEME || 0);
                acc.BALANCE += parseFloat(item.BALANCE || 0);
                acc.ONLINE += parseFloat(item.ONLINE || 0);
            });
            return acc;
        }, {
            NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0,
            CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0
        });

        printWindow.document.write(`
            <div class="group-header">Overall Totals</div>
            <div class="table-container">
                <table>
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
                        <tr>
                            <td></td>
                            <td>${overallTotals.PCS.toFixed(2)}</td>
                            <td>${overallTotals.GWT.toFixed(3)}</td>
                            <td>${overallTotals.NWT.toFixed(3)}</td>
                            <td>${overallTotals.TOTAMT.toFixed(2)}</td>
                            <td>${overallTotals.CGST.toFixed(2)}</td>
                            <td>${overallTotals.SGST.toFixed(2)}</td>
                            <td>${overallTotals.IGST.toFixed(2)}</td>
                            <td>${overallTotals.NETAMT.toFixed(2)}</td>
                            <td></td><td></td><td></td><td></td>
                            <td>${overallTotals.UPI.toFixed(2)}</td>
                            <td>${overallTotals.CUSTADV.toFixed(2)}</td>
                            <td>${overallTotals.CHEQUE.toFixed(2)}</td>
                            <td>${overallTotals.CARD.toFixed(2)}</td>
                            <td>${overallTotals.CASH.toFixed(2)}</td>
                            <td>${overallTotals.SCHEME.toFixed(2)}</td>
                            <td>${overallTotals.BALANCE.toFixed(2)}</td>
                            <td>${overallTotals.ONLINE.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `);

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };
console.log(groupedData)

    // useEffect(() => {
    //     if (dates[0] && dates[1]) {
    //         const fromDate = moment(dates[0]).format('MM/DD/YYYY');
    //         const toDate = moment(dates[1]).format('MM/DD/YYYY');
    //         // const fromDate = moment(dates[0]).format("DD-MM-YYYY");
    //         // const toDate = moment(dates[1]).format("DD-MM-YYYY");

    //         axios.get(`${CREATE_jwel}/api/POSReports/GetdayGlance?fromDate=${fromDate}&toDate=${toDate}`)
    //             .then(response => {
    //                 const detailsData = response.data;
    //                 const grouped = detailsData.reduce((acc, item) => {
    //                     const key = `${item.TCODE}-${item.DESCRIPTION}-${item.TRANSTYPE}`;
    //                     if (!acc[key]) {
    //                         acc[key] = [];
    //                     }
    //                     acc[key].push(item);
    //                     return acc;
    //                 }, {});
    //                 setGroupedData(grouped);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching day glance details:', error);
    //             });
    //     }
    // }, [dates]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');
    
            axios.get(`${CREATE_jwel}/api/POSReports/GetdayGlance?fromDate=${fromDate}&toDate=${toDate}`)
                .then(response => {
                    const detailsData = response.data;
    
                    // Your current group by TCODE-DESCRIPTION-TRANSTYPE
                    const grouped = detailsData.reduce((acc, item) => {
                        const key = `${item.TCODE}-${item.DESCRIPTION}-${item.TRANSTYPE}`;
                        if (!acc[key]) acc[key] = [];
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
            // Section Title
            doc.setFontSize(10);
            doc.text(`${key}`, 15, y);
            y += 5;

            const tableData = [];
            groupedData[key].forEach((item) => {
                // Main row
                tableData.push([
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

                // Sub-row for BDATE and PARTICULARS
                tableData.push([
                    item.BDATE ? moment(item.BDATE).format('DD/MM/YYYY') : '',
                    `${item.PARTICULARS || ''}`,
                    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
                ]);
            });

            // Add totals for the group
            const totals = groupedData[key].reduce((acc, item) => {
                acc.NETAMT += parseFloat(item.NETAMT || 0);
                acc.CGST += parseFloat(item.CGST || 0);
                acc.SGST += parseFloat(item.SGST || 0);
                acc.IGST += parseFloat(item.IGST || 0);
                acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                acc.PCS += parseFloat(item.PCS || 0);
                acc.GWT += parseFloat(item.GWT || 0);
                acc.NWT += parseFloat(item.NWT || 0);
                acc.UPI += parseFloat(item.UPI || 0);
                acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                acc.CARD += parseFloat(item.CARD || 0);
                acc.CASH += parseFloat(item.CASH || 0);
                acc.SCHEME += parseFloat(item.SCHEME || 0);
                acc.BALANCE += parseFloat(item.BALANCE || 0);
                acc.ONLINE += parseFloat(item.ONLINE || 0);
                return acc;
            }, { NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0, CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0 });

            tableData.push([
                'Totals:',
                totals.PCS.toFixed(2),
                totals.GWT.toFixed(3),
                totals.NWT.toFixed(3),
                totals.TOTAMT.toFixed(2),
                totals.CGST.toFixed(2),
                totals.SGST.toFixed(2),
                totals.IGST.toFixed(2),
                totals.NETAMT.toFixed(2),
                '', '', '', '', totals.UPI.toFixed(2),
                totals.CUSTADV.toFixed(2),
                totals.CHEQUE.toFixed(2),
                totals.CARD.toFixed(2),
                totals.CASH.toFixed(2),
                totals.SCHEME.toFixed(2),
                totals.BALANCE.toFixed(2),
                totals.ONLINE.toFixed(2),
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
                bodyStyles: { fontSize: 7 },
                margin: { top: 30 },
            });

            y = doc.autoTable.previous.finalY + 10; // Adjust position for next table
        });

        // Add overall totals
        const overallTotals = Object.keys(groupedData).reduce((acc, key) => {
            groupedData[key].forEach(item => {
                acc.NETAMT += parseFloat(item.NETAMT || 0);
                acc.CGST += parseFloat(item.CGST || 0);
                acc.SGST += parseFloat(item.SGST || 0);
                acc.IGST += parseFloat(item.IGST || 0);
                acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                acc.PCS += parseFloat(item.PCS || 0);
                acc.GWT += parseFloat(item.GWT || 0);
                acc.NWT += parseFloat(item.NWT || 0);
                acc.UPI += parseFloat(item.UPI || 0);
                acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                acc.CARD += parseFloat(item.CARD || 0);
                acc.CASH += parseFloat(item.CASH || 0);
                acc.SCHEME += parseFloat(item.SCHEME || 0);
                acc.BALANCE += parseFloat(item.BALANCE || 0);
                acc.ONLINE += parseFloat(item.ONLINE || 0);
            });
            return acc;
        }, {
            NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0,
            CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0
        });

        doc.text('Overall Totals:', 15, y);
        y += 5;
        doc.autoTable({
            startY: y,
            head: [[
                'BNO', 'PCS', 'G.WT', 'N.WT', 'TOT AMT', 'CGST', 'SGST', 'IGST', 'NET AMT',
                'DIA CTS', 'OLD GOLD', 'OLD SILVER', 'SALE RTN', 'UPI', 'CUST ADV', 'CHEQUE',
                'CARD', 'CASH', 'SCHEME', 'BALANCE', 'ONLINE'
            ]],
            body: [[
                '', overallTotals.PCS.toFixed(2), overallTotals.GWT.toFixed(3), overallTotals.NWT.toFixed(3),
                overallTotals.TOTAMT.toFixed(2), overallTotals.CGST.toFixed(2), overallTotals.SGST.toFixed(2),
                overallTotals.IGST.toFixed(2), overallTotals.NETAMT.toFixed(2), '', '', '', '',
                overallTotals.UPI.toFixed(2), overallTotals.CUSTADV.toFixed(2), overallTotals.CHEQUE.toFixed(2),
                overallTotals.CARD.toFixed(2), overallTotals.CASH.toFixed(2), overallTotals.SCHEME.toFixed(2),
                overallTotals.BALANCE.toFixed(2), overallTotals.ONLINE.toFixed(2)
            ]],
            theme: 'grid',
            styles: { fontSize: 7, halign: 'right' },
            headStyles: { fontSize: 7, fillColor: [80, 80, 80] },
            bodyStyles: { fontSize: 7 },
        });

        doc.save(`Day_Glance_Report_${moment().format("DD-MM-YYYY")}.pdf`);
    };
    const handleExcelDownload = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = "My App";
        workbook.created = new Date();

        Object.keys(groupedData).forEach((key) => {
            const sheet = workbook.addWorksheet(`${key}`);

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
                // Main row
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

                // Sub-row for BDATE and PARTICULARS
                sheet.addRow({
                    BNO: item.BDATE ? moment(item.BDATE).format('DD/MM/YYYY') : "",
                    PCS: item.PARTICULARS || "",
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

            // Add Totals Row for Each Group
            const totals = groupedData[key].reduce((acc, item) => {
                acc.NETAMT += parseFloat(item.NETAMT || 0);
                acc.CGST += parseFloat(item.CGST || 0);
                acc.SGST += parseFloat(item.SGST || 0);
                acc.IGST += parseFloat(item.IGST || 0);
                acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                acc.PCS += parseFloat(item.PCS || 0);
                acc.GWT += parseFloat(item.GWT || 0);
                acc.NWT += parseFloat(item.NWT || 0);
                acc.UPI += parseFloat(item.UPI || 0);
                acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                acc.CARD += parseFloat(item.CARD || 0);
                acc.CASH += parseFloat(item.CASH || 0);
                acc.SCHEME += parseFloat(item.SCHEME || 0);
                acc.BALANCE += parseFloat(item.BALANCE || 0);
                acc.ONLINE += parseFloat(item.ONLINE || 0);
                return acc;
            }, { NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0, CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0 });

            sheet.addRow({
                BNO: "Totals:",
                PCS: totals.PCS.toFixed(2),
                GWT: totals.GWT.toFixed(3),
                NWT: totals.NWT.toFixed(3),
                TOTAMT: totals.TOTAMT.toFixed(2),
                CGST: totals.CGST.toFixed(2),
                SGST: totals.SGST.toFixed(2),
                IGST: totals.IGST.toFixed(2),
                NETAMT: totals.NETAMT.toFixed(2),
                UPI: totals.UPI.toFixed(2),
                CUSTADV: totals.CUSTADV.toFixed(2),
                CHEQUE: totals.CHEQUE.toFixed(2),
                CARD: totals.CARD.toFixed(2),
                CASH: totals.CASH.toFixed(2),
                SCHEME: totals.SCHEME.toFixed(2),
                BALANCE: totals.BALANCE.toFixed(2),
                ONLINE: totals.ONLINE.toFixed(2),
            });
        });

        // Add Overall Totals Sheet
        const overallSheet = workbook.addWorksheet("Overall Totals");
        overallSheet.columns = [
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

        const overallTotals = Object.keys(groupedData).reduce((acc, key) => {
            groupedData[key].forEach(item => {
                acc.NETAMT += parseFloat(item.NETAMT || 0);
                acc.CGST += parseFloat(item.CGST || 0);
                acc.SGST += parseFloat(item.SGST || 0);
                acc.IGST += parseFloat(item.IGST || 0);
                acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                acc.PCS += parseFloat(item.PCS || 0);
                acc.GWT += parseFloat(item.GWT || 0);
                acc.NWT += parseFloat(item.NWT || 0);
                acc.UPI += parseFloat(item.UPI || 0);
                acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                acc.CARD += parseFloat(item.CARD || 0);
                acc.CASH += parseFloat(item.CASH || 0);
                acc.SCHEME += parseFloat(item.SCHEME || 0);
                acc.BALANCE += parseFloat(item.BALANCE || 0);
                acc.ONLINE += parseFloat(item.ONLINE || 0);
            });
            return acc;
        }, { NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0, CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0 });

        overallSheet.addRow({
            BNO: "Overall Totals:",
            PCS: overallTotals.PCS.toFixed(2),
            GWT: overallTotals.GWT.toFixed(3),
            NWT: overallTotals.NWT.toFixed(3),
            TOTAMT: overallTotals.TOTAMT.toFixed(2),
            CGST: overallTotals.CGST.toFixed(2),
            SGST: overallTotals.SGST.toFixed(2),
            IGST: overallTotals.IGST.toFixed(2),
            NETAMT: overallTotals.NETAMT.toFixed(2),
            UPI: overallTotals.UPI.toFixed(2),
            CUSTADV: overallTotals.CUSTADV.toFixed(2),
            CHEQUE: overallTotals.CHEQUE.toFixed(2),
            CARD: overallTotals.CARD.toFixed(2),
            CASH: overallTotals.CASH.toFixed(2),
            SCHEME: overallTotals.SCHEME.toFixed(2),
            BALANCE: overallTotals.BALANCE.toFixed(2),
            ONLINE: overallTotals.ONLINE.toFixed(2),
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
                    position: 'relative',
                    background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    color: '#333',
                }}
            >
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
                        <Button onClick={() => handlePrint()} style={{
                            marginLeft: 8,
                            backgroundColor: '#0052cc',
                            color: '#fff',
                            border: 'none',
                        }} type="primary" icon={<PrinterOutlined />}>
                            Print
                        </Button>
                        <Button
                            onClick={() => handlePDFDownload()} style={{
                                marginLeft: 8,
                                backgroundColor: '#0052cc',
                                color: '#fff',
                                border: 'none',
                            }} icon={<FilePdfOutlined />}
                        >
                            PDF
                        </Button>
                        <Button onClick={() => handleExcelDownload()} style={{
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
                const totals = groupedData[key].reduce((acc, item) => {
                    acc.NETAMT += parseFloat(item.NETAMT || 0);
                    acc.CGST += parseFloat(item.CGST || 0);
                    acc.SGST += parseFloat(item.SGST || 0);
                    acc.IGST += parseFloat(item.IGST || 0);
                    acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                    acc.PCS += parseFloat(item.PCS || 0);
                    acc.GWT += parseFloat(item.GWT || 0);
                    acc.NWT += parseFloat(item.NWT || 0);
                    acc.UPI += parseFloat(item.UPI || 0);
                    acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                    acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                    acc.CARD += parseFloat(item.CARD || 0);
                    acc.CASH += parseFloat(item.CASH || 0);
                    acc.SCHEME += parseFloat(item.SCHEME || 0);
                    acc.BALANCE += parseFloat(item.BALANCE || 0);
                    acc.ONLINE += parseFloat(item.ONLINE || 0);
                    return acc;
                }, { NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0, CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0 });

                return (
                    <div key={index} className="table-container">
                        <h3>{key}</h3>
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
                                            <td style={{ textAlign: 'right' }}>{item.CUSTADV}</td>
                                            <td style={{ textAlign: 'right' }}>{item.CHEQUE}</td>
                                            <td style={{ textAlign: 'right' }}>{item.CARD}</td>
                                            <td style={{ textAlign: 'right' }}>{item.CASH}</td>
                                            <td style={{ textAlign: 'right' }}>{item.SCHEME}</td>
                                            <td style={{ textAlign: 'right' }}>{item.BALANCE}</td>
                                            <td style={{ textAlign: 'right' }}>{item.ONLINE}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="1" style={{ border: '1px solid #000' }}>
                                                {moment(item.BDATE).format('DD/MM/YYYY')}
                                            </td>
                                            <td colSpan="8" className="description">{item.PARTICULARS}</td>
                                            <td colSpan="12" className="empty-border"></td>
                                        </tr>
                                    </React.Fragment>
                                ))}
                                {/* TCODE Totals */}
                                <tr>
                                    <td colSpan="1" style={{ fontWeight: 'bold', textAlign: 'right', border: '1px solid #000' }}>Totals:</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.PCS.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.GWT.toFixed(3)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.NWT.toFixed(3)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.TOTAMT.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.CGST.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.SGST.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.IGST.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.NETAMT.toFixed(2)}</td>
                                    <td colSpan="4"></td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.UPI.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.CUSTADV.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.CHEQUE.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.CARD.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.CASH.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.SCHEME.toFixed(2)}</td>
                                    <td style={{ textAlign: 'right', border: '1px solid #000' }}>{totals.ONLINE.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            })}

            {/* Overall Totals */}
            <div className="table-container">
    {(() => {
        const overallTotals = Object.keys(groupedData).reduce((acc, key) => {
            groupedData[key].forEach(item => {
                acc.NETAMT += parseFloat(item.NETAMT || 0);
                acc.CGST += parseFloat(item.CGST || 0);
                acc.SGST += parseFloat(item.SGST || 0);
                acc.IGST += parseFloat(item.IGST || 0);
                acc.TOTAMT += parseFloat(item.TOTAMT || 0);
                acc.PCS += parseFloat(item.PCS || 0);
                acc.GWT += parseFloat(item.GWT || 0);
                acc.NWT += parseFloat(item.NWT || 0);
                acc.UPI += parseFloat(item.UPI || 0);
                acc.CUSTADV += parseFloat(item.CUSTADV || 0);
                acc.CHEQUE += parseFloat(item.CHEQUE || 0);
                acc.CARD += parseFloat(item.CARD || 0);
                acc.CASH += parseFloat(item.CASH || 0);
                acc.SCHEME += parseFloat(item.SCHEME || 0);
                acc.BALANCE += parseFloat(item.BALANCE || 0);
                acc.ONLINE += parseFloat(item.ONLINE || 0);
            });
            return acc;
        }, {
            NETAMT: 0, CGST: 0, SGST: 0, IGST: 0, TOTAMT: 0, PCS: 0, GWT: 0, NWT: 0, UPI: 0,
            CUSTADV: 0, CHEQUE: 0, CARD: 0, CASH: 0, SCHEME: 0, BALANCE: 0, ONLINE: 0
        });

        // Check if all values are zero
        const hasNonZero = Object.values(overallTotals).some(value => value !== 0);

        if (!hasNonZero) return null;

        return (
            <>
                <h3>Totals</h3>
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
                    <tr>
  <td style={{ fontWeight: 'bold', textAlign: 'left', border: '1px solid #000' }}>Overall Totals:</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.PCS.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.GWT.toFixed(3)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.NWT.toFixed(3)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.TOTAMT.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.CGST.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.SGST.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.IGST.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.NETAMT.toFixed(2)}</td>
  <td></td> {/* DIA CTS */}
  <td></td> {/* OLD GOLD */}
  <td></td> {/* OLD SILVER */}
  <td></td> {/* SALE RTN */}
  <td style={{ textAlign: 'right' }}>{overallTotals.UPI.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.CUSTADV.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.CHEQUE.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.CARD.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.CASH.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.SCHEME.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.BALANCE.toFixed(2)}</td>
  <td style={{ textAlign: 'right' }}>{overallTotals.ONLINE.toFixed(2)}</td>
</tr>

                    </tbody>
                </table>
            </>
        );
    })()}
</div>


            <style jsx>{`
                .empty-border {
                    border-top: none;
                    border-left: none;
                    border-right: none;
                    border-bottom: 1px solid #000;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    overflow-x: auto;
                    display: block;
                }
                th, td {
                    padding: 3px 3px;
                    text-align: left;
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
                td:first-child, th:first-child {
                    border-bottom: none;
                }
                td:not(:first-child), th:not(:first-child) {
                    border-left: 1px solid #2b2a2a;
                }
                td.description {
                    border-left: 1px solid #151313;
                    text-align: center;
                }
                td:last-child, th:last-child {
                    border-right: 1px solid #000;
                }
                .table-container {
                    overflow-x: auto;
                    -webkit-overflow-scrolling: touch;
                }
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
