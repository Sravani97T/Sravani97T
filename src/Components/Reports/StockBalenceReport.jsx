import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const StockBalanceReport = () => {
    const [, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetStockBalances?suspennce=NO')
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);  // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const formatValue = (value) => {
        return value ? value.toFixed(3) : '0.000';  // Format to 3 decimal places
    };

    const columns = [
        { title: 'Material Name', dataIndex: 'MNAME', key: 'MNAME' },
        { title: 'Pieces', dataIndex: 'PCS', key: 'PCS', align: "right" },
        { title: 'Gross Wt', dataIndex: 'GWT', key: 'GWT', align: "right", render: formatValue },
        { title: 'Net Wt', dataIndex: 'NWT', key: 'NWT', align: "right", render: formatValue },
    ];

    const getTotals = () => {
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PCS, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);

        return {
            totalPCS: totalPCS,
            totalGWT: formatValue(totalGWT),
            totalNWT: formatValue(totalNWT),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formattedData = [
        ...filteredData.map(item => ({
            ...item,
            GWT: formatValue(item.GWT),
            NWT: formatValue(item.NWT),
        })),
        {
            MNAME: 'Total',
            PCS: totalPCS,
            GWT: totalGWT,
            NWT: totalNWT,
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Stock Balance</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="StockBalanceReport"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="MNAME"
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
                            <Table.Summary.Cell align="right">{totalPCS}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalGWT}</Table.Summary.Cell>
                            <Table.Summary.Cell align="right">{totalNWT}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default StockBalanceReport;
