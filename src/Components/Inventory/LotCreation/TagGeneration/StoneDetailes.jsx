import React, { useState } from "react";
import { Row, Col, Typography, Input, Select, Button, Modal, Divider,  } from "antd";

const { Text } = Typography;
const { Option } = Select;

const StoneDetails = () => {
    const [stoneData, ] = useState([]);
    const [modal2Open, setModal2Open] = useState(false);

    return (
        <>
            {/* Row containing the Add Stone Button */}
            <Row justify="center" style={{ marginBottom: "16px" }}>
                <Col>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => setModal2Open(true)}
                        style={{
                            backgroundColor: "#4A90E2",
                            borderColor: "#4A90E2",
                            display: "block",
                            margin: "0 auto",
                        }}
                    >
                        + Stone
                    </Button>
                </Col>
            </Row>

            {/* Modal for Adding Stones */}
            <Modal
                title="Add Stones"
                centered
                width="80%"
                open={modal2Open}
                onOk={() => setModal2Open(false)}
                onCancel={() => setModal2Open(false)}
            >
                <div style={{ padding: "7px" }}>
                    {/* Inputs in a Single Row with Stone Item Dropdown included */}
                    <Row gutter={16} style={{ marginTop: "10px" }} align="middle">
                        {/* Stone Item Dropdown */}
                        <Col span={6}>
                            <Text strong>Stone Item:</Text>
                            <Select
                                defaultValue=""
                                style={{
                                    width: "100%",
                                    backgroundColor: "#F4F7FB",
                                    borderRadius: "8px",
                                    marginTop: "4px",
                                }}
                            >
                                <Option value="Diamond">Diamond</Option>
                                <Option value="Emerald">Emerald</Option>
                                <Option value="Ruby">Ruby</Option>
                            </Select>
                        </Col>

                        {/* Other input fields */}
                        {["Pcs", "Cts", "Grams", "Rate", "Amount", "No. Pcs", "Color", "Cut", "Clarity"].map((label) => (
                            <Col xs={6} sm={4} md={3} lg={2} key={label}>
                                <div style={{ textAlign: "center" }}>
                                    <Text strong>{label}</Text>
                                    <Input
                                        placeholder={label}
                                        style={{
                                            marginTop: "4px",
                                            width: "80%",
                                            backgroundColor: "#F4F7FB",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            </Col>
                        ))}
                    </Row>

                    {/* Custom Table for Stones */}
                    <div style={{ marginTop: "20px" }}>
                        {stoneData?.length > 0 && (
                            <>
                                <Row gutter={16} style={{ fontWeight: "bold", backgroundColor: "#F4F7FB" }}>
                                    {["Stone Item", "Pcs", "Cts", "Grams", "Rate", "Amount", "No. Pcs", "Color", "Cut", "Clarity"].map((colTitle, index) => (
                                        <Col span={2} key={index} style={{ textAlign: "center" }}>
                                            {colTitle}
                                        </Col>
                                    ))}
                                </Row>
                                <Divider />
                            </>
                        )}
                        {stoneData?.map((stone, index) => (
                            <Row gutter={16} key={index}>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.stoneItem}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.pcs}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.cts}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.grams}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.rate}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.amount}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.noPcs}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.color}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.cut}</Col>
                                <Col span={2} style={{ textAlign: "center" }}>{stone.clarity}</Col>
                            </Row>
                        ))}
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default StoneDetails;
