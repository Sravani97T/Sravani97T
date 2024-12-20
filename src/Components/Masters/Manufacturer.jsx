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
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
const Manufacturer = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isDuplicate, setIsDuplicate] = useState(false);  // State to check duplicate
    const [loading, setLoading] = useState(false); // State for preventing multiple submissions
    const [oldManufacturer, setOldManufacturer] = useState(""); // Store the old manufacturer for deletion

    const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant name header

    // Fetch data from API and map it to table format
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Master/MasterManufacturerMasterList`,
                {
                    headers: {
                        "tenant-name": tenantNameHeader,
                    },
                }
            );
            // Map response to include key for Table component
            const mappedData = response.data.map((item, index) => ({
                key: index + 1, // Assign a unique key
                Manufacturer: item.MANUFACTURER,
                cloudUpload: item.cloud_upload ? "Yes" : "No", // Convert boolean to readable value
            }));
            setData(mappedData);
        } catch (error) {
            message.error("Failed to fetch manufacturer data.");
        }
    };

    // Check for duplicate manufacturer
    const handleSearchDuplicate = async (manufacturerName) => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Master/MasterManufacturerMasterSearch?Manufacturer=${encodeURIComponent(
                    manufacturerName.trim()
                )}`,
                {
                    headers: {
                        "tenant-name": tenantNameHeader,
                    },
                }
            );
            setIsDuplicate(response.data.length > 0); // Set to true if manufacturer already exists
        } catch (error) {
            console.error("Error checking for duplicate:", error);
            message.error("Error checking for duplicate manufacturer.");
        }
    };

    // Handle Add manufacturer
    const handleAdd = async (values) => {
        if (isDuplicate) {
            message.error("Manufacturer already exists!");
            return; // Prevent adding if duplicate is found
        }

        // Prevent multiple submissions
        if (loading) return;

        setLoading(true);

        try {
            const response = await axios.post(
                `${CREATE_jwel}/api/Master/MasterManufacturerMasterInsert`,
                {
                    manufacturer: values.Manufacturer,
                    cloud_upload: true, // Assuming cloud_upload is true by default
                },
                {
                    headers: {
                        "tenant-name": tenantNameHeader,
                    },
                }
            );

            if (response.data) {
                message.success("Manufacturer added successfully!");
                fetchData(); // Re-fetch data after adding
                form.resetFields(); // Reset form after submission
            } else {
                message.error("Failed to add manufacturer.");
            }
        } catch (error) {
            console.error("Error adding manufacturer:", error);
            message.error("An error occurred while adding the manufacturer.");
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    const handleDelete = async (manufacturerName) => {
        try {
            const response = await axios.post(
                `${CREATE_jwel}/api/Master/MasterManufacturerMasterDelete?Manufacturer=${encodeURIComponent(
                    manufacturerName.trim()
                )}`,
                null, // No request body for this API
                {
                    headers: {
                        "tenant-name": tenantNameHeader,
                    },
                }
            );

            if (response.data === true) {
                setData(data.filter((item) => item.Manufacturer !== manufacturerName));
                message.success("Manufacturer deleted successfully!");
            } else {
                message.error("Failed to delete manufacturer.");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while deleting the manufacturer.");
        }
    };
    const handleEdit = (record) => {
        setOldManufacturer(record.Manufacturer); // Store old manufacturer name for deletion
        setEditingKey(record.key);
        form.setFieldsValue(record);
        window.scrollTo(0, 0);
    };

    const handleSave = async (values) => {
        if (isDuplicate) {
            message.error("Manufacturer already exists!");
            return; // Prevent saving if duplicate is found
        }

        // Prevent multiple submissions
        if (loading) return;

        setLoading(true);

        try {
            // 1. Delete the old manufacturer
            const deleteResponse = await axios.post(
                `${CREATE_jwel}/api/Master/MasterManufacturerMasterDelete?Manufacturer=${encodeURIComponent(
                    oldManufacturer.trim()
                )}`,
                null, // No request body for this API
                {
                    headers: {
                        "tenant-name": tenantNameHeader,
                    },
                }
            );

            if (deleteResponse.data === true) {
                // 2. Insert the new manufacturer
                const insertResponse = await axios.post(
                    `${CREATE_jwel}/api/Master/MasterManufacturerMasterInsert`,
                    {
                        manufacturer: values.Manufacturer,
                        cloud_upload: true, // Assuming cloud_upload is true by default
                    },
                    {
                        headers: {
                            "tenant-name": tenantNameHeader,
                        },
                    }
                );

                if (insertResponse.data) {
                    message.success("Manufacturer updated successfully!");
                    fetchData(); // Re-fetch data after adding
                    form.resetFields(); // Reset form after submission
                } else {
                    message.error("Failed to insert new manufacturer.");
                }
            } else {
                message.error("Failed to delete the old manufacturer.");
            }
        } catch (error) {
            console.error("Error saving manufacturer:", error);
            message.error("An error occurred while saving the manufacturer.");
        } finally {
            setLoading(false); // Reset loading state
        }
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
            title: "Manufacturer",
            dataIndex: "Manufacturer",
            key: "Manufacturer",
            sorter: (a, b) => a.Manufacturer.localeCompare(b.Manufacturer),
        },
        {
            title: "Cloud Upload",
            dataIndex: "cloudUpload",
            align:'center',

            key: "cloudUpload",
        },
        {
            title: "Action",
            key: "action",
            align:'center',

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
                        onConfirm={() => handleDelete(record.Manufacturer)} // Pass Manufacturer name
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
        <div style={{  backgroundColor: "#f4f6f9" }}>
            {/* Breadcrumb */}
            <Row justify="start" style={{ marginBottom: "16px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Manufacturer</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Brand" : "Add Brand"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="Manufacturer"
                                label="Manufacturer"
                                rules={[{ required: true, message: "Manufacturer is required" }]}
                            >
                                <Input
                                    placeholder="Enter Manufacturer"
                                    onChange={(e) => handleSearchDuplicate(e.target.value)} // Check for duplicate on change
                                    onKeyDown={handleEnterPress} // Submit form on Enter key press
                                />
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
                            disabled={isDuplicate || loading} // Disable button if duplicate or loading
                        >
                            {editingKey ? "Save" : "Submit"}
                        </Button>
                        <Button htmlType="button" onClick={handleCancel} style={{ backgroundColor: "#f0f0f0" }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>

            <div style={{float:"right"}}>

                    <Input.Search
                        placeholder="Search records"
                        style={{ marginBottom: "10px", width: "100%", borderRadius: "4px" }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="key"
                size="small"
                pagination={{ pageSize: 5 }}
                style={{
                    background: "#fff",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                }}
            />
        </div>
    );
};

export default Manufacturer;
