// src/Components/POSReports/ExportButton.jsx
import React from 'react';
import { Button } from 'antd';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';

const ExportButton = ({ type, style, tableId }) => {
    const handleClick = () => {
        switch (type) {
            case 'print':
                printTable();
                break;
            case 'pdf':
                exportToPDF();
                break;
            case 'excel':
                exportToExcel();
                break;
            default:
                break;
        }
    };

    const printTable = () => {
        const table = document.getElementById(tableId);
        if (table) {
            const newWindow = window.open('', '', 'width=800,height=600');
            newWindow.document.write('<html><head><title>Print Table</title>');
            newWindow.document.write('</head><body >');
            newWindow.document.write(table.outerHTML);
            newWindow.document.write('</body></html>');
            newWindow.document.close();
            newWindow.print();
        } else {
            console.error('Table not found');
        }
    };

    const exportToPDF = () => {
        // Implement your PDF export logic here
        console.log('Exporting to PDF...');
    };

    const exportToExcel = () => {
        // Implement your Excel export logic here
        console.log('Exporting to Excel...');
    };

    const getIcon = () => {
        switch (type) {
            case 'print':
                return <PrinterOutlined />;
            case 'pdf':
                return <FilePdfOutlined />;
            case 'excel':
                return <FileExcelOutlined />;
            default:
                return null;
        }
    };

    const getLabel = () => {
        switch (type) {
            case 'print':
                return 'Print';
            case 'pdf':
                return 'Export PDF';
            case 'excel':
                return 'Export Excel';
            default:
                return '';
        }
    };

    return (
        <Button icon={getIcon()} style={style} onClick={handleClick}>
            {getLabel()}
        </Button>
    );
};

export default ExportButton;
