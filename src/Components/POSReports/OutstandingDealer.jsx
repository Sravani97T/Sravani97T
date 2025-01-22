import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const OutstandingDealers = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/POSReports/GetOutStandingDealers?partyName=%25&mobileNo=%25`)
            .then(response => {
                const data = response.data.map((item, index) => ({
                    ...item,
                    key: index + 1,
                    serialNo: index + 1,
                    balance: item.JAMA - item.NAMA,
                }));
                setFilteredData(data);
            })
            .catch(error => {
                console.error('Error fetching outstanding dealers:', error);
            });
    }, []);

    const columns = [
        { title: 'S.No',  width: 50,  className: 'blue-background-column', dataIndex: 'serialNo', key: 'serialNo' },
        { title: 'Party Name', dataIndex: 'PARTYNAME', key: 'PARTYNAME' },
        { title: 'Mobile Number', dataIndex: 'MOBILENO', key: 'MOBILENO' },
        { title: 'Debit', dataIndex: 'JAMA', key: 'JAMA', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Credit', dataIndex: 'NAMA', key: 'NAMA', align: "right", render: value => Number(value).toFixed(2) },
        { title: 'Balance', dataIndex: 'balance', key: 'balance', align: "right", render: value => Number(value).toFixed(2) },
    ];

    const getTotals = () => {
        const totalDebit = filteredData.reduce((sum, item) => sum + item.JAMA, 0);
        const totalCredit = filteredData.reduce((sum, item) => sum + item.NAMA, 0);
        const totalBalance = totalDebit - totalCredit;

        return {
            totalDebit: totalDebit.toFixed(2),
            totalCredit: totalCredit.toFixed(2),
            totalBalance: totalBalance.toFixed(2),
        };
    };

    const { totalDebit, totalCredit, totalBalance } = getTotals();

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Breadcrumb style={{ fontSize: '18px', fontWeight: '600', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Outstanding Dealers</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={filteredData}
                        columns={columns}
                        fileName="OutstandingDealersReport"
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
                                    <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} align="right">{totalDebit}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2} align="right">{totalCredit}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">{totalBalance}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default OutstandingDealers;