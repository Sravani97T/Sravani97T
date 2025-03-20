import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Select, Breadcrumb, Button, Form } from "antd";
import ProductDetails from "../TagGeneration/ProductDetailes";
import axios from 'axios';
import { RetweetOutlined } from "@ant-design/icons";
import { CREATE_jwel } from "../../../../Config/Config";

const { Text } = Typography;
const { Option } = Select;

const TagGeneration = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [selectedLot, setSelectedLot] = useState(null);
    const [productMasterList, setProductMasterList] = useState([]);
    const [totalGwt, setTotalGwt] = useState(0);
    const [, setTotalNwt] = useState(0);
    const [totalPieces, setTotalPieces] = useState(0);
    const [resetTrigger, setResetTrigger] = useState(false);
    const updateTotals = (gwt, nwt, pieces) => {
        setTotalGwt(gwt);
        setTotalNwt(nwt);
        setTotalPieces(pieces);
    };

    const lotNoRef = useRef(null);
    const productNameRef = useRef(null);
    useEffect(() => {
        axios.get('${CREATE_jwel}/api/Erp/GetLotCreationList')
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
    const [tagInfo, setTagInfo] = useState({ maxTagNo: null, barcodePrefix: "" });
    const feachTagno = (lotNo) => {
        const selectedLotDetails = data.find(item => item.lotno === lotNo);
        if (!selectedLotDetails) return;

        const mname = selectedLotDetails.mname;
        axios.get(`${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTableWithOrder?tableName=TAG_GENERATION&column=TAGNO&where=MNAME%3D%27${mname}%27`)
            .then(response => {
                const maxNumber = response.data[0]?.Column1 || "00";
                const numberStr = maxNumber.toString();
                const remainingPartNumber = parseInt(numberStr.slice(1), 10) || 0;

                setTagInfo(prevState => ({
                    ...prevState,
                    maxTagNo: remainingPartNumber + 1,
                }));

                console.log("New Max Tag Number:", remainingPartNumber + 1);
            })
            .catch(error => console.error("Failed to fetch max tag number:", error));
    };

    useEffect(() => {
        if (selectedLot) {
            feachTagno(selectedLot); // Fetch new max tag number when lot changes
        }
    }, [selectedLot]); // Runs every time selectedLot changes

    // useEffect(() => {
    //     feachTagno();
    // }, []);



    console.log("productMasterList", productMasterList)
    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/Master/MasterMainProductList`)
            .then(response => {
                setProductMasterList(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch product master list', error);
            });
    }, []);

    const selectedLotDetails = data.find(item => item.lotno === selectedLot);
    useEffect(() => {
        if (selectedLotDetails) {
            const matchedProduct = productMasterList.find(product => product.MNAME === selectedLotDetails.mname);
            if (matchedProduct) {
                setTagInfo(prevState => ({
                    ...prevState,
                    barcodePrefix: matchedProduct.BarcodePrefix
                }));

                console.log("Barcode Prefix:", matchedProduct.BarcodePrefix);
            }
        }
    }, [selectedLotDetails, productMasterList]);

    const handleLotChange = (value) => {
        setSelectedLot(value);
        setTagInfo({ maxTagNo: null, barcodePrefix: "" }); // Reset tag info
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


    return (
        <div>
            <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Tag Generation</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Col>
                    <Button
                        shape="circle"
                        type="primary"
                        icon={<RetweetOutlined className="rotating-icon" style={{ fontSize: "12px" }} />}
                        style={{
                            backgroundColor: "#fff", // Light blue
                            // borderColor: "#ADD8E6",
                            color: "orange",
                        }}
                        onClick={() => {
                            form.resetFields();
                            setSelectedLot(null);
                            setTagInfo({ maxTagNo: null, barcodePrefix: "" });
                            setTotalGwt(0);
                            setTotalNwt(0);
                            setTotalPieces(0);

                            // Trigger reset for ProductDetails
                            setResetTrigger(true);
                            localStorage.removeItem("finalTotalGrams");

                            // Reset focus to Lot No input
                            setTimeout(() => {
                                if (lotNoRef.current) {
                                    lotNoRef.current.focus();
                                }
                            }, 0);
                        }}
                    />
                </Col>

            </Row>
            {/* Combined Lot No and Main Product Card */}
            <Row gutter={[16, 16]} justify="space-between">
                <Col span={24}>
                    <div
                        style={{
                            borderRadius: "10px",
                            backgroundColor: "#040e56f7",
                            padding: "6px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Row gutter={[16, 16]} align="middle">
                            {/* Lot No Section (Left aligned) */}
                            <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 4 }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",

                                    borderRadius: "8px",
                                    width: "fit-content",
                                    marginLeft: "35px"
                                }}>
                                    {/* Label */}
                                    <Text
                                        style={{
                                            color: "#ede6e6",
                                            marginRight: "15px",
                                            whiteSpace: "nowrap"
                                        }}
                                    >
                                        Lot No
                                    </Text>

                                    {/* Select Input */}
                                    <Select
                                        ref={lotNoRef}
                                        showSearch
                                        value={selectedLot}
                                        onChange={handleLotChange}

                                        onSelect={handleSelect}
                                        style={{
                                            width: "170px",
                                            height: "43px",
                                            textAlign: "center",
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().includes(input.toLowerCase())
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="Lot No"
                                    >
                                        {data.map(item => (
                                            <Option key={item.lotno} value={item.lotno}>
                                                {item.lotno}
                                            </Option>
                                        ))}
                                    </Select>

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
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                M Product:
                                            </Text>
                                            <Text strong style={{ fontSize: "12px", color: "#ede6e6" }}>{selectedLotDetails ? selectedLotDetails.mname : ''}</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Dealer:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>{selectedLotDetails ? selectedLotDetails.dealerName : ''}</Text>
                                        </div>
                                    </Col>

                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 2, sm: 2, md: 2, lg: 2 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Lot Pcs:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>{selectedLotDetails ? selectedLotDetails.pieces : ''}</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Lot Weight:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>{selectedLotDetails ? selectedLotDetails.weight.toFixed(3) : ''}</Text>
                                        </div>
                                    </Col>



                                    {/* Grouped Section: Tag Pcs and Tag Weight */}
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 4, sm: 4, md: 4, lg: 4 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Tag Pcs:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>{totalPieces}</Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Tag Weight:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>{totalGwt}</Text>
                                        </div>
                                    </Col>
                                    <Col xs={{ span: 24 }} sm={{ span: 12 }} md={{ span: 6 }} lg={{ span: 5 }} order={{ xs: 3, sm: 3, md: 3, lg: 3 }}>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Balance Pcs:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>
                                                {selectedLotDetails ? (selectedLotDetails.pieces - totalPieces) : ''}
                                            </Text>
                                        </div>
                                        <div className="card-item" style={{ textAlign: "right" }}>
                                            <Text
                                                style={{
                                                    color: "#ede6e6",
                                                    display: "block",
                                                    marginBottom: "5px",
                                                    fontSize: "12px"
                                                }}
                                            >
                                                Balance Weight:
                                            </Text>
                                            <Text style={{ fontSize: "12px", color: "#ede6e6" }} strong>
                                                {selectedLotDetails ? (selectedLotDetails.weight - totalGwt).toFixed(3) : '0.000'}
                                            </Text>
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
                <ProductDetails
                    resetTrigger={resetTrigger} setResetTrigger={setResetTrigger}
                    updateTotals={updateTotals}
                    feachTagno={feachTagno}
                    tagInfo={tagInfo}
                    lotno={selectedLotDetails ? selectedLotDetails.lotno : ''}
                    counter={selectedLotDetails ? selectedLotDetails.counter : ''}
                    prefix={selectedLotDetails ? selectedLotDetails.prefix : ''}
                    manufacturer={selectedLotDetails ? selectedLotDetails.manufacturer : ''}
                    dealername={selectedLotDetails ? selectedLotDetails.dealerName : ''}
                    mname={selectedLotDetails ? selectedLotDetails.mname : ''} productNameRef={productNameRef} />
            </div>




        </div>
    );
};

export default TagGeneration;
