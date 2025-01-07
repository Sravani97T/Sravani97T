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

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
        { title: 'Material Name', dataIndex: 'MNAME', key: 'MNAME' },
        { title: 'Pieces', dataIndex: 'PCS', key: 'PCS', align: "right" },
        { title: 'Gross Wt', dataIndex: 'GWT', key: 'GWT', align: "right", render: value => Number(value).toFixed(3) },
        { title: 'Net Wt', dataIndex: 'NWT', key: 'NWT', align: "right", render: value => Number(value).toFixed(3) },
    ];

    const getTotals = () => {
        const totalPCS = filteredData.reduce((sum, item) => sum + item.PCS, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);

        return {
            totalPCS: totalPCS,
            totalGWT: Number(totalGWT).toFixed(3),
            totalNWT: Number(totalNWT).toFixed(3),
        };
    };

    const { totalNWT, totalPCS, totalGWT } = getTotals();

    const formatValue = value => Number(value).toFixed(3);

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: index + 1,
            GWT: formatValue(item.GWT),
            NWT: formatValue(item.NWT),
            GRMS: formatValue(item.GRMS),
            CTS: formatValue(item.CTS),
            RATE: formatValue(item.RATE),
            AMOUNT: formatValue(item.AMOUNT),
        })),
        {
            sno: 'Total', // Empty S.No for the total row
            MNAME: '', // Set Material Name to an empty string
            PCS: totalPCS,
            GWT: totalGWT,
            NWT: totalNWT,
            GRMS: formatValue(filteredData.reduce((sum, item) => sum + item.GRMS, 0)),
            CTS: formatValue(filteredData.reduce((sum, item) => sum + item.CTS, 0)),
            RATE: formatValue(filteredData.reduce((sum, item) => sum + item.RATE, 0) / filteredData.length),
            AMOUNT: formatValue(filteredData.reduce((sum, item) => sum + item.AMOUNT, 0)),
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
                        totals={{ totalPCS, totalGWT, totalNWT }} // Pass totals as props
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
                <Table
                    size="small"
                    columns={columns}
                    dataSource={formattedData}
                    rowKey="MNAME"
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

export default StockBalanceReport;
