/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";
import {
    Form,
    Input,
    Button,
    Table,
    Space,
    Popconfirm,
    Row,
    Col,
    Card,
    message,
    Breadcrumb,
    Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const OnlineMode = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        { key: 1, type: "Credit", paymentMode: "Card", accountNumber: "12345", accountName: "John Doe" },
        { key: 2, type: "Debit", paymentMode: "Net Banking", accountNumber: "67890", accountName: "Jane Smith" },
    ]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");

    const handleAdd = (values) => {
        const newData = { key: Date.now(), ...values };
        setData([...data, newData]);
        form.resetFields();
        message.success("Record added successfully!");
    };

    const handleDelete = (key) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Record deleted successfully!");
    };

    const handleEdit = (record) => {
        setEditingKey(record.key);
        form.setFieldsValue(record);
        window.scrollTo(0, 0);
    };

    const handleSave = () => {
        const updatedData = form.getFieldsValue();
        setData((prevData) =>
            prevData.map((item) =>
                item.key === editingKey ? { ...item, ...updatedData } : item
            )
        );
        setEditingKey(null);
        form.resetFields();
        message.success("Record updated successfully!");
    };

    const handleCancel = useCallback(() => {
        form.resetFields();
        setEditingKey(null);
    }, [form]);

    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            form.submit(); // Trigger form submission on Enter key press
        }
    };

    const filteredData = data.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: "Payment Mode",
            dataIndex: "paymentMode",
            key: "paymentMode",
        },
        {
            title: "Account Number",
            dataIndex: "accountNumber",
            key: "accountNumber",
        },
        {
            title: "Account Name",
            dataIndex: "accountName",
            key: "accountName",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        disabled={editingKey === record.key}
                    />
                    <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey && e.key === "s") {
                e.preventDefault();
                form.submit(); // Trigger form submission
            }
            if (e.altKey && e.key === "c") {
                e.preventDefault();
                handleCancel(); // Reset the form
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [form, handleCancel]);

    return (
        <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
            {/* Breadcrumb */}
            <Row justify="start" style={{ marginBottom: "16px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Payment Details</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Record" : "Add Record"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        {/* Type Dropdown */}
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="type"
                                label="Type"
                                rules={[{ required: true, message: "Type is required" }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Type"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    <Option value="Credit">Credit</Option>
                                    <Option value="Debit">Debit</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Payment Mode Dropdown */}
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="paymentMode"
                                label="Payment Mode"
                                rules={[{ required: true, message: "Payment Mode is required" }]}
                            >
                                <Input placeholder="Enter Payment Mode" />

                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        {/* Account Number Dropdown */}
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="accountNumber"
                                label="Account Number"
                                rules={[{ required: true, message: "Account Number is required" }]}
                            >
                                <Select
                                    placeholder="Select Account Number"
                                >
                                    <Option value="12345">12345</Option>
                                    <Option value="67890">67890</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        {/* Account Name Text Input */}
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="accountName"
                                label="Account Name"
                                rules={[{ required: true, message: "Account Name is required" }]}
                            >
                                <Input placeholder="Enter Account Name" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ textAlign: "left", marginTop: "16px", float: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 8, backgroundColor: "#0C1154", borderColor: "#0C1154" }}
                        >
                            {editingKey ? "Save" : "Submit"}
                        </Button>
                        <Button htmlType="button" onClick={handleCancel} style={{ backgroundColor: "#f0f0f0" }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>

            <Row gutter={16}>
                <Col xs={24} sm={16} lg={12}>
                    <Input.Search
                        placeholder="Search records"
                        style={{ marginBottom: "16px", width: "100%", borderRadius: "4px" }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="key"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
                style={{
                    background: "#fff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                }}
            />
        </div>
    );
};

export default OnlineMode;
