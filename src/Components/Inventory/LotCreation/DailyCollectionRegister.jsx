import React, { useState, useEffect, forwardRef } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../../Utiles/PdfExcelPrint';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import TableHeaderStyles from '../../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../../Config/Config';

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

const DailyCollectionRegister = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([moment().startOf('day').toDate(), moment().endOf('day').toDate()]);
    const [schemeGroup, setSchemeGroup] = useState('');
    const [schemeName, setSchemeName] = useState('');
    const [incharge, setIncharge] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        fetchData();
    }, [dates, schemeGroup, schemeName, incharge]);

    const fetchData = () => {
        const fromDate = moment(dates[0]).format('MM/DD/YYYY');
        const toDate = moment(dates[1]).format('MM/DD/YYYY');
    
        axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=RECEIPT_MAST&where=RECDATE>='${fromDate}' AND RECDATE<='${toDate}'&order=RECNO`)
            .then(response => {
                let data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                    RecDate: moment(item.RecDate).format('DD/MMM/YYYY'), // Format the date here
                }));
    
                if (schemeGroup) {
                    data = data.filter(item => item.SchemeGroup === schemeGroup);
                }
                if (schemeName) {
                    data = data.filter(item => item.SchemeName === schemeName);
                }
                if (incharge) {
                    data = data.filter(item => item.Incharger === incharge);
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
        { title: 'Rec/Vno', align: 'center', dataIndex: 'RecNo', key: 'RecNo' },
        { title: 'Date', dataIndex: 'RecDate', key: 'RecDate', render: date => moment(date).format('DD MMM YYYY') },
        { title: 'Group', dataIndex: 'SchemeGroup', key: 'SchemeGroup' },
        { title: 'Name', dataIndex: 'SchemeName', key: 'SchemeName' },
        { title: 'Card No', align: 'center', dataIndex: 'CardNo', key: 'CardNo' },
        { title: 'Inst No',align: 'center', dataIndex: 'INSTNO', key: 'INSTNO' },
        { title: 'Member', dataIndex: 'SchemeMember', key: 'SchemeMember' },
        { title: 'Incharge', dataIndex: 'Incharger', key: 'Incharger' },
        { title: 'Gold Rate', dataIndex: 'GoldRate', key: 'GoldRate', align: 'right', render: value => <b>{Number(value).toFixed(2)}</b> },
        { title: 'Gold Wt', dataIndex: 'GoldWt', key: 'GoldWt', align: 'right', render: value => <b>{Number(value).toFixed(3)}</b> },
        { title: 'Amount', dataIndex: 'RecAmount', key: 'RecAmount', align: 'right', render: value => <b>{Number(value).toFixed(2)}</b> },
        { title: 'Cash', dataIndex: 'CASH', key: 'CASH', align: 'right', render: value => <b>{Number(value).toFixed(2)}</b> },
        { title: 'Card', dataIndex: 'CARD', key: 'CARD', align: 'right', render: value => <b>{Number(value).toFixed(2)}</b> },
        { title: 'UPI', dataIndex: 'UPI', key: 'UPI', align: 'right', render: value => <b>{Number(value).toFixed(2)}</b> },
        { title: 'Online', dataIndex: 'ONLINE', key: 'ONLINE', align: 'right', render: value => <b>{Number(value).toFixed(2)}</b> },
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
                        <Breadcrumb.Item>Daily Collection Register</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={filteredData}
                        columns={columns}
                        fileName="DailyCollectionRegister"
                       columnStyles ={columnStyles}
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
                    <label style={{ marginRight: 8 }}>Scheme Name:</label>
                    <Select
                        placeholder="Select Scheme Name"
                        style={{ width: 200 }}
                        onChange={value => setSchemeName(value)}
                        allowClear
                    >
                        {[...new Set(filteredData.map(item => item.SchemeName))].map(name => (
                            <Option key={name} value={name}>{name}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <label style={{ marginRight: 8 }}>Incharge:</label>
                    <Select
                        placeholder="Select Incharge"
                        style={{ width: 200 }}
                        onChange={value => setIncharge(value)}
                        allowClear
                    >
                        {[...new Set(filteredData.map(item => item.Incharger))].map(incharge => (
                            <Option key={incharge} value={incharge}>{incharge}</Option>
                        ))}
                    </Select>
                </Col>
            </Row>
            <Row gutter={8} style={{ marginTop: 10}} align="middle">
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
            <div style={{marginTop:"10px"}}>
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

export default DailyCollectionRegister;
