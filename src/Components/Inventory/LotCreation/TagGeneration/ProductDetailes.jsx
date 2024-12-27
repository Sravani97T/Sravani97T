import React, { useState } from "react";
import { Row, Col, Typography, Input, Select, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Text } = Typography;

const ProductDetails = () => {
  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  return (
    <div>
      {/* Product Details Section */}
      <div
        style={{
          backgroundColor: "#e6f7ff",
          width: "150px",
          borderRadius: "10px",
          marginTop: "5px",
          boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
          padding: "3px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "12px", color: "#1890ff" }}>Product Details</div>
      </div>

      <div
        style={{
          borderRadius: "10px",
          padding: "10px",
          marginTop: "5px",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Row gutter={16} justify="start" align="middle">
          {/* Product Name Dropdown */}
          <Col xs={24} sm={8} md={6}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px" }}>Product Name</Text>
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
              <Text style={{ fontSize: "12px" }}>PCS</Text>
            </div>
            <Input type="number" placeholder="Enter PCS" style={{ width: "100%" }} />
          </Col>

          {/* GWT */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px" }}>G.wt</Text>
            </div>
            <Input type="number" placeholder="Enter GWT" style={{ width: "100%" }} />
          </Col>

          {/* Breads Less Weight */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px" }}>Breads Less </Text>
            </div>
            <Input type="number" placeholder="Enter Breads Less Weight" style={{ width: "100%" }} />
          </Col>

          {/* Total Less */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px" }}>Weight Less</Text>
            </div>
            <Input type="number" placeholder="Enter Total Less" style={{ width: "100%" }} />
          </Col>

          {/* NWT */}
          <Col xs={24} sm={4} md={3}>
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
              <Text style={{ fontSize: "12px" }}>N.wt</Text>
            </div>
            <Input type="number" placeholder="Enter NWT" style={{ width: "100%" }} />
          </Col>

          {/* Image Upload */}
          <Col xs={24} sm={4} md={3}>
            <div
              style={{
                borderRadius: "10px",
                backgroundColor: "#fafafa",
                padding: "10px",
                textAlign: "center",
                width:'80px',
                height:"80px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
               <div
              style={{
                display: "inline-block",
                transform: "scale(0.6)", // Scale down to 80% of its original size
                transformOrigin: "top left", // Anchor the scaling to the top-left corner
              }}
            >
              <Upload
                action="/upload"
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                maxCount={1}
               
              >
                
                {fileList.length < 1 && (
                  <div>
                    <PlusOutlined style={{fontSize:'14px'}}/>
                    <div style={{ marginTop: 8 ,fontSize:'14px'}}>Upload</div>
                  </div>
                )}
              </Upload>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductDetails;
