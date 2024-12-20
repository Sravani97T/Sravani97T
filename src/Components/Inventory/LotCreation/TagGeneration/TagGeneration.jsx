import React from "react";
import { Row, Col, Typography, Select,    Breadcrumb,
} from "antd";
import ProductDetails from "../TagGeneration/ProductDetailes";
import WastageDetails from "../TagGeneration/WastageDetailes";
import TagDetailsForm from "./TagDetailesform";

const { Text } = Typography;
const { Option } = Select;

const TagGeneration = () => {
    return (
        <div>
              <Row justify="start" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Tag Generation</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>
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
                                                    fontSize:"12px"
                                                }}
                                            >
                                                M Product:
                                            </Text>
                                            <Text strong style={{fontSize:"12px"}}>Gold</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Dealer:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>Sravani Reddy</Text>
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
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Lot Pcs:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>12</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Lot Weight:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>15</Text>
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
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Balance Pcs:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>1255</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Balance Weight:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>15</Text>
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
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Tag Pcs:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>15</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize:"12px"
                                                }}
                                            >
                                                Tag Weight:
                                            </Text>
                                            <Text style={{fontSize:"12px"}} strong>12</Text>
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
            {/* tag detailes */}
            <div >
                <TagDetailsForm/>
            </div>
        </div>
    );
};

export default TagGeneration;
