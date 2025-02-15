import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from 'axios';
import WastageDetails from "./WastageDetailes";

const { Option } = Select;
const { Text } = Typography;

const ProductDetails = ({ updateTotals, mname, productNameRef, lotno, counter, prefix, manufacturer, dealername, tagInfo, feachTagno }) => {
  const [fileList, setFileList] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [pcs, setPcs] = useState(1);
  const [gwt, setGwt] = useState(0);
  const [breadsLess, setBreadsLess] = useState(0);
  const [totalLess, setTotalLess] = useState(() => {
    return parseFloat(localStorage.getItem("finalTotalGrams")) || 0;
  }); 
   const [nwt, setNwt] = useState(0);
  const pcsRef = useRef(null);
  const gwtRef = useRef(null);
  const breadsLessRef = useRef(null);
  const totalLessRef = useRef(null);
  const nwtRef = useRef(null);
  const categoryRef = useRef(null);
  const focusProductName = () => {
    if (productNameRef.current) {
      productNameRef.current.focus();
    }
  };
  // Fetch product data based on mname
  useEffect(() => {
    if (!mname) return;
    const url = `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=PRODUCT_MASTER&where=MNAME='${mname}'&order=PRODUCTNAME`;
    axios.get(url)
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching product data:', error);
      });
  }, [mname]);

  useEffect(() => {
    // setNwt(gwt - (breadsLess + totalLess));
    const finalTotalGramValue = (localStorage.getItem('finalTotalGrams') || "");
    setTotalLess(finalTotalGramValue);
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

  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductCode, setSelectedProductCode] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('');
  const [selectedProductHSNCode, setSelectedProductHSNCode] = useState('');

  const handleSelect = (value, option) => {
    setSelectedProduct(value);
    setSelectedProductCode(option.key);
    setSelectedProductCategory(option.category);
    setSelectedProductHSNCode(option.hsncode); // Set HSN code
    if (pcsRef.current) {
      pcsRef.current.focus();
    }
  };

  const handleProductNameKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      const options = products.map(product => product.PRODUCTNAME);
      const currentIndex = options.indexOf(selectedProduct);
      let newIndex = currentIndex;

      if (e.key === "ArrowDown") {
        newIndex = (currentIndex + 1) % options.length;
      } else if (e.key === "ArrowUp") {
        newIndex = (currentIndex - 1 + options.length) % options.length;
      }

      const newSelectedProduct = options[newIndex];
      setSelectedProduct(newSelectedProduct);
    }
  };
 
  const prevTotalLessRef = useRef(totalLess); // Store previous value
  
  useEffect(() => {
    const updateTotalLess = () => {
      const storedTotalGrams = parseFloat(localStorage.getItem("finalTotalGrams")) || 0;
  
      if (prevTotalLessRef.current !== storedTotalGrams) {
        prevTotalLessRef.current = storedTotalGrams;
        setTotalLess(storedTotalGrams);
      }
    };
  
    // Initial load
    updateTotalLess();
  
    // Listen for localStorage changes across tabs/windows
    window.addEventListener("storage", updateTotalLess);
  
    // Periodically check for changes in the same tab
    const interval = setInterval(updateTotalLess, 500); // Check every 500ms
  
    return () => {
      window.removeEventListener("storage", updateTotalLess);
      clearInterval(interval);
    };
  }, []);
  
