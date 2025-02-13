import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Typography, Input, Select, Button, Modal, Table, Card, Tag, Badge } from "antd";
import { PlusOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;
const { Option } = Select;

const OrderItem = ({ lotno,productname,gwt,pieces,orderId, customerName, orderDate, orderData = [], setOrderData }) => {
    const tagStyle = {
        fontSize: "12px",
        padding: "6px 12px",
        borderRadius: "16px",
        fontWeight: "bold",
        color: "white",
    };
    const [modalOpen, setModalOpen] = useState(false);
    const [itemList, setItemList] = useState([]);
    const shapeData = [
        { type: "diamond", top: "10%", left: "15%" },
        { type: "triangle", top: "30%", left: "40%" },
        { type: "circle", top: "50%", left: "20%" },
        { type: "hexagon", top: "70%", left: "60%" },
        { type: "diamond", top: "85%", left: "80%" },
        { type: "circle", top: "20%", left: "70%" },
    ];

    const [formValues, setFormValues] = useState({
        itemName: "",
        quantity: "",
        price: "",
        total: "",
        description: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const itemNameRef = useRef(null);
    const quantityRef = useRef(null);
    const priceRef = useRef(null);
    const descriptionRef = useRef(null);
    const [itemNameInputValue, setItemNameInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const handleItemChange = (value) => {
        setFormValues({ ...formValues, itemName: value });
        setItemNameInputValue(""); // Clears input after selection
    };

    const handleItemSelect = (value) => {
        setFormValues({ ...formValues, itemName: value });
        setItemNameInputValue(""); // Clears input after selection

        setTimeout(() => {
            if (quantityRef.current) {
                quantityRef.current.focus(); // Moves focus to next field
            }
        }, 100);
    };

    const filteredOptions = (itemList || []).filter((item) =>
        item.ITEMNAME.toLowerCase().includes(itemNameInputValue.toLowerCase())
    );

    const handleItemKeyDown = (e) => {
        if (e.key === "Enter" && filteredOptions.length > 0) {
            const selectedItem = filteredOptions[highlightedIndex]; // Get highlighted item
            if (selectedItem) {
                handleItemChange(selectedItem.ITEMNAME);
                handleItemSelect(selectedItem.ITEMNAME);
                setItemNameInputValue(selectedItem.ITEMNAME);
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
        axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterItemMasterList")
            .then(response => {
                setItemList(response.data);
            })
            .catch(error => console.error("Error fetching item list:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValues = { ...formValues, [name]: value };

        // Calculate total
        const price = parseFloat(updatedValues.price) || 0;
        const quantity = parseFloat(updatedValues.quantity) || 0;
        const total = price * quantity;
        updatedValues.total = total.toFixed(2);

        setFormValues(updatedValues);
    };

    const handleEnterPress = (e, field) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default behavior

            const nextFieldMap = {
                itemName: quantityRef,
                quantity: priceRef,
                price: descriptionRef,
                description: null // Submits the form
            };

            const nextField = nextFieldMap[field];

            if (nextField && nextField.current) {
                nextField.current.focus();
            } else {
                handleAddItem(); // Submit after description
            }
        }
    };

    const handleAddItem = () => {
        if (!formValues.price) {
            alert("Enter fields is required.");
            return;
        }

        if (isEditing) {
            setOrderData(orderData.map(item => item.key === editingKey ? { ...formValues, key: editingKey } : item));
            setIsEditing(false);
            setEditingKey(null);
        } else {
            const newItem = { ...formValues, key: orderData.length + 1, sno: orderData.length + 1 };
            setOrderData([...orderData, newItem]);
        }
        setFormValues({ itemName: "", quantity: "", price: "", total: "", description: "" });
    };

    const handleRemoveItem = (key) => {
        setOrderData(orderData.filter(item => item.key !== key));
    };

    const handleEditItem = (record) => {
        setFormValues(record);
        setIsEditing(true);
        setEditingKey(record.key);
        setModalOpen(true);
    };

    const handleClearForm = () => {
        setFormValues({ itemName: "", quantity: "", price: "", total: "", description: "" });
    };

    const columns = [
        { title: "S. No", width: 50, key: "sno", render: (_, __, index) => index + 1 },
        { title: "Item Name", width: 130, dataIndex: "itemName", key: "itemName" },
        { title: "Quantity", width: 50, dataIndex: "quantity", key: "quantity", align: "right", render: (text) => text || "" },
        { title: "Price", dataIndex: "price", key: "price", align: "right", render: (text) => text || "" },
        { title: "Total", dataIndex: "total", key: "total", align: "right", render: (text) => text ? parseFloat(text).toFixed(2) : "" },
        { title: "Description", dataIndex: "description", key: "description", render: (text) => text || "" },
        {
            title: "Action", key: "action", render: (_, record) => (
                <>
                    <EditOutlined onClick={() => handleEditItem(record)} style={{ color: "blue", cursor: "pointer", marginRight: 8, borderRadius: "50%", padding: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }} />
                    <CloseOutlined onClick={() => handleRemoveItem(record.key)} style={{ color: "red", cursor: "pointer", borderRadius: "50%", padding: "5px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)" }} />
                </>
            )
        }
    ];

    useEffect(() => {
        if (itemNameRef.current) {
            itemNameRef.current.focus();
        }
    }, [modalOpen]);

    return (
        <>
            <Row justify="center">
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
                        Order Item
                        {orderData.length > 0 && (
                            <Badge
                                count={orderData.length}
                                style={{ backgroundColor: "red", color: "white" }}
                            />
                        )}
                    </Button>
                </Col>
            </Row>
            <Modal
                title={isEditing ? "Edit Item" : "Add Items"}
                centered
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width="80%"
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setOrderData([]);
                        handleClearForm();
                        setModalOpen(false);
                    }
                }}
            >
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    height: orderData.length >= 5 ? "110vh" : "85vh"
                }}>
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

                            <Row gutter={[8, 8]} style={{ position: "relative", zIndex: 1 }}>
                                <Col span={4}>
                                    <Text style={{ color: "#fff", display: "block" }}>Item Name</Text>
                                    <Select
                                        ref={itemNameRef}
                                        showSearch
                                        value={formValues.itemName || itemNameInputValue}
                                        placeholder="Select Item"
                                        onChange={handleItemChange}
                                        onSelect={handleItemSelect}
                                        style={{ width: "100%" }}
                                        onSearch={(value) => {
                                            setItemNameInputValue(value);
                                            setHighlightedIndex(0);
                                        }}
                                        onKeyDown={handleItemKeyDown}
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

                                {["quantity", "price", "total", "description"].map((field) => (
                                    <Col span={4} key={field}>
                                        <Text style={{ color: "#fff" }}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                                        <Input
                                            ref={field === "quantity" ? quantityRef : field === "price" ? priceRef : field === "description" ? descriptionRef : null}
                                            name={field}
                                            value={formValues[field]}
                                            placeholder={`Enter ${field}`}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => handleEnterPress(e, field)}
                                            readOnly={field === "total"}
                                        />
                                    </Col>
                                ))}

                                <Button type="primary" onClick={handleAddItem} style={{ width: "100px", height: "30px", fontSize: "16px", marginTop: "20px" }} htmlType="submit">
                                    Submit
                                </Button>
                            </Row>
                        </Card>

                        <div style={{ marginTop: "20px" }}>
                            <Table
                                className="custom-order-table table-row"
                                columns={columns}
                                dataSource={orderData}
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
                                                {orderData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={4} align="right">
                                                {orderData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}></Table.Summary.Cell>
                                            <Table.Summary.Cell index={6}></Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                )}
                            />
                        </div>

                    </div>
                    <Row justify="start">
                        <Tag color="#32523A" style={tagStyle}>Total Quantity: {orderData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0)}</Tag>
                        <Tag color="#32523A" style={tagStyle}>Total Amount: {orderData.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0).toFixed(2)}</Tag>
                    </Row>
                    <div style={{
                        padding: "10px",
                        borderTop: "1px solid #ccc",
                        display: "flex",
                        justifyContent: "flex-end",
                        background: "#fff"
                    }}>
                        <Button key="refresh" onClick={() => {
                            setOrderData([]);
                            handleClearForm();
                            if (itemNameRef.current) {
                                itemNameRef.current.focus();
                            }
                        }}>
                            Refresh
                        </Button>
                        <Button key="ok" type="primary" onClick={() => {
                            setModalOpen(false);
                            handleClearForm();
                            if (itemNameRef.current) {
                                itemNameRef.current.focus();
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

export default OrderItem;