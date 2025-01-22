import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Input, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const OutstandingCustomers = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [cityFilter, setCityFilter] = useState('');
    const [mobileFilter, setMobileFilter] = useState('');
    const [customerNameFilter, setCustomerNameFilter] = useState('');
    const [cityOptions, setCityOptions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Set default page size to 20

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/POSReports/GetOutStandingCustomers?cityName=%&custName=%&saleCode=1&mobileNo=%`)
            .then(response => {
                const data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                    balance: item.debit - item.credit,
                }));
                setFilteredData(data);

                // Extract unique city names
                const uniqueCities = [...new Set(data.map(item => item.CityName))];
                setCityOptions(uniqueCities);
            })
            .catch(error => {
                console.error('Error fetching outstanding customers:', error);
            });
    }, []);

    const handleCityChange = (value) => {
        setCityFilter(value);
    };

    const handleMobileChange = (event) => {
        setMobileFilter(event.target.value);
    };

    const handleCustomerNameChange = (event) => {
        setCustomerNameFilter(event.target.value);
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const filteredResults = filteredData.filter(item => 
        (cityFilter ? item.CityName.includes(cityFilter) : true) &&
        (mobileFilter ? item.MobileNum.includes(mobileFilter) : true) &&
        (customerNameFilter ? item.CustName.toLowerCase().includes(customerNameFilter.toLowerCase()) : true)
    );

    const columns = [
        { title: 'S.No', width: 50,   className: 'blue-background-column',  dataIndex: 'serialNo', key: 'serialNo' },
        { title: 'City Name', dataIndex: 'CityName', key: 'CityName' },
        { title: 'Customer Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'Mobile Number', dataIndex: 'MobileNum', key: 'MobileNum' },
        { title: 'Debit', dataIndex: 'debit', key: 'debit', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Credit', dataIndex: 'credit', key: 'credit', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Balance', dataIndex: 'balance', key: 'balance', align: "right", render: value => Number(value).toFixed(2) },
    ];

    const getTotals = () => {
        const totalDebit = filteredResults.reduce((sum, item) => sum + item.debit, 0);
        const totalCredit = filteredResults.reduce((sum, item) => sum + item.credit, 0);
        const totalBalance = totalDebit - totalCredit;

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            totalBalance: totalBalance.toFixed(2),
        };
    };

    const { totalDebit, totalCredit, totalBalance } = getTotals();

    const formattedData = [
        ...filteredResults,
        {
            serialNo: 'Total',
            CityName: '',
            CustName: '',
            MobileNum: '',
            debit: totalDebit,
            credit: totalCredit,
            balance: totalBalance,
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Outstanding Customers</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="OutstandingCustomersReport"
                    />
                </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 8 }} align="middle">
                <Col>
                    <Select
                        placeholder="Select City"
                        onChange={handleCityChange}
                        style={{ width: 180 }}
                        size="mediam"
                    >
                        <Option value="">All Cities</Option>
                        {cityOptions.map(city => (
                            <Option key={city} value={city}>{city}</Option>
                        ))}
                    </Select>
                </Col>
                <Col>
                    <Input
                        placeholder="Search Mobile Number"
                        onChange={handleMobileChange}
                        style={{ width: 180 }}
                        size="mediam"
                    />
                </Col>
                <Col>
                    <Input
                        placeholder="Search Customer Name"
                        onChange={handleCustomerNameChange}
                        style={{ width: 180 }}
                        size="mediam"
                    />
                </Col>
                <Col flex="auto" />
                <Col>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredResults.length}
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
                    dataSource={filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                    rowKey="key"
                    pagination={false}
                    rowClassName="table-row"
                    summary={() => filteredResults.length > 0 && (
                        <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                            <Table.Summary.Cell>Total</Table.Summary.Cell>
                            <Table.Summary.Cell colSpan={3} />
                            <Table.Summary.Cell align="right">{totalDebit}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalCredit}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalBalance}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
                </TableHeaderStyles>
            </div>
        </>
    );
};

export default OutstandingCustomers;
