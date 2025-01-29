import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';
const { Option } = Select;

const StoneDetails = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'
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
        // Fetch the stone details data based on the selected MNAME
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetStoneDetails?mName=${mName}`)
            .then(response => {
                setFilteredData(response.data);  // Set the stone details data
            })
            .catch(error => {
                console.error('Error fetching stone details data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' , width: 50,  className: 'blue-background-column',},
        { title: 'Item Name', dataIndex: 'ITEMNAME', key: 'ITEMNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'PCS', key: 'PCS' },
        { title: 'Grams', align: "right", dataIndex: 'GRMS', key: 'GRMS' },
        { title: 'Carats', align: "right", dataIndex: 'CTS', key: 'CTS' },
        { title: 'Amount', align: "right", dataIndex: 'AMOUNT', key: 'AMOUNT' },
    ];

    const getTotals = () => {
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PCS, 0);
        const totalGRMS = filteredData.reduce((sum, item) => sum + item.GRMS, 0);
        const totalCTS = filteredData.reduce((sum, item) => sum + item.CTS, 0);
        const totalAMOUNT = filteredData.reduce((sum, item) => sum + item.AMOUNT, 0);
        return {
            totalPCS,
            totalGRMS: Number(totalGRMS).toFixed(3),
            totalCTS: Number(totalCTS).toFixed(3),
            totalAMOUNT: Number(totalAMOUNT).toFixed(2),
        };
    };

    const { totalPCS, totalGRMS, totalCTS, totalAMOUNT } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: index + 1,
        })),
        {
            sno: 'Total',
            ITEMNAME: '',
            PCS: totalPCS,
            GRMS: totalGRMS,
            CTS: totalCTS,
            AMOUNT: totalAMOUNT,
        }
    ];

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
                        <Breadcrumb.Item>Stone Details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="StoneDetailsReport"
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
                            rowKey="ITEMNAME"
                            pagination={false}
                            rowClassName="table-row"
                            summary={() => (
                                <Table.Summary.Row style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPCS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGRMS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalCTS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalAMOUNT}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
            </div>
        </>
    );
};

export default StoneDetails;
