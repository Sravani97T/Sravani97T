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

const { Option } = Select;

const ProductCategory = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    { key: 1, mainProduct: "Gold", category: "Bangles" },
    { key: 2, mainProduct: "Silver", category: "Chains" },
  ]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const categoryInputRef = useRef(); // Ref for the second input field

  const mainProductOptions = ["Gold", "Silver", "Platinum", "Diamond"];

  const handleAdd = (values) => {
    const newData = { key: Date.now(), ...values };
    setData([...data, newData]);
    form.resetFields();
    message.success("Product added successfully!");
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Product deleted successfully!");
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
    message.success("Product updated successfully!");
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  // const handleEnterPress = (e, nextRef) => {
  //   e.preventDefault(); // Prevent form submission
  //   if (nextRef && nextRef.current) {
  //     nextRef.current.focus();
  //   }
  // };

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Main Product",
      dataIndex: "mainProduct",
      key: "mainProduct",
      sorter: (a, b) => a.mainProduct.localeCompare(b.mainProduct),
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Product Category",
      dataIndex: "category",
      key: "category",
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
    <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
      {/* Breadcrumb */}
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
            <Breadcrumb.Item>Masters</Breadcrumb.Item>
            <Breadcrumb.Item>Product Category</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card
        title={editingKey ? "Edit Product" : "Add Product"}
        style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="mainProduct"
                label="Main Product"
                rules={[{ required: true, message: "Main Product is required" }]}
              >
                <Select
                  placeholder="Select main product"
                  showSearch
                  value={form.getFieldValue("mainProduct")} // Keeps the selected value in sync
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onDropdownVisibleChange={(open) => {
                    if (open) {
                      form.setFieldsValue({ mainProduct: undefined }); // Reset selection when dropdown is reopened
                    }
                  }}
                  onChange={(value) => {
                    form.setFieldsValue({ mainProduct: value }); // Update the selected value
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      if (form.getFieldValue("mainProduct")) {
                        if (categoryInputRef.current) {
                          categoryInputRef.current.focus(); // Move focus to the category input
                        }
                      }
                    }
                  }}
                >
                  {mainProductOptions.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="category"
                label="Product Category"
                rules={[{ required: true, message: "Product Category is required" }]}
              >
                <Input
                  placeholder="Enter product category"
                  ref={categoryInputRef} // Reference for focusing
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default behavior
                      form.submit(); // Submit the form
                    }
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
            >
              {editingKey ? "Save" : "Submit"}
            </Button>
            <Button htmlType="button" onClick={handleCancel} style={{ backgroundColor: "#f0f0f0" }}>
              Cancel
            </Button>
          </div>
        </Form>


      </Card>

      <Row gutter={16}>
        <Col xs={24} sm={16} lg={12}>
          <Input.Search
            placeholder="Search records"
            style={{ marginBottom: "16px", width: "100%", borderRadius: "4px" }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
        style={{
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default ProductCategory;
