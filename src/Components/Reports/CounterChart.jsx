import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; 
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from "../../Config/Config";
const { Option } = Select;

const CounterChart = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'

    useEffect(() => {
        // Fetch the MNAME options from the StockBalances API
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetStockBalances?suspennce=NO`)
            .then(response => {
                const mNames = response.data.map(item => item.MNAME);
                // Set the fetched MNAME options
                setData(mNames);
            })
            .catch(error => {
                console.error('Error fetching MNAME options:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch the counter chart data based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetCounterChart?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the counter chart data
            })
            .catch(error => {
                console.error('Error fetching counter chart data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', width: 50, dataIndex: 'sno', key: 'sno', className: 'blue-background-column' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'PCS', key: 'PCS' },
    ];

    const getTotals = () => {
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PCS, 0);
        return {
            totalPCS: totalPCS,
        };
    };

    const { totalPCS } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: index + 1,
        })),
        {
            sno: 'Total',
            PRODUCTNAME: '',
            PCS: totalPCS,
        }
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Default page size to 20

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Counter Chart</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="CounterChartReport"
                    />
                </Col>
            </Row>
            <Select
                defaultValue={mName}
                style={{ width: 150, marginRight: '10px' }}
                onChange={(value) => setMName(value)}
            >
                {data.map((item) => (
                    <Option key={item} value={item}>
                        {item}
                    </Option>
                ))}
            </Select>
            <Row gutter={8} style={{ marginBottom: 8 }} align="middle">
                <Col flex="auto" />
                <Col>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={handlePageChange}
                        pageSizeOptions={["5", "10", "20", "50", "100"]}
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
                            dataSource={formattedData.slice(0, -1).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="PRODUCTNAME"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPCS}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default CounterChart;