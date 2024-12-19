import React from "react";
import { Row, Col, Typography, Select } from "antd";
import ProductDetails from "../TagGeneration/ProductDetailes";
import WastageDetails from "../TagGeneration/WastageDetailes";

const { Text } = Typography;
const { Option } = Select;

const TagGeneration = () => {
    return (
        <div>
            {/* Combined Lot No and Main Product Card */}
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={24}>
                    <div
                        style={{
                            borderRadius: "10px",
                            backgroundColor: "#fff",
                            padding: "10px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Row gutter={[16, 16]} align="middle">
                            {/* Lot No Section (Left aligned) */}
                            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 4 }}>
                                <div>
                                    <Text
                                        style={{
                                            color: "#8c8c8c",
                                            display: "block",
                                            marginBottom: "5px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Lot No
                                    </Text>
                                    <div>
                                        <Select defaultValue={0} style={{ width: "100%", textAlign: "center" }}>
                                            {Array.from({ length: 10000 }, (_, i) => (
                                                <Option key={i} value={i}>
                                                    {i}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </div>
                            </Col>

                            {/* Remaining Metrics Section (Right aligned) */}
                            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 17 }} lg={{ span: 19 }} offset={1}>
                                <Row gutter={[16, 16]} justify="end">
                                    {/* Grouped Section: M Product and Dealer */}
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                M Product:
                                            </Text>
                                            <Text strong>Gold</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Dealer:
                                            </Text>
                                            <Text strong>Sravani Reddy</Text>
                                        </div>
                                    </Col>

                                    {/* Grouped Section: Reduced Lot Pcs and Lot Weight */}
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 2, sm: 2, md: 2, lg: 2 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Lot Pcs:
                                            </Text>
                                            <Text strong>12</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Lot Weight:
                                            </Text>
                                            <Text strong>15</Text>
                                        </div>
                                    </Col>

                                    {/* Grouped Section: Reduced Balance Pcs and Balance Weight */}
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Balance Pcs:
                                            </Text>
                                            <Text strong>1255</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Balance Weight:
                                            </Text>
                                            <Text strong>15</Text>
                                        </div>
                                    </Col>

                                    {/* Grouped Section: Tag Pcs and Tag Weight */}
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 4, sm: 4, md: 4, lg: 4 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Tag Pcs:
                                            </Text>
                                            <Text strong>15</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                }}
                                            >
                                                Tag Weight:
                                            </Text>
                                            <Text strong>12</Text>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>

            {/* Product Details */}
            <div>
                <ProductDetails />
            </div>

            {/* Wastage and Making Charges Section */}
            <div>
                <WastageDetails />
            </div>
        </div>
    );
};

export default TagGeneration;
