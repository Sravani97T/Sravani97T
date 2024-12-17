import React, { useState, useEffect } from "react";
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
import axios from "axios"; // Import axios for API requests
import { CREATE_jwel } from "../../Config/Config";
const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant name header

const BrandMaster = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isBrandNameExist, setIsBrandNameExist] = useState(false);
    const [oldBrandName, setOldBrandName] = useState(""); // Store old brand name for delete

    // Fetch data from the API
    useEffect(() => {
        axios.get(`${CREATE_jwel}/api/Master/MasterBrandMasterList`, {
            headers: {
                "tenantName": tenantNameHeader,
            }
        })
            .then(response => {
                setData(response.data.map((item, index) => ({
                    key: index + 1,
                    counterName: item.BrandName,
                })));
            })
            .catch(error => {
                message.error("Failed to fetch data");
            });
    }, []);

    // Check if the brand name exists
    const handleBrandNameCheck = (brandName) => {
        if (!brandName) return; // Prevent making an API request if the brandName is empty

        axios.get(`${CREATE_jwel}/api/Master/MasterBrandMasterSearch?BrandName=${brandName}`, {
            headers: {
                "tenantName": tenantNameHeader,
            }
        })
            .then(response => {
                console.log(response.data); // Log the response for debugging

                // Check if the response contains a valid result
                const brandExists = response.data.some(item => item.BrandName === brandName);

                if (brandExists) {
                    setIsBrandNameExist(true);
                    message.error("Brand name already exists!");
                } else {
                    setIsBrandNameExist(false);
                }
            })
            .catch(error => {
                message.error("Failed to check brand name");
                console.error(error); // Log the error for debugging
            });
    };

    // Handle adding a new brand
    const handleAdd = (values) => {
        if (isBrandNameExist) {
            message.error("Brand name already exists!");
            return;
        }

        axios.post(`${CREATE_jwel}/api/Master/MasterBrandMasterInsert`,
            {
                brandName: values.counterName,
                cloud_upload: true
            },
            {
                headers: {
                    "tenantName": tenantNameHeader,
                }
            })
            .then(response => {
                if (response.data) {
                    const newData = { key: Date.now(), counterName: values.counterName };
                    setData([...data, newData]);
                    form.resetFields();
                    message.success("Brand added successfully!");
                }
            })
            .catch(error => {
                message.error("Failed to add brand");
            });
    };

    // Handle editing a brand
    const handleEdit = (record) => {
        setEditingKey(record.key);
        setOldBrandName(record.counterName); // Store the old brand name for delete
        form.setFieldsValue({ counterName: record.counterName });
    };

    // Handle saving the edited brand
  // Handle saving the edited brand
  const handleSave = () => {
    const updatedData = form.getFieldsValue();

    // Check if the value is unchanged
    if (oldBrandName === updatedData.counterName) {
        setEditingKey(null); // Exit edit mode
        form.resetFields(); // Reset the form to switch back to Add mode
        return; // Exit without making an API call
    }

    // First, check if the brand name exists
    axios.get(`${CREATE_jwel}/api/Master/MasterBrandMasterSearch?BrandName=${updatedData.counterName}`, {
        headers: {
            "tenantName": tenantNameHeader,
        }
    })
        .then(response => {
            const brandExists = response.data.some(item => item.MANUFACTURER === updatedData.counterName);

            if (brandExists) {
                message.error("Brand name already exists!");
                return;
            }

            // If editing, delete the old brand name first
            if (oldBrandName !== updatedData.counterName) {
                axios.post(`${CREATE_jwel}/api/Master/MasterBrandMasterDelete?BrandName=${oldBrandName}`, null, {
                    headers: {
                        "tenantName": tenantNameHeader,
                    }
                })
                    .then(response => {
                        if (response.data) {
                            // Now insert the updated brand name
                            axios.post(`${CREATE_jwel}/api/Master/MasterBrandMasterInsert`,
                                {
                                    brandName: updatedData.counterName,
                                    cloud_upload: true
                                },
                                {
                                    headers: {
                                        "tenantName": tenantNameHeader,
                                    }
                                })
                                .then(response => {
                                    if (response.data) {
                                        setData(prevData =>
                                            prevData.map(item =>
                                                item.key === editingKey ? { ...item, ...updatedData } : item
                                            )
                                        );
                                        setEditingKey(null);
                                        form.resetFields();
                                        message.success("Brand updated successfully!");
                                    }
                                })
                                .catch(error => {
                                    message.error("Failed to update brand");
                                });
                        }
                    })
                    .catch(error => {
                        message.error("Failed to delete old brand");
                    });
            }
        })
        .catch(error => {
            message.error("Failed to check brand name");
        });
};


    // Handle deleting a brand
    const handleDelete = (brandName) => {
        axios.post(`${CREATE_jwel}/api/Master/MasterBrandMasterDelete?BrandName=${brandName}`, null, {
            headers: {
                "tenantName": tenantNameHeader,
            }
        })
            .then(response => {
                if (response.data) {
                    setData(data.filter((item) => item.counterName !== brandName));
                    message.success("Brand deleted successfully!");
                }
            })
            .catch(error => {
                message.error("Failed to delete brand");
            });
    };

    const filteredData = data.filter((item) =>
        Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: "Brand Name",
            dataIndex: "counterName",
            key: "counterName",
            sorter: (a, b) => a.counterName.localeCompare(b.counterName),
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
                        onConfirm={() => handleDelete(record.counterName)} // Pass brand name to delete
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{  backgroundColor: "#f4f6f9" }}>
            {/* Breadcrumb */}
            <Row justify="start" style={{ marginBottom: "16px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Brand Master</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            {/* Add/Edit Form */}
            <Card
                title={editingKey ? "Edit Brand" : "Add Brand"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="counterName"
                                label="Brand Name"
                                rules={[{ required: true, message: "Brand Name is required" }]}
                            >
                                <Input
                                    placeholder="Enter Brand Name"
                                    onChange={(e) => {
                                        const uppercaseValue = e.target.value.toUpperCase();  // Convert to uppercase
                                        form.setFieldsValue({ counterName: uppercaseValue });  // Set the transformed value back to the form field
                                        handleBrandNameCheck(uppercaseValue);  // Check brand name with uppercase value
                                    }}
                                />
                            </Form.Item>

                        </Col>
                    </Row>

                    <div style={{ textAlign: "left", marginTop: "16px", float: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 8, backgroundColor: "#0C1154", borderColor: "#0C1154" }}
                            disabled={isBrandNameExist === true}
                        >
                            {editingKey ? "Save" : "Submit"}
                        </Button>
                        <Button htmlType="button" onClick={() => setEditingKey(null)} style={{ backgroundColor: "#f0f0f0" }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>

            {/* Search Field */}
            <div style={{float:"right"}}>

                    <Input.Search
                        placeholder="Search records"
                        style={{ marginBottom: "10px", width: "100%", borderRadius: "4px" }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
              </div>

            {/* Table */}
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

export default BrandMaster;
