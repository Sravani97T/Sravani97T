import React from "react";
import { Card, Row, Col, Typography, Input, InputNumber, Table } from "antd";

const { Text } = Typography;

const TagGeneration = () => {
    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Description", dataIndex: "description", key: "description" },
        { title: "Quantity", dataIndex: "quantity", key: "quantity" },
        { title: "Weight", dataIndex: "weight", key: "weight" },
    ];

    const data = [
        { id: 1, description: "Product A", quantity: 50, weight: "100kg" },
        { id: 2, description: "Product B", quantity: 30, weight: "60kg" },
    ];

    return (
        <div >
            {/* Combined Lot No and Main Product Card */}
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card style={{
                        borderRadius: "10px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", /* Adding soft shadow */
                    }}>
                        <Row gutter={16} align="middle">
                            {/* Lot No */}
                            <Col span={3}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    alignItems: "center",
                                    textAlign: "center",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Lot No:</Text>
                                    <InputNumber min={0} max={9999} style={{ width: "50px" }} />
                                </div>
                            </Col>

                            {/* Main Product */}
                            <Col span={4}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Main product:</Text>
                                    <Text strong>Gold</Text>
                                </div>
                            </Col>

                            {/* Lot Pieces */}
                            <Col span={3}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Lot Pieces:</Text>
                                    <Text strong>12</Text>
                                </div>
                            </Col>

                            {/* Weight */}
                            <Col span={3}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Weight:</Text>
                                    <Text strong>15</Text>
                                </div>
                            </Col>

                            {/* Bal Weight */}
                            <Col span={3}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Bal Weight:</Text>
                                    <Text strong>15</Text>
                                </div>
                            </Col>

                            {/* Bal Pieces */}
                            <Col span={3}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Bal Pieces:</Text>
                                    <Text strong>1255</Text>
                                </div>
                            </Col>

                            {/* Dealer */}
                            <Col span={5}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#F5F5F5", /* Light Grey */
                                    padding: "8px",
                                    borderRadius: "5px",
                                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)", /* Subtle shadow */
                                }}>
                                    <Text style={{ display: "block", color: "#8c8c8c" }}>Dealer:</Text>
                                    <Text strong>Sravaniiiiiiiiiiiiiiiiiiiii</Text>
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>





            {/* Product Details */}
            <Card
                style={{
                    marginTop: "8px",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ padding: "7px" }}> {/* Reduced padding */}
                    <div style={{fontSize:"16px",fontWeight:"600",}}>Product Detailes</div>
                    <Row gutter={16}>
                        {/* Product Name and Input */}
                        <Col span={12}>
                            <Row align="middle" gutter={8}>
                                <Col span={5}>
                                    <Text strong>Product Name :</Text>
                                </Col>
                                <Col span={12}>
                                    <Input placeholder="Enter Product Name" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Four Cards Below Product Name */}
                    <Row gutter={16} style={{ marginTop: "10px" }}> {/* Reduced margin-top */}
                        {/* Pieces */}
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <div
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    padding:"7px",
                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#F4F7FB", // Light background color
                                }}
                            >
                                <Row align="middle" gutter={8}>
                                    <Col span={12}>
                                        <Text strong>Pieces</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Pieces" style={{ marginTop: "4px" }} /> {/* Reduced marginTop */}
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        {/* GWT */}
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <div
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    padding:"7px",

                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#F4F7FB", // Light background color
                                }}
                            >
                                <Row align="middle" gutter={8}>
                                    <Col span={12}>
                                        <Text strong>GWT</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Gross Weight" style={{ marginTop: "4px" }} /> {/* Reduced marginTop */}
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        {/* Bead Less */}
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <div
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    padding:"7px",

                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#F4F7FB", // Light background color
                                }}
                            >
                                <Row align="middle" gutter={8}>
                                    <Col span={12}>
                                        <Text strong>Bead Less</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Bead Less" style={{ marginTop: "4px" }} /> {/* Reduced marginTop */}
                                    </Col>
                                </Row>
                            </div>
                        </Col>

                        {/* Less */}
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <div
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    padding:"7px",

                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#F4F7FB", // Light background color
                                }}
                            >
                                <Row align="middle" gutter={8}>
                                    <Col span={12}>
                                        <Text strong>Less</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Less" style={{ marginTop: "4px" }} /> {/* Reduced marginTop */}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col xs={12} sm={8} md={6} lg={4}>
                            <div
                                hoverable
                                style={{
                                    textAlign: "center",
                                    borderRadius: "10px",
                                    padding:"7px",

                                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#F4F7FB", // Light background color
                                }}
                            >
                                <Row align="middle" gutter={8}>
                                    <Col span={12}>
                                        <Text strong>Less</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Input placeholder="Less" style={{ marginTop: "4px" }} /> {/* Reduced marginTop */}
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>



            {/* Summary Table */}
            <Card title="Summary Table" style={{ marginTop: "20px", borderRadius: "10px" }}>
                <Table dataSource={data} columns={columns} pagination={false} />
            </Card>
        </div>
    );
};

export default TagGeneration;
