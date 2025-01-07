import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Breadcrumb, Row, Col, DatePicker, Popover, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

const { Option } = Select;

const BillMasterReport = () => {
    const [filters, setFilters] = useState({
        billNo: '',
        jewelType: '',
        customerName: '',
        mobileNumber: '',
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
        const totals = calculateTotals();
    
        doc.autoTable({
            head: [['S.No', 'Bill Date', 'Jewel Type', 'Bill No', 'Customer Name', 'PCS', 'GWT', 'NWT', 'Total Amount', 'Discount', 'Gross Amount', 'CGST', 'SGST', 'IGST', 'Net Amount']],
            body: [
                ...filteredData.map((item, index) => [
                    index + 1,
                    moment(item.BillDate).format('DD/MM/YYYY'),
                    item.JewelType,
                    item.BillNo,
                    item.CustName,
                    item.TotPieces,
                    formatValue(item.TotGwt),
                    formatValue(item.TotNwt),
                    formatValue1(item.TotAmt),
                    formatValue1(item.DisAmt),
                    formatValue1(item.BillAmt),
                    formatValue1(item.CGST),
                    formatValue1(item.SGST),
                    formatValue1(item.IGST),
                    formatValue1(item.NetAmt)
                ]),
                [
                    'Totals',
                    '',
                    '',
                    '',
                    '',
                    totals.TotPieces,
                    formatValue(totals.TotGwt),
                    formatValue(totals.TotNwt),
                    formatValue1(totals.TotAmt),
                    formatValue1(totals.DisAmt),
                    formatValue1(totals.BillAmt),
                    formatValue1(totals.CGST),
                    formatValue1(totals.SGST),
                    formatValue1(totals.IGST),
                    formatValue1(totals.NetAmt)
                ]
            ],
            styles: { cellPadding: 1, fontSize: 5 },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 5 },
            columnStyles: {
                0: { cellWidth: 11 },
                1: { cellWidth: 30 },
                // Configure other column widths as per your needs
            }
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
                saveAs(pdfBlob, 'D:/PDF_PATH/bill_master_report.pdf');
            };
        };
    };
    
    const handleExcel = async () => {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Bill Master Data');
    
        worksheet.columns = [
            { header: 'S.No', key: 'sno', width: 5 },
            { header: 'Bill Date', key: 'BillDate', width: 15 },
            { header: 'Jewel Type', key: 'JewelType', width: 20 },
            { header: 'Bill No', key: 'BillNo', width: 10 },
            { header: 'Customer Name', key: 'CustName', width: 30 },
            { header: 'PCS', key: 'TotPieces', width: 10 },
            { header: 'GWT', key: 'TotGwt', width: 10 },
            { header: 'NWT', key: 'TotNwt', width: 10 },
            { header: 'Total Amount', key: 'TotAmt', width: 20 },
            { header: 'Discount', key: 'DisAmt', width: 15 },
            { header: 'Gross Amount', key: 'BillAmt', width: 20 },
            { header: 'CGST', key: 'CGST', width: 10 },
            { header: 'SGST', key: 'SGST', width: 10 },
            { header: 'IGST', key: 'IGST', width: 10 },
            { header: 'Net Amount', key: 'NetAmt', width: 20 }
        ];
    
        filteredData.forEach((item, index) => {
            worksheet.addRow({
                sno: index + 1,
                BillDate: moment(item.BillDate).format('DD/MM/YYYY'),
                JewelType: item.JewelType,
                BillNo: item.BillNo,
                CustName: item.CustName,
                TotPieces: item.TotPieces,
                TotGwt: formatValue(item.TotGwt),
                TotNwt: formatValue(item.TotNwt),
                TotAmt: formatValue1(item.TotAmt),
                DisAmt: formatValue1(item.DisAmt),
                BillAmt: formatValue1(item.BillAmt),
                CGST: formatValue1(item.CGST),
                SGST: formatValue1(item.SGST),
                IGST: formatValue1(item.IGST),
                NetAmt: formatValue1(item.NetAmt)
            });
        });
    
        const totals = calculateTotals();
    
        worksheet.addRow({
            sno: 'Totals',
            BillDate: '',
            JewelType: '',
            BillNo: '',
            CustName: '',
            TotPieces: totals.TotPieces,
            TotGwt: formatValue(totals.TotGwt),
            TotNwt: formatValue(totals.TotNwt),
            TotAmt: formatValue1(totals.TotAmt),
            DisAmt: formatValue1(totals.DisAmt),
            BillAmt: formatValue1(totals.BillAmt),
            CGST: formatValue1(totals.CGST),
            SGST: formatValue1(totals.SGST),
            IGST: formatValue1(totals.IGST),
            NetAmt: formatValue1(totals.NetAmt)
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'BillMasterData.xlsx');
    };
    

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/Erp/GetBillMast')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    useEffect(() => {
        let filtered = data;
        if (filters.billNo) {
            filtered = filtered.filter(item => item.BillNo.toString().includes(filters.billNo));
        }
        if (filters.jewelType) {
            filtered = filtered.filter(item => item.JewelType === filters.jewelType);
        }
        if (filters.customerName) {
            filtered = filtered.filter(item => item.CustName === filters.customerName);
        }
        if (filters.mobileNumber) {
            filtered = filtered.filter(item => item.MobileNum === filters.mobileNumber);
        }
        if (filters.dateFrom && filters.dateTo) {
            filtered = filtered.filter(item => {
                const billDate = moment(item.BillDate);
                const fromDate = moment(filters.dateFrom);
                const toDate = moment(filters.dateTo);
                return billDate.isBetween(fromDate, toDate, 'days', '[]');
            });
        }
        setFilteredData(filtered.map((item, index) => ({ ...item, sno: index + 1 })));
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
            billNo: '',
            jewelType: '',
            customerName: '',
            mobileNumber: '',
            dateFrom: null,
            dateTo: null
        };
        setTempFilters(clearedFilters);
        setFilters(clearedFilters);
    };
    const formatValue = (value) => value.toFixed(3);
    const formatValue1 = (value) => value.toFixed(2);

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', },
        { title: 'Bill Date', dataIndex: 'BillDate', key: 'BillDate', render: (text) => moment(text).format('DD/MM/YYYY') },
        { title: 'Jewel Type', dataIndex: 'JewelType', key: 'JewelType' },
        { title: 'Bill No', dataIndex: 'BillNo', key: 'BillNo' },
        { title: 'Customer Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'Pieces', dataIndex: 'TotPieces', key: 'TotPieces', align: 'right' },
        { title: 'Gross WT', dataIndex: 'TotGwt', key: 'TotGwt', align: 'right', render: formatValue },
        { title: 'Net WT', dataIndex: 'TotNwt', key: 'TotNwt', align: 'right', render: formatValue },
        { title: 'Total Amount', dataIndex: 'TotAmt', key: 'TotAmt', align: 'right', render: formatValue1 },
        { title: 'Discount', dataIndex: 'DisAmt', key: 'DisAmt', align: 'right', render: formatValue1 },
        { title: 'Gross Amount', dataIndex: 'BillAmt', key: 'BillAmt', align: 'right', render: formatValue1 },
        { title: 'CGST', dataIndex: 'CGST', key: 'CGST', align: 'right', render: formatValue1 },
        { title: 'SGST', dataIndex: 'SGST', key: 'SGST', align: 'right', render: formatValue1 },
        { title: 'IGST', dataIndex: 'IGST', key: 'IGST', align: 'right', render: formatValue1 },
        { title: 'Net Amount', dataIndex: 'NetAmt', key: 'NetAmt', align: 'right', render: formatValue1 }
    ];

    const uniqueJewelTypes = [...new Set(data.map(item => item.JewelType))];
    const uniqueCustomerNames = [...new Set(data.map(item => item.CustName))];
    const uniqueMobileNumbers = [...new Set(data.map(item => item.MobileNum))];

    const isFilterApplied = filters.billNo || filters.jewelType || filters.customerName || filters.mobileNumber || (filters.dateFrom && filters.dateTo);

    const filterContent = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Bill No"
                    value={tempFilters.billNo}
                    onChange={(e) => handleTempFilterChange('billNo', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Jewel Type"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.jewelType}
                    onChange={(value) => handleTempFilterChange('jewelType', value)}
                >
                    {uniqueJewelTypes.map(type => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    showSearch
                    allowClear
                    placeholder="Customer Name"
                    style={{ width: '100%' }}
                    value={tempFilters.customerName}
                    onChange={(value) => handleTempFilterChange('customerName', value)}
                >
                    {uniqueCustomerNames.map(name => (
                        <Option key={name} value={name}>{name}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    showSearch
                    allowClear
                    placeholder="Mobile Number"
                    style={{ width: '100%' }}
                    value={tempFilters.mobileNumber}
                    onChange={(value) => handleTempFilterChange('mobileNumber', value)}
                >
                    {uniqueMobileNumbers.map(number => (
                        <Option key={number} value={number}>{number}</Option>
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

    const calculateTotals = () => {
        const totals = {
            TotPieces: 0,
            TotGwt: 0,
            TotNwt: 0,
            TotAmt: 0,
            DisAmt: 0,
            BillAmt: 0,
            CGST: 0,
            SGST: 0,
            IGST: 0,
            NetAmt: 0
        };

        filteredData.forEach(item => {
            totals.TotPieces += item.TotPieces;
            totals.TotGwt += item.TotGwt;
            totals.TotNwt += item.TotNwt;
            totals.TotAmt += item.TotAmt;
            totals.DisAmt += item.DisAmt;
            totals.BillAmt += item.BillAmt;
            totals.CGST += item.CGST;
            totals.SGST += item.SGST;
            totals.IGST += item.IGST;
            totals.NetAmt += item.NetAmt;
        });

        return totals;
    };

    const totals = calculateTotals();

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill Master</Breadcrumb.Item>
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
                        rowKey="BillNo"
                        pagination={{
                            pageSize: 5,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            position: ["topRight"],
                            style: { margin: "5px" }
                        }}
                        rowClassName={(_, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
                        summary={() => isFilterApplied && (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={5}>Total</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">{totals.TotPieces}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">{formatValue(totals.TotGwt)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">{formatValue(totals.TotNwt)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4} align="right">{formatValue1(totals.TotAmt)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5} align="right">{formatValue1(totals.DisAmt)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={6} align="right">{formatValue1(totals.BillAmt)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={7} align="right">{formatValue1(totals.CGST)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={8} align="right">{formatValue1(totals.SGST)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={9} align="right">{formatValue1(totals.IGST)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={10} align="right">{formatValue1(totals.NetAmt)}</Table.Summary.Cell>
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

export default BillMasterReport;