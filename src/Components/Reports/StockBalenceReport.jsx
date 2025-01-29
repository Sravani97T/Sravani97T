import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const StockBalanceReport = () => {
    const [, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetStockBalances?suspennce=NO`)
            .then(response => {
                setData(response.data);
                setFilteredData(response.data); // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', width: 50, className: 'blue-background-column' },
        { title: 'Material Name', dataIndex: 'MNAME', key: 'MNAME' },
        { title: 'Pieces', dataIndex: 'PCS', key: 'PCS', align: "right" },
        { title: 'Gross Wt', dataIndex: 'GWT', key: 'GWT', align: "right", render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', dataIndex: 'NWT', key: 'NWT', align: "right", render: value => Number(value).toFixed(3) },
    ];

    const getTotals = () => {
        const totalPCS = filteredData.reduce((sum, item) => sum + (item.PCS || 0), 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + (item.GWT || 0), 0);
        const totalNWT = filteredData.reduce((sum, item) => sum + (item.NWT || 0), 0);

        return {
            totalPCS: totalPCS,
            totalGWT: Number(totalGWT).toFixed(3),
            totalNWT: Number(totalNWT).toFixed(3),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formatValue = value => Number(value).toFixed(3);

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: index + 1,
            GWT: formatValue(item.GWT),
            NWT: formatValue(item.NWT),
        })),
        {
            sno: 'Total',
            MNAME: '',
            PCS: totalPCS,
            GWT: totalGWT,
            NWT: totalNWT,
        }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Stock Balance</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="StockBalanceReport"
                        totals={{ totalPCS, totalGWT, totalNWT }} // Pass totals as props
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
                    <div style={{ float: "right", marginBottom: "10px", marginLeft: "5px" }}>
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={filteredData.length}
                            showSizeChanger
                            pageSizeOptions={['10', '20', '50', '100']}
                            onChange={(page, size) => {
                                setCurrentPage(page);
                                setPageSize(size);
                            }}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                            style={{ marginBottom: "10px" }}
                        />
                    </div>
                    <TableHeaderStyles>
                        <Table
                            columns={columns}
                            dataSource={formattedData.slice(0, -1).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="MNAME"
                            size="small"
                            pagination={false}
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell index={1} />
                                    <Table.Summary.Cell index={2} align="right">{totalPCS}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={3} align="right">{totalGWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell index={4} align="right">{totalNWT}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default StockBalanceReport;
