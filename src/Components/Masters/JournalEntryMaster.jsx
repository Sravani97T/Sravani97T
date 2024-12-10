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
  Select,
  Breadcrumb,
  DatePicker,
  Radio,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
const { Option } = Select;


const JournalEntryMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      groupName: "Group A",
      ledgerName: "Ledger A",
      openingBalance: "1000",
      openingQuantity: "10",
      city: "Metropolis",
      phoneNo: "9876543210",
      address: "Main St",
      mobileNo1: "9123456780",
      mobileNo2: "9876543210",
      GSTIN: "GST123",
      aadhaarNo: "Aadhaar123",
      pincode: "123456",
      state: "State A",
      dob: "2000-01-01",
      district: "District A",
      anniversary: "2025-01-01",
      locationType: "Out Station",
    },
    {
      key: 2,
      groupName: "Group B",
      ledgerName: "Ledger B",
      openingBalance: "2000",
      openingQuantity: "20",
      city: "Townsville",
      phoneNo: "9876543222",
      address: "Second St",
      mobileNo1: "9123456781",
      mobileNo2: "9876543221",
      GSTIN: "GST124",
      aadhaarNo: "Aadhaar124",
      pincode: "654321",
      state: "State B",
      dob: "1990-05-15",
      district: "District B",
      anniversary: "2025-06-01",
      locationType: "Local",
    },
  ]);
  const [editingKey, setEditingKey] = useState(null);

  const refs = {
    groupNameRef: useRef(),
    ledgerNameRef: useRef(),
    openingBalanceRef: useRef(),
    openingQuantityRef: useRef(),
    cityRef: useRef(),
    phoneNoRef: useRef(),
    addressRef: useRef(),
    mobileNo1Ref: useRef(),
    mobileNo2Ref: useRef(),
    GSTINRef: useRef(),
    aadhaarNoRef: useRef(),
    pincodeRef: useRef(),
    stateRef: useRef(),
    dobRef: useRef(),
    districtRef: useRef(),
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
    message.success("Journal entry added successfully!");
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Journal entry deleted successfully!");
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
    message.success("Journal entry updated successfully!");
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
    { title: "Group Name", dataIndex: "groupName", key: "groupName" },
    { title: "Ledger Name", dataIndex: "ledgerName", key: "ledgerName" },
    { title: "Opening Balance", dataIndex: "openingBalance", key: "openingBalance" },
    { title: "Opening Quantity", dataIndex: "openingQuantity", key: "openingQuantity" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "Phone No.", dataIndex: "phoneNo", key: "phoneNo" },
    { title: "Mobile No.1", dataIndex: "mobileNo1", key: "mobileNo1" },
    { title: "Mobile No.2", dataIndex: "mobileNo2", key: "mobileNo2" },
    { title: "GSTIN", dataIndex: "GSTIN", key: "GSTIN" },
    { title: "Aadhaar No.", dataIndex: "aadhaarNo", key: "aadhaarNo" },
    { title: "Pincode", dataIndex: "pincode", key: "pincode" },
    { title: "State", dataIndex: "state", key: "state" },
    { title: "District", dataIndex: "district", key: "district" },
    { title: "Date of Birth", dataIndex: "dob", key: "dob" },
    { title: "Anniversary", dataIndex: "anniversary", key: "anniversary" },
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
  const [districts, setDistricts] = useState([]);
  
  const handleStateChange = (state) => {
    // This is where you filter the districts based on the selected state.
    // You can replace this with dynamic logic or an API call based on the state.
    const districtOptions = {
      "State A": ["District A", "District B"],
      "State B": ["District C", "District D"],
    };

    setDistricts(districtOptions[state] || []);
    form.setFieldsValue({ district: "" }); // Reset district field on state change
  };

  return (
    <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
            <Breadcrumb.Item>Masters</Breadcrumb.Item>
            <Breadcrumb.Item>Journal Entry Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card
        title={editingKey ? "Edit Journal Entry" : "Add Journal Entry"}
        style={{
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
            <Form.Item
                name="groupName"
                label="Group Name"
                rules={[{ required: true, message: "Group Name is required" }]}
              >
                <Select
                showSearch
                  ref={refs.groupNameRef}
                  placeholder="Select Group Name"
                  onPressEnter={(e) => handleEnterPress(e, refs.ledgerNameRef)}
                >
                  <Option value="Group A">Group A</Option>
                  <Option value="Group B">Group B</Option>
                  {/* Add more options here */}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="ledgerName"
                label="Ledger Name"
                rules={[{ required: true, message: "Ledger Name is required" }]}
              >
                <Input
                  placeholder="Enter Ledger Name"
                  ref={refs.ledgerNameRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.openingBalanceRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="openingBalance"
                label="Opening Balance"
                rules={[{ required: true, message: "Opening Balance is required" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter Opening Balance"
                  ref={refs.openingBalanceRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.openingQuantityRef)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="openingQuantity"
                label="Opening Quantity"
                rules={[{ required: true, message: "Opening Quantity is required" }]}
              >
                <Input
                  placeholder="Enter Opening Quantity"
                  ref={refs.openingQuantityRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.cityRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
            <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                showSearch
                  ref={refs.cityRef}
                  placeholder="Select City"
                  onPressEnter={(e) => handleEnterPress(e, refs.phoneNoRef)}
                >
                  <Option value="Metropolis">Metropolis</Option>
                  <Option value="Townsville">Townsville</Option>
                  {/* Add more options */}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="phoneNo"
                label="Phone No."
                rules={[{ required: true, message: "Phone No. is required" }]}
              >
                <Input
                  placeholder="Enter Phone No."
                  ref={refs.phoneNoRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.addressRef)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="mobileNo1"
                label="Mobile No.1"
                rules={[{ required: true, message: "Mobile No.1 is required" }]}
              >
                <Input
                  placeholder="Enter Mobile No.1"
                  ref={refs.mobileNo1Ref}
                  onPressEnter={(e) => handleEnterPress(e, refs.mobileNo2Ref)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="mobileNo2"
                label="Mobile No.2"
                rules={[{ required: true, message: "Mobile No.2 is required" }]}
              >
                <Input
                  placeholder="Enter Mobile No.2"
                  ref={refs.mobileNo2Ref}
                  onPressEnter={(e) => handleEnterPress(e, refs.GSTINRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="GSTIN"
                label="GSTIN"
                rules={[{ required: true, message: "GSTIN is required" }]}
              >
                <Input
                  placeholder="Enter GSTIN"
                  ref={refs.GSTINRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.aadhaarNoRef)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="aadhaarNo"
                label="Aadhaar No."
                rules={[{ required: true, message: "Aadhaar No. is required" }]}
              >
                <Input
                  placeholder="Enter Aadhaar No."
                  ref={refs.aadhaarNoRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.pincodeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="pincode"
                label="Pincode"
                rules={[{ required: true, message: "Pincode is required" }]}
              >
                <Input
                  placeholder="Enter Pincode"
                  ref={refs.pincodeRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.stateRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
            <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Select showSearch placeholder="Select State" onChange={handleStateChange}>
                  <Option value="State A">State A</Option>
                  <Option value="State B">State B</Option>
                  {/* Add more options */}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="dob"
                label="Date of Birth"
                rules={[{ required: true, message: "Date of Birth is required" }]}
              >
                <DatePicker
                  placeholder="Select Date"
                  style={{ width: "100%" }}
                  ref={refs.dobRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.districtRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
            <Form.Item
                name="district"
                label="District"
                rules={[{ required: true, message: "District is required" }]}
              >
                <Select showSearch placeholder="Select District">
                  {districts.map((district) => (
                    <Option key={district} value={district}>
                      {district}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="anniversary"
                label="Anniversary"
                rules={[{ required: true, message: "Anniversary is required" }]}
              >
                <DatePicker
                  placeholder="Select Anniversary"
                  style={{ width: "100%" }}
                  ref={refs.anniversaryRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.locationTypeRef)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="locationType"
                label="Location Type"
                rules={[{ required: true, message: "Location Type is required" }]}
              >
                <Radio.Group>
                  <Radio value="Local">Local</Radio>
                  <Radio value="Out Station">Out Station</Radio>
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
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default JournalEntryMaster;
