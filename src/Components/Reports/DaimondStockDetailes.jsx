import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const DiamondStockDetails = () => {
    const [, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetDiamondStockDetail`)
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);  // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const formatValue = (value, decimals = 3) => {
        return value ? value.toFixed(decimals) : '0.000';  // Format to specified
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', width: 50, align: "center", key: 'sno', className: 'blue-background-column' },
        { title: 'Material Name', dataIndex: 'MNAME', key: 'MNAME' },
        { title: 'Product Category', dataIndex: 'PRODUCTCATEGORY', key: 'PRODUCTCATEGORY' },
        { title: 'Product Code', dataIndex: 'PRODUCTCODE', key: 'PRODUCTCODE' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Tag No', dataIndex: 'TAGNO', key: 'TAGNO', align: 'right' },
        { title: 'Item Name', dataIndex: 'ITEMNAME', key: 'ITEMNAME' },
        { title: 'Pieces', dataIndex: 'PIECES', key: 'PIECES', align: 'right' },
        { title: 'Grams', dataIndex: 'GRMS', align: 'right', key: 'GRMS', render: value => Number(value).toFixed(3) },
        { title: 'Carats', dataIndex: 'CTS', align: 'right', key: 'CTS', render: value => Number(value).toFixed(3) },
        { title: 'Rate', dataIndex: 'RATE', align: 'right', key: 'RATE', render: value => Number(value).toFixed(3) },
        { title: 'Amount', dataIndex: 'AMOUNT', align: 'right', key: 'AMOUNT', render: value => Number(value).toFixed(3) },
        { title: 'Colour', dataIndex: 'COLOUR', key: 'COLOUR' },
        { title: 'Cut', dataIndex: 'CUT', key: 'CUT' },
        { title: 'Clarity', dataIndex: 'CLARITY', key: 'CLARITY' },
    ];

    const getTotals = () => {
        const totalPieces = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGrams = filteredData.reduce((sum, item) => sum + item.GRMS, 0);
        const totalCarats = filteredData.reduce((sum, item) => sum + item.CTS, 0);
        const totalAmount = filteredData.reduce((sum, item) => sum + item.AMOUNT, 0);
        const totalRate = filteredData.reduce((sum, item) => sum + item.RATE, 0);
        const averageRate = totalRate / filteredData.length;

        return {
            totalPieces: totalPieces,
            totalGrams: formatValue(totalGrams),
            totalCarats: formatValue(totalCarats),
            totalAmount: formatValue(totalAmount),
            averageRate: formatValue(averageRate),
        };
    };

    const { totalPieces, totalGrams, totalCarats, totalAmount, averageRate } = getTotals();

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: (currentPage - 1) * pageSize + index + 1,
        GRMS: formatValue(item.GRMS),
        CTS: formatValue(item.CTS),
        RATE: formatValue(item.RATE),
        AMOUNT: formatValue(item.AMOUNT),
    }));

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
                        <Breadcrumb.Item>Diamond Stock Details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="DiamondStockDetails"
                    />
                </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 16, marginTop: 16 }} align="middle">
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
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPieces}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGrams}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalCarats}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{averageRate}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalAmount}</Table.Summary.Cell>
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

export default DiamondStockDetails;
