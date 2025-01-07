import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const ProductWiseSaleDetailes = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetProductWiseSaleDetail?fromDate=${fromDate}&toDate=${toDate}`)
                .then(response => {
                    const detailsData = response.data;
                    const calculatedData = detailsData.map((item, index) => ({
                        ...item,
                        key: index + 1,
                        serialNo: index + 1,
                        BillDate: moment(item.BillDate).format('MM/DD/YYYY')
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
        { title: 'S. No', dataIndex: 'serialNo', key: 'serialNo' },
        { title: 'Bill Date', dataIndex: 'BillDate', key: 'BillDate' },
        { title: 'Jewel Type', dataIndex: 'JewelType', key: 'JewelType' },
        { title: 'Bill No', dataIndex: 'BillNo', key: 'BillNo' },
        { title: 'Tag No', dataIndex: 'TagNo', key: 'TagNo' },
        { title: 'Main Product', dataIndex: 'Mname', key: 'Mname' },
        { title: 'Product Name', dataIndex: 'ProductName', key: 'ProductName' },
        { title: 'Prefix', dataIndex: 'Prefix', key: 'Prefix' },
        { title: 'PCS', dataIndex: 'Pieces', key: 'Pieces', align: "right" },
        { title: 'GWT', dataIndex: 'Gwt', key: 'Gwt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'NWT', dataIndex: 'Nwt', key: 'Nwt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'CTS', dataIndex: 'Item_Cts', key: 'Item_Cts', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Dia CTS', dataIndex: 'Item_Diamonds', key: 'Item_Diamonds', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Uncuts', dataIndex: 'Item_Uncuts', key: 'Item_Uncuts', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Amount', dataIndex: 'Amount', key: 'Amount', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Items Amt', dataIndex: 'Itemamt', key: 'Itemamt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Total Amt', dataIndex: 'Totamt', key: 'Totamt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Manufacturer', dataIndex: 'MANUFACTURER', key: 'MANUFACTURER' },
        { title: 'Description', dataIndex: 'Desc1', key: 'Desc1' },
        { title: 'Tag Date', dataIndex: 'TagDate', key: 'TagDate', render: value => moment(value).format('MM/DD/YYYY') },
        { title: 'HUID', dataIndex: 'HUID', key: 'HUID' },
        { title: 'HSN Code', dataIndex: 'HSNCODE', key: 'HSNCODE' },
        { title: 'PValue', dataIndex: 'PVALUE', key: 'PVALUE', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'SValue', dataIndex: 'SVALUE', key: 'SVALUE', align: "right", render: value => Number(value).toFixed(2) },
    ];

    useEffect(() => {
        const today = new Date();
        setDates([today, today]);
    }, []);

    const getTotals = () => {
        const totalPieces = filteredData.reduce((sum, item) => sum + item.Pieces, 0);
        const totalGwt = filteredData.reduce((sum, item) => sum + item.Gwt, 0);
        const totalNwt = filteredData.reduce((sum, item) => sum + item.Nwt, 0);
        const totalAmount = filteredData.reduce((sum, item) => sum + item.Amount, 0);

        return {
            totalPieces: totalPieces.toFixed(2),
            totalGwt: totalGwt.toFixed(2),
            totalNwt: totalNwt.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
        };
    };

    const { totalPieces, totalGwt, totalNwt, totalAmount } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            serialNo: index + 1,
            Pieces: Number(item.Pieces).toFixed(2),
            Gwt: Number(item.Gwt).toFixed(2),
            Nwt: Number(item.Nwt).toFixed(2),
            Amount: Number(item.Amount).toFixed(2),
        })),
        {
            serialNo: '',
            BillNo: 'Total',
            CustName: '',
            ProductName: '',
            Pieces: totalPieces,
            Gwt: totalGwt,
            Nwt: totalNwt,
            Amount: totalAmount,
            BillDate: '',
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Product Wise Sale Details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="ProductWiseSaleDetailsReport"
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
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={8}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">{totalPieces}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right">{totalGwt}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="right">{totalNwt}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align="right">{totalAmount}</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} colSpan={15} />
                        </Table.Summary.Row>
                    )}
                />
                </div>
            </div>
        </>
    );
};

export default ProductWiseSaleDetailes;