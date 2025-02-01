import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Select, Breadcrumb } from "antd";
import ProductDetails from "../TagGeneration/ProductDetailes";
import TagDetailsForm from "./TagDetailesform";
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;

const TagGeneration = () => {
    const [data, setData] = useState([]);
    const [selectedLot, setSelectedLot] = useState(null);
    const lotNoRef = useRef(null);
    const productNameRef = useRef(null);

    useEffect(() => {
        axios.get('http://www.jewelerp.timeserasoftware.in/api/Erp/GetLotCreationList')
            .then(response => {
                const formattedData = response.data.map(item => ({
                    ...item,
                    lotno: item.lotno.toString()
                }));
                setData(formattedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });

        // Set focus to the lotNoRef when the component mounts
        if (lotNoRef.current) {
            lotNoRef.current.focus();
        }
    }, []);

    const handleLotChange = (value) => {
        setSelectedLot(value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default behavior
            const selectedOption = data.find(item => item.lotno === event.target.value);
            if (selectedOption) {
                setSelectedLot(selectedOption.lotno);
                setTimeout(() => {
                    if (productNameRef.current) {
                        productNameRef.current.focus();
                    }
                }, 0);
            }
        }
    };

    const handleSelect = (value) => {
        setSelectedLot(value);
        setTimeout(() => {
            if (productNameRef.current) {
                productNameRef.current.focus();
            }
        }, 0);
    };

    const selectedLotDetails = data.find(item => item.lotno === selectedLot);

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
                                        <Select
                                            ref={lotNoRef}
                                            showSearch
                                            value={selectedLot}
                                            onChange={handleLotChange}
                                            onSelect={handleSelect}
                                            style={{ width: "100%", textAlign: "center" }}
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            onKeyDown={handleKeyDown}
                                            placeholder="Select a lot"
                                        >
                                            {data.map(item => (
                                                <Option key={item.lotno} value={item.lotno}>
                                                    {item.lotno}
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
                                                    fontSize: "12px"
                                                }}
                                            >
                                                M Product:
                                            </Text>
                                            <Text strong style={{ fontSize: "12px" }}>{selectedLotDetails ? selectedLotDetails.mname : ''}</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Dealer:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>{selectedLotDetails ? selectedLotDetails.dealerName : ''}</Text>
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
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Lot Pcs:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>{selectedLotDetails ? selectedLotDetails.pieces : ''}</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Lot Weight:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>{selectedLotDetails ? selectedLotDetails.weight : ''}</Text>
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
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Balance Pcs:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>{selectedLotDetails ? selectedLotDetails.balpieces : ''}</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Balance Weight:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>{selectedLotDetails ? selectedLotDetails.balweight : ''}</Text>
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
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Tag Pcs:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>15</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#8c8c8c",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Tag Weight:
                                            </Text>
                                            <Text style={{ fontSize: "12px" }} strong>12</Text>
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
                <ProductDetails mname={selectedLotDetails ? selectedLotDetails.mname : ''} productNameRef={productNameRef} />
            </div>

            {/* Wastage and Making Charges Section */}
            {/* <div>
                <WastageDetails />
            </div> */}
            {/* tag detailes */}
            <div >
                <TagDetailsForm
                    mname={selectedLotDetails ? selectedLotDetails.mname : ''}
                    counter={selectedLotDetails ? selectedLotDetails.counter : ''}
                    prefix={selectedLotDetails ? selectedLotDetails.prefix : ''}
                    manufacturer={selectedLotDetails ? selectedLotDetails.manufacturer : ''}
                />
            </div>
        </div>
    );
};

export default TagGeneration;
