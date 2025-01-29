import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Pagination } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const CashBookReports = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [openingCash, setOpeningCash] = useState(0);
    const [dates, setDates] = useState([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Default page size set to 20

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('YYYY-MM-DD');
            const saleCode = 1;

            axios.get(`${CREATE_jwel}/api/POSReports/GetCashBookOpenings?billDate=${fromDate}&saleCode=${saleCode}`)
                .then(response => {
                    const openingData = response.data[0];
                    const openingCashValue = openingData.Column1 - openingData.Column2;
                    setOpeningCash(openingCashValue);
                })
                .catch(error => {
                    console.error('Error fetching opening cash:', error);
                });
        }
    }, [dates]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('YYYY-MM-DD');
            const toDate = moment(dates[1]).format('YYYY-MM-DD');
            const saleCode = 1;

            axios.get(`${CREATE_jwel}/api/POSReports/GetCashBookDetails?fromDate=${fromDate}&toDate=${toDate}&saleCode=${saleCode}`)
                .then(response => {
                    const detailsData = response.data;
                    let balance = openingCash;
                    const calculatedData = detailsData.map((item, index) => {
                        balance = balance + item.DEBIT - item.CREDIT;
                        return { ...item, BALANCE: balance, key: index + 1, serialNo: index + 1 };
                    });
                    setFilteredData(calculatedData);
                })
                .catch(error => {
                    console.error('Error fetching cash book details:', error);
                });
        }
    }, [dates, openingCash]);

    useEffect(() => {
        console.log('Filtered Data:', filteredData);
    }, [filteredData]);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', width: 50, align: "center", key: 'serialNo', className: 'blue-background-column' },
        { title: 'Bill No', dataIndex: 'BILLNO', key: 'BILLNO' },
        { title: 'Bill Date', dataIndex: 'BILLDATE', key: 'BILLDATE', render: date => moment(date).format('DD/MM/YYYY') },
        { title: 'Particulars', dataIndex: 'PARTICULARS', key: 'PARTICULARS' },
        { title: 'Type', dataIndex: 'TYPE', key: 'TYPE' }, // New column added here
        { title: 'Debit', dataIndex: 'DEBIT', key: 'DEBIT', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Credit', dataIndex: 'CREDIT', key: 'CREDIT', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Balance', dataIndex: 'BALANCE', key: 'BALANCE', align: "right", render: value => Number(value).toFixed(2) },
    ];

    useEffect(() => {
        const today = new Date();
        setDates([today, today]);
    }, []);

    const getTotals = () => {
        const totalDebit = filteredData.reduce((sum, item) => sum + item.DEBIT, 0);
        const totalCredit = filteredData.reduce((sum, item) => sum + item.CREDIT, 0);
        const totalBalance = filteredData.length > 0 ? filteredData[filteredData.length - 1].BALANCE : 0;

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            totalBalance: totalBalance.toFixed(2),
        };
    };

    const { totalDebit, totalCredit, totalBalance } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            serialNo: index + 1,
            DEBIT: Number(item.DEBIT).toFixed(2),
            CREDIT: Number(item.CREDIT).toFixed(2),
            BALANCE: Number(item.BALANCE).toFixed(2),
        })),
        {
            serialNo: 'Total',
            BILLNO: '',
            BILLDATE: '',
            PARTICULARS: '',
            TYPE: '',
            DEBIT: totalDebit,
            CREDIT: totalCredit,
            BALANCE: totalBalance,
        }
    ];

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Cash Book</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="CashBookReport"
                        totals={{ totalDebit, totalCredit, totalBalance }} // Pass totals as props
                    />
                </Col>
            </Row>
            <Row justify="space-between" align="middle">
                <Col>
                    <Row gutter={16} justify="center" align="middle">
                        <Col>
                            <label style={{ marginRight: 8 ,fontSize:"16px"}}>Start Date:</label>
                            <DatePicker
                                selected={dates[0]}
                                onChange={(date) => setDates([date, dates[1]])}
                                selectsStart
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="Start Date"
                                customInput={<CustomInput />}
                                dateFormat="dd/MM/yyyy"
                            />
                        </Col>
                        <Col>
                            <label style={{ marginRight: 8 ,fontSize:"16px"}}>End Date:</label>
                            <DatePicker
                                selected={dates[1]}
                                onChange={(date) => setDates([dates[0], date])}
                                selectsEnd
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="End Date"
                                customInput={<CustomInput />}
                                dateFormat="dd/MM/yyyy"
                            />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <div style={{ fontWeight: '600', color: '#0C1154', marginRight: 16 }}>Opening Cash: {openingCash.toFixed(2)}</div>
                </Col>
            </Row>
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
                            dataSource={formattedData.slice(0, -1).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="key"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align="right">{totalDebit}</Table.Summary.Cell>
                                    <Table.Summary.Cell align="right">{totalCredit}</Table.Summary.Cell>
                                    <Table.Summary.Cell align="right">{totalBalance}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default CashBookReports;
