import React from "react";
import { Row, Col, Typography, Input, Select } from "antd";

const { Option } = Select;
const { Text } = Typography;

const ProductDetails = () => {
  return (
    <div>
      {/* Product Details Section */}
      <div
        style={{
          backgroundColor: "#e6f7ff",  // Light blue background color
          width: "150px",
          borderRadius: "10px",
          marginTop: "5px",
          boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
          padding: "3px", // Padding for better spacing
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "12px", color: "#1890ff" }}>Product Details</div>
      </div>

      <div
        style={{
          borderRadius: "10px",
          padding: "10px",
          marginTop:"5px",

          backgroundColor: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Responsive Layout using Ant Design Grid */}
        <Row gutter={16} justify="start" align="middle">
          {/* Product Name Dropdown */}
          <Col xs={24} sm={8} md={6}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{fontSize:"12px"}}>Product Name</Text>
            </div>
            <Select placeholder="Select a product" style={{ width: "100%" }}>
              <Option value="product1">Product 1</Option>
              <Option value="product2">Product 2</Option>
              <Option value="product3">Product 3</Option>
            </Select>
          </Col>

          {/* PCS */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{fontSize:"12px"}}>PCS</Text>
            </div>
            <Input type="number" placeholder="Enter PCS" style={{ width: "100%" }} />
          </Col>

          {/* GWT */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{fontSize:"12px"}}>G.wt</Text>
            </div>
            <Input type="number" placeholder="Enter GWT" style={{ width: "100%" }} />
          </Col>

          {/* Breads Less Weight */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{fontSize:"12px"}}>Breads Less </Text>
            </div>
            <Input type="number" placeholder="Enter Breads Less Weight" style={{ width: "100%" }} />
          </Col>

          {/* Total Less */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{fontSize:"12px"}}>Weight Less</Text>
            </div>
            <Input type="number" placeholder="Enter Total Less" style={{ width: "100%" }} />
          </Col>

          {/* NWT */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{fontSize:"12px"}}>N.wt</Text>
            </div>
            <Input type="number" placeholder="Enter NWT" style={{ width: "100%" }} />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetails;
