import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select, Upload, message, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from 'axios';
import WastageDetails from "./WastageDetailes";

const { Option } = Select;
const { Text } = Typography;

const ProductDetails = ({ mname, productNameRef }) => {
  const [fileList, setFileList] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [pcs, setPcs] = useState(1);
  const [gwt, setGwt] = useState(0);
  const [breadsLess, setBreadsLess] = useState(0);
  const [totalLess, setTotalLess] = useState(0);
  const [nwt, setNwt] = useState(0);
  const [loading, setLoading] = useState(false);
  const pcsRef = useRef(null);
  const gwtRef = useRef(null);
  const breadsLessRef = useRef(null);
  const totalLessRef = useRef(null);
  const nwtRef = useRef(null);
  const categoryRef = useRef(null);

  // Fetch product data based on mname
  useEffect(() => {
    if (!mname) return;
    setLoading(true);
    const url = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=PRODUCT_MASTER&where=MNAME='${mname}'&order=PRODUCTNAME`;
    axios.get(url)
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
        setLoading(false);
      });
  }, [mname]);

  useEffect(() => {
    setNwt(gwt - (breadsLess + totalLess));
  }, [gwt, breadsLess, totalLess]);

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleSelect = (value) => {
    setCategory(value);
    if (pcsRef.current) {
      pcsRef.current.focus();
    }
  };

  const handleKeyDown = (e, nextRef, prevRef, category) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }

      if (category) {
        setCategory(category);
      }
    } else if (e.key === "ArrowLeft" && prevRef && prevRef.current) {
      prevRef.current.focus();
    }
  };

  const handleProductNameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <>
      <div>
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
              <Spin spinning={loading}>
                <Select
                  ref={productNameRef}
                  placeholder="Select a product"
                  style={{ width: "100%" }}
                  showSearch
                  autoFocus
                  onSelect={handleSelect}
                  onKeyDown={handleProductNameKeyDown}
                >
                  {products.length > 0 ? (
                    products.map(product => (
                      <Option key={product.PRODUCTCODE} value={product.PRODUCTNAME}>
                        {product.PRODUCTNAME}
                      </Option>
                    ))
                  ) : (
                    <Option disabled>No products available</Option>
                  )}
                </Select>
              </Spin>
            </Col>

            {/* PCS */}
            <Col xs={24} sm={4} md={3}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <Text style={{ fontSize: "12px" }}>PCS</Text>
              </div>
              <Input
                ref={pcsRef}
                type="number"
                value={pcs}
                placeholder="Enter PCS"
                style={{ width: "100%" }}
                onChange={(e) => setPcs(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, gwtRef, null)}
              />
            </Col>

            {/* GWT */}
            <Col xs={24} sm={4} md={3}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <Text style={{ fontSize: "12px" }}>G.wt</Text>
              </div>
              <Input
                ref={gwtRef}
                type="number"
                value={gwt === 0 ? '' : gwt}
                placeholder="Enter GWT"
                style={{ width: "100%" }}
                onChange={(e) => setGwt(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, breadsLessRef, pcsRef)}
              />
            </Col>

            {/* Breads Less Weight */}
            <Col xs={24} sm={4} md={3}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <Text style={{ fontSize: "12px" }}>Breads Less </Text>
              </div>
              <Input
                ref={breadsLessRef}
                type="number"
                value={breadsLess === 0 ? '' : breadsLess}
                placeholder="Enter Breads Less Weight"
                style={{ width: "100%" }}
                onChange={(e) => setBreadsLess(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, totalLessRef, gwtRef)}
              />
            </Col>

            {/* Total Less */}
            <Col xs={24} sm={4} md={3}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <Text style={{ fontSize: "12px" }}>Weight Less</Text>
              </div>
              <Input
                ref={totalLessRef}
                type="number"
                value={totalLess === 0 ? '' : totalLess}
                placeholder="Enter Total Less"
                style={{ width: "100%" }}
                onChange={(e) => setTotalLess(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, nwtRef, breadsLessRef)}
              />
            </Col>

            {/* NWT */}
            <Col xs={24} sm={4} md={3}>
              <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <Text style={{ fontSize: "12px" }}>N.wt</Text>
              </div>
              <Input
                ref={nwtRef}
                type="number"
                value={nwt === 0 ? '' : nwt}
                placeholder="Enter NWT"
                style={{ width: "100%" }}
                readOnly
                onKeyDown={(e) => handleKeyDown(e, categoryRef, totalLessRef)}
              />
            </Col>

            {/* Image Upload */}
            <Col xs={24} sm={4} md={3}>
              <div
                style={{
                  borderRadius: "10px",
                  backgroundColor: "#fafafa",
                  padding: "10px",
                  textAlign: "center",
                  width: '80px',
                  height: "80px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    transform: "scale(0.6)",
                    transformOrigin: "top left",
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
                        <PlusOutlined style={{ fontSize: '14px' }} />
                        <div style={{ marginTop: 8, fontSize: '14px' }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <WastageDetails categoryRef={categoryRef} />
    </>
  );
};

export default ProductDetails;
