import React, { useState, useCallback, useRef ,useEffect} from "react";
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
  Checkbox,
  Select,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const BankMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      accountNumber: "123456789",
      accountType: "Savings",
      accountName: "John Doe",
      amount: 1000,
      bankName: "Bank A",
      street: "Main St",
      town: "Townsville",
      district: "District A",
      pincode: "123456",
      phoneNo: "9876543210",
      cardComm: 2,
      currentBalance: true,
    },
    {
      key: 2,
      accountNumber: "987654321",
      accountType: "Current",
      accountName: "Jane Smith",
      amount: 2500,
      bankName: "Bank B",
      street: "Second St",
      town: "Metropolis",
      district: "District B",
      pincode: "654321",
      phoneNo: "9123456780",
      cardComm: 1.5,
      currentBalance: false,
    },
  ]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, ] = useState("");

  const refs = {
    accountNumRef: useRef(),
    accountNameRef: useRef(),
    accountTypeRef: useRef(),

    amountRef: useRef(),
    bankNameRef: useRef(),
    streetRef: useRef(),
    townRef: useRef(),
    districtRef: useRef(),
    pincodeRef: useRef(),
    phoneNoRef: useRef(),
    cardCommRef: useRef(),
    currentBalanceRef: useRef(),
    checkaccountRef:useRef()
    
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

  const handleEnterPress = (e, nextRef) => {
    e.preventDefault();
    if (nextRef?.current) {
      nextRef.current.focus();
    } else {
      form.submit(); // Submit the form if there's no next field
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
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
    {
      title: "Account Number",
      dataIndex: "accountNumber",
      key: "accountNumber",
    },
    {
      title: "Account Type",
      dataIndex: "accountType",
      key: "accountType",
    },
    {
      title: "Account Name",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
    },
    {
      title: "Phone No.",
      dataIndex: "phoneNo",
      key: "phoneNo",
    },
    {
      title: "Card Comm %",
      dataIndex: "cardComm",
      key: "cardComm",
    },
    {
      title: "Current Balance",
      dataIndex: "currentBalance",
      key: "currentBalance",
      render: (value) => (value ? "Yes" : "No"),
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
            <Breadcrumb.Item>Bank Master</Breadcrumb.Item>
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
                name="accountNumber"
                label="Account Number"
                rules={[{ required: true, message: "Account Number is required" }]}
              >
                <Input
                  placeholder="Enter Account Number"
                  onPressEnter={(e) => handleEnterPress(e, refs.accountTypeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="accountType"
                label="Account Type"
                rules={[{ required: true, message: "Account Type is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Account Type"
                  ref={refs.accountTypeRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.accountNameRef.current?.focus()
                  }
                >
                  <Option value="Savings">Savings</Option>
                  <Option value="Current">Current</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="accountName"
                label="Account Name"
                rules={[{ required: true, message: "Account Name is required" }]}
              >
                <Input
                  placeholder="Enter Account Name"
                  ref={refs.accountNameRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.amountRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="amount"
                label="Amount"
                rules={[{ required: true, message: "Amount is required" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter Amount"
                  ref={refs.amountRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.bankNameRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="bankName"
                label="Bank Name"
                rules={[{ required: true, message: "Bank Name is required" }]}
              >
                <Input
                  placeholder="Enter Bank Name"
                  ref={refs.bankNameRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.streetRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="street" label="Street">
                <Input
                  placeholder="Enter Street"
                  ref={refs.streetRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.townRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="town" label="Town">
                <Input
                  placeholder="Enter Town"
                  ref={refs.townRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.districtRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="district" label="District">
                <Input
                  placeholder="Enter District"
                  ref={refs.districtRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.pincodeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="pincode" label="Pincode">
                <Input
                  type="number"
                  placeholder="Enter Pincode"
                  ref={refs.pincodeRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.phoneNoRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phoneNo"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Phone Number 10 digits",
                    len: 10,
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder="Enter Phone Number"
                  ref={refs.phoneNoRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.cardCommRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cardComm"
                label="Card Comm (%)"
                rules={[{ required: true, message: "Card Comm is required" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter Card Comm (%)"
                  ref={refs.cardCommRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.currentBalanceRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="currentBalance"
                label="Current Balance"
                rules={[{ required: true, message: "Current Balance is required" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter Current Balance"
                  ref={refs.currentBalanceRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.checkaccountRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
                <Checkbox ref={refs.checkaccountRef}>
                  default Account
                </Checkbox>
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

      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} size="small"/>
    </div>
  );
};

export default BankMaster;
