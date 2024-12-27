/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Table,
    Space,
    Popconfirm,
    Row,
    Col,
    Card,
    message,
    Breadcrumb,
    Radio,
    Checkbox
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const StateMaster = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        { key: 1, state: "Karnataka", code: "KA", station: "Out Station", checkbox: true },
        { key: 2, state: "Maharashtra", code: "MH", station: "Local", checkbox: false },
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

    const handleEnterPress = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission on Enter
            if (nextRef && nextRef.current) {
                nextRef.current.focus(); // Move focus to the next input
            }
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
            title: "State",
            dataIndex: "state",
            key: "state",
            sorter: (a, b) => a.state.localeCompare(b.state),
        },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Station",
            dataIndex: "station",
            key: "station",
        },
        {
            title: "Checkbox",
            dataIndex: "checkbox",
            key: "checkbox",
            render: (checkbox) => (checkbox ? "Yes" : "No"),
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
                        <Breadcrumb.Item>State Master</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Record" : "Add Record"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="state"
                                label="State"
                                rules={[{ required: true, message: "State is required" }]}
                            >
                                <Input placeholder="Enter State" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="code"
                                label="Code"
                                rules={[{ required: true, message: "Code is required" }]}
                            >
                                <Input placeholder="Enter Code" />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Station and Checkbox */}
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="station"
                                label="Station"
                                rules={[{ required: true, message: "Station is required" }]}
                            >
                                <Radio.Group>
                                    <Radio value="outstation">Out Station</Radio>
                                    <Radio value="local">Local</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item name="checkbox" valuePropName="checked">
                                <Checkbox >Default Checkbox</Checkbox>
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

export default StateMaster;
