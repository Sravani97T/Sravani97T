import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Input, Select, Pagination } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const BankStatementReport = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [tempFilters, setTempFilters] = useState({
        accountNumber: '',
        type: '',
        amount: '',
        payMode: '',
        dateFrom: moment().format('YYYY-MM-DD'),
        dateTo: moment().format('YYYY-MM-DD'),
    });
    const [uniqueAccountNumbers, setUniqueAccountNumbers] = useState([]);
    const [uniquePayModes, setUniquePayModes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/Erp/GetBankDepDraw`)
            .then(response => {
                const data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                    balance: item.Credit - item.Debit,
                }));
                setOriginalData(data);

                // Extract unique account numbers and pay modes
                const uniqueAccounts = [...new Set(data.map(item => item.ACCNO))];
                const uniqueModes = [...new Set(data.map(item => item.mode))];
                setUniqueAccountNumbers(uniqueAccounts);
                setUniquePayModes(uniqueModes);

                // Apply initial filters based on current date
                const filtered = data.filter(item => 
                    moment(item.DEPDATE).isSameOrAfter(tempFilters.dateFrom) &&
                    moment(item.DEPDATE).isSameOrBefore(tempFilters.dateTo)
                );
                setFilteredData(filtered.length > 0 ? filtered : []);
            })
            .catch(error => {
                console.error('Error fetching bank statement:', error);
            });
    }, [tempFilters.dateFrom, tempFilters.dateTo]);

    const handleTempFilterChange = (field, value) => {
        const newFilters = {
            ...tempFilters,
            [field]: value,
        };
        setTempFilters(newFilters);
        applyFilters(newFilters);
    };

    const applyFilters = (filters) => {
        let filtered = originalData;

        if (filters.accountNumber) {
            filtered = filtered.filter(item => item.ACCNO === filters.accountNumber);
        }
        if (filters.type) {
            filtered = filtered.filter(item => item.TRANSTYPE.includes(filters.type));
        }
        if (filters.amount) {
            filtered = filtered.filter(item => item.Credit === parseFloat(filters.amount) || item.Debit === parseFloat(filters.amount));
        }
        if (filters.payMode) {
            filtered = filtered.filter(item => item.mode === filters.payMode);
        }
        if (filters.dateFrom) {
            filtered = filtered.filter(item => moment(item.DEPDATE, 'YYYY-MM-DD').isSameOrAfter(moment(filters.dateFrom, 'YYYY-MM-DD')));
        }
        if (filters.dateTo) {
            filtered = filtered.filter(item => moment(item.DEPDATE, 'YYYY-MM-DD').isSameOrBefore(moment(filters.dateTo, 'YYYY-MM-DD')));
        }

        setFilteredData(filtered);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const calculateTotals = (data) => {
        return data.reduce((totals, item) => {
            totals.debit += item.Debit || 0;
            totals.credit += item.Credit || 0;
            return totals;
        }, { debit: 0, credit: 0 });
    };

    const totals = calculateTotals(filteredData);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', width: 50, align: "center", key: 'serialNo', className: 'blue-background-column' },
        { title: 'VNO', dataIndex: 'RecNo', key: 'RecNo' },
        { title: 'Date', dataIndex: 'DEPDATE', key: 'DEPDATE', render: (text) => moment(text, 'YYYY-MM-DD').format('DD/MM/YYYY') },
        { title: 'Trans Type', dataIndex: 'TRANSTYPE', key: 'TRANSTYPE' },
        { title: 'Pay Mode', dataIndex: 'mode', key: 'mode' },
        { title: 'Particulars', dataIndex: 'DESCR', key: 'DESCR' },
        { title: 'Party Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'Debit', dataIndex: 'Debit', key: 'Debit', align: "right", render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Credit', dataIndex: 'Credit', key: 'Credit', align: "right", render: (value) => value ? value.toFixed(2) : '' },
        { title: 'Closing Balance', dataIndex: 'balance', key: 'balance', align: "right", render: (value) => value ? value.toFixed(2) : '' }
    ];

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            serialNo: index + 1,
            Debit: item.Debit ? item.Debit.toFixed(2) : '',
            Credit: item.Credit ? item.Credit.toFixed(2) : '',
            balance: item.balance ? item.balance.toFixed(2) : ''
        })),
        {
            serialNo: 'Total',
            RecNo: '',
            DEPDATE: '',
            TRANSTYPE: '',
            mode: '',
            DESCR: '',
            CustName: '',
            Debit: totals.debit.toFixed(2),
            Credit: totals.credit.toFixed(2),
            balance: (totals.credit - totals.debit).toFixed(2)
        }
    ];

    const filterContent = (
        <Row gutter={[8, 8]}>
            <Col xs={24} sm={12} md={4}>
                <Select
                    showSearch
                    allowClear
                    placeholder="Account Number"
                    style={{ width: '100%' }}
                    value={tempFilters.accountNumber || undefined}
                    onChange={(value) => handleTempFilterChange('accountNumber', value)}
                >
                    {uniqueAccountNumbers.map(account => (
                        <Option key={account} value={account}>{account}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
                <Input
                    placeholder="Type"
                    value={tempFilters.type}
                    onChange={(e) => handleTempFilterChange('type', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={4}>
                <Input
                    placeholder="Amount"
                    value={tempFilters.amount}
                    onChange={(e) => handleTempFilterChange('amount', e.target.value)}
                />
            </Col>
            <Col xs={24} sm={12} md={4}>
                <Select
                    placeholder="Pay Mode"
                    allowClear
                    style={{ width: '100%' }}
                    value={tempFilters.payMode || undefined}
                    onChange={(value) => handleTempFilterChange('payMode', value)}
                >
                    {uniquePayModes.map(mode => (
                        <Option key={mode} value={mode}>{mode}</Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
                <DatePicker
                    selected={tempFilters.dateFrom ? new Date(tempFilters.dateFrom) : null}
                    onChange={(date) => handleTempFilterChange('dateFrom', date ? moment(date).format('YYYY-MM-DD') : null)}
                    customInput={<CustomInput />}
                    placeholderText="From Date"
                    dateFormat="dd/MM/yyyy"
                />
            </Col>
            <Col xs={24} sm={12} md={4}>
                <DatePicker
                    selected={tempFilters.dateTo ? new Date(tempFilters.dateTo) : null}
                    onChange={(date) => handleTempFilterChange('dateTo', date ? moment(date).format('YYYY-MM-DD') : null)}
                    customInput={<CustomInput />}
                    placeholderText="To Date"
                    dateFormat="dd/MM/yyyy"
                />
            </Col>
        </Row>
    );

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Bank Statement Report</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="BankStatementReport"
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
                        overflowY: "auto",
                        overflowX: "auto",
                        marginTop: "20px",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    }}
                >
                    <TableHeaderStyles>
                        <Table
                            size="small"
                            columns={columns}
                            dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="key"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell index={0} colSpan={7}>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">{totals.debit.toFixed(2)}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="right">{totals.credit.toFixed(2)}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">{(totals.credit - totals.debit).toFixed(2)}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default BankStatementReport;
