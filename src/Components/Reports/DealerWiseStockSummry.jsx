import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const DealerWiseStockSummary = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'
    const [, setDealers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        // Fetch the MNAME options from the StockBalances API
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetStockBalances?suspennce=NO`)
            .then(response => {
                const mNames = response.data.map(item => item.MNAME);
                setData(mNames);
            })
            .catch(error => {
                console.error('Error fetching MNAME options:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch the dealer wise stock summary based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetDealerWiseStockSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setDealers(response.data);
                setFilteredData(response.data);  // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [mName]);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', width: 50, className: 'blue-background-column', key: 'sno' },
        { title: 'Dealer Name', dataIndex: 'DEALERNAME', key: 'DEALERNAME' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', dataIndex: 'PIECES', key: 'PIECES', align: 'right' },
        { title: 'Gross Weight', dataIndex: 'GWT', key: 'GWT', align: 'right', render: value => Number(value).toFixed(3) },
        { title: 'Net Weight', dataIndex: 'NWT', key: 'NWT', align: 'right', render: value => Number(value).toFixed(3) },
        { title: 'Diamond Carats', dataIndex: 'DIACTS', key: 'DIACTS', align: 'right', render: value => Number(value).toFixed(2) },
        { title: 'Diamond Amount', dataIndex: 'DIAAMT', key: 'DIAAMT', align: 'right', render: value => Number(value).toFixed(2) },
    ];

    const getTotals = () => {
        const totalPieces = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);
        const totalDIACTS = filteredData.reduce((sum, item) => sum + item.DIACTS, 0);
        const totalDIAAMT = filteredData.reduce((sum, item) => sum + item.DIAAMT, 0);

        return {
            totalPieces,
            totalGWT: Number(totalGWT).toFixed(3),
            totalNWT: Number(totalNWT).toFixed(3),
            totalDIACTS: Number(totalDIACTS).toFixed(2),
            totalDIAAMT: Number(totalDIAAMT).toFixed(2),
        };
    };

    const { totalPieces, totalGWT, totalNWT, totalDIACTS, totalDIAAMT } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: (currentPage - 1) * pageSize + index + 1,
            GWT: Number(item.GWT).toFixed(3),
            NWT: Number(item.NWT).toFixed(3),
            DIACTS: Number(item.DIACTS).toFixed(2),
            DIAAMT: Number(item.DIAAMT).toFixed(2),
        })),
        {
            sno: 'Total',
            DEALERNAME: '',
            PRODUCTNAME: '',
            PIECES: totalPieces,
            GWT: totalGWT,
            NWT: totalNWT,
            DIACTS: totalDIACTS,
            DIAAMT: totalDIAAMT,
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Dealer Wise Stock Summary</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="DealerWiseStockSummary"
                        totals={{ totalPieces, totalGWT, totalNWT, totalDIACTS, totalDIAAMT }} // Pass totals as props
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
                            dataSource={formattedData.slice(0, -1).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                            rowKey="PRODUCTNAME"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPieces}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalNWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalDIACTS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalDIAAMT}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default DealerWiseStockSummary;
