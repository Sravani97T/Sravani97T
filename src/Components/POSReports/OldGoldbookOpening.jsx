import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => {
    const formattedValue = value ? moment(value).format('DD/MM/YYYY') : '';
    return (
        <div className="custom-date-input" onClick={onClick} ref={ref}>
            <input value={formattedValue} placeholder={placeholder} readOnly />
            <FaCalendarAlt className="calendar-icon" />
        </div>
    );
});

const { Option } = Select;

const OldGoldBookOpening = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [openingCash, setOpeningCash] = useState(0);
    const [dates, setDates] = useState([moment().toDate(), moment().toDate()]);
    const [particulars, setParticulars] = useState('OLD GOLD');
    const [particularsList, setParticularsList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/POSReports/GetGS11ParticularsList`)
            .then(response => {
                setParticularsList(response.data);
            })
            .catch(error => {
                console.error('Error fetching particulars list:', error);
            });
    }, []);

    useEffect(() => {
        const fetchData = () => {
            if (dates[0] && dates[1]) {
                const fromDate = moment(dates[0]).format('YYYY/MM/DD');
                const toDate = moment(dates[1]).format('YYYY/MM/DD');

                axios.get(`${CREATE_jwel}/api/POSReports/GetOldGoldBookOpening?entryDate=${toDate}&particulars=${particulars}`)
                    .then(response => {
                        const openingData = response.data[0];
                        const openingCashValue = openingData.Column1 - openingData.Column2;
                        setOpeningCash(openingCashValue);
                    })
                    .catch(error => {
                        console.error('Error fetching opening cash:', error);
                    });

                axios.get(`${CREATE_jwel}/api/POSReports/GetOldGoldBookDetails?fromDate=${fromDate}&toDate=${toDate}&particulars=${particulars}`)
                    .then(response => {
                        const detailsData = response.data;
                        let balance = openingCash;
                        const calculatedData = detailsData.map((item, index) => {
                            balance = balance + item.JAMA - item.NAMA;
                            return { ...item, BALANCE: balance, key: index + 1, serialNo: index + 1, HSNCode: '123456' };
                        });
                        setFilteredData(calculatedData);
                    })
                    .catch(error => {
                        console.error('Error fetching Old Gold Book details:', error);
                    });
            }
        };

        fetchData();
    }, [dates, openingCash, particulars]);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', key: 'serialNo', width: 50, className: 'blue-background-column' },
        { title: 'Date', dataIndex: 'ENTRYDATE', key: 'ENTRYDATE', render: date => moment(date).format('DD/MM/YYYY') },
        { title: 'Particulars', dataIndex: 'PARTICULARS', key: 'PARTICULARS' },
        { title: 'Party Name', dataIndex: 'PARTYNAME', key: 'PARTYNAME' },
        { title: 'HSN Code', dataIndex: 'HSNCode', key: 'HSNCode' },
        { title: 'Inv .no', dataIndex: 'VNO', key: 'VNO' },
        { title: 'Debit', dataIndex: 'JAMA', key: 'JAMA', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Credit', dataIndex: 'NAMA', key: 'NAMA', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Balance', dataIndex: 'BALANCE', key: 'BALANCE', align: "right", render: value => Number(value).toFixed(2) },
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
                        <Breadcrumb.Item>Old Gold Book</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="OldGoldBookReport"
                    />
                </Col>
            </Row>
            <Row justify="space-between" align="middle">
                <Col>
                    <Row gutter={16} justify="center">
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
                            />
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Select
                        value={particulars}
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
                                <Table.Summary.Cell index={0} colSpan={columns.length - 3}>Total</Table.Summary.Cell>
                                <Table.Summary.Cell index={1} align="right">{totalDebit}</Table.Summary.Cell>
                                <Table.Summary.Cell index={2} align="right">{totalCredit}</Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">{totalBalance}</Table.Summary.Cell>
                            </Table.Summary.Row>
                        )}
                    />
                </TableHeaderStyles>
            </div>
        </>
    );
};

export default OldGoldBookOpening;