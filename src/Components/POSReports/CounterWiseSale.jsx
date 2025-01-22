import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Pagination } from 'antd';
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

const CounterWiseSale = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([null, null]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Default page size set to 20

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');
            const saleCode = 1;

            axios.get(`${CREATE_jwel}/api/POSReports/GetCounterWiseSale?fromDate=${fromDate}&toDate=${toDate}&saleCode=${saleCode}`)
                .then(response => {
                    const detailsData = response.data;
                    const calculatedData = detailsData.map((item, index) => ({
                        ...item,
                        key: index,
                        serialNo: index + 1
                    }));
                    setFilteredData(calculatedData);
                })
                .catch(error => {
                    console.error('Error fetching counter wise sale details:', error);
                });
        }
    }, [dates]);

    useEffect(() => {
        console.log('Filtered Data:', filteredData);
    }, [filteredData]);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', width: 50, align: "center", key: 'serialNo', className: 'blue-background-column' },
        { title: 'Counter Name', dataIndex: 'CounterName', key: 'CounterName' },
        { title: 'Pcs', dataIndex: 'Pcs', key: 'Pcs', align: "right" },
        { title: 'Gross Weight', dataIndex: 'Gwt', key: 'Gwt', align: "right", render: value => Number(value).toFixed(3) },
        { title: 'Net Weight', dataIndex: 'Nwt', key: 'Nwt', align: "right", render: value => Number(value).toFixed(3) },
        { title: 'Amount', dataIndex: 'Amount', key: 'Amount', align: "right", render: value => Number(value).toFixed(2) },
    ];

    useEffect(() => {
        const today = new Date();
        setDates([today, today]);
    }, []);

    const getTotals = () => {
        const totalPcs = filteredData.reduce((sum, item) => sum + item.Pcs, 0);
        const totalGwt = filteredData.reduce((sum, item) => sum + item.Gwt, 0);
        const totalNwt = filteredData.reduce((sum, item) => sum + item.Nwt, 0);
        const totalAmount = filteredData.reduce((sum, item) => sum + item.Amount, 0);

        return {
            totalPcs: totalPcs,
            totalGwt: totalGwt.toFixed(3),
            totalNwt: totalNwt.toFixed(3),
            totalAmount: totalAmount.toFixed(2),
        };
    };

    const { totalPcs, totalGwt, totalNwt, totalAmount } = getTotals();

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Row gutter={16}>
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
                    <PdfExcelPrint
                        data={filteredData}
                        columns={columns}
                        fileName="CounterWiseSaleReport"
                    />
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
                            dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="key"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell align="right">{totalPcs}</Table.Summary.Cell>
                                    <Table.Summary.Cell align="right">{totalGwt}</Table.Summary.Cell>
                                    <Table.Summary.Cell align="right">{totalNwt}</Table.Summary.Cell>
                                    <Table.Summary.Cell align="right">{totalAmount}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default CounterWiseSale;
