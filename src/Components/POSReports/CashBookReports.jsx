import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CashBookReports = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [openingCash, setOpeningCash] = useState(0);
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const saleCode = 1;

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetCashBookOpenings?billDate=${fromDate}&saleCode=${saleCode}`)
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
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');
            const saleCode = 1;

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetCashBookDetails?fromDate=${fromDate}&toDate=${toDate}&saleCode=${saleCode}`)
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
        { title: 'S. No', dataIndex: 'serialNo', key: 'serialNo' }, // Added serial number column
        { title: 'Bill No', dataIndex: 'BILLNO', key: 'BILLNO' },
        { title: 'Bill Date', dataIndex: 'BILLDATE', key: 'BILLDATE', render: date => moment(date).format('MM/DD/YYYY') },
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
            serialNo: '', // Add empty value for the serial number in the total row
            BILLNO: 'Total',
            BILLDATE: '',
            PARTICULARS: '',
            TYPE: '', // Add empty value for the new column in the total row
            DEBIT: totalDebit,
            CREDIT: totalCredit,
            BALANCE: totalBalance,
        }
    ];

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
                    />
                </Col>
            </Row>
            <Row justify="space-between" align="middle">
                <Col>
                    <Row gutter={16} justify="center">
                        <Col>
                            <DatePicker
                                selected={dates[0]}
                                onChange={(date) => setDates([date, dates[1]])}
                                selectsStart
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="Start Date"
                                className="date-picker"
                                showIcon
                                icon="fa fa-calendar"
                                style={{ width: '100%', borderColor: 'lightgrey', align: "center" }}
                            />
                        </Col>
                        <Col>
                            <DatePicker
                                selected={dates[1]}
                                onChange={(date) => setDates([dates[0], date])}
                                selectsEnd
                                startDate={dates[0]}
                                endDate={dates[1]}
                                placeholderText="End Date"
                                className="date-picker"
                                showIcon
                                icon="fa fa-calendar"
                                style={{ width: '100%', borderColor: 'lightgrey' }}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <div style={{ fontWeight: '600', color: '#0C1154', marginRight: 16 }}>Opening Cash: {openingCash.toFixed(2)}</div>
                </Col>
            </Row>
            <div style={{ marginTop: "10px" }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="key"
                    pagination={{
                        pageSize: 6,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        position: ["topRight"],
                        style: { margin: "16px 0" }
                    }}
                    rowClassName="table-row"
                    summary={() => filteredData.length > 0 && (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={5}>Total</Table.Summary.Cell> {/* Adjusted colspan */}
                            <Table.Summary.Cell align="right">{totalDebit}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalCredit}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalBalance}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default CashBookReports;
