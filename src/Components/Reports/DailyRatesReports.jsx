import React, { useState, useEffect } from 'react';
import { Table, Select, Input, Breadcrumb, Row, Col, DatePicker, Popover, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { PrinterOutlined, FilePdfOutlined, FileExcelOutlined, FilterOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { CREATE_jwel } from '../../Config/Config';

const { Option } = Select;
const { RangePicker } = DatePicker;

const DailyRatesReports = () => {
    const [filters, setFilters] = useState({
        mainProduct: '',
        prefix: '',
        rateFrom: null,
        rateTo: null,
        rateDate: []
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
            head: [['S.No', 'Date', 'Main Product', 'Prefix', 'Rate', 'Pure or Not']],
            body: filteredData.map((item, index) => [
                index + 1,
                moment(item.RDATE).format('DD/MM/YYYY'),
                item.MAINPRODUCT,
                item.PREFIX,
                item.RATE,
                item.PUREORNOT ? 'Yes' : 'No'
            ]),
            styles: { cellPadding: 1, fontSize: 5, lineColor: [200, 200, 200], lineWidth: 0.1, fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontSize: 5, fontStyle: 'normal' },
            footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [200, 200, 200], fontStyle: 'normal' },
            margin: { top: 5, bottom: 5 },
            columnStyles: {
                0: { cellWidth: 11 },
                1: { cellWidth: 20 },
                2: { cellWidth: 30 },
                3: { cellWidth: 20 },
                4: { cellWidth: 20 },
                5: { cellWidth: 20 }
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
                saveAs(pdfBlob, 'D:/PDF_PATH/daily_rates.pdf');
            };
        };
    };

    const handleExcel = async () => {
        const ExcelJS = await import('exceljs');
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Daily Rates Data');

        worksheet.columns = [
            { header: 'S.No', key: 'sno', width: 5 },
            { header: 'Date', key: 'RDATE', width: 15 },
            { header: 'Main Product', key: 'MAINPRODUCT', width: 30 },
            { header: 'Prefix', key: 'PREFIX', width: 10 },
            { header: 'Rate', key: 'RATE', width: 10 },
            { header: 'Pure or Not', key: 'PUREORNOT', width: 15 }
        ];

        filteredData.forEach((item, index) => {
            worksheet.addRow({
                sno: index + 1,
                RDATE: moment(item.RDATE).format('DD/MM/YYYY'),
                MAINPRODUCT: item.MAINPRODUCT,
                PREFIX: item.PREFIX,
                RATE: item.RATE,
                PUREORNOT: item.PUREORNOT ? 'Yes' : 'No'
            });
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
        saveAs(new Blob([buffer]), 'DailyRatesData.xlsx');
    };

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/Erp/GetDailyRatesList`) // Corrected template literal
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching the data:', error);
            });
    }, []);
    

    useEffect(() => {
        let filtered = data;
        if (filters.mainProduct) {
            filtered = filtered.filter(item => item.MAINPRODUCT === filters.mainProduct);
        }
        if (filters.prefix) {
            filtered = filtered.filter(item => item.PREFIX === filters.prefix);
        }
        if (filters.rateFrom !== null && filters.rateTo !== null) {
            filtered = filtered.filter(item => item.RATE >= filters.rateFrom && item.RATE <= filters.rateTo);
        }
        if (filters.rateDate.length === 2) {
            filtered = filtered.filter(item => {
                const rateDate = moment(item.RDATE);
                const fromDate = moment(filters.rateDate[0]);
                const toDate = moment(filters.rateDate[1]);
                return rateDate.isBetween(fromDate, toDate, 'days', '[]');
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
            mainProduct: '',
            prefix: '',
            rateFrom: null,
            rateTo: null,
            rateDate: []
        };
        setTempFilters(clearedFilters);
        setFilters(clearedFilters);
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', render: (text, record, index) => index + 1 },
        { title: 'Date', dataIndex: 'RDATE', key: 'RDATE', render: (text) => moment(text).format('DD/MM/YYYY') },
        { title: 'Main Product', dataIndex: 'MAINPRODUCT', key: 'MAINPRODUCT' },
        { title: 'Prefix', dataIndex: 'PREFIX', key: 'PREFIX' },
        { title: 'Rate', dataIndex: 'RATE', key: 'RATE', align: "right" },
        { title: 'Pure or Not', dataIndex: 'PUREORNOT', key: 'PUREORNOT', render: (text) => text ? 'Yes' : 'No' }
    ];

    const uniqueMainProducts = [...new Set(data.map(item => item.MAINPRODUCT))];
    const uniquePrefixes = [...new Set(data.map(item => item.PREFIX))];

    const isFilterApplied = filters.mainProduct || filters.prefix || (filters.rateFrom !== null && filters.rateTo !== null) || (filters.rateDate.length === 2);

    const filterContent = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={8}>
                <Select
                    showSearch
                    allowClear
                    placeholder="Main Product"
                    style={{ width: '100%' }}
                    value={tempFilters.mainProduct}
                    onChange={(value) => handleTempFilterChange('mainProduct', value)}
                >
                    {uniqueMainProducts.map(product => (
                        <Option key={product} value={product}>{product}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Select
                    placeholder="Prefix"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.prefix}
                    onChange={(value) => handleTempFilterChange('prefix', value)}
                >
                    {uniquePrefixes.map(prefix => (
                        <Option key={prefix} value={prefix}>{prefix}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Rate From"
                    value={tempFilters.rateFrom}
                    onChange={(e) => handleTempFilterChange('rateFrom', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Rate To"
                    value={tempFilters.rateTo}
                    onChange={(e) => handleTempFilterChange('rateTo', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={8}>
                <RangePicker
                    placeholder={["Rate Date From", "Rate Date To"]}
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    value={tempFilters.rateDate.length === 2 ? [moment(tempFilters.rateDate[0]), moment(tempFilters.rateDate[1])] : []}
                    onChange={(dates) => {
                        const formattedDates = dates ? [dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')] : [];
                        handleTempFilterChange('rateDate', formattedDates);
                    }}
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
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
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
                        rowKey="RDATE"
                        pagination={{
                            pageSize: 5,
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "20", "50"],
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            position: ["topRight"],
                            style: { margin: "5px" }
                        }}
                        rowClassName={(record, index) => (index % 2 === 0 ? 'table-row-light' : 'table-row-dark')}
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

export default DailyRatesReports;