useEffect(() => {
  // Calculate NWT correctly whenever GWT, Breads Less, or Weight Less changes
  const calculateNwt = () => {
    const breadsLessValue = parseFloat(breadsLess) || 0;
    const totalLessValue = parseFloat(totalLess) || 0;
    const gwtValue = parseFloat(gwt) || 0;

    const calculatedNwt = gwtValue - (breadsLessValue + totalLessValue);

    // Update NWT only if the new value is different
    setNwt((prevNwt) => (prevNwt !== calculatedNwt ? calculatedNwt : prevNwt));
  };

  calculateNwt();
}, [gwt, breadsLess, totalLess]); // Runs whenever these values change

  
  return (
    <>
      <div>
        <div
          style={{
            width: "150px",
            borderRadius: "10px",
            marginTop: "5px",
            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
            padding: "6px",
            textAlign: "center",
          }}
          className="bgcolur"
        >
          <div style={{ fontSize: "13px", color: "#fff" }}>Product Details</div>
        </div>


        <Row gutter={16} justify="start" align="top">
          {/* First Section - Product Details */}
          <Col xs={24} sm={20} md={20}>
            <div
              style={{
                borderRadius: "10px",
                padding: "10px",
                marginTop: "5px",
                backgroundColor: "#d9d6d6",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Row gutter={16} justify="start" align="middle">
                {/* Product Name */}
                <Col xs={24} sm={10} md={8}>
                  <div style={{ textAlign: "center", marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px" }}>Product Name</Text>
                  </div>
                  <Select
                    ref={productNameRef}
                    placeholder="Select a product"
                    style={{ width: "100%" }}
                    showSearch
                    autoFocus
                    value={selectedProduct || undefined}
                    onSelect={handleSelect}
                onKeyDown={handleProductNameKeyDown}
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <style jsx>{`
                      .ant-select-item-option-active {
                        background-color: rgb(125, 248, 156) !important;
                      }
                    `}</style>
                  </div>
                )}
                  >
                    {products.length > 0 ? (
                  products.map(product => (
                    <Option key={product.PRODUCTCODE} value={product.PRODUCTNAME} category={product.PRODUCTCATEGORY} hsncode={product.HSNCODE}>
                          {product.PRODUCTNAME}
                        </Option>
                      ))
                    ) : (
                      <Option disabled>No products available</Option>
                    )}
                  </Select>
                </Col>

                        <Col xs={24} sm={3} md={2}>
                          <div style={{ textAlign: "center", marginBottom: "8px" }}>
                          <Text style={{ fontSize: "12px" }}>PCS</Text>
                          </div>
                          <Input
                          ref={pcsRef}
                          type="number"
                          value={pcs}
                          placeholder="Enter PCS"
                          style={{ width: "100%", textAlign: "right" }}
                          onChange={(e) => setPcs(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, gwtRef, null)}
                          />
                        </Col>

                        <Col xs={24} sm={5} md={4}>
                          <div style={{ textAlign: "center", marginBottom: "8px" }}>
                          <Text style={{ fontSize: "12px" }}>G.wt</Text>
                          </div>
                          <Input
                          ref={gwtRef}
                          type="number"
                          value={gwt === 0 ? '' : gwt}
                          placeholder="Enter GWT"
                          style={{ width: "100%", textAlign: "right" }}
                          onChange={(e) => setGwt(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, breadsLessRef, pcsRef)}
                          />
                        </Col>

                        <Col xs={24} sm={4} md={3}>
                          <div style={{ textAlign: "center", marginBottom: "8px" }}>
                          <Text style={{ fontSize: "12px" }}>Breads Less</Text>
                          </div>
                          <Input
                          ref={breadsLessRef}
                          type="number"
                          value={breadsLess === 0 ? "" : breadsLess}
                          placeholder="Enter Breads Less"
                          style={{ width: "100%", textAlign: "right" }}
                          onChange={(e) => setBreadsLess(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, totalLessRef, gwtRef)}
                          />
                        </Col>

                        <Col xs={24} sm={4} md={3}>
                          <div style={{ textAlign: "center", marginBottom: "8px" }}>
                          <Text style={{ fontSize: "12px" }}>Weight Less</Text>
                          </div>
                          <Input
                          ref={totalLessRef}
                          type="number"
                          value={totalLess}
                          placeholder="Enter Total Less"
                          style={{ width: "100%", textAlign: "right" }}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setTotalLess(newValue);
                            localStorage.setItem("finalTotalGrams", newValue);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, nwtRef, breadsLessRef)}
                          />
                        </Col>

                        <Col xs={24} sm={5} md={4}>
                          <div style={{ textAlign: "center", marginBottom: "8px" }}>
                            <Text style={{ fontSize: "12px" }}>N.wt</Text>
                          </div>
                          <Input
                            ref={nwtRef}
                            type="number"
                            value={nwt} // Show 3 decimal places
                            placeholder="Enter NWT"
                            style={{ width: "100%", textAlign: "right" }}
                            readOnly
                            onKeyDown={(e) => handleKeyDown(e, categoryRef, totalLessRef)}
                          />
                        </Col>
                        </Row>
                        </div>
                        </Col>

                        <Col xs={24} sm={4} md={4}>

                        <div
                          style={{
                          borderRadius: "10px",
                          marginTop: "5px",
                          marginBottom: "5px",
                          boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                          textAlign: "center",
                          backgroundColor: "#71769b", // Background color added
                  padding: "5px",
                  display: "flex", // Centering content
                  alignItems: "center",
                  justifyContent: "center",
                  }}
                  className="bgcolurimg"
                >
                  <Upload
                  action="/upload"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  style={{ width: "100px", height: "100px" }} // Decreased size
                  disabled={!lotno || !selectedProduct || gwt === 0 || pcs === 0} // Disable upload if conditions are not met
                  >
                  {fileList.length < 1 && (
                    <div style={{ textAlign: "center" }}>
                    <PlusOutlined style={{ fontSize: "12px", color: "#fff" }} /> {/* Smaller icon */}
                    <div style={{ marginTop: 5, fontSize: "12px", color: "#fff" }}>Upload Image</div> {/* Smaller text */}
                    </div>
                  )}
                  </Upload>

                </div>


                </Col>
              </Row>
              </div>

              <WastageDetails
              focusProductName={focusProductName}
              updateTotals={updateTotals}
              feachTagno={feachTagno}
              tagInfo={tagInfo}
              setGwt={setGwt}
              setBreadsLess={setBreadsLess}
              setTotalLess={setTotalLess}
              setNwt={setNwt}
              pcsRef={pcsRef}
              gwtRef={gwtRef}
              breadsLessRef={breadsLessRef}
              totalLessRef={totalLessRef}
              nwtRef={nwtRef}
              setPcs={setPcs}
              setSelectedProduct={setSelectedProduct}
              categoryRef={categoryRef}
              nwt={nwt}
              lotno={lotno}
              counter={counter}
              prefix={prefix}
              manufacturer={manufacturer}
              dealername={dealername}
              mname={mname}
              productname={selectedProduct}
              productcode={selectedProductCode}
              productcategory={selectedProductCategory}
              hsncode={selectedProductHSNCode} // Pass HSN code to WastageDetails
        gwt={gwt}
        bswt={breadsLess}
        aswt={totalLess}
        pieces={pcs} // Pass pieces to WastageDetails
      />
    </>
  );
};

export default ProductDetails;
