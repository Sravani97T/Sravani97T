import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const StoneDetails = () => {
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
        // Fetch the stone details data based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetStoneDetails?mName=${mName}`)
            .then(response => {
                setFilteredData(response.data);  // Set the stone details data
            })
            .catch(error => {
                console.error('Error fetching stone details data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
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
            totalGRMS,
            totalCTS,
            totalAMOUNT,
        };
    };

    const { totalPCS, totalGRMS, totalCTS, totalAMOUNT } = getTotals();

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
    }));

    // Add totals row
    formattedData.push({
        sno: 'Total',
        ITEMNAME: '',
        PCS: totalPCS,
        GRMS: totalGRMS,
        CTS: totalCTS,
        AMOUNT: totalAMOUNT,
    });

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
                        fileName="StoneDetailsReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={formattedData}
                    rowKey="ITEMNAME"
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

export default StoneDetails;