import React, { useState,  forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../../Components/Utiles/PdfExcelPrint';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import TableHeaderStyles from '../Pages/TableHeaderStyles';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => {
    const formattedValue = value ? moment(value).format('DD MMM YYYY') : '';
    return (
        <div className="custom-date-input" onClick={onClick} ref={ref}>
            <input value={formattedValue} placeholder={placeholder} readOnly />
            <FaCalendarAlt className="calendar-icon" />
        </div>
    );
});

const { Option } = Select;

const SchemeDiscontinueRegister = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([moment().startOf('day').toDate(), moment().endOf('day').toDate()]);
    const [schemeGroup, setSchemeGroup] = useState('');
    const [schemeName, setSchemeName] = useState('');
    const [schemeType, setSchemeType] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const fetchData = () => {
        setCurrentPage(1); // Reset to first page
        const fromDate = moment(dates[0]).format('DD MMM YYYY');
        const toDate = moment(dates[1]).format('DD MMM YYYY');

        axios.get(`http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=SCHEME_MIDDLEDROP&where=SMDRECDATE>='${fromDate}' AND SMDRECDATE<='${toDate}'`)
            .then(response => {
                let data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                    RecDate: moment(item.SMDRecDate).format('DD MMM YYYY'), // Ensure date format
                    SCHEME_ENDDATE: item.SCHEME_ENDDATE ? moment(item.SCHEME_ENDDATE).format('DD MMM YYYY') : '', // Ensure date format
                }));

                if (schemeGroup) {
                    data = data.filter(item => item.SchemeGroup === schemeGroup);
                }
                if (schemeName) {
                    data = data.filter(item => item.SchemeName === schemeName);
                }
                if (schemeType) {
                    data = data.filter(item => item.SchemeType === schemeType);
                }
                if (mobileNumber) {
                    data = data.filter(item => item.Mobile1 === mobileNumber);
                }

                setFilteredData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const columnStyles = {
        8: { halign: 'right' },  // Net Wt
        9: { halign: 'right' },  // Total Amount
        10: { halign: 'right' },  // Discount
    };
    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', key: 'serialNo', align: 'center', width: 50 },
        { title: 'Entry No', dataIndex: 'SMDRecno', key: 'SMDRecno', align: 'center' },
        { title: 'Entry Date', dataIndex: 'RecDate', key: 'RecDate' },
        { title: 'Scheme Type', dataIndex: 'SchemeType', key: 'SchemeType' },
        { title: 'Scheme Group', dataIndex: 'SchemeGroup', key: 'SchemeGroup' },
        { title: 'Scheme Name', dataIndex: 'SchemeName', key: 'SchemeName' },
        { title: 'Card No', dataIndex: 'CardNo', key: 'CardNo', align: 'center' },
        { title: 'Member Name', dataIndex: 'SchemeMember', key: 'SchemeMember' },
        { title: 'Total Months', dataIndex: 'SchemeDuration', key: 'SchemeDuration', align: 'center' },
        { title: 'Gold Wt', dataIndex: 'GoldWt', key: 'GoldWt', align: 'right', render: val => <b>{Number(val).toFixed(3)}</b> },
        { title: 'Mobile No', dataIndex: 'Mobile1', key: 'Mobile1' },
        { title: 'Paid Amount', dataIndex: 'PaidAmount', key: 'PaidAmount', align: 'right', render: val => <b>{Number(val || 0).toFixed(2)}</b> },
        { title: 'End Date', dataIndex: 'SCHEME_ENDDATE', key: 'SCHEME_ENDDATE' },
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
                        <Breadcrumb.Item>Inventory</Breadcrumb.Item>
                        <Breadcrumb.Item>Scheme Discontinue Register</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={filteredData}
                        columns={columns}
                        fileName="SchemeDiscontinueRegister"
                        columnStyles={columnStyles}
                    />
                </Col>
            </Row>

            <Row gutter={16} align="middle">
                <Col>
                    <label style={{ marginRight: 8 }}>Start Date:</label>
                    <DatePicker
                        selected={dates[0]}
                        onChange={(date) => setDates([date, dates[1]])}
                        selectsStart
                        startDate={dates[0]}
                        endDate={dates[1]}
                        placeholderText="Start Date"
                        customInput={<CustomInput />}
                        dateFormat="dd MMM yyyy"
                    />
                </Col>
                <Col>
                    <label style={{ marginRight: 8 }}>End Date:</label>
                    <DatePicker
                        selected={dates[1]}
                        onChange={(date) => setDates([dates[0], date])}
                        selectsEnd
                        startDate={dates[0]}
                        endDate={dates[1]}
                        placeholderText="End Date"
                        customInput={<CustomInput />}
                        dateFormat="dd MMM yyyy"
                    />
                </Col>
                <Col>
                    <Button
                        onClick={fetchData}
                        style={{
                            backgroundColor: '#0C1154',
                            color: '#fff',
                            padding: '6px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Show
                    </Button>
                </Col>
                <Button
                    onClick={() => {
                        setDates([moment().startOf('day').toDate(), moment().endOf('day').toDate()]);
                        setSchemeGroup('');
                        setSchemeName('');
                        setMobileNumber('');

                        setFilteredData([]);
                    }}
                    style={{
                        backgroundColor: '#f0ad4e',
                        color: '#fff',
                        padding: '6px 16px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    Refresh
                </Button>

            </Row>

            <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
                <Col>
                    <label style={{ marginRight: 8 }}>Scheme Group:</label>
                    <Select
                        placeholder="Select Scheme Group"
                        style={{ width: 200 }}
                        onChange={value => setSchemeGroup(value)}
                        allowClear
                    >
                        {[...new Set(filteredData.map(item => item.SchemeGroup))].map(group => (
                            <Option key={group} value={group}>{group}</Option>
                        ))}
                    </Select>
                </Col>

                <Col>
                    <label style={{ marginRight: 8 }}>Scheme Type:</label>
                    <Select
                        placeholder="Select Scheme Type"
                        style={{ width: 200 }}
                        onChange={value => setSchemeType(value)}
                        allowClear
                    >
                        {[...new Set(filteredData.map(item => item.SchemeType || ''))].map(type => (
                            <Option key={type} value={type}>{type}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <label style={{ marginRight: 8 }}>Mobile Number:</label>
                    <Select
                        placeholder="Select Mobile Number"
                        style={{ width: 200 }}
                        onChange={value => setMobileNumber(value)}
                        allowClear
                    >
                        {[...new Set(filteredData.map(item => item.Mobile1 || ''))].map(mobile => (
                            <Option key={mobile} value={mobile}>{mobile}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>

            <Row gutter={8} style={{ marginTop: 10 }} align="middle">
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
            <div style={{ marginTop: "10px" }}>
                <TableHeaderStyles>
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                        rowKey="key"
                        pagination={false}
                        scroll={{ x: 'max-content' }}
                    />
                </TableHeaderStyles>
            </div>
        </>
    );
};

export default SchemeDiscontinueRegister;
