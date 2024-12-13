import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
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
import { CREATE_jwel } from "../../Config/Config";

const CategoryMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryExists, setCategoryExists] = useState(false);
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";
  const refs = useRef({}); // Use useRef to store references to input fields

  // Focus the next input on Enter key press
  const handleKeyDown = (e, fieldName) => {
    // Check for Enter key or Alt+S to prevent submission
    if (e.key === "Enter" || (e.altKey && e.key === "s")) {
      e.preventDefault(); // Prevent default form submission
  
      // If in editing mode, save the form
      if (editingKey) {
        handleSave();
      } else {
        // If in Add mode, submit the form
        form.submit();
      }
  
      // Handle field focus navigation to next field
      const fieldNames = Object.keys(refs.current);
      const currentIndex = fieldNames.indexOf(fieldName);
      const nextFieldName = fieldNames[currentIndex + 1];
  
      // Move focus to next field if available
      if (nextFieldName && refs.current[nextFieldName]) {
        refs.current[nextFieldName].focus();
      }
    }
  
    // Handle cancel when "C" key is pressed
    if (e.key === "c" || e.key === "C") {
      handleCancel(); // Trigger cancel action
    }
  };
  
  
  
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterList");
        const transformedData = response.data.map((item, index) => ({
          key: index + 1,
          categoryName: item.categoryname,
          wastagePercentage: item.wastage,
          directWastage: item.directwastage,
          makingChargesPerGram: item.makingcharges,
          directMakingCharges: item.directmc,
          includingGst: item.cloud_upload,
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        message.error("Failed to load category data!");
      }
    };

    fetchData();
  }, []);

  // Function to check if category name exists
  const checkCategoryExists = async (categoryName) => {
    try {
      const response = await axios.get(
        `http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterSearch?CategoryName=${categoryName}`
      );
      if (response.data && response.data.length > 0) {
        setCategoryExists(true);
      } else {
        setCategoryExists(false);
      }
    } catch (error) {
      console.error("Error checking category name: ", error);
      message.error("Error checking category name!");
    }
  };

  const handleAdd = async (values) => {
    // First, check if category name already exists
    await checkCategoryExists(values.categoryName);

    if (categoryExists) {
      message.error("Category name already exists!");
      return;
    }

    try {
      const response = await axios.post(
        "http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterInsert",
        {
          categoryname: values.categoryName,
          wastage: values.wastagePercentage,
          directwastage: values.directWastage,
          makingcharges: values.makingChargesPerGram,
          directmc: values.directMakingCharges,
          cloud_upload: values.includingGst,
          cloud_upload: true
        },
        { headers: { tenantName: tenantNameHeader } }
      );

      if (response.status === 200 && response.data === true) {
        const newData = {
          key: Date.now(),
          ...values,
        };
        setData([...data, newData]);
        form.resetFields();
        message.success("Category added successfully!");
      } else {
        message.error("Failed to add category!");
      }
    } catch (error) {
      console.error("Error adding category: ", error);
      message.error("Failed to add category!");
    }
  };

  const handleDelete = async (key, categoryName) => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/MasterCategoryMasterDelete?CategoryName=${categoryName}`,
        {},
        { headers: { tenantName: tenantNameHeader } }
      );
      if (response.status === 200 && response.data === true) {
        setData((prevData) => prevData.filter((item) => item.key !== key));
        message.success("Product deleted successfully!");
      } else {
        message.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("An error occurred while deleting the product.");
    }
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue(record);
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    const updatedData = form.getFieldsValue(); // Get updated values from the form

    // Step 1: Delete the old category name
    try {
      const oldRecord = data.find((item) => item.key === editingKey); // Find the old record
      if (!oldRecord) {
        message.error("Old record not found.");
        return;
      }

      const deleteResponse = await axios.post(
        `${CREATE_jwel}/api/Master/MasterCategoryMasterDelete?CategoryName=${oldRecord.categoryName}`,
        {},
        { headers: { tenantName: tenantNameHeader } }
      );

      if (!(deleteResponse.status === 200 && deleteResponse.data === true)) {
        message.error("Failed to delete the old category.");
        return;
      }

      // Step 2: Check if the new category name exists
      const searchResponse = await axios.get(
        `http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterSearch?CategoryName=${updatedData.categoryName}`
      );

      if (searchResponse.data && searchResponse.data.length > 0) {
        message.error("New category name already exists!");
        return;
      }

      // Step 3: Insert the updated category
      const insertResponse = await axios.post(
        "http://www.jewelerp.timeserasoftware.in/api/Master/MasterCategoryMasterInsert",
        {
          categoryname: updatedData.categoryName,
          wastage: updatedData.wastagePercentage,
          directwastage: updatedData.directWastage,
          makingcharges: updatedData.makingChargesPerGram,
          directmc: updatedData.directMakingCharges,
          cloud_upload: true,
        },
        { headers: { tenantName: tenantNameHeader } }
      );

      if (insertResponse.status === 200 && insertResponse.data === true) {
        setData((prevData) =>
          prevData.map((item) =>
            item.key === editingKey ? { ...item, ...updatedData } : item
          )
        );
        setEditingKey(null);
        form.resetFields();
        message.success("Category updated successfully!");
      } else {
        message.error("Failed to update the category.");
      }
    } catch (error) {
      console.error("Error updating category: ", error);
      message.error("An error occurred while updating the category.");
    }
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
            onConfirm={() => handleDelete(record.key, record.categoryName)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="categoryName"
                label="Category Name"
                rules={[{ required: true, message: "Category Name is required" }]}
              >
                <Input
                  ref={(el) => (refs.current["categoryName"] = el)}
                  onKeyDown={(e) => handleKeyDown(e, "categoryName")}
                  placeholder="Enter category name"
                  value={form.getFieldValue("categoryName")}
                  onChange={(e) => {
                    // Automatically convert the input to uppercase as the user types
                    const value = e.target.value.toUpperCase();
                    form.setFieldsValue({ categoryName: value }); // Update the form field value with uppercase text
                  }}
                  onBlur={(e) => checkCategoryExists(e.target.value)}
                />
              </Form.Item>
            </Col>




            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="wastagePercentage"
                label="Wastage %"
                rules={[{ required: true, message: "Wastage % is required" }]}
              >
                <Input type="number"
                  ref={(el) => (refs.current["wastagePercentage"] = el)}
                  onKeyDown={(e) => handleKeyDown(e, "wastagePercentage")}

                  placeholder="Enter Wastage %" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="directWastage"
                label="Direct Wastage"
                rules={[{ required: true, message: "Direct Wastage is required" }]}
              >
                <Input type="number"
                  ref={(el) => (refs.current["directWastage"] = el)}
                  onKeyDown={(e) => handleKeyDown(e, "directWastage")}

                  placeholder="Enter Direct Wastage" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="makingChargesPerGram"
                label="Making Charges / grams"
                rules={[{ required: true, message: "Making Charges / grams is required" }]}
              >
                <Input type="number"
                  ref={(el) => (refs.current["makingChargesPerGram"] = el)}
                  onKeyDown={(e) => handleKeyDown(e, "makingChargesPerGram")}

                  placeholder="Enter Making Charges / grams" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="directMakingCharges"
                label="Direct Making Charges"
                rules={[{ required: true, message: "Direct Making Charges is required" }]}
              >
                <Input type="number"
                  ref={(el) => (refs.current["directMakingCharges"] = el)}
                  onKeyDown={(e) => handleKeyDown(e, "directMakingCharges")}

                  placeholder="Enter Direct Making Charges" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "left", marginTop: "16px", float: "right" }}>
            <Button
              type="primary"
              htmlType="button"
              onClick={editingKey ? handleSave : form.submit} // Call handleSave in edit mode
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
