import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Checkbox } from 'antd';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import PdfExcelPrint from '../../Utiles/PdfExcelPrint';
import TableHeaderStyles from '../../Pages/TableHeaderStyles';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => {
    const formattedValue = value ? moment(value).format('DD/MM/YYYY') : '';
    return (
        <div className="custom-date-input" onClick={onClick} ref={ref}>
            <input value={formattedValue} placeholder={placeholder} readOnly />
            <FaCalendarAlt className="calendar-icon" />
        </div>
    );
});

const EstimationRegister = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([moment().toDate(), moment().toDate()]);
    const [pendingOnly, setPendingOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch Data from API
    const fetchData = () => {
        setLoading(true);
        const startDate = moment(dates[0]).format('MM/DD/YYYY');
        const endDate = moment(dates[1]).format('MM/DD/YYYY');
        const apiUrl = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=Estimation_mast&where=ESTDATE%3E%3D%27${startDate}%27%20AND%20ESTDATE%3C%3D%27${endDate}%27&order=ESTIMATIONNO`;

        axios.get(apiUrl)
            .then(response => {
                const records = response.data || [];
                setData(records);
                setFilteredData(records);
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchData(); // Re-fetch data when date changes
    }, [dates]);

    useEffect(() => {
        setFilteredData(pendingOnly ? data.filter(item => item.BillNo === 0) : data);
    }, [pendingOnly, data]);


    const handleDateChange = (index, date) => {
        const updatedDates = [...dates];
        updatedDates[index] = date;
        setDates(updatedDates);
        setFilteredData([]); // Reset data on date change
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', width: 50 },
        { title: 'Esti No', dataIndex: 'EstimationNo', key: 'EstimationNo' },
        { title: 'Date', dataIndex: 'EstDate', key: 'EstDate', render: date => moment(date).format('YYYY-MM-DD') },
        { title: 'Customer Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'GWT', dataIndex: 'GWT', key: 'GWT', align: 'right', render: value => value.toFixed(3) },
        { title: 'NWT', dataIndex: 'Nwt', key: 'Nwt', align: 'right', render: value => value.toFixed(3) },
        { title: 'Item Amt', dataIndex: 'ItemAmount', key: 'ItemAmount', align: 'right' },
        { title: 'Total Amt', dataIndex: 'TotAmount', key: 'TotAmount', align: 'right' },
        { title: 'GST', dataIndex: 'VatAmt', key: 'VatAmt', align: 'right' },
        { title: 'Discount', dataIndex: 'DiscountAmt', key: 'DiscountAmt', align: 'right' },
        { title: 'Net Amt', dataIndex: 'NetAmt', key: 'NetAmt', align: 'right' },
        { title: 'Jewel Type', dataIndex: 'JewelType', key: 'JewelType' },
        { title: 'Bill No', dataIndex: 'BillNo', key: 'BillNo', align: 'center' },
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Estimation Register</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={filteredData.map((item, index) => ({ ...item, sno: index + 1 }))}
                        columns={columns}
                        fileName="EstimationRegisterReport"
                    />
                </Col>
            </Row>
            <Row gutter={8} align="middle" style={{ marginBottom: 8 }}>
                <Col>
                    <label style={{ marginRight: 8, fontSize: "16px" }}>Start Date:</label>
                    <DatePicker
                        selected={dates[0]}
                        onChange={(date) => handleDateChange(0, date)}
                        selectsStart
                        startDate={dates[0]}
                        endDate={dates[1]}
                        placeholderText="Start Date"
                        customInput={<CustomInput />}
                    />
                </Col>
                <Col>
                    <label style={{ marginRight: 8, fontSize: "16px" }}>End Date:</label>
                    <DatePicker
                        selected={dates[1]}
                        onChange={(date) => handleDateChange(1, date)}
                        selectsEnd
                        startDate={dates[0]}
                        endDate={dates[1]}
                        placeholderText="End Date"
                        customInput={<CustomInput />}
                    />
                </Col>
                <Col>
                    <Checkbox checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)}>
                        Pending Estimations
                    </Checkbox>
                </Col>
            </Row>

            <div style={{ marginTop: 5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <TableHeaderStyles>
                    <Table
                        key={`${filteredData.length}-${currentPage}`} // Unique key ensures re-render
                        size="small"
                        loading={loading}
                        columns={columns}
                        dataSource={filteredData.map((item, index) => ({
                            ...item,
                            sno: index + 1,
                        }))}
                        rowKey="EstimationNo"
                        pagination={{
                            current: currentPage,
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '50', '100'],
                            onChange: (page) => setCurrentPage(page),
                            position: ['topRight', 'bottomRight'],

                        }}
                    />



                </TableHeaderStyles>
            </div>
        </>
    );
};

export default EstimationRegister;
