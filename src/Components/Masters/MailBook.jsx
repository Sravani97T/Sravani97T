import React, { useState, useCallback, useRef, useEffect } from "react";
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
  DatePicker,
  Radio,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const MailBook = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      name: "John Doe",
      mobileNo1: "9876543210",
      category: "Personal",

      mobileNo2: "9123456780",
      city: "Metropolis",
      address: "Main St",
      state: "State A",
      GSTIN: "GST123",
      PAN: "PAN123",
      proofType: "Aadhaar",
      proofNumber: "Aadhaar123",
      dob: "2000-01-01",
      anniversary: "2025-01-01",
      locationType: "Out Station",
    },
    {
      key: 2,
      name: "Jane Smith",
      mobileNo1: "9876543222",
      mobileNo2: "9123456781",
      category: "Personal",

      city: "Townsville",
      address: "Second St",
      state: "State B",
      GSTIN: "GST124",
      PAN: "PAN124",
      proofType: "Voter ID",
      proofNumber: "Voter123",
      dob: "1990-05-15",
      anniversary: "2025-06-01",
      locationType: "Local",
    },
  ]);
  const [editingKey, setEditingKey] = useState(null);
  const refs = {
    nameRef: useRef(),
    category: useRef(),

    mobileNo1Ref: useRef(),
    mobileNo2Ref: useRef(),
    cityRef: useRef(),
    addressRef: useRef(),
    stateRef: useRef(),
    GSTINRef: useRef(),
    PANRef: useRef(),
    proofTypeRef: useRef(),
    proofNumberRef: useRef(),
    dobRef: useRef(),
    anniversaryRef: useRef(),
    locationTypeRef: useRef(),
  };
  const handleEnterPress = (e, nextRef) => {
    e.preventDefault();
    if (nextRef?.current) {
      nextRef.current.focus();
    } else {
      form.submit(); // Submit the form if there's no next field
    }
  };

  const handleAdd = (values) => {
    const newData = {
      key: Date.now(),
      ...values,
    };
    setData([...data, newData]);
    form.resetFields();
    message.success("Bank details added successfully!");
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Bank details deleted successfully!");
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
    message.success("Bank details updated successfully!");
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
  );

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

  const columns = [
    { title: "Category", dataIndex: "category", key: "category" },

    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Mobile No.1", dataIndex: "mobileNo1", key: "mobileNo1" },
    { title: "Mobile No.2", dataIndex: "mobileNo2", key: "mobileNo2" },
    { title: "GSTIN", dataIndex: "GSTIN", key: "GSTIN" },
    { title: "Location Type", dataIndex: "locationType", key: "locationType" },
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

  return (
    <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
            <Breadcrumb.Item>Masters</Breadcrumb.Item>
            <Breadcrumb.Item>Mail Book</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card
        title={editingKey ? "Edit Bank Details" : "Add Bank Details"}
        style={{
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select placeholder="Select Category"
                  showSearch
                  ref={refs.category}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.nameRef.current?.focus()
                  }>
                  <Option value="Personal">Personal</Option>
                  <Option value="Business">Business</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  placeholder="Enter Name"
                  ref={refs.nameRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.mobileNo1Ref)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mobileNo1"
                label="Mobile No. 1"
                rules={[{ required: true, message: "Mobile No. 1 is required" }]}
              >
                <Input
                  placeholder="Enter Mobile No. 1"
                  ref={refs.mobileNo1Ref}
                  type="number"
                  maxLength={10}
                  onPressEnter={(e) => handleEnterPress(e, refs.mobileNo2Ref)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mobileNo2"
                label="Mobile No. 2"
                rules={[{ required: true, message: "Mobile No. 2 is required" }]}
              >
                <Input
                  placeholder="Enter Mobile No. 2"
                  ref={refs.mobileNo2Ref}
                  type="number"
                  maxLength={10}
                  onPressEnter={(e) => handleEnterPress(e, refs.cityRef)}
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
                  ref={refs.cityRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.addressRef.current?.focus()
                  }
                >
                  <Option value="Metropolis">Metropolis</Option>
                  <Option value="Townsville">Townsville</Option>
                </Select>
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
                  ref={refs.addressRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.stateRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Input placeholder="Enter State" ref={refs.stateRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.GSTINRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="GSTIN"
                label="GSTIN"
                rules={[{ required: true, message: "GSTIN is required" }]}
              >
                <Input placeholder="Enter GSTIN" ref={refs.GSTINRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.PANRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="PAN"
                label="PAN"
                rules={[{ required: true, message: "PAN is required" }]}
              >
                <Input
                  placeholder="Enter PAN" ref={refs.PANRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.proofTypeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item

                name="proofType"
                label="Proof Type"
                rules={[{ required: true, message: "Proof Type is required" }]}
              >
                <Select showSearch ref={refs.proofTypeRef} 
                onKeyDown={(e) =>
                  e.key === "Enter" && refs.proofNumberRef.current?.focus()
                }>
                  <Option value="Aadhaar">Aadhaar</Option>
                  <Option value="Voter ID">Voter ID</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="proofNumber"
                label="Proof Number"
                rules={[{ required: true, message: "Proof Number is required" }]}
              >
                <Input placeholder="Enter Proof Number" ref={refs.proofNumberRef} onPressEnter={(e) => handleEnterPress(e, refs.dobRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: "Date of Birth is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" ref={refs.dobRef} 
                onKeyDown={(e) =>
                  e.key === "Enter" && refs.anniversaryRef.current?.focus()
                }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="anniversary"
                label="Anniversary"
                rules={[{ required: true, message: "Anniversary is required" }]}
              >
                <DatePicker format="YYYY-MM-DD" ref={refs.anniversaryRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.locationTypeRef.current?.focus()
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="locationType"
                label="Location Type"
                rules={[{ required: true, message: "Location Type is required" }]}
              >
                <Radio.Group
                  ref={refs.locationTypeRef}
                  onKeyDown={(e) =>
                    e.key === "Enter"  && handleEnterPress(e, null)
                  }
                >
                  <Radio value="Out Station">Out Station</Radio>
                  <Radio value="Local">Local</Radio>
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
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default MailBook;
