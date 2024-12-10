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

const ProductMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      mainProduct: "Gold",
      productCategory: "Bangles",
      productName: "Gold Ring",
      productCode: "GR001",
      hsnCode: "7113",
      minQty: 1,
      CategoryRef:"Gold"
    },
    {
      key: 2,
      mainProduct: "Silver",
      productCategory: "Chains",
      productName: "Silver Necklace",
      productCode: "SN002",
      hsnCode: "7114",
      minQty: 1,
      CategoryRef:"Gold"

    },
  ]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Refs for form fields to handle focus
  const mainProductRef = useRef(null);
  const productCategoryRef = useRef(null);
  const CategoryRef = useRef(null);

  const productNameRef = useRef(null);
  const productCodeRef = useRef(null);
  const hsnCodeRef = useRef(null);
  const minQtyRef = useRef(null);
  const mainProductOptions = ["Gold", "Silver", "Platinum", "Diamond"];

  const handleAdd = (values) => {
    const newData = {
      key: Date.now(),
      ...values,
    };
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
        message.success("Product updated successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

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
      dataIndex: "productCategory",
      key: "productCategory",
      sorter: (a, b) => a.productCategory.localeCompare(b.productCategory),
    },
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: "Product Code",
      dataIndex: "productCode",
      key: "productCode",
      sorter: (a, b) => a.productCode.localeCompare(b.productCode),
    },
    {
      title: "HSN Code",
      dataIndex: "hsnCode",
      key: "hsnCode",
      sorter: (a, b) => a.hsnCode.localeCompare(b.hsnCode),
    },
    {
      title: "Min Qty",
      dataIndex: "minQty",
      key: "minQty",
      sorter: (a, b) => a.minQty - b.minQty,
    },
    {
        title: "Category",
        dataIndex: "productCategory",
        key: "productCategory",
        sorter: (a, b) => a.productCategory.localeCompare(b.productCategory),
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
  const handleEnterPress = (e, nextFieldRef) => {
    e.preventDefault();
    if (nextFieldRef.current) {
      nextFieldRef.current.focus();
    }
  };


  // Reset the selection when the dropdown is opened
  const handleDropdownVisibleChange = (open) => {
    if (open) {
      form.setFieldsValue({ mainProduct: undefined });
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + S: Trigger Submit
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.submit();
      }
      // Alt + C: Trigger Cancel
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCancel();
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
            <Breadcrumb.Item>Product Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card
        title={editingKey ? "Edit Product" : "Add Product"}
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
          if (productCategoryRef.current) {
            productCategoryRef.current.focus(); // Move focus to the category input
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

            <Col xs={24} sm={12} lg={8}>
            <Form.Item
                name="productCategory"
                label="Product Category"
                rules={[{ required: true, message: "Product Category is required" }]}
              >
                <Select
                  placeholder="Select product category"
                  showSearch
                  optionFilterProp="children"
                  ref={productCategoryRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEnterPress(e, productNameRef); // Focus the next input
                    }
                  }}
                  onPressEnter={(e) => handleEnterPress(e, productNameRef)}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="Bangles">Bangles</Option>
                  <Option value="Chains">Chains</Option>
                  <Option value="Necklaces">Necklaces</Option>
                  <Option value="Earrings">Earrings</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="productName"
                label="Product Name"
                rules={[{ required: true, message: "Product Name is required" }]}
              >
                <Input
                  placeholder="Enter product name"
                  ref={productNameRef}
                  onPressEnter={(e) => handleEnterPress(e, productCodeRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="productCode"
                label="Product Code"
                rules={[{ required: true, message: "Product Code is required" }]}
              >
                <Input
                  placeholder="Enter product code"
                  ref={productCodeRef}
                  onPressEnter={(e) => handleEnterPress(e, hsnCodeRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="hsnCode"
                label="HSN Code"
                rules={[{ required: true, message: "HSN Code is required" }]}
              >
                <Input
                  placeholder="Enter HSN code"
                  ref={hsnCodeRef}
                  onPressEnter={(e) => handleEnterPress(e, minQtyRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="minQty"
                label="Min Quantity"
                rules={[{ required: true, message: "Min Quantity is required" }]}
              >
                <Input
                  type="number"
                  placeholder="Enter minimum quantity"
                  ref={minQtyRef}
                  onPressEnter={(e) => handleEnterPress(e, CategoryRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="Category"
                label="Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select
                  placeholder="Select product category"
                  showSearch
                  optionFilterProp="children"
                  ref={CategoryRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default behavior
                      form.submit(); // Submit the form
                    }
                  }}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  <Option value="Bangles">Bangles</Option>
                  <Option value="Chains">Chains</Option>
                  <Option value="Necklaces">Necklaces</Option>
                  <Option value="Earrings">Earrings</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div
            style={{
              textAlign: "right",
              marginTop: "16px",
            }}
          >
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
            <Button htmlType="button" onClick={handleCancel} style={{ backgroundColor: "#f0f0f0" }}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card>

      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col xs={24} sm={16} lg={12}>
          <Input.Search
            placeholder="Search records"
            style={{ width: "100%", borderRadius: "4px" }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }} // Allow horizontal scrolling if needed
        style={{
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default ProductMaster;
