import React, { useState, useRef, useCallback } from "react";
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
  Checkbox,
  message,
  Breadcrumb,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const JewelryTypeMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      jewelryType: "Gold",
      mainProduct: "Gold Ring",
      hsnCode: "7113",
      isDefault: false,
    },
    {
      key: 2,
      jewelryType: "Silver",
      mainProduct: "Silver Necklace",
      hsnCode: "7114",
      isDefault: true,
    },
  ]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Refs for handling "Enter" key navigation
  const jewelryTypeRef = useRef(null);
  const mainProductRef = useRef(null);
  const hsnCodeRef = useRef(null);

  const handleAdd = (values) => {
    const newData = {
      key: Date.now(),
      ...values,
    };
    setData([...data, newData]);
    form.resetFields();
    jewelryTypeRef.current && jewelryTypeRef.current.focus(); // Refocus on the first field
    message.success("Jewelry type added successfully!");
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((updatedData) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.key === editingKey ? { ...item, ...updatedData } : item
          )
        );
        setEditingKey(null);
        form.resetFields();
        jewelryTypeRef.current && jewelryTypeRef.current.focus(); // Refocus on the first field
        message.success("Jewelry type updated successfully!");
      })
      .catch((info) => console.log("Validate Failed:", info));
  };


  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Jewelry type deleted successfully!");
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue(record);
  };



  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  const handleEnterPress = (e, nextFieldRef) => {
    // Allow Select to handle "Enter" key by itself
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textarea") {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        if (nextFieldRef && nextFieldRef.current) {
          nextFieldRef.current.focus();
        }
      }
    }
  };


  const columns = [
    {
      title: "Jewelry Type",
      dataIndex: "jewelryType",
      key: "jewelryType",
      sorter: (a, b) => a.jewelryType.localeCompare(b.jewelryType),
    },
    {
      title: "Main Product",
      dataIndex: "mainProduct",
      key: "mainProduct",
      sorter: (a, b) => a.mainProduct.localeCompare(b.mainProduct),
    },
    {
      title: "HSN Code",
      dataIndex: "hsnCode",
      key: "hsnCode",
    },
    {
      title: "Default",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (isDefault) => (isDefault ? "Yes" : "No"),
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
            <Breadcrumb.Item>JewelryType Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Card
        title={editingKey ? "Edit Jewelry Type" : "Add Jewelry Type"}
        style={{
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingKey ? handleSave : handleAdd}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
            <Form.Item
  name="jewelryType"
  label="Jewelry Type"
  rules={[{ required: true, message: "Jewelry type is required" }]}
>
  <Select
    placeholder="Select jewelry type"
    ref={jewelryTypeRef}
    showSearch
    optionFilterProp="children"
    value={form.getFieldValue("jewelryType")} // Keeps the selected value in sync with the form
    filterOption={(input, option) =>
      option.children.toLowerCase().includes(input.toLowerCase())
    }
    onChange={(value) => {
      form.setFieldsValue({ jewelryType: value }); // Update the field value
    }}
    onDropdownVisibleChange={(open) => {
      if (open) {
        form.setFieldsValue({ jewelryType: undefined }); // Reset the field when the dropdown is opened
      }
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const selectedValue = form.getFieldValue("jewelryType");
        if (selectedValue) {
          if (mainProductRef.current) {
            mainProductRef.current.focus(); // Move to the next field
          }
        }
      }
    }}
  >
    <Option value="Gold">Gold</Option>
    <Option value="Silver">Silver</Option>
    <Option value="Platinum">Platinum</Option>
  </Select>
</Form.Item>




            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="mainProduct"
                label="Main Product"
                rules={[{ required: true, message: "Main product is required" }]}
              >
                <Input
                  placeholder="Enter main product"
                  ref={mainProductRef}
                  onKeyDown={(e) => handleEnterPress(e, hsnCodeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="hsnCode"
                label="HSN Code"
                rules={[{ required: true, message: "HSN code is required" }]}
              >
                <Input
                  placeholder="Enter HSN code"
                  ref={hsnCodeRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.submit();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox>Default</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 8, backgroundColor: "#0C1154" }}
            >
              {editingKey ? "Save" : "Submit"}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </Form>
      </Card>

      <Input.Search
        placeholder="Search records"
        style={{ marginBottom: "16px" }}
        onChange={(e) => setSearchText(e.target.value)}
      />

      <Table
        columns={columns}
        dataSource={data.filter((item) =>
          Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )}
        rowKey="key"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default JewelryTypeMaster;
