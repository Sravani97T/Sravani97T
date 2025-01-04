import React, { useState, useEffect } from 'react';
import { Table, Row, Col,  } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProductWiseSale = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');
            const saleCode = 1;

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetProductWiseSale?fromDate=${fromDate}&toDate=${toDate}&saleCode=${saleCode}`)
                .then(response => {
                    const detailsData = response.data;
                    const calculatedData = detailsData.map((item, index) => ({
                        ...item,
                        key: index
                    }));
                    setFilteredData(calculatedData);
                })
                .catch(error => {
                    console.error('Error fetching product wise sale details:', error);
                });
        }
    }, [dates]);

    useEffect(() => {
        console.log('Filtered Data:', filteredData);
    }, [filteredData]);

    const columns = [
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pcs', dataIndex: 'Pcs', key: 'Pcs', align: "right", },
        { title: 'Gross Weight', dataIndex: 'Gwt', key: 'Gwt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Net Weight', dataIndex: 'Nwt', key: 'Nwt', align: "right", render: value => Number(value).toFixed(2) },
    ];

    useEffect(() => {
        const today = new Date();
        setDates([today, today]);
    }, []);

    const getTotals = () => {
        const totalPcs = filteredData.reduce((sum, item) => sum + item.Pcs, 0);
        const totalGwt = filteredData.reduce((sum, item) => sum + item.Gwt, 0);
        const totalNwt = filteredData.reduce((sum, item) => sum + item.Nwt, 0);

        return {
            totalPcs: totalPcs,
            totalGwt: totalGwt.toFixed(2),
            totalNwt: totalNwt.toFixed(2),
        };
    };

    const { totalPcs, totalGwt, totalNwt } = getTotals();

    const formattedData = [
        ...filteredData.map(item => ({
            ...item,
            Pcs: Number(item.Pcs),
            Gwt: Number(item.Gwt).toFixed(2),
            Nwt: Number(item.Nwt).toFixed(2),
        })),
        {
            PRODUCTNAME: 'Total',
            Pcs: totalPcs,
            Gwt: totalGwt,
            Nwt: totalNwt,
        }
    ];

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
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="ProductWiseSaleReport"
                    />
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
                            <Table.Summary.Cell>Total</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalPcs}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalGwt}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalNwt}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default ProductWiseSale;