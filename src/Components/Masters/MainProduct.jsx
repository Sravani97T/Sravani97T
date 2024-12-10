import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
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

const MainProduct = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      mainProduct: "Product A",
      gst: 18,
      pgst: 9,
      barcodePrefix: 12345,
      includingGst: true,
    },
    {
      key: 2,
      mainProduct: "Product B",
      gst: 12,
      pgst: 6,
      barcodePrefix: 67890,
      includingGst: false,
    },
  ]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");

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
      filters: [
        { text: 'Product A', value: 'Product A' },
        { text: 'Product B', value: 'Product B' },
      ],
      onFilter: (value, record) => record.mainProduct.includes(value),
      responsive: ['xs', 'sm'], // Ensure this column is visible on mobile devices
    },
    {
      title: "GST",
      dataIndex: "gst",
      key: "gst",
      sorter: (a, b) => a.gst - b.gst,
      filters: [
        { text: '18%', value: 18 },
        { text: '12%', value: 12 },
      ],
      onFilter: (value, record) => record.gst === value,
    },
    {
      title: "PGST",
      dataIndex: "pgst",
      key: "pgst",
      sorter: (a, b) => a.pgst - b.pgst,
    },
    {
      title: "Barcode Prefix",
      dataIndex: "barcodePrefix",
      key: "barcodePrefix",
      sorter: (a, b) => a.barcodePrefix - b.barcodePrefix,
    },
    {
      title: "Including GST",
      dataIndex: "includingGst",
      key: "includingGst",
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

  const handleEnterPress = (e, nextFieldRef) => {
    e.preventDefault();
    if (nextFieldRef.current) {
      nextFieldRef.current.focus();
    }
  };

  const gstRef = React.createRef();
  const pgstRef = React.createRef();
  const barcodePrefixRef = React.createRef();
  const includingGstRef = React.createRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        form.submit();
      }
      if (e.altKey && e.key === "c") {
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
            <Breadcrumb.Item>Main Products</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card title={editingKey ? "Edit Product" : "Add Product"} style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="mainProduct"
                label="Main Product"
                rules={[{ required: true, message: "Main Product is required" }]}>
                <Input
                  placeholder="Enter main product"
                  onPressEnter={(e) => handleEnterPress(e, gstRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="gst"
                label="GST"
                rules={[{ required: true, message: "GST is required" }]}>
                <Input
                  ref={gstRef}
                  type="number"
                  placeholder="Enter GST"
                  onPressEnter={(e) => handleEnterPress(e, pgstRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="pgst"
                label="PGST"
                rules={[{ required: true, message: "PGST is required" }]}>
                <Input
                  ref={pgstRef}
                  placeholder="Enter PGST"
                  type="number"
                  onPressEnter={(e) => handleEnterPress(e, barcodePrefixRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="barcodePrefix"
                label="Barcode Prefix"
                rules={[{ required: true, message: "Barcode Prefix is required" }]}>
                <Input
                  ref={barcodePrefixRef}
                  placeholder="Enter Barcode Prefix"
                  type="number"
                  onPressEnter={(e) => handleEnterPress(e, includingGstRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item name="includingGst" valuePropName="checked">
                <Checkbox ref={includingGstRef}>Including GST</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "left", marginTop: "16px", float: "right" }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8, backgroundColor: "#0C1154", borderColor: "#0C1154" }}>
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
        scroll={{ x: 1000 }} // Allow horizontal scrolling
        style={{
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default MainProduct;
