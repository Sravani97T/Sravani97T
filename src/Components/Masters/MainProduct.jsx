import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Table,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Breadcrumb,
  Card
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import "../Assets/css/Style.css";

const MainProduct = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [oldProductName, setOldProductName] = useState("");

  const API_BASE_URL = "http://www.jewelerp.timeserasoftware.in/api/Master";
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";
  const mainprodRef = useRef(null);
  const gstRef = useRef(null);

  const pgstRef = useRef(null);
  const barCodeRef = useRef(null);
  const checkRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/MasterMainProductList`, {
          headers: { tenantName: tenantNameHeader },
        });
        if (response.status === 200) {
          const transformedData = response.data.map((item) => ({
            key: item.ID || `${item.MNAME}-${Date.now()}`, // Ensure a unique key
            mainProduct: item.MNAME || "",
            gst: item.VAT || 0,
            pgst: item.PTAX || 0,
            barcodePrefix: item.BarcodePrefix || "",
            includingGst: item.INCLUDING_GST || false,
          }));

          setData(transformedData);
        } else {
          message.error("Failed to fetch product data.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);


  const handleAdd = async (values) => {
    const upperCaseProduct = values.mainProduct.toUpperCase();
    form.setFieldsValue({ mainProduct: upperCaseProduct });

    try {
      const searchResponse = await axios.get(
        `${API_BASE_URL}/MasterMainProductSearch?MName=${upperCaseProduct}`,
        { headers: { tenantName: tenantNameHeader } }
      );

      if (searchResponse.data.length > 0) {
        message.error("Main product already exists!");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/MasterMainProductInsert`,
        {
          mname: upperCaseProduct,
          vat: values.gst,
          ptax: values.pgst,
          barcodePrefix: values.barcodePrefix,
          metaltype: "Gold",
          includinG_GST: values.includingGst,
          cloud_upload: true,
        },
        { headers: { tenantName: tenantNameHeader } }
      );

      if (response.status === 200) {
        const newProduct = {
          key: response.data.ID || `${upperCaseProduct}-${Date.now()}`,
          mainProduct: upperCaseProduct,
          gst: values.gst,
          pgst: values.pgst,
          barcodePrefix: values.barcodePrefix,
          includingGst: values.includingGst,
        };
        setData((prevData) => [...prevData, newProduct]);
        form.resetFields();
        message.success("Product added successfully!");
      } else {
        message.error("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      // message.error("An error occurred while adding the product.");
    }
  };

  const handleDelete = async (key, mainProduct) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/MasterMainProductDelete?MName=${mainProduct}`,
        {},
        { headers: { tenantName: tenantNameHeader } }
      );

      if (response.status === 200 && response.data === true) {
        setData((prevData) => prevData.filter((item) => item.mainProduct !== mainProduct));
        message.success("Product deleted successfully!");
      } else {
        message.error("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      message.error("An error occurred while deleting the product.");
    }
  };

  const handleEdit = (product) => {
    setOldProductName(product.mainProduct);
    form.setFieldsValue({
      mainProduct: product.mainProduct,
      gst: product.gst,
      pgst: product.pgst,
      barcodePrefix: product.barcodePrefix,
      includingGst: product.includingGst,
    });
    setEditingKey(product.key);
  };

  const handleSave = async () => {
    const updatedData = form.getFieldsValue();
    const newMainProduct = updatedData.mainProduct.toUpperCase(); // Convert to uppercase
  
    // Check if the form values are the same as the original values
    if (
      newMainProduct === oldProductName &&
      updatedData.gst === data.find(item => item.mainProduct === oldProductName).gst &&
      updatedData.pgst === data.find(item => item.mainProduct === oldProductName).pgst &&
      updatedData.barcodePrefix === data.find(item => item.mainProduct === oldProductName).barcodePrefix &&
      updatedData.includingGst === data.find(item => item.mainProduct === oldProductName).includingGst
    ) {
      // Instead of showing a "No changes" message, clear the form and switch to Add Product
      form.resetFields();
      setEditingKey(null);
      return; // Stop further processing
    }
  
    try {
      // Check if the new main product name already exists
      const searchResponse = await axios.get(
        `${API_BASE_URL}/MasterMainProductSearch?MName=${newMainProduct}`,
        { headers: { tenantName: tenantNameHeader } }
      );
  
      if (searchResponse.data.length > 0 && newMainProduct !== oldProductName) {
        message.error("Main product already exists!");
        return;
      }
  
      // Delete the old record if the main product name has changed
      if (newMainProduct !== oldProductName) {
        await axios.post(
          `${API_BASE_URL}/MasterMainProductDelete?MName=${oldProductName}`,
          {},
          { headers: { tenantName: tenantNameHeader } }
        );
      }
  
      // Add or update the record
      const response = await axios.post(
        `${API_BASE_URL}/MasterMainProductInsert`,
        {
          mname: newMainProduct, // Use the uppercase main product name
          vat: updatedData.gst,
          ptax: updatedData.pgst,
          barcodePrefix: updatedData.barcodePrefix,
          metaltype: "Gold",
          includinG_GST: updatedData.includingGst,
          cloud_upload: true,
        },
        { headers: { tenantName: tenantNameHeader } }
      );
  
      if (response.status === 200) {
        const updatedRecord = {
          key: editingKey, // Ensure the same key is reused
          mainProduct: newMainProduct, // Use the uppercase main product name
          gst: updatedData.gst,
          pgst: updatedData.pgst,
          barcodePrefix: updatedData.barcodePrefix,
          includingGst: updatedData.includingGst,
        };
  
        // Replace the record with the same key
        setData((prevData) =>
          prevData.map((item) => (item.key === editingKey ? updatedRecord : item))
        );
  
        form.resetFields();
        setEditingKey(null);
        message.success("Product updated successfully!");
      } else {
        message.error("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      message.error("An error occurred while updating the product.");
    }
  };
  
  const handleMainProductChange = async (e) => {
    const enteredProduct = e.target.value.toUpperCase(); // Ensure product name is uppercase
    form.setFieldsValue({ mainProduct: enteredProduct });

    // If the entered product is the same as the current one, no need to check
    if (enteredProduct === oldProductName) {
      return; // Exit early, no need to check for duplication
    }

    try {
      const searchResponse = await axios.get(
        `${API_BASE_URL}/MasterMainProductSearch?MName=${enteredProduct}`,
        { headers: { tenantName: tenantNameHeader } }
      );

      // Show the message only if the new product name exists
      if (searchResponse.data.length > 0) {
        message.error("Main product already exists!");
      }
    } catch (error) {
      console.error("Error checking product existence:", error);
      // message.error("An error occurred while checking the product.");
    }
  };



  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  const filteredData = data.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Main Product",
      dataIndex: "mainProduct",
      key: "mainProduct",
    },
    {
      title: "GST",
      dataIndex: "gst",
      key: "gst",
    },
    {
      title: "PGST",
      dataIndex: "pgst",
      key: "pgst",
    },
    {
      title: "Barcode Prefix",
      dataIndex: "barcodePrefix",
      key: "barcodePrefix",
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
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={editingKey === record.key}
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.key, record.mainProduct)}
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
  return (
    <div style={{  backgroundColor: "#f4f6f9" }}>
      <Row justify="start" style={{ marginBottom: "10px" }}>
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
          marginBottom: "10px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingKey ? handleSave : handleAdd}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mainProduct"
                label="Main Product"
                rules={[{ required: true, message: "Main Product is required" }]}
              >
                <Input
                  placeholder="Main Product"
                  ref={mainprodRef}
                  onPressEnter={(e) => handleEnterPress(e, gstRef)}
                  onChange={handleMainProductChange}
                  onBlur={handleMainProductChange}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="gst" label="GST" rules={[{ required: true, }]}
              >
                <Input placeholder="GST" type="number" ref={gstRef}
                  onPressEnter={(e) => handleEnterPress(e, pgstRef)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="pgst" label="PGST" rules={[{ required: true, }]}>
                <Input placeholder="PGST" type="number"
                  ref={pgstRef}
                  onPressEnter={(e) => handleEnterPress(e, barCodeRef)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="barcodePrefix" label="Barcode Prefix" rules={[{ required: true, }]}>
                <Input placeholder="Barcode Prefix" ref={barCodeRef}
                  onPressEnter={(e) => handleEnterPress(e, checkRef)} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="includingGst" valuePropName="checked">
                <Checkbox ref={checkRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default behavior
                      form.submit(); // Submit the form
                    }
                  }}>Including GST</Checkbox>
              </Form.Item>
            </Col>
            <Col >
              <Form.Item>
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
              onClick={handleCancel}
              style={{ backgroundColor: "#f0f0f0", }}
            >
              Cancel
            </Button>
              </Form.Item>
            </Col>
          </Row>
         
        </Form>
      </Card>
      <div style={{float:"right"}}>
        
          <Input.Search
            placeholder="Search"
            onChange={(e) => setSearchText(e.target.value)}
            style={{width: 300 ,marginBottom:"10px"}}
          />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        size="small"
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

export default MainProduct;
