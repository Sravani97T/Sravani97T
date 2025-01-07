import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const PrifixNetSummry = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'
    const [prefix, setPrefix] = useState(''); // State for selected PREFIX
    const [prefixOptions, setPrefixOptions] = useState([]); // State for PREFIX options

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
        // Fetch the Prefix Net Summary based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetPrefixNetSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the filtered data based on the new API
                const uniquePrefixes = [...new Set(response.data.map(item => item.PREFIX))];
                setPrefixOptions(uniquePrefixes); // Set unique PREFIX options
            })
            .catch(error => {
                console.error('Error fetching Prefix Net Summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
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

    const formattedData = filteredByPrefix.map((item, index) => ({
        ...item,
        sno: index + 1,
        Gwt: Number(item.Gwt).toFixed(3),
        Nwt: Number(item.Nwt).toFixed(3),
        DIACTS: Number(item.DIACTS).toFixed(2),
        DIAAMT: Number(item.DIAAMT).toFixed(2),
    }));

    // Add totals row
    formattedData.push({
        sno: 'Total',
        PREFIX: '',
        Pieces: totalPieces,
        Nwt: totalNwt,
        Gwt: totalGwt,
        DIACTS: totalDiaCts,
        DIAAMT: totalDiaAmt,
    });

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
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="PrefixNetSummaryReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={formattedData}
                    rowKey="PREFIX"
                    pagination={{
                        pageSize: 5,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                        position: ["topRight"],
                        style: { margin: "5px" }
                    }}
                    rowClassName="table-row"
                />
            </div>
        </>
    );
};

export default PrifixNetSummry;
