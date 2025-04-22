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

const SchemeName = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [schemeTypes, setSchemeTypes] = useState([]);
    const [schemeGroups, setSchemeGroups] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [oldSchemeName, setOldSchemeName] = useState({});

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_NAME"
            );
            const mappedData = response.data.map((item, index) => ({
                key: index + 1,
                ...item,
            }));
            setData(mappedData);
        } catch (error) {
            message.error("Failed to fetch scheme name data.");
        }
    };

    const fetchSchemeTypes = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_TYPE"
            );
            setSchemeTypes(response.data);
        } catch (error) {
            message.error("Failed to fetch scheme types.");
        }
    };

    const fetchSchemeGroups = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_GROUP"
            );
            setSchemeGroups(response.data);
        } catch (error) {
            message.error("Failed to fetch scheme groups.");
        }
    };

    useEffect(() => {
        fetchData();
        fetchSchemeTypes();
        fetchSchemeGroups();
    }, []);

    const handleAdd = async (values) => {
        if (loading) return;
    
        setLoading(true);
        try {
            const response = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeName",
                {
                    schemeGroup: values.SchemeGroup,
                    schemeType: values.SchemeType,
                    schemeName: values.SchemeName,
                    schemeAmount: values.SchemeAmount,
                    schemeDuration: values.SchemeDuration,
                    schemePersons: values.NoOfPersons,
                    bonusAmount: values.BonusAmount,
                    schemeValue: values.SchemeValue,
                    schemeDate: new Date().toISOString(), // Example: Current date
                    schemeEndDate: new Date().toISOString(), // Example: Current date
                    schemeMode: "Default", // Example: Default value
                    bonusMonth: values.BonusMonth,
                    giftVoucher: 0, // Example: Default value
                    commper: 0, // Example: Default value
                    commamt: 0, // Example: Default value
                    clouD_UPLOAD: true,
                }
            );
    
            if (response.data) {
                message.success("Scheme Name added successfully!");
                fetchData();
                form.resetFields();
            } else {
                message.error("Failed to add Scheme Name.");
            }
        } catch (error) {
            console.error("Error adding Scheme Name:", error);
            message.error("An error occurred while adding the Scheme Name.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleSave = async (values) => {
        if (loading) return;
    
        setLoading(true);
        try {
            // Delete the old Scheme Name
            const deleteResponse = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeName?schemeType=${encodeURIComponent(
                    oldSchemeName.SchemeType
                )}&schemeGroup=${encodeURIComponent(
                    oldSchemeName.SchemeGroup
                )}&schemeName=${encodeURIComponent(oldSchemeName.SchemeName)}`
            );
    
            if (deleteResponse.data === true) {
                // Insert the updated Scheme Name
                const insertResponse = await axios.post(
                    "http://www.jewelerp.timeserasoftware.in/api/Scheme/InsertSchemeName",
                    {
                        schemeGroup: values.SchemeGroup,
                        schemeType: values.SchemeType,
                        schemeName: values.SchemeName,
                        schemeAmount: values.SchemeAmount,
                        schemeDuration: values.SchemeDuration,
                        schemePersons: values.NoOfPersons,
                        bonusAmount: values.BonusAmount,
                        schemeValue: values.SchemeValue,
                        schemeDate: new Date().toISOString(), // Example: Current date
                        schemeEndDate: new Date().toISOString(), // Example: Current date
                        schemeMode: "Default", // Example: Default value
                        bonusMonth: values.BonusMonth,
                        giftVoucher: 0, // Example: Default value
                        commper: 0, // Example: Default value
                        commamt: 0, // Example: Default value
                        clouD_UPLOAD: true,
                    }
                );
    
                if (insertResponse.data) {
                    message.success("Scheme Name updated successfully!");
                    fetchData();

                    setEditingKey(null);

                    form.resetFields();
                } else {
                    message.error("Failed to update Scheme Name.");
                }
            } else {
                message.error("Failed to delete the old Scheme Name.");
            }
        } catch (error) {
            console.error("Error saving Scheme Name:", error);
            message.error("An error occurred while saving the Scheme Name.");
        } finally {
            setLoading(false);
        }
    };
    

    const handleDelete = async (record) => {
        try {
            const response = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/DeleteSchemeName?schemeType=${encodeURIComponent(
                    record.SchemeType
                )}&schemeGroup=${encodeURIComponent(
                    record.SchemeGroup
                )}&schemeName=${encodeURIComponent(record.SchemeName)}`
            );

            if (response.data === true) {
                setData(data.filter((item) => item.key !== record.key));
                message.success("Scheme Name deleted successfully!");
            } else {
                message.error("Failed to delete Scheme Name.");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while deleting the Scheme Name.");
        }
    };

    const handleEdit = (record) => {
        setOldSchemeName({
            SchemeType: record.SchemeType,
            SchemeGroup: record.SchemeGroup,
            SchemeName: record.SchemeName,
        }); // Store old values for deletion
        setEditingKey(record.key);
    
        // Map SchemePersons to NoOfPersons
        form.setFieldsValue({
            ...record,
            NoOfPersons: record.SchemePersons || 0, // Map SchemePersons to NoOfPersons
        });
    
        window.scrollTo(0, 0);
    };
    

  

    const handleCancel = useCallback(() => {
        form.resetFields();
        setEditingKey(null);
    }, [form]);

    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            form.submit();
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
            title: "Scheme Type",
            dataIndex: "SchemeType",
            key: "SchemeType",
        },
        {
            title: "Scheme Name",
            dataIndex: "SchemeName",
            key: "SchemeName",
        },
        {
            title: "Scheme Amount",
            dataIndex: "SchemeAmount",
            key: "SchemeAmount",
            render: (amount) => amount.toFixed(2), // Format as a decimal
        },
        {
            title: "Scheme Duration (Months)",
            dataIndex: "SchemeDuration",
            key: "SchemeDuration",
        },
        {
            title: "Bonus Amount",
            dataIndex: "BonusAmount",
            key: "BonusAmount",
            render: (amount) => amount.toFixed(2),
        },
        {
            title: "Scheme Value",
            dataIndex: "SchemeValue",
            key: "SchemeValue",
            render: (value) => value.toFixed(2),
        },
        {
            title: "Bonus Month",
            dataIndex: "BonusMonth",
            key: "BonusMonth",
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
        <div style={{ backgroundColor: "#f4f6f9" }}>
            <Row justify="start" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Scheme Name</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Scheme Name" : "Add Scheme Name"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
      <Form
    form={form}
    layout="vertical"
    onFinish={editingKey ? handleSave : handleAdd}
    onKeyPress={handleEnterPress}
>
    <Row gutter={16}>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="SchemeGroup"
                label="Scheme Group"
                rules={[{ required: true, message: "Scheme Group is required" }]}
            >
                <Select
                    showSearch
                    placeholder="Select Scheme Group"
                    optionFilterProp="children"
                >
                    {schemeGroups.map((group) => (
                        <Option key={group.SchemeGroup} value={group.SchemeGroup}>
                            {group.SchemeGroup}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="SchemeType"
                label="Scheme Type"
                rules={[{ required: true, message: "Scheme Type is required" }]}
            >
                <Select
                    showSearch
                    placeholder="Select Scheme Type"
                    optionFilterProp="children"
                >
                    {schemeTypes.map((type) => (
                        <Option key={type.SchemeType} value={type.SchemeType}>
                            {type.SchemeType}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="SchemeName"
                label="Scheme Name"
                rules={[{ required: true, message: "Scheme Name is required" }]}
            >
                <Input placeholder="Enter Scheme Name" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="SchemeAmount"
                label="Scheme Amount"
                rules={[{ required: true, message: "Scheme Amount is required" }]}
            >
                <Input placeholder="Enter Scheme Amount" type="number" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="SchemeDuration"
                label="Scheme Duration"
                rules={[{ required: true, message: "Scheme Duration is required" }]}
            >
                <Input placeholder="Enter Scheme Duration (in months)" type="number" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="NoOfPersons"
                label="No. of Persons"
                rules={[{ required: true, message: "No. of Persons is required" }]}
            >
                <Input placeholder="Enter No. of Persons" type="number" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="BonusAmount"
                label="Bonus Amount"
                rules={[{ required: true, message: "Bonus Amount is required" }]}
            >
                <Input placeholder="Enter Bonus Amount" type="number" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="BonusMonth"
                label="Bonus Month"
                rules={[{ required: true, message: "Bonus Month is required" }]}
            >
                <Input placeholder="Enter Bonus Month" />
            </Form.Item>
        </Col>
        <Col xs={24} sm={12} lg={12}>
            <Form.Item
                name="SchemeValue"
                label="Scheme Value"
                rules={[{ required: true, message: "Scheme Value is required" }]}
            >
                <Input placeholder="Enter Scheme Value" type="number" />
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

export default SchemeName;