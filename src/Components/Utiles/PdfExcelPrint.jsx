import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';

const PdfExcelPrint = ({ data, columns, fileName }) => {

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Table</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('table { width: 100%; border-collapse: collapse; }');
        printWindow.document.write('th, td { border: 1px solid black; padding: 8px; text-align: left; }');
        printWindow.document.write('th { background-color: #f2f2f2; }');
        printWindow.document.write('</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write('<table><thead><tr>');

        columns.forEach(col => {
            printWindow.document.write(`<th>${col.title}</th>`);
        });

        printWindow.document.write('</tr></thead><tbody>');

        data.forEach(item => {
            printWindow.document.write('<tr>');
            columns.forEach(col => {
                printWindow.document.write(`<td>${item[col.dataIndex]}</td>`);
            });
            printWindow.document.write('</tr>');
        });

        printWindow.document.write('</tbody></table>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    const handlePDFWithPreview = () => {
        const doc = new jsPDF();
        const tableColumn = columns.map(col => col.title);
        const tableRows = data.map(item => columns.map(col => item[col.dataIndex]));
    
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            styles: { fontSize: 6, cellPadding: 1 }, // Further reduce font size and cell padding
            headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], fontStyle: 'normal', lineWidth: 0.1, lineColor: [211, 211, 211] }, // Light grey background, black text, normal font, and borders
            theme: 'grid',
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
                saveAs(pdfBlob, `${fileName}.pdf`);
            };
        };
    };
    

    const handleExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(fileName);

        worksheet.columns = columns.map(col => ({
            header: col.title,
            key: col.dataIndex,
            width: 25
        }));

        data.forEach(item => {
            const row = {};
            columns.forEach(col => {
                row[col.dataIndex] = item[col.dataIndex];
            });
            worksheet.addRow(row);
        });

        // Style the header
        worksheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'D3D3D3' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        // Style the data cells
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber !== 1) {
                row.eachCell(cell => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            }
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    };

    return (
        <>
            <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ marginRight: 8 }}>Print</Button>
            <Button icon={<FilePdfOutlined />} onClick={handlePDFWithPreview} style={{ marginRight: 8 }}>PDF</Button>
            <Button icon={<FileExcelOutlined />} onClick={handleExcel} style={{ marginRight: 8 }}>Excel</Button>
        </>
    );
};

export default PdfExcelPrint;
