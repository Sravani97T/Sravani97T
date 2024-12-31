import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const CounterNetSummry = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'

    useEffect(() => {
        // Fetch the MNAME options from the StockBalances API
        axios.get('http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetStockBalances?suspennce=NO')
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
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetCounterNetSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the filtered data for counter net summary
            })
            .catch(error => {
                console.error('Error fetching counter net summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const formatValue = (value) => {
        return value ? value.toFixed(3) : '0.000';  // Format to 3 decimal places
    };

    const columns = [
        { title: 'Counter Name', dataIndex: 'CounterName', key: 'CounterName' },
        { title: 'Pieces', align: "right", dataIndex: 'Pieces', key: 'Pieces' },
        { title: 'Gross Wt', align: "right", dataIndex: 'Gwt', key: 'Gwt', render: formatValue },
        { title: 'Net Wt', align: "right", dataIndex: 'Nwt', key: 'Nwt', render: formatValue },
        { title: 'Diamond Counts', align: "right", dataIndex: 'DIACTS', key: 'DIACTS', render: formatValue },
        { title: 'Diamond Amount', align: "right", dataIndex: 'DIAAMT', key: 'DIAAMT', render: formatValue },
    ];

    const getTotals = () => {
        const totalNwt = filteredData.reduce((sum, item) => sum + item.Nwt, 0);
        const totalPieces = filteredData.reduce((sum, item) => sum + item.Pieces, 0);
        const totalGwt = filteredData.reduce((sum, item) => sum + item.Gwt, 0);
        const totalDiaCts = filteredData.reduce((sum, item) => sum + item.DIACTS, 0);
        const totalDiaAmt = filteredData.reduce((sum, item) => sum + item.DIAAMT, 0);
        return {
            totalNwt: formatValue(totalNwt),
            totalPieces: totalPieces,
            totalGwt: formatValue(totalGwt),
            totalDiaCts: formatValue(totalDiaCts),
            totalDiaAmt: formatValue(totalDiaAmt),
        };
    };

    const { totalNwt, totalPieces, totalGwt, totalDiaCts, totalDiaAmt } = getTotals();

    const formattedData = [
        ...filteredData.map(item => ({
            ...item,
            Gwt: formatValue(item.Gwt),
            Nwt: formatValue(item.Nwt),
            DIACTS: formatValue(item.DIACTS),
            DIAAMT: formatValue(item.DIAAMT),
        })),
        {
            CounterName: 'Total',
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
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="CounterNetSummaryReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="CounterName"
                    pagination={{
                        pageSize: 5,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        position: ["topRight"],
                        style: { margin: "5px" }
                    }}
                    rowClassName="table-row"
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={1}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalPieces}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalGwt}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalNwt}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalDiaCts}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalDiaAmt}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default CounterNetSummry;
