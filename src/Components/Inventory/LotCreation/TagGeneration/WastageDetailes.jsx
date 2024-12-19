import React, { useState } from "react";
import { Row, Col, Typography, Input, Select } from "antd";
import StoneDetails from "../TagGeneration/StoneDetailes";

const { Text } = Typography;
const { Option } = Select;

const WastageDetails = () => {
    const [wastageData, setWastageData] = useState([
        {
            key: "1",
            percentage: "18%",
            direct: "",
            total: "",
            perGram: "",
            newField1: "",
            newField2: "",
        },
    ]);

    const handleWastageChange = (e, key, field) => {
        const updatedData = wastageData.map((item) =>
            item.key === key ? { ...item, [field]: e.target.value } : item
        );
        setWastageData(updatedData);
    };

    return (
        <div>
            {/* Wastage Section */}
            <Row gutter={16}>
                {/* First Column: Wastage & Making */}
                <Col xs={24} sm={4}>
                    <div
                        style={{
                            backgroundColor: "#e6f7ff", // Light blue background color for header
                            width: "100%",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginBottom: "5px",
                            boxShadow: "0px 4px 12px rgba(243, 238, 238, 0.91)",
                            padding: "5px",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "16px", color: "#1890ff" }}>
                            Wastage & Making
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
                                gridTemplateColumns: "1fr",
                                gap: "10px",
                                textAlign: "center",
                            }}
                        >
                            <Text style={{ textAlign: "center" }}>
                                Wastage & Making
                            </Text>
                            <Select
                                value={wastageData[0].percentage}
                                placeholder="%"
                                onChange={(value) =>
                                    handleWastageChange(
                                        { target: { value } },
                                        wastageData[0].key,
                                        "percentage"
                                    )
                                }
                                style={{
                                    width: "100%",
                                    borderRadius: "8px",
                                    marginTop: "4px",
                                }}
                            >
                                <Option value="18%">18%</Option>
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
                            padding: "5px",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "16px", color: "#1890ff" }}>
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
                                <Text key={header} style={{ textAlign: "center" }}>
                                    {header}
                                </Text>
                            ))}
                            {wastageData.map((item) => (
                                <React.Fragment key={item.key}>
                                    <Input
                                        placeholder="%"
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                    />
                                    <Input
                                        value={item.direct}
                                        placeholder="Direct"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "direct")
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                    />
                                    <Input
                                        value={item.total}
                                        placeholder="Total"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "total")
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
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
                            padding: "5px",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "16px", color: "#1890ff" }}>
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
                                <Text key={header} style={{ textAlign: "center" }}>
                                    {header}
                                </Text>
                            ))}
                            {wastageData.map((item) => (
                                <React.Fragment key={item.key}>
                                    <Input
                                        value={item.perGram}
                                        placeholder="Per Gram"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "perGram")
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                    />
                                    <Input
                                        value={item.direct}
                                        placeholder="Direct"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "direct")
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
                                    />
                                    <Input
                                        value={item.total}
                                        placeholder="Total"
                                        onChange={(e) =>
                                            handleWastageChange(e, item.key, "total")
                                        }
                                        style={{
                                            width: "100%",
                                            borderRadius: "8px",
                                            marginTop: "4px",
                                        }}
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
                            boxShadow: "0px 4px 12px rgba(226, 222, 222, 0.91)",
                            padding: "5px",
                            textAlign: "center",
                        }}
                    >
                        <Text style={{ fontSize: "16px", color: "#1890ff" }}>
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
                        <div>Total: 10</div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default WastageDetails;
