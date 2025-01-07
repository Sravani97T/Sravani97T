import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const DiamondStockDetails = () => {
    const [, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetDiamondStockDetail')
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);  // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const formatValue = (value, decimals = 3) => {
        return value ? value.toFixed(decimals) : '0.000';  // Format to specified
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno', align: 'center' },
        { title: 'Material Name', dataIndex: 'MNAME', key: 'MNAME' },

        { title: 'Product Category', dataIndex: 'PRODUCTCATEGORY', key: 'PRODUCTCATEGORY' },
        { title: 'Product Code', dataIndex: 'PRODUCTCODE', key: 'PRODUCTCODE' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Tag No', dataIndex: 'TAGNO', key: 'TAGNO', align: 'right' },
        { title: 'Item Name', dataIndex: 'ITEMNAME', key: 'ITEMNAME' },
        { title: 'Pieces', dataIndex: 'PIECES', key: 'PIECES', align: 'right' },
        { title: 'Grams', dataIndex: 'GRMS', align: 'right', key: 'GRMS', render: value => Number(value).toFixed(3) },
        { title: 'Carats', dataIndex: 'CTS', align: 'right', key: 'CTS', render: value => Number(value).toFixed(3) },
        { title: 'Rate', dataIndex: 'RATE', align: 'right', key: 'RATE', render: value => Number(value).toFixed(3) },
        { title: 'Amount', dataIndex: 'AMOUNT', align: 'right', key: 'AMOUNT', render: value => Number(value).toFixed(3) },
        { title: 'Colour', dataIndex: 'COLOUR', key: 'COLOUR' },
        { title: 'Cut', dataIndex: 'CUT', key: 'CUT' },
        { title: 'Clarity', dataIndex: 'CLARITY', key: 'CLARITY' },
    ];


    const getTotals = () => {
        const totalPieces = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGrams = filteredData.reduce((sum, item) => sum + item.GRMS, 0);
        const totalCarats = filteredData.reduce((sum, item) => sum + item.CTS, 0);
        const totalAmount = filteredData.reduce((sum, item) => sum + item.AMOUNT, 0);
        const totalRate = filteredData.reduce((sum, item) => sum + item.RATE, 0);
        const averageRate = totalRate / filteredData.length;

        return {
            totalPieces: totalPieces,
            totalGrams: formatValue(totalGrams),
            totalCarats: formatValue(totalCarats),
            totalAmount: formatValue(totalAmount),
            averageRate: formatValue(averageRate),
        };
    };

    const { totalPieces, totalGrams, totalCarats, totalAmount, averageRate } = getTotals();

    const formattedData = [
        ...filteredData.map((item, index) => ({
            ...item,
            sno: index + 1,
            GRMS: formatValue(item.GRMS),
            CTS: formatValue(item.CTS),
            RATE: formatValue(item.RATE),
            AMOUNT: formatValue(item.AMOUNT),
        })),
        {
            sno: 'Total',
            MNAME: '',
            PIECES: totalPieces,
            GRMS: totalGrams,
            CTS: totalCarats,
            RATE: averageRate,
            AMOUNT: totalAmount,
        }
    ];

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Diamond Stock Details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="DiamondStockDetails"
                    />
                </Col>
            </Row>
            <div style={{ marginTop: 16, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>

                <div
                    className="table-responsive scroll-horizontal"
                    style={{
                        maxHeight: "calc(99vh - 193.33px)",
                        overflowY: "auto",
                        overflowX: "auto",
                        marginTop: "20px",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    }}
                >
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

                    />
                </div>
            </div>
        </>
    );
};

export default DiamondStockDetails;