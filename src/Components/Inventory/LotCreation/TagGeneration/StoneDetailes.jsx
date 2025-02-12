import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select, Button, Modal, Table, Card, Tag } from "antd";
import { PlusOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

const StoneDetails = ({ stoneData, setStoneData }) => {
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
        if (e.key === "Enter" && filteredOptions.length > 0) {
            const selectedItem = filteredOptions[highlightedIndex]; // Get highlighted item
            if (selectedItem) {
                handleStoneChange(selectedItem.ITEMNAME);
                handleStoneSelect(selectedItem.ITEMNAME);
                setStoneItemInputValue(selectedItem.ITEMNAME);
            }
        } else if (e.key === "ArrowDown") {
            setHighlightedIndex((prev) =>
                prev < filteredOptions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
    };
    useEffect(() => {
        axios.get(`${CREATE_jwel}`+"/api/Master/MasterItemMasterList")
            .then(response => {
                setStoneItems(response.data);
            })
            .catch(error => console.error("Error fetching stone items:", error));
    }, []);

    const handleSelectChange = (value) => {
        setFormValues({ ...formValues, stoneItem: value });
    };

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

    const handleClearField = (e, field) => {
        if (!e.target.value) {
            const fields = ["pcs", "cts", "grams"];
            const currentIndex = fields.indexOf(field);
            if (currentIndex < fields.length - 1) {
                document.querySelector(`[name=${fields[currentIndex + 1]}]`).focus();
            }
        }
    };

    const handleAddStone = () => {
        if (!formValues.rate) {
            alert("Enter fields is required.");
            return;
        }

        if (isEditing) {
            setStoneData(stoneData.map(item => item.key === editingKey ? { ...formValues, key: editingKey } : item));
            setIsEditing(false);
            setEditingKey(null);
        } else {
            setStoneData([...stoneData, { ...formValues, key: stoneData.length + 1 }]);
        }
        setFormValues({ stoneItem: "", pcs: "", cts: "", grams: "", rate: "", amount: "", noPcs: "", color: "", cut: "", clarity: "" });
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
        { title: "No. Pcs", dataIndex: "noPcs", key: "noPcs", render: (text) => text || "" },
        { title: "Color", dataIndex: "color", key: "color", render: (text) => text || "" },
        { title: "Cut", dataIndex: "cut", key: "cut", render: (text) => text || "" },
        { title: "Clarity", dataIndex: "clarity", key: "clarity", render: (text) => text || "" },
        {
            title: "Action", key: "action", render: (_, record) => (
                <>
                    <EditOutlined onClick={() => handleEditStone(record)} style={{ color: "blue", cursor: "pointer", marginRight: 8, borderRadius: "50%", padding: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }} />
                    <CloseOutlined onClick={() => handleRemoveStone(record.key)} style={{ color: "red", cursor: "pointer", borderRadius: "50%", padding: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }} />
                </>
            )
        }
    ];


    return (
        <>
            <Row justify="center" style={{ marginBottom: "16px" }}>
                <Col span={24}>
                    <Button type="primary" onClick={() => setModalOpen(true)} style={{ width: "100%", backgroundColor: "#0d094e" }}>
                        <PlusOutlined /> Stones
                    </Button>
                </Col>
            </Row>
            <Modal
                title={isEditing ? "Edit Stone" : "Add Stones"}
                centered
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null} // Footer is handled separately inside the modal
                width="80%"
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    height: stoneData.length >= 5 ? "110vh" : "85vh"
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
                                padding: "20px"
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

                                <Button type="primary" onClick={handleAddStone} style={{ width: "100px", height: "30px", fontSize: "16px", marginTop: "20px" }} htmlType="submit">
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
                                summary={() => (
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
                                                {stoneData.reduce((sum, item) => sum + (parseFloat(item.pcs) || 0), 0)}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={3} align="right">
                                                {stoneData.reduce((sum, item) => sum + (parseFloat(item.cts) || 0), 0).toFixed(3)}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4} align="right">
                                                {stoneData.reduce((sum, item) => sum + (parseFloat(item.grams) || 0), 0).toFixed(3)}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={6} align="right">
                                                {stoneData.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0).toFixed(2)}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={7}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={8}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={9}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={10}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={11}></Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </div>

                    </div>
                    <Row justify="start">
                        <Tag color="#32523A" style={tagStyle}>Total Grams:44.000</Tag>
                        <Tag color="#32523A" style={tagStyle}>Daimond CTS:00.000</Tag>
                    </Row>
                    {/* Footer Section */}
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
                        }}>
                            Refresh
                        </Button>
                        <Button key="ok" type="primary" onClick={() => {
                            setModalOpen(false);
                            handleClearForm();
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