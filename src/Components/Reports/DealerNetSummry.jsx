import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const DealerNetSummry = () => {
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
        // Fetch the dealer net summary based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetDealerNetSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the dealer net summary data
            })
            .catch(error => {
                console.error('Error fetching dealer net summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
        { title: 'Dealer', dataIndex: 'DEALERNAME', key: 'DEALERNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'Pieces', key: 'Pieces' },
        { title: 'Gross Wt', align: "right", dataIndex: 'Gwt', key: 'Gwt', render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', align: "right", dataIndex: 'Nwt', key: 'Nwt', render: value => Number(value).toFixed(3) },
        { title: 'Dia Cts', align: "right", dataIndex: 'DIACTS', key: 'DIACTS', render: value => Number(value).toFixed(2) },
        { title: 'Dia Amt', align: "right", dataIndex: 'DIAAMT', key: 'DIAAMT', render: value => Number(value).toFixed(2) },
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

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
        Gwt: Number(item.Gwt).toFixed(3),
        Nwt: Number(item.Nwt).toFixed(3),
        DIACTS: Number(item.DIACTS).toFixed(2),
        DIAAMT: Number(item.DIAAMT).toFixed(2),
    }));

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Dealer Net Summary</Breadcrumb.Item>
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
                        fileName="DealerNetSummaryReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={formattedData}
                    rowKey="DEALERNAME"
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
                            <Table.Summary.Cell index={0} colSpan={2}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align='right'>{totalPieces}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align='right'>{totalGwt}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align='right'>{totalNwt}</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align='right'>{totalDiaCts}</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} align='right'>{totalDiaAmt}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default DealerNetSummry;
