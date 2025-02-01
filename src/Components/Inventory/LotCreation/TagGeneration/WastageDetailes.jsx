import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select } from "antd";
import StoneDetails from "../TagGeneration/StoneDetailes";
import axios from 'axios';

const { Text } = Typography;
const { Option } = Select;

const WastageDetails = ({ categoryRef }) => {
    const [wastageData, setWastageData] = useState([
        {
            key: "1",
            percentage: "",
            direct: "",
            total: "",
            perGram: "",
            newField1: "",
            newField2: "",
        },
    ]);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const directRef = useRef(null);
    const direct1Ref = useRef(null);

    const totalRef = useRef(null);
    const total1Ref = useRef(null);

    const perGramRef = useRef(null);
    const percentageRef = useRef(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterList");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleWastageChange = (e, key, field, nextRef) => {
        const value = e.target.value;
        const updatedData = wastageData.map((item) =>
            item.key === key ? { ...item, [field]: value } : item
        );
        setWastageData(updatedData);
    
        if (nextRef) {
            nextRef.current.focus();
        }
    };

    const handleKeyDown = (e, nextRef, prevRef) => {
        if (e.key === 'Enter' && nextRef) {
            nextRef.current.focus();
        } else if (e.key === 'ArrowLeft' && prevRef) {
            prevRef.current.focus();
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    const handleCategorySelect = (value) => {
        setSelectedCategory(value);
        setTimeout(() => {
            if (percentageRef.current) {
                percentageRef.current.focus();
            }
        }, 0);
    };

    return (
        <div>
            {/* Wastage Section */}
            <Row gutter={16}>
                {/* First Column: Wastage & Making */}
                <Col xs={24} sm={4} style={{ marginTop: "33px" }}>
                    <div
                        style={{
                            borderRadius: "10px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: "10px",
                                textAlign: "center",
                            }}
                        >
                            <Text style={{ textAlign: "center", fontSize: "12px" }}>
                                Category
                            </Text>
                            <Select
                                showSearch
                                ref={categoryRef}
                                value={selectedCategory}
                                placeholder="%"
                                onChange={handleCategoryChange}
                                onSelect={handleCategorySelect}
                                style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    marginTop: "4px",
                                }}
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                            >
                                {categories.map((category) => (
                                    <Option key={category.categoryname} value={category.categoryname}>
                                        {category.categoryname}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </Col>

                {/* Second Column: Wastage */}
                <Col xs={24} sm={8}>
                    <div
                        style={{
                            backgroundColor: "#e6f7ff", // Light blue background color for header
                            width: "100%",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                            Wastage
                        </Text>
                    </div>
                    <div
                        style={{
                            borderRadius: "10px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "10px",
                                textAlign: "center",
                            }}
                        >
                            {["%", "Direct", "Total"].map((header) => (
                                <Text key={header} style={{ textAlign: "center", fontSize: "12px" }}>
                                    {header}
                                </Text>
                            ))}
                            {wastageData.map((item) => (
                                <React.Fragment key={item.key}>
                                    <Input
                                        ref={percentageRef}
                                        placeholder="%"
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, directRef, null)}
                                    />
                                    <Input
                                        ref={directRef}
                                        value={item.direct}
                                        placeholder="Direct"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "direct", totalRef)
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, totalRef, percentageRef)}
                                    />
                                    <Input
                                        ref={totalRef}
                                        value={item.total}
                                        placeholder="Total"
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, perGramRef, directRef)}
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Third Column: Making Charges */}
                <Col xs={24} sm={8}>
                    <div
                        style={{
                            backgroundColor: "#e6f7ff", // Light blue background color for header
                            width: "100%",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                            Making Charges
                        </Text>
                    </div>
                    <div
                        style={{
                            borderRadius: "10px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "10px",
                                textAlign: "center",
                            }}
                        >
                            {["Gram", "Direct", "Total"].map((header) => (
                                <Text key={header} style={{ textAlign: "center", fontSize: "12px" }}>
                                    {header}
                                </Text>
                            ))}
                            {wastageData.map((item) => (
                                <React.Fragment key={item.key}>
                                    <Input
                                        ref={perGramRef}
                                        value={item.perGram}
                                        placeholder="Per Gram"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "perGram", direct1Ref)
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, direct1Ref, totalRef)}
                                    />
                                    <Input
                                        ref={direct1Ref}
                                        value={item.direct}
                                        placeholder="Direct"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "direct", total1Ref)
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, total1Ref, perGramRef)}
                                    />
                                    <Input
                                        ref={total1Ref}
                                        value={item.total}
                                        placeholder="Total"
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                        onKeyDown={(e) => handleKeyDown(e, null, direct1Ref)}
                                    />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Fourth Column: Stone Details */}
                <Col xs={24} sm={4}>
                    <div
                        style={{
                            backgroundColor: "#e6f7ff", // Light blue background color for header
                            width: "100%",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                            Stone Details
                        </Text>
                    </div>
                    <div
                        style={{
                            borderRadius: "10px",
                            padding: "10px",
                            backgroundColor: "#fff",
                            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <StoneDetails />
                        <div>Stones: 10</div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default WastageDetails;
