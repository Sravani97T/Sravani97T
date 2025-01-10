import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Input, Select, Pagination, DatePicker, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const BillMasterReport = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [tempFilters, setTempFilters] = useState({
        billNo: '',
        jewelType: '',
        customerName: '',
        mobileNumber: '',
        dateFrom: null,
        dateTo: null,
    });
    const [uniqueJewelTypes, setUniqueJewelTypes] = useState([]);
    const [uniqueCustomerNames, setUniqueCustomerNames] = useState([]);
    const [uniqueMobileNumbers, setUniqueMobileNumbers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/Erp/GetBillMast')
            .then(response => {
                const data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                }));
                setFilteredData(data);
                setOriginalData(data);

                // Extract unique jewel types, customer names, and mobile numbers
                const uniqueJewelTypes = [...new Set(data.map(item => item.JewelType))];
                const uniqueCustomerNames = [...new Set(data.map(item => item.CustName))];
                const uniqueMobileNumbers = [...new Set(data.map(item => item.MobileNum))];
                setUniqueJewelTypes(uniqueJewelTypes);
                setUniqueCustomerNames(uniqueCustomerNames);
                setUniqueMobileNumbers(uniqueMobileNumbers);
            })
            .catch(error => {
                console.error('Error fetching bill master data:', error);
            });
    }, []);

    const handleTempFilterChange = (field, value) => {
        setTempFilters(prevFilters => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    const applyFilters = () => {
        let filtered = originalData;

        if (tempFilters.billNo) {
            filtered = filtered.filter(item => item.BillNo.toString().includes(tempFilters.billNo));
        }
        if (tempFilters.jewelType) {
            filtered = filtered.filter(item => item.JewelType === tempFilters.jewelType);
        }
        if (tempFilters.customerName) {
            filtered = filtered.filter(item => item.CustName === tempFilters.customerName);
        }
        if (tempFilters.mobileNumber) {
            filtered = filtered.filter(item => item.MobileNum === tempFilters.mobileNumber);
        }
        if (tempFilters.dateFrom) {
            filtered = filtered.filter(item => moment(item.BillDate).isSameOrAfter(tempFilters.dateFrom));
        }
        if (tempFilters.dateTo) {
            filtered = filtered.filter(item => moment(item.BillDate).isSameOrBefore(tempFilters.dateTo));
        }

        setFilteredData(filtered);
    };

    const clearFilters = () => {
        setTempFilters({
            billNo: '',
            jewelType: '',
            customerName: '',
            mobileNumber: '',
            dateFrom: null,
            dateTo: null,
        });
        setFilteredData(originalData);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const calculateTotals = (data) => {
        return data.reduce((totals, item) => {
            totals.TotPieces += item.TotPieces || 0;
            totals.TotGwt += item.TotGwt || 0;
            totals.TotNwt += item.TotNwt || 0;
            totals.TotAmt += item.TotAmt || 0;
            totals.DisAmt += item.DisAmt || 0;
            totals.BillAmt += item.BillAmt || 0;
            totals.CGST += item.CGST || 0;
            totals.SGST += item.SGST || 0;
            totals.IGST += item.IGST || 0;
            totals.NetAmt += item.NetAmt || 0;
            return totals;
        }, { TotPieces: 0, TotGwt: 0, TotNwt: 0, TotAmt: 0, DisAmt: 0, BillAmt: 0, CGST: 0, SGST: 0, IGST: 0, NetAmt: 0 });
    };

    const totals = calculateTotals(filteredData);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', align: "center", key: 'serialNo' },
        { title: 'Bill Date', dataIndex: 'BillDate', key: 'BillDate', render: (text) => moment(text).format('DD/MM/YYYY') },
        { title: 'Jewel Type', dataIndex: 'JewelType', key: 'JewelType' },
        { title: 'Bill No', dataIndex: 'BillNo', key: 'BillNo' },
        { title: 'Customer Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'Pieces', dataIndex: 'TotPieces', key: 'TotPieces', align: 'right' },
        { title: 'Gross WT', dataIndex: 'TotGwt', key: 'TotGwt', align: 'right', render: (value) => value ? value.toFixed(3) : '' },
        { title: 'Net WT', dataIndex: 'TotNwt', key: 'TotNwt', align: 'right', render: (value) => value ? value.toFixed(3) : '' },
        { title: 'Total Amount', dataIndex: 'TotAmt', key: 'TotAmt', align: 'right', render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Discount', dataIndex: 'DisAmt', key: 'DisAmt', align: 'right', render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Gross Amount', dataIndex: 'BillAmt', key: 'BillAmt', align: 'right', render: (value) => value ? value.toFixed(2) : '' },
        { title: 'CGST', dataIndex: 'CGST', key: 'CGST', align: 'right', render: (value) => value ? value.toFixed(2) : '' },
        { title: 'SGST', dataIndex: 'SGST', key: 'SGST', align: 'right', render: (value) => value ? value.toFixed(2) : '' },
        { title: 'IGST', dataIndex: 'IGST', key: 'IGST', align: 'right', render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Net Amount', dataIndex: 'NetAmt', key: 'NetAmt', align: 'right', render: (value) => value ? value.toFixed(2) : '' }
    ];

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            serialNo: index + 1,
            TotGwt: item.TotGwt ? item.TotGwt.toFixed(3) : '',
            TotNwt: item.TotNwt ? item.TotNwt.toFixed(3) : '',
            TotAmt: item.TotAmt ? item.TotAmt.toFixed(2) : '',
            DisAmt: item.DisAmt ? item.DisAmt.toFixed(2) : '',
            BillAmt: item.BillAmt ? item.BillAmt.toFixed(2) : '',
            CGST: item.CGST ? item.CGST.toFixed(2) : '',
            SGST: item.SGST ? item.SGST.toFixed(2) : '',
            IGST: item.IGST ? item.IGST.toFixed(2) : '',
            NetAmt: item.NetAmt ? item.NetAmt.toFixed(2) : ''
        })),
        {
            serialNo: 'Total',
            BillDate: '',
            JewelType: '',
            BillNo: '',
            CustName: '',
            TotPieces: totals.TotPieces,
            TotGwt: totals.TotGwt.toFixed(3),
            TotNwt: totals.TotNwt.toFixed(3),
            TotAmt: totals.TotAmt.toFixed(2),
            DisAmt: totals.DisAmt.toFixed(2),
            BillAmt: totals.BillAmt.toFixed(2),
            CGST: totals.CGST.toFixed(2),
            SGST: totals.SGST.toFixed(2),
            IGST: totals.IGST.toFixed(2),
            NetAmt: totals.NetAmt.toFixed(2)
        }
    ];

    const filterContent = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={4}>
                <Input
                    placeholder="Bill No"
                    value={tempFilters.billNo}
                    onChange={(e) => handleTempFilterChange('billNo', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={4}>
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
            <Col xs={24} sm={12} md={4}>
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
            <Col xs={24} sm={12} md={4}>
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
            <Col xs={24} sm={12} md={4}>
                <DatePicker
                    placeholder="From Date"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    value={tempFilters.dateFrom ? moment(tempFilters.dateFrom) : null}
                    onChange={(date) => handleTempFilterChange('dateFrom', date ? date.format('YYYY-MM-DD') : null)}
                />
            </Col>
            <Col xs={24} sm={12} md={4}>
                <DatePicker
                    placeholder="To Date"
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    value={tempFilters.dateTo ? moment(tempFilters.dateTo) : null}
                    onChange={(date) => handleTempFilterChange('dateTo', date ? date.format('YYYY-MM-DD') : null)}
                />
            </Col>
            <Col xs={24} sm={12} md={4}>
                <Button type="primary" onClick={applyFilters} style={{ marginRight: 8 }}>Apply</Button>
                <Button onClick={clearFilters}>Clear</Button>
            </Col>
        </Row>
    );

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill Master Report</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="BillMasterReport"
                        totals={totals}
                    />
                </Col>
            </Row>
            {filterContent}
            <Row gutter={8} style={{ marginBottom: 8 }} align="middle">
                <Col flex="auto" />
                <Col>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePageChange}
                        pageSizeOptions={["6", "10", "20", "50", "100"]}
                        showSizeChanger
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        size="small"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div
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
                        dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        rowKey="key"
                        pagination={false}
                        rowClassName="table-row"
                        summary={() => (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={5}>Total</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">{totals.TotPieces}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">{totals.TotGwt.toFixed(3)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">{totals.TotNwt.toFixed(3)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={4} align="right">{totals.TotAmt.toFixed(2)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={5} align="right">{totals.DisAmt.toFixed(2)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={6} align="right">{totals.BillAmt.toFixed(2)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={7} align="right">{totals.CGST.toFixed(2)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={8} align="right">{totals.SGST.toFixed(2)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={9} align="right">{totals.IGST.toFixed(2)}</Table.Summary.Cell>
                                <Table.Summary.Cell index={10} align="right">{totals.NetAmt.toFixed(2)}</Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                </div>
            </div>
        </>
    );
};

export default BillMasterReport;
