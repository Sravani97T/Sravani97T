import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const { Option } = Select;

const GS12Reports = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [openingCash, setOpeningCash] = useState(0);
    const [dates, setDates] = useState([moment().toDate(), moment().toDate()]);
    const [particulars, setParticulars] = useState('');
    const [particularsList, setParticularsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/POSReports/GetGS12MNameList`)
            .then(response => {
                setParticularsList(response.data);
                if (response.data.length > 0) {
                    setParticulars(response.data[0].PARTICULARS);
                }
            })
            .catch(error => {
                console.error('Error fetching particulars list:', error);
            });
    }, []);

    useEffect(() => {
        if (dates[0] && dates[1] && particulars) {
            const fromDate = moment(dates[0]).format('YYYY/MM/DD');
            const toDate = moment(dates[1]).format('YYYY/MM/DD');

            axios.get(`${CREATE_jwel}/api/POSReports/GetG12Opening?entryDate=${toDate}&particulars=${particulars}&saleCode=1&preFix=%`)
                .then(response => {
                    const openingData = response.data[0];
                    const openingCashValue = openingData.Column1 - openingData.Column2;
                    setOpeningCash(openingCashValue);
                })
                .catch(error => {
                    console.error('Error fetching opening cash:', error);
                });

            axios.get(`${CREATE_jwel}/api/POSReports/GetG12Details?fromDate=${fromDate}&toDate=${toDate}&particulars=${particulars}&saleCode=1&preFix=%`)
                .then(response => {
                    const detailsData = response.data;
                    let balance = openingCash;
                    const calculatedData = detailsData.map((item, index) => {
                        balance = balance + item.JAMA - item.NAMA;
                        return { ...item, BALANCE: balance, key: index + 1, serialNo: index + 1, HSNCode: '7333' };
                    });
                    setFilteredData(calculatedData);
                })
                .catch(error => {
                    console.error('Error fetching GS12 details:', error);
                });
        }
    }, [dates, particulars, openingCash]);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', width: 50, align: "center", key: 'serialNo', className: 'blue-background-column' },
        { title: 'Date', dataIndex: 'ENTRYDATE', key: 'ENTRYDATE', render: date => moment(date).format('YYYY/MM/DD') },
        { title: 'Particulars', dataIndex: 'PARTICULARS', key: 'PARTICULARS' },
        { title: 'Party Name', dataIndex: 'PARTYNAME', key: 'PARTYNAME' },
        { title: 'HSN Code', dataIndex: 'HSNCode', key: 'HSNCode' },
        { title: 'Inv .no', dataIndex: 'VNO', key: 'VNO' },
        { title: 'Debit', dataIndex: 'JAMA', key: 'JAMA', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Credit', dataIndex: 'NAMA', key: 'NAMA', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Balance', dataIndex: 'BALANCE', key: 'BALANCE', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Prefix', dataIndex: 'PREFIX', key: 'PREFIX' },
        { title: 'Transaction Type', dataIndex: 'STYPE', key: 'STYPE' },
    ];

    const getTotals = () => {
        const totalDebit = filteredData.reduce((sum, item) => sum + item.JAMA, 0);
        const totalCredit = filteredData.reduce((sum, item) => sum + item.NAMA, 0);
        const totalBalance = filteredData.length > 0 ? filteredData[filteredData.length - 1].BALANCE : 0;

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            totalBalance: totalBalance.toFixed(2),
        };
    };

    const { totalDebit, totalCredit, totalBalance } = getTotals();

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            serialNo: index + 1,
            ENTRYDATE: moment(item.ENTRYDATE).format('YYYY/MM/DD'),
            JAMA: Number(item.JAMA).toFixed(2),
            NAMA: Number(item.NAMA).toFixed(2),
            BALANCE: Number(item.BALANCE).toFixed(2),
        })),
        {
            serialNo: 'Total',
            ENTRYNO: '',
            VNO: '',
            ENTRYDATE: '',
            PARTICULARS: '',
            PARTYNAME: '',
            HSNCode: '',
            JEWELTYPE: '',
            JAMA: totalDebit,
            NAMA: totalCredit,
            BALANCE: totalBalance,
            PREFIX: '',
            STYPE: '',
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>GS12</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="GS12Report"
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
                                customInput={<CustomInput />}
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
                                customInput={<CustomInput />}
                            />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Select
                        value={particulars}
                        placeholder="Main Product"
                        onChange={value => setParticulars(value)}
                        style={{ width: 200, marginRight: 16 }}
                    >
                        {particularsList.map(item => (
                            <Option key={item.PARTICULARS} value={item.PARTICULARS}>
                                {item.PARTICULARS}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row style={{ marginTop: 16, marginBottom: 16 }}>
                <Col span={24} style={{ textAlign: 'right', fontWeight: '600', color: '#0C1154' }}>
                    Opening Cash: {openingCash.toFixed(2)}
                </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 8, marginTop: "10px" }} align="middle">
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
                                    <Table.Summary.Cell index={0} colSpan={6}>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">{totalDebit}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="right">{totalCredit}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">{totalBalance}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} colSpan={3} />
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default GS12Reports;
