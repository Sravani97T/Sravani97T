import React, { useState, useEffect, forwardRef } from 'react';
import { Row, Col, Breadcrumb, Card, Button, Table ,Tag} from 'antd';
import axios from 'axios';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const DayGlance = () => {
    const [groupedData, setGroupedData] = useState([]);
    const [dates, setDates] = useState([null, null]);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetdayGlance?fromDate=${fromDate}&toDate=${toDate}`)
                .then(response => {
                    const detailsData = response.data;
                    const grouped = detailsData.reduce((acc, item) => {
                        const key = `${item.TCODE}-${item.DESCRIPTION}-${item.TRANSTYPE}`;
                        if (!acc[key]) {
                            acc[key] = [];
                        }
                        acc[key].push(item);
                        return acc;
                    }, {});
                    setGroupedData(grouped);
                })
                .catch(error => {
                    console.error('Error fetching day glance details:', error);
                });
        }
    }, [dates]);


    const columns = [
        { title: 'S. No', dataIndex: 'index', key: 'index', render: (text, record) => (
            <div>
                <div>{text}</div>
                <div><Tag color="purple">{moment(record.BDATE).format('DD/MM/YYYY')}</Tag></div>
            </div>
        ) },
        { title: 'BNO', dataIndex: 'BNO', key: 'BNO', render: (text, record) => (
            <div>
                <div>{text}</div>
                <div><Tag color="geekblue">{record.PARTICULARS}</Tag></div>
            </div>
        ) },
        { title: 'PCS', dataIndex: 'PCS', key: 'PCS' },
        { title: 'GWT', dataIndex: 'GWT', key: 'GWT' },
        { title: 'NWT', dataIndex: 'NWT', key: 'NWT' },
        { title: 'TOTAL AMT', dataIndex: 'TOTAMT', key: 'TOTAMT' },
        { title: 'CGST', dataIndex: 'CGST', key: 'CGST' },
        { title: 'SGST', dataIndex: 'SGST', key: 'SGST' },
        { title: 'IGST', dataIndex: 'IGST', key: 'IGST' },
        { title: 'NET AMT', dataIndex: 'NETAMT', key: 'NETAMT' },
        { title: 'DIA CTS', dataIndex: 'DIACTS', key: 'DIACTS' },
        { title: 'OLD GOLD', dataIndex: 'OLDGOLD', key: 'OLDGOLD' },
        { title: 'OLD SILVER', dataIndex: 'OLDSILVER', key: 'OLDSILVER' },
        { title: 'SALERTN', dataIndex: 'SALERTN', key: 'SALERTN' },
        { title: 'UPI', dataIndex: 'UPI', key: 'UPI' },
        { title: 'CUS ADV', dataIndex: 'CUSADV', key: 'CUSADV' },
        { title: 'CHEQUE', dataIndex: 'CHEQUE', key: 'CHEQUE' },
        { title: 'CARD', dataIndex: 'CARD', key: 'CARD' },
        { title: 'CASH', dataIndex: 'CASH', key: 'CASH' },
        { title: 'SCHEME', dataIndex: 'SCHEME', key: 'SCHEME' },
        { title: 'BALANCE', dataIndex: 'BALANCE', key: 'BALANCE' },
        { title: 'ONLINE', dataIndex: 'ONLINE', key: 'ONLINE' }
    ];
  
  
    return (
        <div id="printableArea" style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Day Glance</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
            <Card
                className="day-glance-card"
                style={{
                    position: 'relative', // For positioning the triangular and diamond designs
                    background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)', // Blue gradient background
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    padding: '16px',
                    color: '#333',
                }}
            >
                {/* Triangular Design 1 */}
                <div
                    style={{
                        position: 'absolute',
                        top: '-50px',
                        left: '-50px',
                        width: '0',
                        height: '0',
                        borderLeft: '75px solid transparent',
                        borderRight: '75px solid transparent',
                        borderBottom: '150px solid rgba(255, 255, 255, 0.2)',
                    }}
                />
                {/* Diamond Design */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-77px',
                        right: '15px',
                        width: '150px',
                        height: '150px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        transform: 'rotate(45deg)',
                    }}
                />
                {/* Triangular Design 2 */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-50px',
                        left: '-50px',
                        width: '0',
                        height: '0',
                        borderLeft: '100px solid transparent',
                        borderRight: '100px solid transparent',
                        borderTop: '200px solid rgba(255, 255, 255, 0.15)',
                        
                    }}
                />

                <Row justify="center" gutter={16} style={{ marginBottom: 16 }}>
                    <Col>
                        <DatePicker
                            selected={dates[0]}
                            onChange={(date) => setDates([date, dates[1]])}
                            selectsStart
                            startDate={dates[0]}
                            endDate={dates[1]}
                            placeholderText="From Date"
                            customInput={<CustomInput />}
                            popperProps={{ positionFixed: true, style: { zIndex: 2 } }}
                        />
                    </Col>
                    <Col>
                        <DatePicker
                            selected={dates[1]}
                            onChange={(date) => setDates([dates[0], date])}
                            selectsEnd
                            startDate={dates[0]}
                            endDate={dates[1]}
                            placeholderText="To Date"
                            customInput={<CustomInput />}
                            popperProps={{ positionFixed: true, style: { zIndex: 2 } }}
                        />
                    </Col>
                </Row>
                <Row justify="center" style={{ marginBottom: 16 }}>
                    <Col>
                        <Button type="primary">
                            Print
                        </Button>
                        <Button
                            style={{
                                marginLeft: 8,
                                backgroundColor: '#0052cc',
                                color: '#fff',
                                border: 'none',
                            }}
                        >
                            PDF
                        </Button>
                    </Col>
                </Row>
            </Card>

            {Object.keys(groupedData).map((key, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                    <h3>{`TCODE: ${key.split('-')[0]},  ${key.split('-')[1]}, ${key.split('-')[2]}`}</h3>
                    <div style={{ marginTop: 16, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                        <div
                            className="table-responsive scroll-horizontal print-friendly"
                            style={{
                                maxHeight: "calc(99vh - 193.33px)",
                                overflowY: "auto",
                                overflowX: "auto",
                                marginTop: "20px",
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#fff',
                                borderRadius: '8px',
                            }}
                        >
                            <Table
                                size="small"
                                columns={columns}
                                dataSource={groupedData[key].map((item, idx) => ({ ...item, index: idx + 1 }))}
                                pagination={false}
                                bordered
                                rowKey={(record) => record.BNO + record.BDATE}
                                summary={() => {
                                    const totals = groupedData[key].reduce((acc, item) => {
                                        acc.PCS += item.PCS || 0;
                                        acc.GWT += item.GWT || 0;
                                        acc.NWT += item.NWT || 0;
                                        acc.TOTAMT += item.TOTAMT || 0;
                                        acc.CGST += item.CGST || 0;
                                        acc.SGST += item.SGST || 0;
                                        acc.IGST += item.IGST || 0;
                                        acc.NETAMT += item.NETAMT || 0;
                                        acc.DIACTS += item.DIACTS || 0;
                                        acc.OLDGOLD += item.OLDGOLD || 0;
                                        acc.OLDSILVER += item.OLDSILVER || 0;
                                        acc.SALERTN += item.SALERTN || 0;
                                        acc.UPI += item.UPI || 0;
                                        acc.CUSADV += item.CUSADV || 0;
                                        acc.CHEQUE += item.CHEQUE || 0;
                                        acc.CARD += item.CARD || 0;
                                        acc.CASH += item.CASH || 0;
                                        acc.SCHEME += item.SCHEME || 0;
                                        acc.BALANCE += item.BALANCE || 0;
                                        acc.ONLINE += item.ONLINE || 0;
                                        return acc;
                                    }, {
                                        PCS: 0,
                                        GWT: 0,
                                        NWT: 0,
                                        TOTAMT: 0,
                                        CGST: 0,
                                        SGST: 0,
                                        IGST: 0,
                                        NETAMT: 0,
                                        DIACTS: 0,
                                        OLDGOLD: 0,
                                        OLDSILVER: 0,
                                        SALERTN: 0,
                                        UPI: 0,
                                        CUSADV: 0,
                                        CHEQUE: 0,
                                        CARD: 0,
                                        CASH: 0,
                                        SCHEME: 0,
                                        BALANCE: 0,
                                        ONLINE: 0
                                    });

                                    return (
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={2}>Total</Table.Summary.Cell>
                                            <Table.Summary.Cell index={1}>{totals.PCS}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={2}>{totals.GWT}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}>{totals.NWT}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>{totals.TOTAMT}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}>{totals.CGST}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={6}>{totals.SGST}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={7}>{totals.IGST}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={8}>{totals.NETAMT}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={9}>{totals.DIACTS}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={10}>{totals.OLDGOLD}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={11}>{totals.OLDSILVER}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={12}>{totals.SALERTN}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={13}>{totals.UPI}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={14}>{totals.CUSADV}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={15}>{totals.CHEQUE}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={16}>{totals.CARD}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={17}>{totals.CASH}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={18}>{totals.SCHEME}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={19}>{totals.BALANCE}</Table.Summary.Cell>
                                            <Table.Summary.Cell index={20}>{totals.ONLINE}</Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DayGlance;
