import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const StockSummaryReport = () => {
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
        // Fetch the stock summary based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetStockSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the stock summary data
            })
            .catch(error => {
                console.error('Error fetching stock summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        {
            title: 'S.No', dataIndex: 'sno', key: 'sno', className: 'blue-background-column',
            width: 50,
        },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'PIECES', key: 'PIECES' },
        { title: 'Gross Wt', align: "right", dataIndex: 'GWT', key: 'GWT', render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', align: "right", dataIndex: 'NWT', key: 'NWT', render: value => Number(value).toFixed(3) },
    ];

    const getTotals = () => {
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        return {
            totalNWT: Number(totalNWT).toFixed(3),
            totalPCS: totalPCS,
            totalGWT: Number(totalGWT).toFixed(3),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
        GWT: Number(item.GWT).toFixed(3),
        NWT: Number(item.NWT).toFixed(3),
    }));

    // Add totals row to formattedData
    const formattedDataWithTotals = [
        ...formattedData,
        {
            sno: 'Total',
            PRODUCTNAME: '',
            PIECES: totalPCS,
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
                        <Breadcrumb.Item>Stock Summary</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedDataWithTotals}
                        columns={columns}
                        fileName="StockSummaryReport"
                        alignRightColumns={['PIECES', 'GWT', 'NWT']} // Add this prop to align right
                    />
                </Col>
            </Row>
            
            <Select
                defaultValue={mName}
                style={{ width: 150, marginRight: "10px" }}
                onChange={(value) => setMName(value)}
            >
                {data.map((item) => (
                    <Option key={item} value={item}>
                        {item}
                    </Option>
                ))}
            </Select>
            
            <Row justify="end" style={{ marginBottom: "10px" }}>
                <Col>
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
                            dataSource={formattedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="PRODUCTNAME"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPCS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalNWT}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default StockSummaryReport;
