import React, { useState } from "react";
import { Row, Col, Typography, Input, Select, Button, Modal, Table, Card } from "antd";

const { Text } = Typography;
const { Option } = Select;

const StoneDetails = () => {
    const [modal2Open, setModal2Open] = useState(false);

    // Static data for stone details
    const stoneData = [
        { key: "1", stoneItem: "Diamond", pcs: 10, cts: 2.5, grams: 1.2, rate: 500, amount: 500 * 10, noPcs: 10, color: "White", cut: "Round", clarity: "VS1" },
        { key: "2", stoneItem: "Emerald", pcs: 8, cts: 1.8, grams: 1.0, rate: 450, amount: 450 * 8, noPcs: 8, color: "Green", cut: "Oval", clarity: "SI1" },
        { key: "3", stoneItem: "Ruby", pcs: 12, cts: 3.0, grams: 1.5, rate: 600, amount: 600 * 12, noPcs: 12, color: "Red", cut: "Cushion", clarity: "VVS" },
    ];

    // Calculate totals
    const totalPcs = stoneData.reduce((sum, item) => sum + item.pcs, 0);
    const totalCts = stoneData.reduce((sum, item) => sum + item.cts, 0);
    const totalGrams = stoneData.reduce((sum, item) => sum + item.grams, 0);
    const totalAmount = stoneData.reduce((sum, item) => sum + item.amount, 0);

    // Define columns for the table
    const columns = [
        { title: "S. No", key: "sno", align: "center", render: (_, __, index) => index + 1 },
        { title: "Stone Item", dataIndex: "stoneItem", key: "stoneItem", align: "center" },
        { title: "Pcs", dataIndex: "pcs", key: "pcs", align: "center" },
        { title: "Cts", dataIndex: "cts", key: "cts", align: "center" },
        { title: "Grams", dataIndex: "grams", key: "grams", align: "center" },
        { title: "Rate", dataIndex: "rate", key: "rate", align: "center" },
        { title: "Amount", dataIndex: "amount", key: "amount", align: "center" },
        { title: "No. Pcs", dataIndex: "noPcs", key: "noPcs", align: "center" },
        { title: "Color", dataIndex: "color", key: "color", align: "center" },
        { title: "Cut", dataIndex: "cut", key: "cut", align: "center" },
        { title: "Clarity", dataIndex: "clarity", key: "clarity", align: "center" },
    ];

    return (
        <>
            <Row justify="center" style={{ marginBottom: "16px" }}>
                <Col>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => setModal2Open(true)}
                        style={{
                            backgroundColor: "#4A90E2",
                            borderColor: "#4A90E2",
                        }}
                    >
                        + Stone
                    </Button>
                </Col>
            </Row>

            <Modal
                title="Add Stones"
                centered
                width="80%"
                open={modal2Open}
                onOk={() => setModal2Open(false)}
                onCancel={() => setModal2Open(false)}
                bodyStyle={{ overflowX: "auto" }} // Ensure content scrolls horizontally if needed
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
        <Text>Stone Item</Text>
        <Select placeholder="Select Item" style={{ width: "100%", marginTop: "4px" }}>
            <Option value="Diamond">Diamond</Option>
            <Option value="Emerald">Emerald</Option>
            <Option value="Ruby">Ruby</Option>
        </Select>
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Clarity</Text>
        <Input placeholder="Enter Clarity" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Color</Text>
        <Input placeholder="Enter Color" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Cut</Text>
        <Input placeholder="Enter Cut" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>No. Pcs</Text>
        <Input placeholder="Enter No. Pcs" style={{ marginTop: "4px" }} />
    </Col>
</Row>
<Row gutter={[8, 8]}>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Pcs</Text>
        <Input placeholder="Enter Pcs" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Cts</Text>
        <Input placeholder="Enter Cts" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Grams</Text>
        <Input placeholder="Enter Grams" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Rate</Text>
        <Input placeholder="Enter Rate" style={{ marginTop: "4px" }} />
    </Col>
    <Col xs={24} sm={12} md={6} lg={4}>
        <Text>Amount</Text>
        <Input placeholder="Enter Amount" style={{ marginTop: "4px" }} />
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
                            <Table.Summary.Cell index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>Total Pcs: {totalPcs}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>Total Cts: {totalCts.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>Total Grams: {totalGrams.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4}></Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>Total Amt: {totalAmount.toFixed(2)}</Table.Summary.Cell>
                            <Table.Summary.Cell index={6} colSpan={4}></Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
                />
            </Modal>
        </>
    );
};

export default StoneDetails;
