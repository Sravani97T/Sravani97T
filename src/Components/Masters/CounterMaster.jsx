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
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
const { Option } = Select;

const CounterMaster = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [, setIsDuplicate] = useState(false);
    const counterInputRef = useRef(); // Ref for the second input field
    const [rowdata, setRowdata] = useState(null);
    const mainCounterOptions = Array.from({ length: 10 }, (_, i) => `CTN ${i + 1}`);

    const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant header value

    useEffect(() => {
        GetAllCounters();
    }, []); 
    const GetAllCounters = () => {

        // Fetch data from the API when the component is mounted
        axios.get(`${CREATE_jwel}/api/Master/MasterCounterMasterList`, {
            headers: { "tenantName": tenantNameHeader }
        })
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                message.error("Failed to load counter data.");
            });
        }

    const handleAdd = (values) => {
        const upperCaseValues = {
            ...values,
            counterName: values.counterName.toUpperCase(),  // Force uppercase for counterName
        };

        const requestBody = {
            countername: upperCaseValues.counterName, // Matches "countername" in the API body
            cntchartdisplay: upperCaseValues.counterChart, // Matches "cntchartdisplay" in the API body
            cloud_upload: true, // Assuming "cloud_upload" is always true for this request
        };

        // Check if counter already exists
        axios
            .get(
                `${CREATE_jwel}/api/Master/MasterCounterMasterSearch?CounterName=${upperCaseValues.counterName}`,
                { headers: { tenantName: tenantNameHeader } }
            )
            .then((response) => {
                if (response.data.length > 0) {
                    setIsDuplicate(true); // Show duplicate message
                    message.error("Counter already exists!");
                } else {
                    // Send the request to add a new counter
                    axios
                        .post(
                            `${CREATE_jwel}/api/Master/MasterCounterMasterInsert`,
                            requestBody,
                            { headers: { tenantName: tenantNameHeader } }
                        )
                        .then(() => {
                            form.resetFields();
                            message.success("Counter added successfully!");
                            setIsDuplicate(false); // Reset duplicate flag

                            // Fetch the updated list
                            axios
                                .get(
                                    `${CREATE_jwel}/api/Master/MasterCounterMasterList`,
                                    { headers: { tenantName: tenantNameHeader } }
                                )
                                .then((response) => {
                                    setData(response.data); // Update table data with the latest list
                                })
                                .catch((error) => {
                                    console.error("Error fetching updated data:", error);
                                    message.error("Failed to refresh counter data.");
                                });
                        })
                        .catch((error) => {
                            console.error("Error adding counter:", error);
                            message.error("Failed to add counter.");
                        });
                }
            })
            .catch((error) => {
                console.error("Error checking counter name:", error);
            });
    };

    const handleEdit = (record) => {
        setEditingKey(true); // Set the record's unique key
        setRowdata(record);
        form.setFieldsValue({
            counterName: record.COUNTERNAME, // Adjust field names to match API data
            counterChart: record.CNTCHARTDISPLAY,
        });
        window.scrollTo(0, 0); // Scroll to the form for editing
    };
    console.log("rowdata", rowdata);

    const handleEditFunction = async (values) => {
        console.log("values", values);
    
        // Convert the new counter name to uppercase
        const upperCaseValues = {
            ...values,
            counterName: values.counterName.toUpperCase(), // Ensure it is uppercase
        };
    
        // Step 1: Compare the updated data with the original (rowdata) to check if there are any changes
        const updatedData = form.getFieldsValue();
    
        if (
            upperCaseValues.counterName === rowdata.COUNTERNAME &&
            updatedData.counterChart === rowdata.CNTCHARTDISPLAY // Assuming `counterChart` is a field
        ) {
            // If no changes, reset the form and stop processing
            form.resetFields();
            setEditingKey(false); // Switch back to Add form
            return; // Stop further processing
        }
    
        // Step 2: Check if the new counter name already exists
        try {
            const searchResponse = await axios.get(
                `${CREATE_jwel}/api/Master/MasterCounterMasterSearch?CounterName=${upperCaseValues.counterName}`,
                { headers: { tenantName: tenantNameHeader } }
            );
    
            if (searchResponse.data.length > 0 && upperCaseValues.counterName !== rowdata.COUNTERNAME) {
                message.error("Counter name already exists!");
                return; // Stop if a duplicate is found
            }
    
            // Step 3: Delete the old counter if the counter name has changed
            const deleteResponse = await axios.post(
                `${CREATE_jwel}/api/Master/MasterCounterMasterDelete?CounterName=${rowdata.COUNTERNAME}`,
                null, // No request body
                { headers: { tenantName: tenantNameHeader } }
            );
    
            if (deleteResponse.data) {
                setRowdata(null); // Reset row data
    
                // Step 4: Create a new counter after successful deletion
                const requestBody = {
                    countername: upperCaseValues.counterName, // New counter name
                    cntchartdisplay: upperCaseValues.counterChart, // New counter chart
                    cloud_upload: true, // Assuming it's always true
                };
    
                const createResponse = await axios.post(
                    `${CREATE_jwel}/api/Master/MasterCounterMasterInsert`,
                    requestBody,
                    { headers: { tenantName: tenantNameHeader } }
                );
    
                if (createResponse.data) {
                    message.success("Counter updated successfully!");
                    form.resetFields();
                    GetAllCounters(); // Refresh counters list
                    setEditingKey(false); // Reset to add form
                } else {
                    message.error("Failed to create new counter.");
                }
            } 
        } catch (error) {
            console.error("Error during the process:", error);
            message.error("An error occurred while updating the counter.");
        }
    };
    
    
    
    const handleDelete = (key, counterName) => {
        axios
            .post(
                `${CREATE_jwel}/api/Master/MasterCounterMasterDelete?CounterName=${counterName}`,
                null, // No request body is required
                { headers: { tenantName: tenantNameHeader } }
            )
            .then((response) => {
                if (response.data) {  // Check if response contains data, which indicates success
                    message.success("Counter deleted successfully!");
                    GetAllCounters();  // Refresh counters list
                } else {
                    message.error("Failed to delete the counter.");
                }
            })
            .catch((error) => {
                console.error("Error deleting counter:", error);
                message.error("Failed to delete counter.");
            });
    };
    

    const handleCancel = useCallback(() => {
        form.resetFields();
        setEditingKey(false);
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
            dataIndex: "COUNTERNAME",
            key: "COUNTERNAME",
            sorter: (a, b) => a.COUNTERNAME.localeCompare(b.COUNTERNAME),
        },
        {
            title: "Counter Chart",
            dataIndex: "CNTCHARTDISPLAY",
            key: "CNTCHARTDISPLAY",
            align:'center',

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
                        onConfirm={() => handleDelete(record.key, record.COUNTERNAME)}
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
        <div style={{ backgroundColor: "#f4f6f9" }}>
            {/* Breadcrumb */}
            <Row justify="start" style={{ marginBottom: "16px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Counter Master</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Counter" : "Add Counter"}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleEditFunction : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={12}>
                            <Form.Item
                                name="counterName"
                                label="Counter Name"
                                rules={[{ required: true, message: "Counter Name is required" }]}
                            >
                                <Input
                                    placeholder="Enter Counter Name"
                                    onChange={(e) => {
                                        const upperCaseValue = e.target.value.toUpperCase(); // Convert input to uppercase
                                        form.setFieldsValue({ counterName: upperCaseValue }); // Update form value with uppercase
                                    }}
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
                                    value={form.getFieldValue("counterChart")} // Ensure this field has a value
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

            <div style={{float:"right"}}>

                    <Input.Search
                        placeholder="Search records"
                        style={{ marginBottom: "16px", width: "100%", borderRadius: "4px" }}
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

export default CounterMaster;
