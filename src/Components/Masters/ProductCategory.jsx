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
  Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import TableHeaderStyles from '../Pages/TableHeaderStyles';

const { Option } = Select;

const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant header value
axios.defaults.headers.common['tenantName'] = tenantNameHeader;

const ProductCategory = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);  // For pagination
  const [pageSize, setPageSize] = useState(20);      // For pagination
  const categoryInputRef = useRef(); // Ref for the second input field
  const [mainProductOptions, setMainProductOptions] = useState([]);  // State for dynamic main product options
  const [rowdata, setRowdata] = useState(null);

  useEffect(() => {
    // Fetch main products from API
    const fetchMainProducts = async () => {
      try {
        const response = await axios.get(`${CREATE_jwel}/api/Master/MasterMainProductList`);
        const options = response.data.map((item) => item.MNAME);  // Assuming the response contains MNAME
        setMainProductOptions(options); // Set the main product options
      } catch (error) {
        message.error("Failed to fetch main products.");
      }
    };

    fetchMainProducts();

    // Fetch product category data
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${CREATE_jwel}/api/Master/MasterProductCategoryList`);
      const formattedData = response.data.map((item, index) => ({
        ...item,
        key: index,
        sno: index + 1, // Add serial number
      }));
      setData(formattedData);
    } catch (error) {
      message.error("Failed to fetch product categories.");
    }
  };
  

  const checkProductExists = async (mainProduct, category) => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/MasterProductCategorySearch?MName=${mainProduct}&ProductCategory=${category}`
      );
      return response.data.length > 0;
    } catch (error) {
      message.error("Failed to check product existence.");
      return false;
    }
  };

  const handleAdd = async (values) => {
    const productExists = await checkProductExists(values.mainProduct, values.category);
    if (productExists) {
      message.warning("This product category already exists.");
      return;
    }

    try {
      await axios.post(
        `${CREATE_jwel}/api/Master/MasterProductCategoryInsert`,
        {
          mname: values.mainProduct,
          productcategory: values.category,
          minqty: 10,
          cloud_upload: false,
        }
      );

      const newRecord = {
        key: Date.now(),
        MNAME: values.mainProduct,
        PRODUCTCATEGORY: values.category,
        MINQTY: 10,
      };

      setData((prevData) => [...prevData, newRecord]);

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
        `${CREATE_jwel}/api/Master/MasterProductCategoryDelete?MName=${record.MNAME}&ProductCategory=${record.PRODUCTCATEGORY}`
      );
      setData(data.filter((item) => item.key !== key));
      message.success("Product deleted successfully!");
    } catch (error) {
      message.error("Failed to delete product.");
    }
  };

  const handleEdit = (record) => {
    setEditingKey(true);
    setRowdata(record.key);

    form.setFieldsValue({
      mainProduct: record.MNAME,
      category: record.PRODUCTCATEGORY,
    });
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    const updatedData = form.getFieldsValue();
    const record = data.find((item) => item.key === rowdata);

    // Check if there are any changes
    if (
      updatedData.mainProduct === record?.MNAME &&
      updatedData.category === record?.PRODUCTCATEGORY
    ) {
      setEditingKey(false);
      form.resetFields();
      return;
    }

    // Proceed with existing logic
    if (updatedData.mainProduct !== record.MNAME || updatedData.category !== record.PRODUCTCATEGORY) {
      const productExists = await checkProductExists(updatedData.mainProduct, updatedData.category);
      if (productExists) {
        message.warning("This product category already exists.");
        return;
      }
    }

    try {
      // Delete the existing record before inserting the new one
      if (updatedData.mainProduct !== record.MNAME || updatedData.category !== record.PRODUCTCATEGORY) {
        await axios.post(
          `${CREATE_jwel}/api/Master/MasterProductCategoryDelete?MName=${record.MNAME}&ProductCategory=${record.PRODUCTCATEGORY}`
        );
      }

      // Insert the new record
      await axios.post(
        `${CREATE_jwel}/api/Master/MasterProductCategoryInsert`,
        {
          mname: updatedData.mainProduct,
          productcategory: updatedData.category,
          minqty: 10,
          cloud_upload: false,
        }
      );

      // Update the table data
      setData((prevData) =>
        prevData.map((item) =>
          item.key === editingKey
            ? {
                ...item,
                MNAME: updatedData.mainProduct,
                PRODUCTCATEGORY: updatedData.category,
                MINQTY: 10,
              }
            : item
        )
      );

      setEditingKey(false);
      form.resetFields();
      message.success("Product updated successfully!");
      fetchData();

    } catch (error) {
      message.error("Failed to update product.");
    }
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(false);
  }, [form]);

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      className: 'blue-background-column', 
      width: 50, 
  },
    {
      title: "Main Product",
      dataIndex: "MNAME",
      key: "MNAME",
      render: (text) => text.toUpperCase(),
      sorter: (a, b) => a.MNAME.localeCompare(b.MNAME),
      filters: [
        ...new Set(data.map(item => item.MNAME)) // Dynamically extract unique MNAME values from the data
      ].map(item => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.MNAME.includes(value),
    },
    {
      title: "Product Category",
      dataIndex: "PRODUCTCATEGORY",
      key: "PRODUCTCATEGORY",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Action",
      key: "action",
      align:'center',

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
    <div style={{  backgroundColor: "#f4f6f9" }}>
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
                  value={form.getFieldValue("mainProduct")}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                  onDropdownVisibleChange={(open) => {
                    if (open) {
                      form.setFieldsValue({ mainProduct: undefined });
                    }
                  }}
                  onChange={(value) => form.setFieldsValue({ mainProduct: value.toUpperCase() })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (form.getFieldValue("mainProduct") && categoryInputRef.current) {
                        categoryInputRef.current.focus();
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
                  ref={categoryInputRef}
                  onChange={(e) => form.setFieldsValue({ category: e.target.value.toUpperCase() })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" style={{ marginTop: "5px" }}>
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
                <Button
                  htmlType="button"
                  onClick={handleCancel}
                  style={{ backgroundColor: "#f0f0f0" }}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Search Box and Pagination */}
   
      <div style={{marginLeft:"5px", float: "right", marginBottom: "10px" }}>
      <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredData.length}
            showSizeChanger
            pageSizeOptions={['10', '20', '50', '100']}
            onChange={handlePageChange}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}

          />
      </div>

      <div style={{ float: "right", marginBottom: "10px" }}>
     
          <Input.Search
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
            style={{ width: "100%", marginBottom: "10px" }}
            />
      </div>
      {/* Table with Pagination */}
      <TableHeaderStyles>

      <Table
        columns={columns}
        dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        size="small"
        pagination={false}
        style={{
          marginTop: "10px",
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      />
      </TableHeaderStyles>
    </div>
  );
};

export default ProductCategory;
