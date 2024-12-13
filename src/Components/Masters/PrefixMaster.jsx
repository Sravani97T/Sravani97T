import React, { useState, useEffect } from "react";
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
  Select,
  Checkbox,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios for API requests

const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant name header

const PrefixMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isPrefixExist, setIsPrefixExist] = useState(false); // State to track if prefix exists
  const [oldPrefix, setOldPrefix] = useState(""); // Store old prefix for edit
  const [mainProductOptions, setMainProductOptions] = useState([]); // Main product options for dropdown

  // Fetch main product list from API
  useEffect(() => {
    axios
      .get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList", {
        headers: {
          tenantName: tenantNameHeader,
        },
      })
      .then((response) => {
        setMainProductOptions(
          response.data.map((item) => ({
            value: item.MNAME, // Assuming 'MNAME' is the main product name field
            label: item.MNAME,
          }))
        );
      })
      .catch((error) => {
        message.error("Failed to fetch main products");
      });
  }, []);

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList", {
        headers: {
          tenantName: tenantNameHeader,
        },
      })
      .then((response) => {
        setData(
          response.data.map((item, index) => ({
            key: index + 1,
            mainProduct: item.MAINPRODUCT,
            prefix: item.Prefix,
            pure: item.PUREORNOT,
            displayOnDailyRates: item.DISPLAY_DRATES,
          }))
        );
      })
      .catch((error) => {
        message.error("Failed to fetch data");
      });
  }, []);

  // Duplicate check for prefix
  const checkDuplicatePrefix = (prefix) => {
    if (!prefix) return; // Prevent making an API request if the prefix is empty

    axios
      .get(`http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterSearch?Prefix=${prefix}`, {
        headers: {
          tenantName: tenantNameHeader,
        },
      })
      .then((response) => {
        const prefixExists = response.data.length > 0; // Check if prefix exists
        setIsPrefixExist(prefixExists); // Update state with result
        if (prefixExists) {
          message.error("Prefix already exists!");
        }
      })
      .catch((error) => {
        message.error("Failed to check prefix");
        console.error(error); // Log the error for debugging
      });
  };

  // Handle adding a new prefix
  const handleAdd = (values) => {
    if (isPrefixExist) {
      message.error("Prefix already exists!");
      return;
    }
  
    axios
      .post(
        "http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterInsert",
        {
          prefix: values.prefix,
          mainproduct: values.mainProduct,
          pureornot: values.pure,
          displaY_DRATES: values.displayOnDailyRates,
          cloud_upload: true,
        },
        {
          headers: {
            tenantName: tenantNameHeader,
          },
        }
      )
      .then((response) => {
        if (response.data.Download) {
          // Adding the new data to the state immediately
          const newData = {
            key: Date.now(),
            ...values, // Ensure new data is in the correct format
          };
          setData((prevData) => [...prevData, newData]); // Update table data
  
          form.resetFields();
          message.success("Prefix added successfully!"); // Show success message
        }
      })
      .catch((error) => {
        message.error("Failed to add prefix");
      });
  };
  
  

  // Handle editing a prefix
  const handleEdit = (record) => {
    setEditingKey(record.key);
    setOldPrefix(record.prefix); // Store the old prefix for delete
    form.setFieldsValue({
      mainProduct: record.mainProduct,
      prefix: record.prefix,
      pure: record.pure,
      displayOnDailyRates: record.displayOnDailyRates,
    });
  };

  // Handle saving the edited prefix
  const handleSave = () => {
    const updatedData = form.getFieldsValue();
  
    // Check if any field is actually changed
    const isChanged =
      updatedData.prefix !== oldPrefix ||
      updatedData.mainProduct !== form.getFieldValue('mainProduct') ||
      updatedData.pure !== form.getFieldValue('pure') ||
      updatedData.displayOnDailyRates !== form.getFieldValue('displayOnDailyRates');
  
    if (!isChanged) {
      // No changes made, return early without updating
      setEditingKey(null);
      form.resetFields();
      return;
    }
  
    // If prefix is changed, delete the old one first
    if (updatedData.prefix !== oldPrefix) {
      axios
        .post(
          `http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterDelete?Prefix=${oldPrefix}`,
          null,
          {
            headers: {
              tenantName: tenantNameHeader,
            },
          }
        )
        .then(() => {
          // After deleting old prefix, insert the new one
          axios
            .post(
              "http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterInsert",
              {
                prefix: updatedData.prefix,
                mainproduct: updatedData.mainProduct,
                pureornot: updatedData.pure,
                displaY_DRATES: updatedData.displayOnDailyRates,
                cloud_upload: true,
              },
              {
                headers: {
                  tenantName: tenantNameHeader,
                },
              }
            )
            .then(() => {
              // Update the table data with the new value
              setData(
                data.map((item) =>
                  item.key === editingKey ? { ...item, ...updatedData } : item
                )
              );
              setEditingKey(null);
              form.resetFields();
              message.success("Prefix updated successfully!");
            })
            .catch((error) => {
              message.error("Failed to insert new prefix");
            });
        })
        .catch((error) => {
          message.error("Failed to delete old prefix");
        });
    } else {
      // If prefix hasn't changed, just update the existing record
      axios
        .post(
          "http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterInsert",
          {
            prefix: updatedData.prefix,
            mainproduct: updatedData.mainProduct,
            pureornot: updatedData.pure,
            displaY_DRATES: updatedData.displayOnDailyRates,
            cloud_upload: true,
          },
          {
            headers: {
              tenantName: tenantNameHeader,
            },
          }
        )
        .then(() => {
          setData(
            data.map((item) =>
              item.key === editingKey ? { ...item, ...updatedData } : item
            )
          );
          setEditingKey(null);
          form.resetFields();
          message.success("Prefix updated successfully!");
        })
        .catch((error) => {
          message.error("Failed to update prefix");
        });
    }
  };
  
  
  
  // Handle deleting a prefix
  const handleDelete = (prefix) => {
    axios
      .post(
        `http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterDelete?Prefix=${prefix}`,
        null,
        {
          headers: {
            tenantName: tenantNameHeader,
          },
        }
      )
      .then(() => {
        setData(data.filter((item) => item.prefix !== prefix));
        message.success("Prefix deleted successfully!");
      })
      .catch((error) => {
        message.error("Failed to delete prefix");
      });
  };

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
    },
    {
      title: "Prefix",
      dataIndex: "prefix",
      key: "prefix",
    },
    {
      title: "Pure",
      dataIndex: "pure",
      key: "pure",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Display Rates",
      dataIndex: "displayOnDailyRates",
      key: "displayOnDailyRates",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="link"
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.prefix)}
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
            <Breadcrumb.Item>Prefix Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      {/* Add/Edit Form */}
      <Card
        title={editingKey ? "Edit Prefix" : "Add Prefix"}
        style={{
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="mainProduct"
                label="Main Product"
                rules={[{ required: true, message: "Main product is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select Main Product"
                  options={mainProductOptions}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={12}>
              <Form.Item
                name="prefix"
                label="Prefix"
                rules={[{ required: true, message: "Prefix is required" }]}
              >
                <Input
                  placeholder="Enter Prefix"
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    form.setFieldsValue({ prefix: uppercaseValue });
                    checkDuplicatePrefix(uppercaseValue);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="pure" valuePropName="checked">
                <Checkbox>Pure</Checkbox>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="displayOnDailyRates" valuePropName="checked">
                <Checkbox>Display on Daily Rates</Checkbox>
              </Form.Item>
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
              onClick={() => setEditingKey(null)}
              style={{ backgroundColor: "#f0f0f0" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>

      {/* Search Field */}
      <Row gutter={16}>
        <Col xs={24} sm={16} lg={12}>
          <Input.Search
            placeholder="Search records"
            style={{ marginBottom: "16px", width: "100%", borderRadius: "4px" }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
      </Row>

      {/* Table */}
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

export default PrefixMaster;
