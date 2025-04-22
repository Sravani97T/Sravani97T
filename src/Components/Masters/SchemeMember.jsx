import React, { useState, useEffect, useCallback } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Radio,
    DatePicker,
    Row,
    Col,
    Card,
    Table,
    Space,
    Popconfirm,
    message,
    Breadcrumb,
    Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const SchemeMember = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [collectionPoint, setCollectionPoint] = useState("Shop");
    const [oldSchemeMember, setOldSchemeMember] = useState({}); // Store old values for deletion

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_MEMBER"
            );
            const mappedData = response.data.map((item, index) => ({
                key: index + 1,
                ...item,
            }));
            setData(mappedData);
        } catch (error) {
            message.error("Failed to fetch scheme member data.");
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
                "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeMember",
                {
                    ...values,
                    clouD_UPLOAD: true,
                }
            );

            if (response.data) {
                message.success("Scheme Member added successfully!");
                fetchData();
                form.resetFields();
            } else {
                message.error("Failed to add Scheme Member.");
            }
        } catch (error) {
            console.error("Error adding Scheme Member:", error);
            message.error("An error occurred while adding the Scheme Member.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record) => {
        try {
            const response = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeMember?schemeType=${encodeURIComponent(
                    record.SchemeType
                )}&schemeGroup=${encodeURIComponent(
                    record.SchemeGroup
                )}&schemeMember=${encodeURIComponent(record.SchemeMember)}`
            );

            if (response.data === true) {
                setData(data.filter((item) => item.key !== record.key));
                message.success("Scheme Member deleted successfully!");
            } else {
                message.error("Failed to delete Scheme Member.");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while deleting the Scheme Member.");
        }
    };

    const handleEdit = (record) => {
        setOldSchemeMember({
            SchemeType: record.SchemeType,
            SchemeGroup: record.SchemeGroup,
            SchemeMember: record.SchemeMember,
        }); // Store old values for deletion
        setEditingKey(record.key);
        form.setFieldsValue(record);
        window.scrollTo(0, 0);
    };

    const handleSave = async (values) => {
        if (loading) return;

        setLoading(true);
        try {
            // Delete the old Scheme Member
            const deleteResponse = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeMember?schemeType=${encodeURIComponent(
                    oldSchemeMember.SchemeType
                )}&schemeGroup=${encodeURIComponent(
                    oldSchemeMember.SchemeGroup
                )}&schemeMember=${encodeURIComponent(oldSchemeMember.SchemeMember)}`
            );

            if (deleteResponse.data === true) {
                // Insert the updated Scheme Member
                const insertResponse = await axios.post(
                    "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeMember",
                    {
                        ...values,
                        clouD_UPLOAD: true,
                    }
                );

                if (insertResponse.data) {
                    message.success("Scheme Member updated successfully!");
                    fetchData();
                    setEditingKey(null);
                    form.resetFields();
                } else {
                    message.error("Failed to update Scheme Member.");
                }
            } else {
                message.error("Failed to delete the old Scheme Member.");
            }
        } catch (error) {
            console.error("Error saving Scheme Member:", error);
            message.error("An error occurred while saving the Scheme Member.");
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
        },
        {
            title: "Scheme Name",
            dataIndex: "SchemeName",
            key: "SchemeName",
        },
        {
            title: "Scheme Member",
            dataIndex: "SchemeMember",
            key: "SchemeMember",
        },
        {
            title: "Mobile No. 1",
            dataIndex: "Mobile1",
            key: "Mobile1",
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
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ backgroundColor: "#f4f6f9",  }}>
            <Row justify="start" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Scheme Member</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Scheme Member" : "Add Scheme Member"}
                bordered={false}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Type"
                                name="schemeType"
                                rules={[{ required: true, message: "Scheme Type is required" }]}
                            >
                                <Select placeholder="Select Scheme Type">
                                    <Option value="gold">Gold</Option>
                                    <Option value="cash">Cash</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Group"
                                name="schemeGroup"
                                rules={[{ required: true, message: "Scheme Group is required" }]}
                            >
                                <Select placeholder="Select Scheme Group" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Name"
                                name="schemeName"
                                rules={[{ required: true, message: "Scheme Name is required" }]}
                            >
                                <Select placeholder="Select Scheme Name" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Member Name"
                                name="memberName"
                                rules={[{ required: true, message: "Member Name is required" }]}
                            >
                                <Input placeholder="Enter Member Name" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Card No"
                                name="cardNo"
                                rules={[{ required: true, message: "Card No is required" }]}
                            >
                                <Input readOnly style={{ fontWeight: "bold", color: "red" }} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[{ required: true, message: "Gender is required" }]}
                            >
                                <Radio.Group>
                                    <Radio value="Male">Male</Radio>
                                    <Radio value="Female">Female</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: "City is required" }]}
                            >
                                <Select placeholder="Select City" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: "Address is required" }]}
                            >
                                <Input.TextArea rows={1} placeholder="Enter Address" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Pin Code"
                                name="pinCode"
                                rules={[{ required: true, message: "Pin Code is required" }]}
                            >
                                <Input placeholder="Enter Pin Code" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="State"
                                name="state"
                                rules={[{ required: true, message: "State is required" }]}
                            >
                                <Input placeholder="Enter State" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="District"
                                name="district"
                                rules={[{ required: true, message: "District is required" }]}
                            >
                                <Select placeholder="Select District" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Mobile No. 1"
                                name="mobile1"
                                rules={[{ required: true, message: "Mobile No. 1 is required" }]}
                            >
                                <Input placeholder="Enter Mobile No. 1" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Mobile No. 2"
                                name="mobile2"
                            >
                                <Input placeholder="Enter Mobile No. 2" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ type: "email", message: "Enter a valid email" }]}
                            >
                                <Input placeholder="Enter Email" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Join Date"
                                name="joinDate"
                                rules={[{ required: true, message: "Scheme Join Date is required" }]}
                            >
                                <DatePicker format="DD-MMM-YYYY" style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Collection Point"
                                name="collectionPoint"
                                rules={[{ required: true, message: "Collection Point is required" }]}
                            >
                                <Radio.Group
                                    onChange={(e) => setCollectionPoint(e.target.value)}
                                    value={collectionPoint}
                                >
                                    <Radio value="Shop">Shop</Radio>
                                    <Radio value="Home">Home</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button htmlType="submit" type="primary">
                                {editingKey ? "Save" : "Submit"}
                            </Button>
                        </Col>
                        <Col>
                            <Button htmlType="button" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
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

export default SchemeMember;