import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const CategoryNetSummary = () => {
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
        // Fetch the category net summary based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetCategoryNetSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setFilteredData(response.data);  // Set the category net data
            })
            .catch(error => {
                console.error('Error fetching category net summary data:', error);
            });
    }, [mName]);  // Re-fetch when MNAME is changed

    const formatValue = (value) => {
        return value ? value.toFixed(3) : '0.000';  // Format to 3 decimal places
    };

    const columns = [
        { title: 'Category', dataIndex: 'CATEGORYNAME', key: 'CATEGORYNAME' },
        { title: 'Pieces', align: "right", dataIndex: 'Pieces', key: 'Pieces' },
        { title: 'Net Wt', align: "right", dataIndex: 'Nwt', key: 'Nwt', render: formatValue },
        { title: 'Gross Wt', align: "right", dataIndex: 'Gwt', key: 'Gwt', render: formatValue },
    ];

    const getTotals = () => {
        const totalNWT = filteredData.reduce((sum, item) => sum + item.Nwt, 0);
        const totalPCS = filteredData.reduce((sum, item) => sum + item.Pieces, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.Gwt, 0);
        return {
            totalNWT: formatValue(totalNWT),
            totalPCS: totalPCS,
            totalGWT: formatValue(totalGWT),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formattedData = [
        ...filteredData.map(item => ({
            ...item,
            Gwt: formatValue(item.Gwt),
            Nwt: formatValue(item.Nwt),
        })),
        {
            CATEGORYNAME: 'Total',
            Pieces: totalPCS,
            Gwt: totalGWT,
            Nwt: totalNWT,
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Category Net Summary</Breadcrumb.Item>
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
                        fileName="CategoryNetSummaryReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="CATEGORYNAME"
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
                            <Table.Summary.Cell align='right'>{totalPCS}</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalGWT}</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalNWT}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default CategoryNetSummary;
