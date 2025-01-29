import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const PrifixNetSummry = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'
    const [prefix, setPrefix] = useState(''); // State for selected PREFIX
    const [prefixOptions, setPrefixOptions] = useState([]); // State for PREFIX options
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20); // Default page size to 20

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
        // Fetch the Prefix Net Summary based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetPrefixNetSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the filtered data based on the new API
                const uniquePrefixes = [...new Set(response.data.map(item => item.PREFIX))];
                setPrefixOptions(uniquePrefixes); // Set unique PREFIX options
            })
            .catch(error => {
                console.error('Error fetching Prefix Net Summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno',  width: 50, className: 'blue-background-column', key: 'sno' },
        { title: 'Prefix', dataIndex: 'PREFIX', key: 'PREFIX' },
        { title: 'Pieces', align: "right", dataIndex: 'Pieces', key: 'Pieces' },
        { title: 'Net Wt', align: "right", dataIndex: 'Nwt', key: 'Nwt', render: value => Number(value).toFixed(3) },
        { title: 'Gross Wt', align: "right", dataIndex: 'Gwt', key: 'Gwt', render: value => Number(value).toFixed(3) },
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
            totalNwt: totalNwt.toFixed(3),
            totalPieces: totalPieces,
            totalGwt: totalGwt.toFixed(3),
            totalDiaCts: totalDiaCts.toFixed(2),
            totalDiaAmt: totalDiaAmt.toFixed(2),
        };
    };

    const filteredByPrefix = filteredData.filter(item => !prefix || item.PREFIX === prefix); // Filter by PREFIX

    const getFilteredTotals = () => {
        const totalNwt = filteredByPrefix.reduce((sum, item) => sum + item.Nwt, 0);
        const totalPieces = filteredByPrefix.reduce((sum, item) => sum + item.Pieces, 0);
        const totalGwt = filteredByPrefix.reduce((sum, item) => sum + item.Gwt, 0);
        const totalDiaCts = filteredByPrefix.reduce((sum, item) => sum + item.DIACTS, 0);
        const totalDiaAmt = filteredByPrefix.reduce((sum, item) => sum + item.DIAAMT, 0);
        return {
            totalNwt: totalNwt.toFixed(3),
            totalPieces: totalPieces,
            totalGwt: totalGwt.toFixed(3),
            totalDiaCts: totalDiaCts.toFixed(2),
            totalDiaAmt: totalDiaAmt.toFixed(2),
        };
    };

    const { totalNwt, totalPieces, totalGwt, totalDiaCts, totalDiaAmt } = getFilteredTotals();

    const formattedData = [
        ...filteredByPrefix.map((item, index) => ({
            ...item,
            sno: index + 1,
            Gwt: Number(item.Gwt).toFixed(3),
            Nwt: Number(item.Nwt).toFixed(3),
            DIACTS: Number(item.DIACTS).toFixed(2),
            DIAAMT: Number(item.DIAAMT).toFixed(2),
        })),
        {
            sno: 'Total',
            PREFIX: '',
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
                        <Breadcrumb.Item>Prefix Net Summary</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="PrefixNetSummaryReport"
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
            <Select
                placeholder="Select Prefix"
                style={{ width: 150, marginRight: '10px' }}
                onChange={(value) => setPrefix(value)}
                allowClear
            >
                {prefixOptions.map((item) => (
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
                            rowKey="PREFIX"
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

export default PrifixNetSummry;
