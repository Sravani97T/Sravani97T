import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const CounterChart = () => {
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
        // Fetch the counter chart data based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetCounterChart?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the counter chart data
            })
            .catch(error => {
                console.error('Error fetching counter chart data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'PCS', key: 'PCS' },
    ];

    const getTotals = () => {
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PCS, 0);
        return {
            totalPCS: totalPCS,
        };
    };

    const { totalPCS } = getTotals();

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
    }));

    // Add totals row
    formattedData.push({
        sno: 'Total',
        PRODUCTNAME: '',
        PCS: totalPCS,
    });

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Counter Chart</Breadcrumb.Item>
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
                        fileName="CounterChartReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={formattedData}
                    rowKey="PRODUCTNAME"
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

export default CounterChart;