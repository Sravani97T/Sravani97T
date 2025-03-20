import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select, Button, Modal, Table, Card, Tag, Badge } from "antd";
import { PlusOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { CREATE_jwel } from "../../../../Config/Config";

const { Text } = Typography;
const { Option } = Select;

const StoneDetails = ({ lotno, productname, pieces, gwt, stoneData, setStoneData }) => {
    const tagStyle = {
        fontSize: "12px",
        padding: "6px 12px",
        borderRadius: "16px",
        fontWeight: "bold",
        color: "white",
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [stoneItems, setStoneItems] = useState([]);
    const shapeData = [
        { type: "diamond", top: "10%", left: "15%" },
        { type: "triangle", top: "30%", left: "40%" },
        { type: "circle", top: "50%", left: "20%" },
        { type: "hexagon", top: "70%", left: "60%" },
        { type: "diamond", top: "85%", left: "80%" },
        { type: "circle", top: "20%", left: "70%" },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "F7") {
                setModalOpen(true); // Open modal on F7 press
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const [formValues, setFormValues] = useState({
        stoneItem: "",
        pcs: "",
        cts: "",
        grams: "",
        rate: "",
        amount: "",
        noPcs: "",
        color: "",
        cut: "",
        clarity: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const stoneItemRef = useRef(null);
    const pcsRef = useRef(null);
    const ctsRef = useRef(null);
    const gramsRef = useRef(null);
    const rateRef = useRef(null);
    const noPcsRef = useRef(null);
    const colorRef = useRef(null);
    const cutRef = useRef(null);
    const clarityRef = useRef(null);
    const [stoneItemInputValue, setStoneItemInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const handleStoneChange = (value) => {
        setFormValues({ ...formValues, stoneItem: value });
        setStoneItemInputValue(""); // ✅ Clears input after selection
    };

    const handleStoneSelect = (value) => {
        setFormValues({ ...formValues, stoneItem: value });
        setStoneItemInputValue(""); // ✅ Clears input after selection

        setTimeout(() => {
            if (pcsRef.current) {
                pcsRef.current.focus(); // ✅ Moves focus to next field
            }
        }, 100);
    };
    // Filter options based on input
    const filteredOptions = stoneItems.filter((item) =>
        item.ITEMNAME.toLowerCase().includes(stoneItemInputValue.toLowerCase())
    );

    // Handle key down (Enter & Arrow navigation)
    const handleStoneKeyDown = (e) => {
        if (e.key === "Enter" && filteredOptions?.length > 0) {
            const selectedItem = filteredOptions[highlightedIndex]; // Get highlighted item
            if (selectedItem) {
                handleStoneChange(selectedItem.ITEMNAME);
                handleStoneSelect(selectedItem.ITEMNAME);
                setStoneItemInputValue(selectedItem.ITEMNAME);
            }
        } else if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) =>
                prev < filteredOptions?.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
    };
    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/Master/MasterItemMasterList`)
            .then(response => {
                setStoneItems(response.data);
            })
            .catch(error => console.error("Error fetching stone items:", error));
    }, []);


   const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValues = { ...formValues, [name]: value };

        // Ensure only one of pcs, cts, grams is filled and others are cleared
        if (name === "pcs" && value) {
            updatedValues = { ...updatedValues, cts: "", grams: "" };
        } else if (name === "cts" && value) {
            updatedValues = { ...updatedValues, pcs: "", grams: "" };
        } else if (name === "grams" && value) {
            updatedValues = { ...updatedValues, pcs: "", cts: "" };
        }

        // Calculate amount
        const rate = parseFloat(updatedValues.rate) || 0;
        const pcs = parseFloat(updatedValues.pcs) || 0;
        const cts = parseFloat(updatedValues.cts) || 0;
        const grams = parseFloat(updatedValues.grams) || 0;
        const amount = rate * (pcs + cts + grams);
        updatedValues.amount = amount.toFixed(2);

        setFormValues(updatedValues);
    };

    const handleEnterPress = (e, field) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior

            const nextFieldMap = {
                stoneItem: pcsRef,
                pcs: rateRef,
                cts: rateRef,
                grams: rateRef,
                rate: noPcsRef,
                noPcs: colorRef,
                color: cutRef,
                cut: clarityRef,
                clarity: null // Submits the form
            };

            const nextField = nextFieldMap[field];

            if (nextField && nextField.current) {
                nextField.current.focus();
            } else {
                handleAddStone(); // Submit after clarity
            }
        }
    };

    const handleAddStone = () => {
        if (!formValues.rate) {
            alert("Enter fields is required.");
            return;
        }

        if (isEditing) {
            setStoneData((stoneData || []).map(item => item.key === editingKey ? { ...formValues, key: editingKey } : item));
            setIsEditing(false);
            setEditingKey(null);
        } else {
            const newStone = { ...formValues, key: (stoneData?.length || 0) + 1, sno: (stoneData?.length || 0) + 1 };
            setStoneData([...(stoneData || []), newStone]);
        }
        setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });

        // Move cursor back to the stoneItem field
        if (stoneItemRef.current) {
            stoneItemRef.current.focus();
        }
    };
    const handleRemoveStone = (key) => {
        setStoneData(stoneData.filter(item => item.key !== key));
    };

    const handleEditStone = (record) => {
        setFormValues(record);
        setIsEditing(true);
        setEditingKey(record.key);
        setModalOpen(true);
    };

    const handleClearForm = () => {
        setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });
    };

    const columns = [
        { title: "S. No", width: 50, key: "sno", render: (_, __, index) => index + 1 },
        { title: "Stone Item", width: 130, dataIndex: "stoneItem", key: "stoneItem" },
        { title: "Pcs", width: 50, dataIndex: "pcs", key: "pcs", align: "right", render: (text) => text || "" },
        { title: "Cts", dataIndex: "cts", key: "cts", align: "right", render: (text) => text ? parseFloat(text).toFixed(3) : "" },
        { title: "Grams", dataIndex: "grams", key: "grams", align: "right", render: (text) => text ? parseFloat(text).toFixed(3) : "" },
        { title: "Rate", dataIndex: "rate", key: "rate", align: "right", render: (text) => text || "" },
        { title: "Amount", dataIndex: "amount", key: "amount", align: "right", render: (text) => text ? parseFloat(text).toFixed(2) : "" },
        {
            title: "No. Pcs", dataIndex: "noPcs", key: "noPcs", align: "right",
            render: (text) => text || ""
        },
        { title: "Color", dataIndex: "color", key: "color", render: (text) => text || "" },
        { title: "Cut", dataIndex: "cut", key: "cut", render: (text) => text || "" },
        { title: "Clarity", dataIndex: "clarity", key: "clarity", render: (text) => text || "" },
        {
            title: "Cts-Grams",
            key: "ctsToGrams",
            align: "right",
            render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                if (item && item.DIAMONDS) {
                    return "0.000"; // Show zero if diamonds exist
                }
                if (!isNaN(parseFloat(record.grams)) && parseFloat(record.grams) !== 0) {
                    return "0.000"; // Show zero if grams exist
                }
                if (item && item.EFFECTON_GOLD) {
                    return (parseFloat(record.cts) / 5).toFixed(3) || "0.000";
                }
                return !isNaN(parseFloat(record.cts)) ? parseFloat(record.cts).toFixed(3) : "0.000";
            },
        },
        {
            title: "Dia Cts", key: "diaCts", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.DIAMONDS ? parseFloat(record.cts).toFixed(3) : "";
            }
        },
        {
            title: "Dia Amt", key: "diaAmount", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.DIAMONDS ? parseFloat(record.amount).toFixed(2) : "";
            }
        },
        {
            title: "CTS", key: "ctsCol", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.CTS ? parseFloat(record.cts).toFixed(3) : "";
            }
        },
        {
            title: "Uncuts", key: "uncutsCol", align: "right", render: (_, record) => {
                const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
                return item && item.UNCUTS ? parseFloat(record.cts).toFixed(3) : "";
            }
        },
        {
            title: "Action", key: "action", render: (_, record) => (
                <>
                    <EditOutlined onClick={() => handleEditStone(record)} style={{ color: "blue", cursor: "pointer", marginRight: 8, borderRadius: "50%", padding: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }} />
                    <CloseOutlined onClick={() => handleRemoveStone(record.key)} style={{ color: "red", cursor: "pointer", borderRadius: "50%", padding: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }} />
                </>
            )
        }
    ];

    const totalCtsGrams = (stoneData && stoneData?.length > 0 ? stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        if (item && item.DIAMONDS) {
            return sum; // Skip diamonds, since we show 0 in Cts-Grams
        }
        if (parseFloat(record.grams)) {
            return sum; // Skip grams, since we show 0 in Cts-Grams
        }
        if (item && item.EFFECTON_GOLD) {
            return sum + (parseFloat(record.cts) / 5 || 0);
        }
        return sum + (parseFloat(record.cts) || 0);
    }, 0) : 0).toFixed(3);

    const totalGrams = stoneData?.reduce((sum, record) => sum + (parseFloat(record.grams) || 0), 0).toFixed(3);
    const finalTotalGrams = (parseFloat(totalCtsGrams) + parseFloat(totalGrams)).toFixed(3);

    const totalDiaAmount = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        if (item && item.DIAMONDS) {
            return sum + (parseFloat(record.amount) || 0);
        }
        return sum;
    }, 0).toFixed(2);

    const totalDiamondCts = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        return item && item.DIAMONDS ? sum + (parseFloat(record.cts) || 0) : sum;
    }, 0).toFixed(3);
    const totalCTS = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        return item && item.CTS ? sum + (parseFloat(record.cts) || 0) : sum;
    }, 0).toFixed(3);

    const totalUncuts = stoneData?.reduce((sum, record) => {
        const item = stoneItems.find(i => i.ITEMNAME === record.stoneItem);
        return item && item.UNCUTS ? sum + (parseFloat(record.cts) || 0) : sum;
    }, 0).toFixed(3);

    useEffect(() => {
        if (stoneItemRef.current) {
            stoneItemRef.current.focus();
        }
    }, [modalOpen]);

    return (
        <>
            <Row justify="center" >
                <Col span={24}>
                    <Button
                        type="primary"
                        onClick={() => {
                            if (lotno && productname && pieces && gwt) {
                                setModalOpen(true);
                            }
                        }}
                        style={{ width: "100%", backgroundColor: "#0d094e", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", opacity: lotno && productname && pieces && gwt ? 1 : 0.5, pointerEvents: lotno && productname && pieces && gwt ? "auto" : "none" }}
                    >
                        <PlusOutlined />
                        Stones
                        {stoneData?.length > 0 && (
                            <Badge
                                count={stoneData?.length}
                                style={{ backgroundColor: "red", color: "white" }}
                            />
                        )}
                    </Button>
                </Col>
            </Row>
            <Modal
                title={isEditing ? "Edit Stone" : "Add Stones"}
                centered
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null} // Footer is handled separately inside the modal
                width="100%"
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setStoneData([]);
                        handleClearForm();
                        setModalOpen(false);
                    }
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    height: stoneData?.length >= 5 ? "110vh" : "85vh"
                }}>
                    {/* Content Section */}
                    <div style={{
                        flex: 1,
                        overflowY: "auto",
                        paddingBottom: "20px"
                    }}>
                        <Card
                            bordered={false}
                            style={{
                                background: "#394646",
                                borderRadius: "8px",
                                position: "relative",
                                overflow: "hidden",
                            }}
                        >
                            {/* Background Shapes */}
                            {shapeData.map((shape, index) => {
                                let shapeStyle = {
                                    position: "absolute",
                                    width: "40px",
                                    height: "40px",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    top: shape.top,
                                    left: shape.left,
                                    zIndex: 0,
                                    pointerEvents: "none",
                                };

                                if (shape.type === "diamond") {
                                    shapeStyle.transform = "rotate(45deg)";
                                } else if (shape.type === "triangle") {
                                    shapeStyle.width = "0";
                                    shapeStyle.height = "0";
                                    shapeStyle.borderLeft = "20px solid transparent";
                                    shapeStyle.borderRight = "20px solid transparent";
                                    shapeStyle.borderBottom = "40px solid rgba(255, 255, 255, 0.1)";
                                    shapeStyle.background = "none";
                                } else if (shape.type === "circle") {
                                    shapeStyle.borderRadius = "50%";
                                } else if (shape.type === "hexagon") {
                                    shapeStyle.clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
                                }

                                return <div key={index} style={shapeStyle}></div>;
                            })}

                            {/* Form Fields */}
                            <Row gutter={[8, 8]} style={{ position: "relative", zIndex: 1 }}>
                                <Col span={4}>
                                    <Text style={{ color: "#fff", display: "block" }}>Stone Item</Text>
                                    <Select
                                        ref={stoneItemRef}
                                        showSearch
                                        value={formValues.stoneItem || stoneItemInputValue}
                                        placeholder="Select Stone"
                                        onChange={handleStoneChange}
                                        onSelect={handleStoneSelect}
                                        style={{ width: "100%" }}
                                        onSearch={(value) => {
                                            setStoneItemInputValue(value);
                                            setHighlightedIndex(0);
                                        }}
                                        onKeyDown={handleStoneKeyDown}
                                        filterOption={false}
                                        defaultActiveFirstOption={false}
                                        dropdownRender={(menu) => (
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
                                        {filteredOptions.map((item, index) => (
                                            <Option
                                                key={item.ITEMCODE}
                                                value={item.ITEMNAME}
                                                className={index === highlightedIndex ? "highlighted-option" : ""}
                                            >
                                                {item.ITEMNAME}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>

                                {["pcs", "cts", "grams", "rate", "amount", "noPcs", "color", "cut", "clarity"].map((field) => (
                                    <Col span={4} key={field}>
                                        <Text style={{ color: "#fff" }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                        <Input
                                            ref={field === "pcs" ? pcsRef : field === "cts" ? ctsRef : field === "grams" ? gramsRef : field === "rate" ? rateRef : field === "noPcs" ? noPcsRef : field === "color" ? colorRef : field === "cut" ? cutRef : field === "clarity" ? clarityRef : null}
                                            name={field}
                                            value={formValues[field]}
                                            placeholder={`Enter ${field}`}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleEnterPress(e, field)}
                                            readOnly={field === "amount"}
                                        />
                                    </Col>
                                ))}

                                <Button type="primary" 
                                onClick={() => {
                                    handleAddStone();
                                    if (stoneItemRef.current) {
                                        stoneItemRef.current.focus();
                                    }}
                                }
                                     style={{ width: "100px", height: "30px", fontSize: "16px", marginTop: "20px" }} htmlType="submit">
                                        Submit
                                    </Button>
                                </Row>
                            </Card>

                            <div style={{ marginTop: "20px" }}>
                                <Table
                                    className="custom-stone-table table-row"
                                    columns={columns}
                                    dataSource={stoneData}
                                    size="small"
                                    pagination={false}
                                    scroll={{ y: 300 }}
                                    summary={() => {
                                        const totalPcs = stoneData?.reduce((sum, item) => sum + (parseFloat(item.pcs) || 0), 0);
                                        const totalCts = stoneData?.reduce((sum, item) => sum + (parseFloat(item.cts) || 0), 0).toFixed(3);
                                        const totalGrams = stoneData?.reduce((sum, item) => sum + (parseFloat(item.grams) || 0), 0).toFixed(3);
                                        const totalAmount = stoneData?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2);
                                        const totalNoPcs = stoneData?.reduce((sum, item) => sum + (parseFloat(item.noPcs) || 0), 0);

                                        return (
                                            <Table.Summary fixed>
                                                <Table.Summary.Row
                                                    style={{
                                                        background: "#dee5f5",
                                                        fontWeight: "bold",
                                                        position: "sticky",
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={2} align="right">
                                                        {totalPcs}
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={3} align="right">
                                                        {totalCts}
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={4} align="right">
                                                        {totalGrams}
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={6} align="right">
                                                        {totalAmount}
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={7} align="right">
                                                        {totalNoPcs}
                                                    </Table.Summary.Cell>
                                                    <Table.Summary.Cell index={8}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={9}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={10}></Table.Summary.Cell>
                                                    <Table.Summary.Cell index={11}></Table.Summary.Cell>
                                                </Table.Summary.Row>
                                            </Table.Summary>
                                        );
                                    }}
                                />
                            </div>

                        </div>
                        <Row justify="start">

                            <Tag color="#32523A" style={tagStyle}>            Total Grms: {finalTotalGrams}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>            Total Dia Amount: {totalDiaAmount}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>
                                Total Diamond Cts: {totalDiamondCts}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>
                                Total CTS: {totalCTS}
                            </Tag>
                            <Tag color="#32523A" style={tagStyle}>
                                Total Uncuts: {totalUncuts}
                            </Tag>
                        </Row>
                    <div style={{
                        padding: "10px",
                        borderTop: "1px solid #ccc",
                        display: "flex",
                        justifyContent: "flex-end",
                        background: "#fff"
                    }}>
                        <Button key="refresh" onClick={() => {
                            setStoneData([]);
                            handleClearForm();
                            if (stoneItemRef.current) {
                                stoneItemRef.current.focus();
                            }
                        }}>
                            Refresh
                        </Button>
                        <Button key="ok" type="primary" onClick={() => {
                            // Store totals in localStorage
                            const totalPcs = stoneData?.reduce((sum, item) => sum + (parseFloat(item.pcs) || 0), 0);
                            const totalCts = stoneData?.reduce((sum, item) => sum + (parseFloat(item.cts) || 0), 0).toFixed(3);
                            const totalGrams = stoneData?.reduce((sum, item) => sum + (parseFloat(item.grams) || 0), 0).toFixed(3);
                            const totalAmount = stoneData?.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2);
                            const totalNoPcs = stoneData?.reduce((sum, item) => sum + (parseFloat(item.noPcs) || 0), 0);

                            localStorage.setItem('totalPcs', totalPcs);
                            localStorage.setItem('totalCts', totalCts);
                            localStorage.setItem('totalGrams', totalGrams);
                            localStorage.setItem('totalAmount', totalAmount);
                            localStorage.setItem('totalNoPcs', totalNoPcs);
                            localStorage.setItem('finalTotalGrams', finalTotalGrams);
                            localStorage.setItem('totalDiaAmount', totalDiaAmount);
                            localStorage.setItem('totalDiamondCts', totalDiamondCts);
                            localStorage.setItem('totalCTS', totalCTS);
                            localStorage.setItem('totalUncuts', totalUncuts);

                            setModalOpen(false);
                            handleClearForm();
                            if (stoneItemRef.current) {
                                stoneItemRef.current.focus();
                            }
                        }} style={{ marginLeft: "8px" }}>
                            OK
                        </Button>

                    </div>
                </div>
            </Modal>
        </>
    );
};

export default StoneDetails; 