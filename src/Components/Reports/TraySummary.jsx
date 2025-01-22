import React, { useState, useEffect } from 'react';
import { Table, Row, Col, Breadcrumb, Pagination } from 'antd';
import axios from 'axios';
import PdfExcelPrint from '../Utiles/PdfExcelPrint'; // Adjust the import path as necessary
import TableHeaderStyles from '../Pages/TableHeaderStyles';
import { CREATE_jwel } from '../../Config/Config';

const TraySummary = () => {
    const [, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/InventoryReports/GetTraySummary?tray=1&suspennce=NO`)
            .then(response => {
                setData(response.data);
                setFilteredData(response.data);  // Initially no filters, all data is shown
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const columns = [
        {
            title: 'S.No',
            dataIndex: 'sno',
            key: 'sno',
            className: 'blue-background-column', 
            width: 50, 
        },
        { title: 'Tag No', dataIndex: 'TAGNO', key: 'TAGNO' },
        { title: 'Product Name', dataIndex: 'PRODUCTNAME', key: 'PRODUCTNAME' },
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

    const formattedData = filteredData.map((item, index) => ({
        ...item,
        sno: index + 1,
        GWT: formatValue(item.GWT),
        NWT: formatValue(item.NWT),
    }));

    const paginatedData = formattedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <>
            <Row justify="space-between" align="middle">
                <Col>
                    <Breadcrumb style={{ fontSize: '16px', fontWeight: '500', color: '#0C1154' }}>
                        <Breadcrumb.Item>Reports</Breadcrumb.Item>
                        <Breadcrumb.Item>Tray Summary</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <PdfExcelPrint
                        data={formattedData}
                        columns={columns}
                        fileName="TraySummaryReport"
                    />
                </Col>
            </Row>
            <Row gutter={8} style={{ marginBottom: 8 }} align="middle">
                     <Col flex="auto" />
                                <Col>
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={filteredData.length}
                        showSizeChanger
                        pageSizeOptions={['10', '20', '50', '100']}
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            setPageSize(size);
                        }}
                        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                        style={{ marginBottom: "10px" , marginTop: 16, }}
                    />
                    </Col>
            </Row>
            <div style={{ marginTop: 5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <div
                    className="table-responsive scroll-horizontal"
                    style={{
                        // maxHeight: "calc(99vh - 193.33px)",
                        overflowY: "auto",
                        overflowX: "auto",
                        marginTop: "6px",
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                        borderRadius: '8px'
                    }}
                >
                    <TableHeaderStyles>
                        <Table
                            size="small"
                            columns={columns}
                            dataSource={paginatedData}
                            rowKey="TAGNO"
                            pagination={false}
                            rowClassName={() => 'blue-background-row no-hover'} // Apply blue background to all rows in S.No column and remove hover effect
                            summary={() => (
                                <Table.Summary.Row className='tbaletotals'>
                                    <Table.Summary.Cell>Total</Table.Summary.Cell>
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell />
                                    <Table.Summary.Cell align='right'>{totalPCS}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalGWT}</Table.Summary.Cell>
                                    <Table.Summary.Cell align='right'>{totalNWT}</Table.Summary.Cell>
                                </Table.Summary.Row>
                            )}
                        />
                    </TableHeaderStyles>
                </div>
                
            </div>
        </>
    );
};

export default TraySummary;
