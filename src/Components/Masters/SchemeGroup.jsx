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
    Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const SchemeGroup = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [schemeTypes, setSchemeTypes] = useState([]); // State for scheme types
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [oldSchemeGroup, setOldSchemeGroup] = useState(""); // Store old SchemeGroup for deletion
    const [oldSchemeType, setOldSchemeType] = useState(""); // Store old SchemeType for deletion

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_GROUP"
            );
            const mappedData = response.data.map((item, index) => ({
                key: index + 1,
                SchemeGroup: item.SchemeGroup,
                SchemeType: item.SchemeType,
                cloudUpload: item.CLOUD_UPLOAD ? "Yes" : "No",
            }));
            setData(mappedData);

            // Extract unique scheme types for the dropdown
            const uniqueSchemeTypes = [
                ...new Set(response.data.map((item) => item.SchemeType)),
            ];
            setSchemeTypes(uniqueSchemeTypes);
        } catch (error) {
            message.error("Failed to fetch scheme group data.");
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
                "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeGroup",
                {
                    schemeType: values.SchemeType,
                    schemeGroup: values.SchemeGroup,
                    groupcode: "",
                    grouptype: "",
                    cardno: 0,
                    clouD_UPLOAD: true,
                }
            );

            if (response.data) {
                message.success("Scheme Group added successfully!");
                fetchData();
                form.resetFields();
            } else {
                message.error("Failed to add Scheme Group.");
            }
        } catch (error) {
            console.error("Error adding Scheme Group:", error);
            message.error("An error occurred while adding the Scheme Group.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (schemeType, schemeGroup) => {
        try {
            const response = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeGroup?schemeType=${encodeURIComponent(
                    schemeType.trim()
                )}&schemeGroup=${encodeURIComponent(schemeGroup.trim())}`
            );

            if (response.data === true) {
                setData(data.filter((item) => item.SchemeGroup !== schemeGroup));
                message.success("Scheme Group deleted successfully!");
            } else {
                message.error("Failed to delete Scheme Group.");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while deleting the Scheme Group.");
        }
    };

    const handleEdit = (record) => {
        setOldSchemeGroup(record.SchemeGroup); // Store old SchemeGroup for deletion
        setOldSchemeType(record.SchemeType); // Store old SchemeType for deletion
        setEditingKey(record.key);
        form.setFieldsValue(record);
        window.scrollTo(0, 0);
    };

    const handleSave = async (values) => {
        if (loading) return;

        setLoading(true);
        try {
            // Delete the old SchemeGroup
            const deleteResponse = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeGroup?schemeType=${encodeURIComponent(
                    oldSchemeType.trim()
                )}&schemeGroup=${encodeURIComponent(oldSchemeGroup.trim())}`
            );

            if (deleteResponse.data === true) {
                // Insert the updated SchemeGroup
                const insertResponse = await axios.post(
                    "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeGroup",
                    {
                        schemeType: values.SchemeType,
                        schemeGroup: values.SchemeGroup,
                        groupcode: "",
                        grouptype: "",
                        cardno: 0,
                        clouD_UPLOAD: true,
                    }
                );

                if (insertResponse.data) {
                    message.success("Scheme Group updated successfully!");
                    fetchData();
                    setEditingKey(null);
                    form.resetFields();
                } else {
                    message.error("Failed to update Scheme Group.");
                }
            } else {
                message.error("Failed to delete the old Scheme Group.");
            }
        } catch (error) {
            console.error("Error saving Scheme Group:", error);
            message.error("An error occurred while saving the Scheme Group.");
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
            title: "Scheme Group",
            dataIndex: "SchemeGroup",
            key: "SchemeGroup",
            sorter: (a, b) => a.SchemeGroup.localeCompare(b.SchemeGroup),
        },
        {
            title: "Scheme Type",
            dataIndex: "SchemeType",
            key: "SchemeType",
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
                        onConfirm={() => handleDelete(record.SchemeType, record.SchemeGroup)}
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
                        <Breadcrumb.Item>Scheme Group</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Scheme Group" : "Add Scheme Group"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="SchemeGroup"
                                label="Scheme Group"
                                rules={[{ required: true, message: "Scheme Group is required" }]}
                            >
                                <Input placeholder="Enter Scheme Group" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                            
                                name="SchemeType"
                                label="Scheme Type"
                                rules={[{ required: true, message: "Scheme Type is required" }]}
                            >
                                <Select placeholder="Select Scheme Type">
                                    {schemeTypes.map((type) => (
                                        <Option key={type} value={type}>
                                            {type}
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

export default SchemeGroup;