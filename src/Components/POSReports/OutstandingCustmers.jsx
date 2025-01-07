import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const OutstandingCustomers = () => {
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/POSReports/GetOutStandingCustomers?cityName=%&custName=%&saleCode=1&mobileNo=%')
            .then(response => {
                const data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                    balance: item.debit - item.credit,
                }));
                setFilteredData(data);
            })
            .catch(error => {
                console.error('Error fetching outstanding customers:', error);
            });
    }, []);

    const columns = [
        { title: 'S.No', dataIndex: 'serialNo', key: 'serialNo' },
        { title: 'City Name', dataIndex: 'CityName', key: 'CityName' },
        { title: 'Customer Name', dataIndex: 'CustName', key: 'CustName' },
        { title: 'Mobile Number', dataIndex: 'MobileNum', key: 'MobileNum' },
        { title: 'Debit', dataIndex: 'debit', key: 'debit', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Credit', dataIndex: 'credit', key: 'credit', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Balance', dataIndex: 'balance', key: 'balance', align: "right", render: value => Number(value).toFixed(2) },
    ];

    const getTotals = () => {
        const totalDebit = filteredData.reduce((sum, item) => sum + item.debit, 0);
        const totalCredit = filteredData.reduce((sum, item) => sum + item.credit, 0);
        const totalBalance = totalDebit - totalCredit;

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            totalBalance: totalBalance.toFixed(2),
        };
    };

    const { totalDebit, totalCredit, totalBalance } = getTotals();

    const formattedData = [
        ...filteredData,
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
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
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
                            <Table.Summary.Cell colSpan={3} />
                            <Table.Summary.Cell align="right">{totalDebit}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalCredit}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalBalance}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default OutstandingCustomers;
