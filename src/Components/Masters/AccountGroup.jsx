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
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const AccountGroup = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        { key: 1, counterName: "Gold", counterChart: "Bangles" },
        { key: 2, counterName: "Silver", counterChart: "Chains" },
    ]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const counterInputRef = useRef(); // Ref for the second input field

    const mainCounterOptions = Array.from({ length: 10 }, (_, i) => `CTN ${i + 1}`);

    const handleAdd = (values) => {
        const newData = { key: Date.now(), ...values };
        setData([...data, newData]);
        form.resetFields();
        message.success("Counter added successfully!");
    };

    const handleDelete = (key) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Counter deleted successfully!");
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
        message.success("counter  updated successfully!");
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
            title: "Counter Name",
            dataIndex: "counterName",
            key: "counterName",
            sorter: (a, b) => a.counterName.localeCompare(b.counterName),
        },
        {
            title: "Counter chart",
            dataIndex: "counterChart",
            key: "counterChart",
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
                        <Breadcrumb.Item>Account Group</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Product" : "Add Product"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="counterName"
                                label="Counter Name"
                                rules={[{ required: true, message: "Counter Name is required" }]}
                            >
                                <Input
                                    placeholder="Enter Counter Name"
                                    onKeyDown={(e) => handleEnterPress(e, counterInputRef)}
                                />
                            </Form.Item>

                        </Col>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="counterChart"
                                label="Counter Chart Display"
                                rules={[{ required: true, message: "Counter Chart is required" }]}
                            >
                                <Select
                                    ref={counterInputRef} // Correctly assign ref here
                                    placeholder="Select"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option?.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // Prevent default behavior
                                            form.submit(); // Trigger form submission
                                        }
                                    }}
                                >
                                    {mainCounterOptions.map((item) => (
                                        <Option key={item} value={item}>
                                            {item}
                                        </Option>
                                    ))}
                                </Select>
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

export default AccountGroup;
