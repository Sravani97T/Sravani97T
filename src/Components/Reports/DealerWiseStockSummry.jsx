import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Select } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary

const { Option } = Select;

const DealerWiseStockSummary = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [mName, setMName] = useState('GOLD'); // Default to 'GOLD'
    const [dealers, setDealers] = useState([]);
    const [selectedDealer, setSelectedDealer] = useState('');

    useEffect(() => {
        // Fetch the MNAME options from the StockBalances API
        axios.get('http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetStockBalances?suspennce=NO')
            .then(response => {
                const mNames = response.data.map(item => item.MNAME);
                setData(mNames);
            })
            .catch(error => {
                console.error('Error fetching MNAME options:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch the dealer wise stock summary based on the selected MNAME
        axios.get(`http://www.jewelerp.timeserasoftware.in/api/InventoryReports/GetDealerWiseStockSummary?mName=${mName}&suspennce=NO`)
            .then(response => {
                setDealers(response.data);
                setFilteredData(response.data);  // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [mName]);

    const handleDealerChange = (value) => {
        setSelectedDealer(value);
        if (value) {
            setFilteredData(dealers.filter(item => item.DEALERNAME === value));
        } else {
            setFilteredData(dealers);  // Reset to all data if no filter is selected
        }
    };

    const columns = [
        { title: 'S.No', dataIndex: 'sno', key: 'sno' },
        { title: 'Dealer Name', dataIndex: 'DEALERNAME', key: 'DEALERNAME' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
        { title: 'Pieces', dataIndex: 'PIECES', key: 'PIECES', align: 'right' },
        { title: 'Gross Weight', dataIndex: 'GWT', key: 'GWT', align: 'right', render: value => Number(value).toFixed(3) },
        { title: 'Net Weight', dataIndex: 'NWT', key: 'NWT', align: 'right', render: value => Number(value).toFixed(3) },
        { title: 'Diamond Carats', dataIndex: 'DIACTS', key: 'DIACTS', align: 'right', render: value => Number(value).toFixed(2) },
        { title: 'Diamond Amount', dataIndex: 'DIAAMT', key: 'DIAAMT', align: 'right', render: value => Number(value).toFixed(2) },
    ];

    const getTotals = () => {
        const totalPieces = filteredData.reduce((sum, item) => sum + item.PIECES, 0);
        const totalGWT = filteredData.reduce((sum, item) => sum + item.GWT, 0);
        const totalNWT = filteredData.reduce((sum, item) => sum + item.NWT, 0);
        const totalDIACTS = filteredData.reduce((sum, item) => sum + item.DIACTS, 0);
        const totalDIAAMT = filteredData.reduce((sum, item) => sum + item.DIAAMT, 0);

        return {
            totalPieces: totalPieces,
            totalGWT: Number(totalGWT).toFixed(3),
            totalNWT: Number(totalNWT).toFixed(3),
            totalDIACTS: Number(totalDIACTS).toFixed(2),
            totalDIAAMT: Number(totalDIAAMT).toFixed(2),
        };
    };

    const { totalPieces, totalGWT, totalNWT, totalDIACTS, totalDIAAMT } = getTotals();

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
        GWT: Number(item.GWT).toFixed(3),
        NWT: Number(item.NWT).toFixed(3),
        DIACTS: Number(item.DIACTS).toFixed(2),
        DIAAMT: Number(item.DIAAMT).toFixed(2),
    }));

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Dealer Wise Stock Summary</Breadcrumb.Item>
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
                        fileName="DealerWiseStockSummary"
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
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}>Total</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalPieces}</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalGWT}</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalNWT}</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalDIACTS}</Table.Summary.Cell>
                            <Table.Summary.Cell align='right'>{totalDIAAMT}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </div>
        </>
    );
};

export default DealerWiseStockSummary;
