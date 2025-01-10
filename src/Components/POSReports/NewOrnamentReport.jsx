import React, { useState, useEffect ,forwardRef} from 'react';
import { Table, Row, Col, Breadcrumb, Popover, Select, Button } from 'antd';
import axios from 'axios';
import moment from 'moment';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FilterOutlined } from '@ant-design/icons';
import { FaCalendarAlt } from 'react-icons/fa';

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const { Option } = Select;

const NewOrnamentReport = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [dates, setDates] = useState([null, null]);
    const [mainProductFilter, setMainProductFilter] = useState(null);
    const [partyNameFilter, setPartyNameFilter] = useState(null);
    const [popoverVisible, setPopoverVisible] = useState(false);

    useEffect(() => {
        if (dates[0] && dates[1]) {
            const fromDate = moment(dates[0]).format('MM/DD/YYYY');
            const toDate = moment(dates[1]).format('MM/DD/YYYY');

            axios.get(`http://www.jewelerp.timeserasoftware.in/api/POSReports/GetNewOrnamentRegister?fromDate=${fromDate}&toDate=${toDate}`)
                .then(response => {
                    const detailsData = response.data.map((item, index) => ({
                        ...item,
                        key: index,
                        sno: index + 1,
                        InvDate: moment(item.InvDate).format('MM/DD/YYYY')
                    }));
                    setFilteredData(detailsData);
                })
                .catch(error => {
                    console.error('Error fetching new ornament register:', error);
                });
        }
    }, [dates]);

    const handleMainProductChange = (value) => {
        setMainProductFilter(value);
        setPopoverVisible(false);
    };

    const handlePartyNameChange = (value) => {
        setPartyNameFilter(value);
        setPopoverVisible(false);
    };

    const filteredTableData = filteredData.filter(item => {
        return (
            (!mainProductFilter || item.ptype === mainProductFilter) &&
            (!partyNameFilter || item.PartyName === partyNameFilter)
        );
    });

    const columns = [
        { title: 'S. No', dataIndex: 'sno', key: 'sno' },
        { title: 'Entry No', dataIndex: 'entryno', key: 'entryno' },
        { title: 'Inv No', dataIndex: 'InvNo', key: 'InvNo' },
        { title: 'Inv Date', dataIndex: 'InvDate', key: 'InvDate' },
        { title: 'Main Product', dataIndex: 'ptype', key: 'ptype' },
        { title: 'Party Name', dataIndex: 'PartyName', key: 'PartyName' },
        { title: 'GWt', dataIndex: 'Gwt', key: 'Gwt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Less', dataIndex: 'Others', key: 'Others', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'NWt', dataIndex: 'NWT', key: 'NWT', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Total Amt', dataIndex: 'TotVal', key: 'TotVal', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'CGST', dataIndex: 'cgst', key: 'cgst', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'SGST', dataIndex: 'Sgst', key: 'Sgst', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'IGST', dataIndex: 'igst', key: 'igst', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Gross Amt', dataIndex: 'grossamt', key: 'grossamt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'TCS ', dataIndex: 'tcsamt', key: 'tcsamt', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Net Amount', dataIndex: 'NETAMT', key: 'NETAMT', align: "right", render: value => Number(value).toFixed(2) },
    ];

    useEffect(() => {
        const today = new Date();
        setDates([today, today]);
    }, []);

    const getTotals = () => {
        const totalGrossWeight = filteredTableData.reduce((sum, item) => sum + item.Gwt, 0);
        const totalNetWeight = filteredTableData.reduce((sum, item) => sum + item.NWT, 0);
        const totalTaxable = filteredTableData.reduce((sum, item) => sum + item.TotVal, 0);
        const totalCGST = filteredTableData.reduce((sum, item) => sum + item.cgst, 0);
        const totalSGST = filteredTableData.reduce((sum, item) => sum + item.Sgst, 0);
        const totalIGST = filteredTableData.reduce((sum, item) => sum + item.igst, 0);
        const totalGrossAmount = filteredTableData.reduce((sum, item) => sum + item.grossamt, 0);
        const totalTCSAmount = filteredTableData.reduce((sum, item) => sum + item.tcsamt, 0);
        const totalNetAmount = filteredTableData.reduce((sum, item) => sum + item.NETAMT, 0);

        return {
            totalGrossWeight: totalGrossWeight.toFixed(2),
            totalNetWeight: totalNetWeight.toFixed(2),
            totalTaxable: totalTaxable.toFixed(2),
            totalCGST: totalCGST.toFixed(2),
            totalSGST: totalSGST.toFixed(2),
            totalIGST: totalIGST.toFixed(2),
            totalGrossAmount: totalGrossAmount.toFixed(2),
            totalTCSAmount: totalTCSAmount.toFixed(2),
            totalNetAmount: totalNetAmount.toFixed(2),
        };
    };

    const {
        totalGrossWeight,
        totalNetWeight,
        totalTaxable,
        totalCGST,
        totalSGST,
        totalIGST,
        totalGrossAmount,
        totalTCSAmount,
        totalNetAmount
    } = getTotals();

    const formattedData = [
        ...filteredTableData.map(item => ({
            ...item,
            Gwt: Number(item.Gwt).toFixed(2),
            NWT: Number(item.NWT).toFixed(2),
            TotVal: Number(item.TotVal).toFixed(2),
            cgst: Number(item.cgst).toFixed(2),
            Sgst: Number(item.Sgst).toFixed(2),
            igst: Number(item.igst).toFixed(2),
            grossamt: Number(item.grossamt).toFixed(2),
            tcsamt: Number(item.tcsamt).toFixed(2),
            NETAMT: Number(item.NETAMT).toFixed(2),
        })),
        {
            sno: 'Total',
            entryno: '',
            InvNo: '',
            InvDate: '',
            ptype: '',
            PartyName: '',
            Gwt: totalGrossWeight,
            Others: '',
            NWT: totalNetWeight,
            TotVal: totalTaxable,
            cgst: totalCGST,
            Sgst: totalSGST,
            igst: totalIGST,
            grossamt: totalGrossAmount,
            tcsamt: totalTCSAmount,
            NETAMT: totalNetAmount,
        }
    ];

    const uniqueMainProducts = [...new Set(filteredData.map(item => item.ptype))];
    const uniquePartyNames = [...new Set(filteredData.map(item => item.PartyName))];
    const filterContent = (
        <div>
            <div style={{ marginBottom: 8 }}>
                <Select
                    placeholder="Select Main Product"
                    style={{ width: 200 }}
                    onChange={handleMainProductChange}
                    allowClear
                >
                    {uniqueMainProducts.map(product => (
                        <Option key={product} value={product}>{product}</Option>
                    ))}
                </Select>
            </div>
            <div>
                <Select
                    placeholder="Select Party Name"
                    style={{ width: 200 }}
                    onChange={handlePartyNameChange}
                    allowClear
                >
                    {uniquePartyNames.map(name => (
                        <Option key={name} value={name}>{name}</Option>
                    ))}
                </Select>
            </div>
        </div>
    );

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>New Ornament Register</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="NewOrnamentReport"
                    />
                    <Popover
                        content={filterContent}
                        title="Filters"
                        trigger="click"
                        open={popoverVisible}
                        onOpenChange={setPopoverVisible}
                        placement="bottomLeft"
                        overlayStyle={{ width: '500px' }}
                    >
                        <Button icon={<FilterOutlined />} type="primary">Filters</Button>
                    </Popover>
                </Col>
            </Row>
          
            <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
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
                                className="date-picker"
                                customInput={<CustomInput />}

                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <div
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
                    dataSource={filteredTableData}
                    rowKey="key"
                    pagination={{
                        pageSize: 6,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        position: ["topRight"],
                        style: { margin: "16px 0" }
                    }}
                    rowClassName="table-row"
                    summary={() => filteredTableData.length > 0 && (
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={6}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">{totalGrossWeight}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right"></Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="right">{totalNetWeight}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align="right">{totalTaxable}</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align="right">{totalCGST}</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align="right">{totalSGST}</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} align="right">{totalIGST}</Table.Summary.Cell>
                            <Table.Summary.Cell index={8} align="right">{totalGrossAmount}</Table.Summary.Cell>
                            <Table.Summary.Cell index={9} align="right">{totalTCSAmount}</Table.Summary.Cell>
                            <Table.Summary.Cell index={10} align="right">{totalNetAmount}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default NewOrnamentReport;
