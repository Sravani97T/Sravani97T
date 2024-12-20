import React, { useState } from "react";
import { Row, Col, Typography, Input, Select, Button, Modal, Table, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;

const StoneDetails = () => {
    const [modal2Open, setModal2Open] = useState(false);

    // Static data for stone details
    const stoneData = [
        { key: "1", stoneItem: "Diamond", pcs: 10, cts: 2.5, grams: 1.2, rate: 500, amount: 500 * 10, noPcs: 10, color: "White", cut: "Round", clarity: "VS1" },
        { key: "2", stoneItem: "Emerald", pcs: 8, cts: 1.8, grams: 1.0, rate: 450, amount: 450 * 8, noPcs: 8, color: "Green", cut: "Oval", clarity: "SI1" },
        { key: "3", stoneItem: "Ruby", pcs: 12, cts: 3.0, grams: 1.5, rate: 600, amount: 600 * 12, noPcs: 12, color: "Red", cut: "Cushion", clarity: "VVS" },
        { key: "4", stoneItem: "Ruby", pcs: 12, cts: 3.0, grams: 1.5, rate: 600, amount: 600 * 12, noPcs: 12, color: "Red", cut: "Cushion", clarity: "VVS" },

        { key: "5", stoneItem: "Ruby", pcs: 12, cts: 3.0, grams: 1.5, rate: 600, amount: 600 * 12, noPcs: 12, color: "Red", cut: "Cushion", clarity: "VVS" },

        { key: "6", stoneItem: "Ruby", pcs: 12, cts: 3.0, grams: 1.5, rate: 600, amount: 600 * 12, noPcs: 12, color: "Red", cut: "Cushion", clarity: "VVS" },

    ];

    // Calculate totals
    const totalPcs = stoneData.reduce((sum, item) => sum + item.pcs, 0);
    const totalCts = stoneData.reduce((sum, item) => sum + item.cts, 0);
    const totalGrams = stoneData.reduce((sum, item) => sum + item.grams, 0);
    const totalAmount = stoneData.reduce((sum, item) => sum + item.amount, 0);

    // Define columns for the table
    const columns = [
        { title: <span style={{ fontSize: "14px" }}>S. No</span>, key: "sno", align: "center", render: (_, __, index) => <span style={{ fontSize: "12px" }}>{index + 1}</span> },
        { title: <span style={{ fontSize: "14px" }}>Stone Item </span>, dataIndex: "stoneItem", key: "stoneItem", align: "left", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Pcs </span>, dataIndex: "pcs", key: "pcs", align: "right", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Cts </span>, dataIndex: "cts", key: "cts", align: "right", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Grams </span>, dataIndex: "grams", key: "grams", align: "right", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Rate</span>, dataIndex: "rate", key: "rate", align: "right", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Amount</span>, dataIndex: "amount", key: "amount", align: "right", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>No. Pcs</span>, dataIndex: "noPcs", key: "noPcs", align: "center", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Color</span>, dataIndex: "color", key: "color", align: "center", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Cut</span>, dataIndex: "cut", key: "cut", align: "center", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
        { title: <span style={{ fontSize: "14px" }}>Clarity</span>, dataIndex: "clarity", key: "clarity", align: "center", render: (text) => <span style={{ fontSize: "12px" }}>{text}</span> },
    ];

    return (
        <>
            <Row justify="center" style={{ marginBottom: "16px" }}>
                <Col xs={24}> {/* Make the Col take full width at all breakpoints */}
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => setModal2Open(true)}
                        style={{
                            backgroundColor: "#4A90E2",
                            borderColor: "#4A90E2",
                            width: '100%', // Make the button full width
                        }}
                    >
                        <PlusOutlined/> Stones
                    </Button>
                </Col>
            </Row>


            <Modal
                title={<span style={{ fontSize: '14px', fontWeight: 'bold' }}>Add Stones</span>} centered
                width="80%"
                open={modal2Open}
                onOk={() => setModal2Open(false)}
                onCancel={() => setModal2Open(false)}
            >
                <Card
                    bordered={false}
                    style={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "8px",
                    }}
                >
                    <Row gutter={[8, 8]}>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Stone Item</Text>
                            <Select placeholder="Select Item" style={{ width: "100%", marginTop: "4px" }}>
                                <Option value="Diamond">Diamond</Option>
                                <Option value="Ruby">Ruby</Option>
                            </Select>
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Pcs</Text>
                            <Input placeholder="Enter Pcs" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Cts</Text>
                            <Input placeholder="Enter Cts" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Grams</Text>
                            <Input placeholder="Enter Grams" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Rate</Text>
                            <Input placeholder="Enter Rate" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>

                    </Row>
                    <Row gutter={[8, 8]}>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Amount</Text>
                            <Input placeholder="Enter Amount" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>No. Pcs</Text>
                            <Input placeholder="Enter No. Pcs" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Color</Text>
                            <Input placeholder="Enter Color" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Cut</Text>
                            <Input placeholder="Enter Cut" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>
                        <Col xs={24} sm={12} md={6} lg={4}>
                            <Text style={{ fontSize: "12px" }}>Clarity</Text>
                            <Input placeholder="Enter Clarity" style={{ marginTop: "4px", fontSize: "12px" }} />
                        </Col>


                    </Row>


                </Card>

                <Table
                    columns={columns}
                    dataSource={stoneData}
                    size="small"
                    pagination={{ pageSize: 7 }}
                    scroll={{ x: true }} // Enable horizontal scrolling
                    summary={() => (
                        <Table.Summary.Row style={{ backgroundColor: "lightgrey", fontWeight: "normal" }}>
                            {/* Add a common label "Total" under S.No */}
                            <Table.Summary.Cell index={0} colSpan={2} style={{ fontWeight: "bold", textAlign: "center" }}>
                                Total
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} align="right" style={{ fontSize: "12px" }}>{totalPcs}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3} align="right" style={{ fontSize: "12px" }}>{totalCts.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4} align="right" style={{ fontSize: "12px" }}>{totalGrams.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={5} align="right" style={{ fontSize: "12px" }}></Table.Summary.Cell> {/* Clarity column (optional: leave blank) */}
                            <Table.Summary.Cell index={6} align="right" style={{ fontSize: "12px" }}>{totalAmount.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={7} colSpan={4} align="right"></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />


            </Modal>
        </>
    );
};

export default StoneDetails;
