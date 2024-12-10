import React, { useState, useEffect, useCallback } from "react";
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

const CategoryMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      categoryName: "Category A",
      wastagePercentage: 5,
      directWastage: 2,
      makingChargesPerGram: 10,
      directMakingCharges: 20,
      gst: 18,
      pgst: 9,
      barcodePrefix: 12345,
      includingGst: true,
    },
    {
      key: 2,
      categoryName: "Category B",
      wastagePercentage: 7,
      directWastage: 3,
      makingChargesPerGram: 12,
      directMakingCharges: 25,
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
    message.success("Category added successfully!");
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Category deleted successfully!");
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
    message.success("Category updated successfully!");
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
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      filters: [
        { text: 'Category A', value: 'Category A' },
        { text: 'Category B', value: 'Category B' },
      ],
      onFilter: (value, record) => record.categoryName.includes(value),
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Wastage %",
      dataIndex: "wastagePercentage",
      key: "wastagePercentage",
      sorter: (a, b) => a.wastagePercentage - b.wastagePercentage,
    },
    {
      title: "Direct Wastage",
      dataIndex: "directWastage",
      key: "directWastage",
      sorter: (a, b) => a.directWastage - b.directWastage,
    },
    {
      title: "Making Charges / grams",
      dataIndex: "makingChargesPerGram",
      key: "makingChargesPerGram",
      sorter: (a, b) => a.makingChargesPerGram - b.makingChargesPerGram,
    },
    {
      title: "Direct Making Charges",
      dataIndex: "directMakingCharges",
      key: "directMakingCharges",
      sorter: (a, b) => a.directMakingCharges - b.directMakingCharges,
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

  const wastagePercentageRef = React.createRef();
  const directWastageRef = React.createRef();
  const makingChargesPerGramRef = React.createRef();
  const directMakingChargesRef = React.createRef();

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
            <Breadcrumb.Item>Category Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card title={editingKey ? "Edit Category" : "Add Category"} style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="categoryName"
                label="Category Name"
                rules={[{ required: true, message: "Category Name is required" }]}>
                <Input
                  placeholder="Enter category name"
                  onPressEnter={(e) => handleEnterPress(e, wastagePercentageRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="wastagePercentage"
                label="Wastage %"
                rules={[{ required: true, message: "Wastage % is required" }]}>
                <Input
                  ref={wastagePercentageRef}
                  type="number"
                  placeholder="Enter Wastage %"
                  onPressEnter={(e) => handleEnterPress(e, directWastageRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="directWastage"
                label="Direct Wastage"
                rules={[{ required: true, message: "Direct Wastage is required" }]}>
                <Input
                  ref={directWastageRef}
                  type="number"
                  placeholder="Enter Direct Wastage"
                  onPressEnter={(e) => handleEnterPress(e, makingChargesPerGramRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="makingChargesPerGram"
                label="Making Charges / grams"
                rules={[{ required: true, message: "Making Charges / grams is required" }]}>
                <Input
                  ref={makingChargesPerGramRef}
                  type="number"
                  placeholder="Enter Making Charges / grams"
                  onPressEnter={(e) => handleEnterPress(e, directMakingChargesRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="directMakingCharges"
                label="Direct Making Charges"
                rules={[{ required: true, message: "Direct Making Charges is required" }]}>
                <Input
                  ref={directMakingChargesRef}
                  type="number"
                  placeholder="Enter Direct Making Charges"
                />
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

export default CategoryMaster;
