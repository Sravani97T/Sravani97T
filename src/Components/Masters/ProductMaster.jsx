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
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
const { Option } = Select;
const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant header value
axios.defaults.headers.common['tenantName'] = tenantNameHeader;
const ProductMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Refs for form fields to handle focus
  const productCategoryRef = useRef(null);
  const CategoryRef = useRef(null);

  const productNameRef = useRef(null);
  const productCodeRef = useRef(null);
  const hsnCodeRef = useRef(null);
  const minQtyRef = useRef(null);
  const mainProductOptions = ["Gold", "Silver", "Platinum", "Diamond"];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${CREATE_jwel}/api/Master/MasterProductMasterList`
        );

        // Add key to each record for table usage
        const formattedData = response.data.map((item, index) => ({
          ...item,
          key: index, // Or use a unique identifier if available
        }));

        setData(formattedData);
      } catch (error) {
        message.error("Failed to fetch product categories.");
      }
    };

    fetchData();
  }, []);
  const checkProductExists = async (productName, productCode, excludeProductCode = null) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/MasterProductMasterSearch?ProductName=${productName}&ProductCode=${productCode}`
      );
  
      // If excludeProductCode is provided, exclude the current record from the search result
      const existingProduct = response.data.filter(item => item.PRODUCTCODE !== excludeProductCode);
      
      return existingProduct.length > 0; // Return true if product exists
    } catch (error) {
      message.error("Failed to check product existence.");
      return false;
    }
  };
  const handleAdd = async (values) => {
    const productExists = await checkProductExists(values.productName, values.productCode);
    if (productExists) {
      message.warning("This product name and/or code already exists.");
      return;
    }
  
    try {
      // Convert relevant fields to uppercase
      const mainProduct = values.mainProduct;
      const productCategory = values.productcategory;
      const productName = values.productName;
      const productCode = values.productCode;
      const categoryName = values.categoryName;
      const hsnCode = values.hsncode; // if applicable
  
      await axios.post(
        `${CREATE_jwel}/api/Master/MasterProductMasterInsert`,
        {
          mname: mainProduct,
          productcategory: productCategory,
          productname: productName,
          productcode: productCode,
          categoryname: categoryName,
          minqty: values.minqty,
          hsncode: hsnCode,
          cloud_upload: false,
          prinT_BILL: true,
        }
      );
  
      // Assuming the API returns the inserted product data
      const newProduct = {
        key: Date.now(), // Temporary unique key for the new row
        MNAME: mainProduct,
        PRODUCTCATEGORY: productCategory,
        PRODUCTNAME: productName,
        PRODUCTCODE: productCode,
        CATEGORYNAME: categoryName,
        HSNCODE: hsnCode,
        MINQTY: values.minqty,
      };
  
      // Update the table data immediately
      setData((prevData) => [...prevData, newProduct]);
  
      // Reset form fields
      form.resetFields();
      message.success("Product added successfully!");
    } catch (error) {
      message.error("Failed to add product.");
    }
  };
  
  
  const handleDelete = async (key) => {
    const record = data.find((item) => item.key === key);
    try {
      await axios.post(
        `${CREATE_jwel}/api/Master/MasterProductMasterDelete?ProductName=${record.PRODUCTNAME}&ProductCode=${record.PRODUCTCODE}`
      );
      setData(data.filter((item) => item.key !== key));
      message.success("Product deleted successfully!");
    } catch (error) {
      message.error("Failed to delete product.");
    }
  };
  
  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue({
      mainProduct: record.MNAME,
      productcategory: record.PRODUCTCATEGORY,
      productName: record.PRODUCTNAME,
      productCode: record.PRODUCTCODE,
      hsncode: record.HSNCODE,
      minqty: record.MINQTY,
      categoryName: record.CATEGORYNAME,
    });
    window.scrollTo(0, 0); // Scroll to the top for form visibility
  };
  

 
  
  const handleSave = async () => {
    const updatedData = form.getFieldsValue();
    const record = data.find((item) => item.key === editingKey);
  
    // Check if the product already exists in the database (for both name and code)
    const productExists = await checkProductExists(updatedData.productName, updatedData.productCode);
  
    if (productExists && (updatedData.productName !== record.PRODUCTNAME || updatedData.productCode !== record.PRODUCTCODE)) {
      message.warning("This product name and/or code already exists.");
      return;
    }
  
    // Proceed if no changes or no conflict
    if (
      updatedData.mainProduct !== record.MNAME ||
      updatedData.productcategory !== record.PRODUCTCATEGORY ||
      updatedData.productName !== record.PRODUCTNAME ||
      updatedData.productCode !== record.PRODUCTCODE ||
      updatedData.hsncode !== record.HSNCODE ||
      updatedData.minqty !== record.MINQTY ||
      updatedData.categoryName !== record.CATEGORYNAME
    ) {
      try {
        // If the record has changed, delete the old record and add the new one
        await axios.post(
          `${CREATE_jwel}/api/Master/MasterProductMasterDelete?ProductName=${record.PRODUCTNAME}&ProductCode=${record.PRODUCTCODE}`
        );
  
        // Insert the new edited product
        await axios.post(
          `${CREATE_jwel}/api/Master/MasterProductMasterInsert`,
          {
            mname: updatedData.mainProduct,
            productcategory: updatedData.productcategory,
            productname: updatedData.productName,
            productcode: updatedData.productCode,
            categoryname: updatedData.categoryName,
            minqty: updatedData.minqty,
            hsncode: updatedData.hsncode,
            cloud_upload: false,
            prinT_BILL: true,
          }
        );
  
        // Update the data table
        setData((prevData) =>
          prevData.map((item) =>
            item.key === editingKey
              ? {
                  ...item,
                  MNAME: updatedData.mainProduct,
                  PRODUCTCATEGORY: updatedData.productcategory,
                  PRODUCTNAME: updatedData.productName,
                  PRODUCTCODE: updatedData.productCode,
                  CATEGORYNAME: updatedData.categoryName,
                  HSNCODE: updatedData.hsncode,
                  MINQTY: updatedData.minqty,
                }
              : item
          )
        );
  
        setEditingKey(null);
        form.resetFields();
        message.success("Product updated successfully!");
      } catch (error) {
        message.error("Failed to update product.");
      }
    } else {
      // If no changes were made to the product, reset the form
      setEditingKey(null);
      form.resetFields();
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
      title: "Main Product",
      dataIndex: "MNAME",
      key: "MNAME",
      sorter: (a, b) => a.MNAME.localeCompare(b.MNAME),
    },
    {
      title: "Product Category",
      dataIndex: "PRODUCTCATEGORY",
      key: "PRODUCTCATEGORY",
      sorter: (a, b) => a.PRODUCTCATEGORY.localeCompare(b.PRODUCTCATEGORY),
    },
    {
      title: "Product Name",
      dataIndex: "PRODUCTNAME",
      key: "PRODUCTNAME",
      sorter: (a, b) => a.PRODUCTNAME.localeCompare(b.PRODUCTNAME),
    },
    {
      title: "Product Code",
      dataIndex: "PRODUCTCODE",
      key: "PRODUCTCODE",
      sorter: (a, b) => a.PRODUCTCODE.localeCompare(b.PRODUCTCODE),
    },
    {
      title: "HSN Code",
      dataIndex: "HSNCODE",
      key: "HSNCODE",
      sorter: (a, b) => a.HSNCODE.localeCompare(b.HSNCODE),
    },
    {
      title: "Min Qty",
      dataIndex: "MINQTY",
      key: "MINQTY",
      sorter: (a, b) => a.MINQTY - b.MINQTY,
    },
    {
      title: "Category",
      dataIndex: "CATEGORYNAME",
      key: "CATEGORYNAME",
      sorter: (a, b) => a.CATEGORYNAME.localeCompare(b.CATEGORYNAME),
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
    <div style={{  backgroundColor: "#f4f6f9" }}>
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
                rules={[{ required: true,  }]}
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
                name="productcategory"
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
                name="hsncode"
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
                name="minqty"
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
                name="categoryName"
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
          <Row justify="end" >
            <Col>
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
            <Button htmlType="button" onClick={handleCancel} style={{ backgroundColor: "#f0f0f0" }}>
              Cancel
            </Button>
            </Form.Item></Col></Row>
          
        </Form>
      </Card>

      <Row justify="end" style={{ marginBottom: "10px" }}>
      <Col span={6}>
          <Input.Search
            placeholder="Search..."
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
        size="small"
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

export default ProductMaster;
