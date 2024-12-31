import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Breadcrumb, Row, Col, DatePicker, Popover, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

const { Option } = Select;

const BankStatementReport = () => {
    const [filters, setFilters] = useState({
        accountNumber: '',
        type: '',
        amount: '',
        payMode: '',
        dateFrom: null,
        dateTo: null
    });
    const [tempFilters, setTempFilters] = useState(filters);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [popoverVisible, setPopoverVisible] = useState(false);

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
        doc.autoTable({
            head: [['S.No', 'VNO', 'Date', 'Trans Type', 'Pay Mode', 'Particulars', 'Party Name', 'Debit', 'Credit', 'Closing Balance']],
            body: [
                ...filteredData.map((item, index) => [
                    index + 1,
                    item.RecNo,
                    moment(item.DEPDATE).format('DD/MM/YYYY'),
                    item.TRANSTYPE,
                    item.mode,
                    item.DESCR,
                    item.CustName,
                    item.Debit ? item.Debit.toFixed(2) : '',
                    item.Credit ? item.Credit.toFixed(2) : '',
                    item.currbal ? item.currbal.toFixed(2) : ''
                ]),
                [
                    'Total',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    sums.Debit ? sums.Debit.toFixed(2) : '',
                    sums.Credit ? sums.Credit.toFixed(2) : '',
                    sums.currbal ? sums.currbal.toFixed(2) : ''
                ]
            ],
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
                saveAs(pdfBlob, 'D:/PDF_PATH/bank_statement.pdf');
            };
        };
    };

    const handleExcel = async () => {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bank Statement Data');

        worksheet.columns = [
            { header: 'S.No', key: 'sno', width: 5 },
            { header: 'VNO', key: 'RecNo', width: 10 },
            { header: 'Date', key: 'DEPDATE', width: 15 },
            { header: 'Trans Type', key: 'TRANSTYPE', width: 20 },
            { header: 'Pay Mode', key: 'mode', width: 10 },
            { header: 'Particulars', key: 'DESCR', width: 30 },
            { header: 'Party Name', key: 'CustName', width: 20 },
            { header: 'Debit', key: 'Debit', width: 10 },
            { header: 'Credit', key: 'Credit', width: 10 },
            { header: 'Closing Balance', key: 'currbal', width: 15 }
        ];

        filteredData.forEach((item, index) => {
            worksheet.addRow({
                sno: index + 1,
                RecNo: item.RecNo,
                DEPDATE: moment(item.DEPDATE).format('DD/MM/YYYY'),
                TRANSTYPE: item.TRANSTYPE,
                mode: item.mode,
                DESCR: item.DESCR,
                CustName: item.CustName,
                Debit: item.Debit ? item.Debit.toFixed(2) : '',
                Credit: item.Credit ? item.Credit.toFixed(2) : '',
                currbal: item.currbal ? item.currbal.toFixed(2) : ''
            });
        });

        worksheet.addRow({});
        worksheet.addRow({
            sno: 'Total',
            Debit: sums.Debit ? sums.Debit.toFixed(2) : '',
            Credit: sums.Credit ? sums.Credit.toFixed(2) : '',
            currbal: sums.currbal ? sums.currbal.toFixed(2) : ''
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
        saveAs(new Blob([buffer]), 'BankStatementData.xlsx');
    };

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/Erp/GetBankDepDraw')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    useEffect(() => {
        let filtered = data;
        if (filters.accountNumber) {
            filtered = filtered.filter(item => item.ACCNO === filters.accountNumber);
        }
        if (filters.type) {
            filtered = filtered.filter(item => item.TRANSTYPE === filters.type);
        }
        if (filters.amount) {
            filtered = filtered.filter(item => item.Credit >= filters.amount || item.Debit >= filters.amount);
        }
        if (filters.payMode) {
            filtered = filtered.filter(item => item.mode === filters.payMode);
        }
        if (filters.dateFrom && filters.dateTo) {
            filtered = filtered.filter(item => {
                const depDate = moment(item.DEPDATE);
                const fromDate = moment(filters.dateFrom);
                const toDate = moment(filters.dateTo);
                return depDate.isBetween(fromDate, toDate, 'days', '[]');
            });
        }
        setFilteredData(filtered);
    }, [filters, data]);

    const handleTempFilterChange = (key, value) => {
        setTempFilters({
            ...tempFilters,
            [key]: value
        });
    };

    const applyFilters = () => {
        setFilters(tempFilters);
        setPopoverVisible(false);
    };

    const clearFilters = () => {
        const clearedFilters = {
            accountNumber: '',
            type: '',
            amount: '',
            payMode: '',
            dateFrom: null,
            dateTo: null
        };
        setTempFilters(clearedFilters);
        setFilters(clearedFilters);
    };

    const calculateSums = (data) => {
        return data.reduce((sums, item) => {
            sums.Debit += item.Debit || 0;
            sums.Credit += item.Credit || 0;
            sums.currbal = item.currbal || 0;
            return sums;
        }, { Debit: 0, Credit: 0, currbal: 0 });
    };

    const sums = calculateSums(filteredData);

    const columns = [
        { title: 'S.No', dataIndex: 'sno',align:"center", key: 'sno', render: (_, __, index) => index + 1 },
        { title: 'VNO', dataIndex: 'RecNo', key: 'RecNo' },
        { title: 'Date', dataIndex: 'DEPDATE', key: 'DEPDATE', render: (text) => moment(text).format('DD/MM/YYYY') },
        { title: 'Trans Type', dataIndex: 'TRANSTYPE', key: 'TRANSTYPE' },
        { title: 'Pay Mode', dataIndex: 'mode', key: 'mode' },
        { title: 'Particulars', dataIndex: 'DESCR', key: 'DESCR' },
        { title: 'Party Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'Debit', dataIndex: 'Debit', key: 'Debit',align:"right", render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Credit', dataIndex: 'Credit', key: 'Credit',align:"right", render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Closing Balance', dataIndex: 'currbal', key: 'currbal',align:"right", render: (value) => value ? value.toFixed(2) : '' }
    ];

    const uniqueAccountNumbers = [...new Set(data.map(item => item.ACCNO))];
    const uniquePayModes = [...new Set(data.map(item => item.mode))];

    const isFilterApplied = filters.accountNumber || filters.type || filters.amount || filters.payMode || (filters.dateFrom && filters.dateTo);

    const filterContent = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
                <Select
                    showSearch
                    allowClear
                    placeholder="Account Number"
                    style={{ width: '100%' }}
                    value={tempFilters.accountNumber}
                    onChange={(value) => {
                        handleTempFilterChange('accountNumber', value);
                        const selectedAccount = data.find(item => item.ACCNO === value);
                        if (selectedAccount) {
                            setTempFilters({
                                ...tempFilters,
                                accountNumber: value,
                                type: selectedAccount.TRANSTYPE,
                                amount: selectedAccount.Credit || selectedAccount.Debit
                            });
                        } else {
                            handleTempFilterChange('accountNumber', value);
                        }
                    }}
                >
                    {uniqueAccountNumbers.map(account => (
                        <Option key={account} value={account}>{account}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Type"
                    value={tempFilters.type}
                    onChange={(e) => handleTempFilterChange('type', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Amount"
                    value={tempFilters.amount}
                    onChange={(e) => handleTempFilterChange('amount', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Pay Mode"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.payMode}
                    onChange={(value) => handleTempFilterChange('payMode', value)}
                >
                    {uniquePayModes.map(mode => (
                        <Option key={mode} value={mode}>{mode}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <DatePicker
                    placeholder="From Date"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    value={tempFilters.dateFrom ? moment(tempFilters.dateFrom) : null}
                    onChange={(date) => handleTempFilterChange('dateFrom', date ? date.format('YYYY-MM-DD') : null)}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <DatePicker
                    placeholder="To Date"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    value={tempFilters.dateTo ? moment(tempFilters.dateTo) : null}
                    onChange={(date) => handleTempFilterChange('dateTo', date ? date.format('YYYY-MM-DD') : null)}
                />
            </Col>
            <Col xs={24} sm={24} md={24}>
                <Button type="primary" onClick={applyFilters}>Apply</Button>
                <Button style={{ marginLeft: '8px' }} onClick={clearFilters}>Clear</Button>
            </Col>
        </Row>
    );

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Bank Statement</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <Button icon={<PrinterOutlined />} onClick={handlePrint} style={{ marginRight: 8 }}>Print</Button>
                    <Button icon={<FilePdfOutlined />} onClick={handlePDFWithPreview} style={{ marginRight: 8 }}>PDF</Button>
                    <Button icon={<FileExcelOutlined />} onClick={handleExcel} style={{ marginRight: 8 }}>Excel</Button>
                    <Popover
                        content={filterContent}
                        title="Filters"
                        trigger="click"
                        open={popoverVisible}
                        onOpenChange={setPopoverVisible}
                        placement="bottomLeft"
                        overlayStyle={{ width: '500px' }}
                    >
                        <Button icon={<FilterOutlined />} type="primary">Filter</Button>
                    </Popover>
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
                        dataSource={isFilterApplied ? filteredData : []}
                        rowKey="RecNo"
                        pagination={{
                            pageSize: 5,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            position: ["topRight"],
                            style: { margin: "5px" }
                        }}
                        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                        summary={() => isFilterApplied && (
                            <Table.Summary fixed>
                                <Table.Summary.Row style={{ backgroundColor: "#D5D8DC" }}>
                                    <Table.Summary.Cell index={0} colSpan={7}>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell index={7} align="right">{sums.Debit ? sums.Debit.toFixed(2) : ''}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={8} align="right">{sums.Credit ? sums.Credit.toFixed(2) : ''}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={9} align="right">{sums.currbal ? sums.currbal.toFixed(2) : ''}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            </Table.Summary>
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

export default BankStatementReport;
