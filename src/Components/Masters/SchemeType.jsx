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
    Radio,
    Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const SchemeType = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [schemeMode, setSchemeMode] = useState("Gold Scheme");
    const [oldSchemeType, setOldSchemeType] = useState(""); // Store the old SchemeType for deletion
    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_TYPE"
            );
            const mappedData = response.data.map((item, index) => ({
                key: index + 1,
                SchemeType: item.SchemeType,
                SchemeMode: item.SchemeMode,
                cloudUpload: item.CLOUD_UPLOAD ? "Yes" : "No",
            }));
            setData(mappedData);
        } catch (error) {
            message.error("Failed to fetch scheme type data.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (values) => {
        if (loading) return;

        setLoading(true);
        try {
            const response = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeType",
                {
                    schemeType: values.SchemeType,
                    schemeMode: schemeMode,
                    clouD_UPLOAD: true,
                }
            );

            if (response.data) {
                message.success("Scheme Type added successfully!");
                fetchData();
                form.resetFields();
            } else {
                message.error("Failed to add Scheme Type.");
            }
        } catch (error) {
            console.error("Error adding Scheme Type:", error);
            message.error("An error occurred while adding the Scheme Type.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (schemeType) => {
        try {
            const response = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeType?schemeType=${encodeURIComponent(
                    schemeType.trim()
                )}`
            );

            if (response.data === true) {
                setData(data.filter((item) => item.SchemeType !== schemeType));
                message.success("Scheme Type deleted successfully!");
            } else {
                message.error("Failed to delete Scheme Type.");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while deleting the Scheme Type.");
        }
    };

    const handleEdit = (record) => {
        setOldSchemeType(record.SchemeType); // Store old SchemeType for deletion
        setEditingKey(record.key);
        setSchemeMode(record.SchemeMode);
        form.setFieldsValue(record);
        window.scrollTo(0, 0);
    };

    const handleSave = async (values) => {
        if (loading) return;
    
        setLoading(true);
        try {
            // Delete the old SchemeType
            const deleteResponse = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeType?schemeType=${encodeURIComponent(
                    oldSchemeType.trim()
                )}`
            );
    
            if (deleteResponse.data === true) {
                // Insert the updated SchemeType
                const insertResponse = await axios.post(
                    "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeType",
                    {
                        schemeType: values.SchemeType,
                        schemeMode: schemeMode,
                        clouD_UPLOAD: true,
                    }
                );
    
                if (insertResponse.data) {
                    message.success("Scheme Type updated successfully!");
                    fetchData();
                            setEditingKey(null);

                    form.resetFields();
                } else {
                    message.error("Failed to update Scheme Type.");
                }
            } else {
                message.error("Failed to delete the old Scheme Type.");
            }
        } catch (error) {
            console.error("Error saving Scheme Type:", error);
            message.error("An error occurred while saving the Scheme Type.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = useCallback(() => {
        form.resetFields();
        setEditingKey(null);
    }, [form]);

    const filteredData = data.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "S.No",
            dataIndex: "sno",
            key: "sno",
            width: 50,
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Scheme Type",
            dataIndex: "SchemeType",
            key: "SchemeType",
            sorter: (a, b) => a.SchemeType.localeCompare(b.SchemeType),
        },
        {
            title: "Scheme Mode",
            dataIndex: "SchemeMode",
            key: "SchemeMode",
        },
        {
            title: "Cloud Upload",
            dataIndex: "cloudUpload",
            key: "cloudUpload",
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
                        onConfirm={() => handleDelete(record.SchemeType)}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ backgroundColor: "#f4f6f9" }}>
            <Row justify="start" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Scheme Type</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Scheme Type" : "Add Scheme Type"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="SchemeType"
                                label="Scheme Type"
                                rules={[{ required: true, message: "Scheme Type is required" }]}
                            >
                                <Input placeholder="Enter Scheme Type" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item label="Scheme Mode">
                                <Radio.Group
                                    onChange={(e) => setSchemeMode(e.target.value)}
                                    value={schemeMode}
                                >
                                    <Radio value="Gold Scheme">Gold Scheme</Radio>
                                    <Radio value="Cash Scheme">Cash Scheme</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ textAlign: "left", marginTop: "16px", float: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                marginRight: 8,
                                backgroundColor: "#0C1154",
                                borderColor: "#0C1154",
                            }}
                            disabled={loading}
                        >
                            {editingKey ? "Save" : "Submit"}
                        </Button>
                        <Button htmlType="button" onClick={handleCancel} style={{ backgroundColor: "#f0f0f0" }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>

            <div style={{ marginLeft: "5px", float: "right", marginBottom: "10px" }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData.length}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50", "100"]}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                />
            </div>

            <div style={{ float: "right", marginBottom: "10px" }}>
                <Input.Search
                    placeholder="Search"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                rowKey="key"
                size="small"
                pagination={false}
                style={{
                    background: "#fff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                }}
            />
        </div>
    );
};

export default SchemeType;