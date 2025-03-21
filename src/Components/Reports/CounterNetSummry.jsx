import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const CounterNetSummry = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

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
        // Fetch the counter wise net summary based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetCounterNetSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the filtered data for counter net summary
            })
            .catch(error => {
                console.error('Error fetching counter net summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', width: 50, align: "center", key: 'sno', className: 'blue-background-column' },
        { title: 'Counter Name', dataIndex: 'CounterName', key: 'CounterName' },
        { title: 'Pieces', align: "right", dataIndex: 'Pieces', key: 'Pieces' },
        { title: 'Gross Wt', align: "right", dataIndex: 'Gwt', key: 'Gwt', render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', align: "right", dataIndex: 'Nwt', key: 'Nwt', render: value => Number(value).toFixed(3) },
        { title: 'Diamond Counts', align: "right", dataIndex: 'DIACTS', key: 'DIACTS', render: value => Number(value).toFixed(2) },
        { title: 'Diamond Amount', align: "right", dataIndex: 'DIAAMT', key: 'DIAAMT', render: value => Number(value).toFixed(2) },
    ];

    const getTotals = () => {
        const totalNwt = filteredData.reduce((sum, item) => sum + item.Nwt, 0);
        const totalPieces = filteredData.reduce((sum, item) => sum + item.Pieces, 0);
        const totalGwt = filteredData.reduce((sum, item) => sum + item.Gwt, 0);
        const totalDiaCts = filteredData.reduce((sum, item) => sum + item.DIACTS, 0);
        const totalDiaAmt = filteredData.reduce((sum, item) => sum + item.DIAAMT, 0);
        return {
            totalNwt: Number(totalNwt).toFixed(3),
            totalPieces: totalPieces,
            totalGwt: Number(totalGwt).toFixed(3),
            totalDiaCts: Number(totalDiaCts).toFixed(2),
            totalDiaAmt: Number(totalDiaAmt).toFixed(2),
        };
    };

    const { totalNwt, totalPieces, totalGwt, totalDiaCts, totalDiaAmt } = getTotals();

    const formatValue = value => Number(value).toFixed(3);

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: (currentPage - 1) * pageSize + index + 1,
            Gwt: formatValue(item.Gwt),
            Nwt: formatValue(item.Nwt),
            DIACTS: Number(item.DIACTS).toFixed(2),
            DIAAMT: Number(item.DIAAMT).toFixed(2),
        })),
        {
            sno: 'Total',
            CounterName: '',
            Pieces: totalPieces,
            Gwt: totalGwt,
            Nwt: totalNwt,
            DIACTS: totalDiaCts,
            DIAAMT: totalDiaAmt,
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Counter Net Summary</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="CounterNetSummaryReport"
                        totals={{ totalPieces, totalGwt, totalNwt, totalDiaCts, totalDiaAmt }} // Pass totals as props
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
                            rowKey="CounterName"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPieces}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGwt}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalNwt}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalDiaCts}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalDiaAmt}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default CounterNetSummry;
