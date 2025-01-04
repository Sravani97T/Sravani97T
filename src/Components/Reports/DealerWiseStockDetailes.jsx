import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const DealerWiseStockDetailes = () => {
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
        // Fetch the dealer wise stock detail based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetDealerWiseStockDetail?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the dealer wise stock data
            })
            .catch(error => {
                console.error('Error fetching dealer wise stock detail data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
        { title: 'Tag No', dataIndex: 'TAGNO', key: 'TAGNO' },
        { title: 'Product', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'PIECES', key: 'PIECES' },
        { title: 'Gross Wt', align: "right", dataIndex: 'GWT', key: 'GWT', render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', align: "right", dataIndex: 'NWT', key: 'NWT', render: value => Number(value).toFixed(3) },
        { title: 'Prefix', dataIndex: 'PREFIX', key: 'PREFIX' },
        { title: 'Counter', dataIndex: 'COUNTERNAME', key: 'COUNTERNAME' },
        { title: 'Tag Date', dataIndex: 'TAGDATE', key: 'TAGDATE' },
    ];

    const getTotals = () => {
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        return {
            totalNWT: totalNWT.toFixed(3),
            totalPCS: totalPCS,
            totalGWT: totalGWT.toFixed(3),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
        GWT: Number(item.GWT).toFixed(3),
        NWT: Number(item.NWT).toFixed(3),
    }));

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Dealer Wise Stock Detail</Breadcrumb.Item>
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
                        fileName="DealerWiseStockDetailReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={formattedData}
                    rowKey="TAGNO"
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
                            <Table.Summary.Cell index={0} colSpan={3}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align='right'>{totalPCS}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align='right'>{totalGWT}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align='right'>{totalNWT}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4} colSpan={4}></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default DealerWiseStockDetailes;
