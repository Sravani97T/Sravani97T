import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const DealerWiseStockDetailes = () => {
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
        // Fetch the dealer wise stock detail based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetDealerWiseStockDetail?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the dealer wise stock data
            })
            .catch(error => {
                console.error('Error fetching dealer wise stock detail data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno',  className: 'blue-background-column', width: 50,  key: 'sno' },
        { title: 'Tag No', dataIndex: 'TAGNO', key: 'TAGNO' },
        { title: 'Product', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'PIECES', key: 'PIECES' },
        { title: 'Gross Wt', align: "right", dataIndex: 'GWT', key: 'GWT', render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', align: "right", dataIndex: 'NWT', key: 'NWT', render: value => Number(value).toFixed(3) },
        { title: 'Prefix', dataIndex: 'PREFIX', key: 'PREFIX' },
        { title: 'Counter', dataIndex: 'COUNTERNAME', key: 'COUNTERNAME' },
        { 
            title: 'Tag Date', 
            dataIndex: 'TAGDATE', 
            key: 'TAGDATE',
            render: (value) => {
                const date = new Date(value);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
    ];

    const getTotals = () => {
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        return {
            totalNWT: totalNWT.toFixed(3),
            totalPCS: totalPCS,
            totalGWT: totalGWT.toFixed(3),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: index + 1,
            GWT: Number(item.GWT).toFixed(3),
            NWT: Number(item.NWT).toFixed(3),
        })),
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Default page size set to 20

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
                        <Breadcrumb.Item>Dealer Wise Stock Detail</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="DealerWiseStockDetailReport"
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
                            dataSource={formattedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="TAGNO"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPCS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalNWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default DealerWiseStockDetailes;
