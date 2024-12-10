import React, { useState,  useRef,  } from "react";
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
    Radio,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const EmployeeMaster = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        {
            key: 1,
            employeeName: "John Doe",
            employeeCode: "E12345",
            gender: "Male",
            address: "Main St, Metropolis",
            city: "Metropolis",
            pincode: "123456",
            district: "District A",
            state: "State A",
            phoneNo: "9876543210",
            mobileNo: "9123456780",
            email: "john@example.com",
            designation: "Manager",
            basicSalary: 50000,
            DA: 10000,
            TA: 5000,
            PF: 2000,
            HRA: 7000,
            LIC: 1000,
            netSalary: 60000,
        },
    ]);
    const [editingKey, setEditingKey] = useState(null);

    const handleAdd = (values) => {
        const newData = {
            key: Date.now(),
            ...values,
        };
        setData([...data, newData]);
        form.resetFields();
        message.success("Employee details added successfully!");
    };

    const handleDelete = (key) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Employee details deleted successfully!");
    };

    const handleEdit = (record) => {
        setEditingKey(record.key);
        form.setFieldsValue(record);
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
        message.success("Employee details updated successfully!");
    };


    const columns = [
        { title: "Employee Name", dataIndex: "employeeName", key: "employeeName" },
        { title: "Employee Code", dataIndex: "employeeCode", key: "employeeCode" },
        { title: "Gender", dataIndex: "gender", key: "gender" },
        { title: "Phone No.", dataIndex: "phoneNo", key: "phoneNo" },
        { title: "Mobile No.", dataIndex: "mobileNo", key: "mobileNo" },
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Designation", dataIndex: "designation", key: "designation" },
        { title: "Net Salary", dataIndex: "netSalary", key: "netSalary" },
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
    const refs = {
        employeeNameRef: useRef(),
        employeeCodeRef: useRef(),
        genderRef: useRef(),
        addressRef: useRef(),
        cityRef: useRef(),
        pincodeRef: useRef(),
        districtRef: useRef(),
        stateRef: useRef(),
        phoneNoRef: useRef(),
        mobileNoRef: useRef(),
        emailRef: useRef(),
        designationRef: useRef(),
        basicSalaryRef: useRef(),
        DARef: useRef(),
        TARef: useRef(),
        PFRef: useRef(),
        HRARef: useRef(),
        LICRef: useRef(),
        netSalaryRef: useRef(),
    };
    const handleEnterPress = (e, nextRef) => {
        e.preventDefault();
        if (nextRef?.current) {
          nextRef.current.focus();
        } else {
          form.submit(); // Submit the form if there's no next field
        }
      };
    return (
        <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
            <Row justify="start" style={{ marginBottom: "16px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>EmployeeMaster</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Employee Details" : "Add Employee Details"}
                style={{
                    marginBottom: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        {/* Personal Details Section */}
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="employeeName"
                                label="Employee Name"
                                rules={[{ required: true, message: "Employee Name is required" }]}
                            >
                                <Input
                                    placeholder="Enter Employee Name" ref={refs.empnameRef}
                                    onPressEnter={(e) => handleEnterPress(e, refs.employeeCodeRef)} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="employeeCode"
                                label="Employee Code"
                                rules={[{ required: true, message: "Employee Code is required" }]}
                            >
                                <Input
                                    ref={refs.employeeCodeRef}
                                    placeholder="Enter Employee Code" onPressEnter={(e) => handleEnterPress(e, refs.mobileNo2Ref)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[{ required: true, message: "Gender is required" }]}
                            >
                                <Radio.Group>
                                    <Radio value="Male">Male</Radio>
                                    <Radio value="Female">Female</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: "Address is required" }]}
                            >
                                <Input.TextArea rows={4}
                                    placeholder="Enter Address"

                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="city"
                                label="City"
                                rules={[{ required: true, message: "City is required" }]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Select City"

                                >
                                    <Option value="Metropolis">Metropolis</Option>
                                    <Option value="Townsville">Townsville</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="pincode"
                                label="Pincode"
                                rules={[{ required: true, message: "Pincode is required" }]}
                            >
                                <Input placeholder="Enter Pincode" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="district"
                                label="District"
                                rules={[{ required: true, message: "District is required" }]}
                            >
                                <Input placeholder="Enter District" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="state"
                                label="State"
                                rules={[{ required: true, message: "State is required" }]}
                            >
                                <Input placeholder="Enter State" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="phoneNo"
                                label="Phone No."
                                rules={[{ required: true, message: "Phone No. is required" }]}
                            >
                                <Input placeholder="Enter Phone No." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="mobileNo"
                                label="Mobile No."
                                rules={[{ required: true, message: "Mobile No. is required" }]}
                            >
                                <Input placeholder="Enter Mobile No." />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[{ required: true, message: "Email is required" }]}
                            >
                                <Input placeholder="Enter Email" />
                            </Form.Item>
                        </Col>

                        {/* Salary Details Section */}
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="designation"
                                label="Designation"
                                rules={[{ required: true, message: "Designation is required" }]}
                            >
                                <Select placeholder="Select Designation" showSearch>
                                    <Option value="Manager">Manager</Option>
                                    <Option value="Staff">Staff</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="basicSalary"
                                label="Basic Salary"
                                rules={[{ required: true, message: "Basic Salary is required" }]}
                            >
                                <Input type="number" placeholder="Enter Basic Salary" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="DA"
                                label="DA"
                                rules={[{ required: true, message: "DA is required" }]}
                            >
                                <Input type="number" placeholder="Enter DA" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="TA"
                                label="TA"
                                rules={[{ required: true, message: "TA is required" }]}
                            >
                                <Input type="number" placeholder="Enter TA" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="PF"
                                label="PF"
                                rules={[{ required: true, message: "PF is required" }]}
                            >
                                <Input type="number" placeholder="Enter PF" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="HRA"
                                label="HRA"
                                rules={[{ required: true, message: "HRA is required" }]}
                            >
                                <Input type="number" placeholder="Enter HRA" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="LIC"
                                label="LIC"
                                rules={[{ required: true, message: "LIC is required" }]}
                            >
                                <Input type="number" placeholder="Enter LIC" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="total"
                                label="Total"
                                rules={[{ required: true, message: "Total is required" }]}
                            >
                                <Input type="number" disabled placeholder="Calculated Total" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="total1"
                                label="Total"
                                rules={[{ required: true, message: "Total is required" }]}
                            >
                                <Input type="number" disabled placeholder="Calculated Total" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                name="netSalary"
                                label="Net Salary"
                                rules={[{ required: true, message: "Net Salary is required" }]}
                            >
                                <Input type="number" disabled placeholder="Calculated Net Salary" />
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
                        >
                            {editingKey ? "Save" : "Submit"}
                        </Button>
                        <Button
                            htmlType="button"
                            onClick={() => form.resetFields()}
                            style={{ backgroundColor: "#f0f0f0" }}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Card>

            <Table
                bordered
                columns={columns}
                dataSource={data}
                rowClassName="editable-row"
                pagination={false}
            />
        </div>
    );
};

export default EmployeeMaster;
