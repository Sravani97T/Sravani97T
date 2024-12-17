import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { CREATE_jwel } from "../../Config/Config";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios for API requests
const { Option } = Select;

const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant name header

const PrefixMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isPrefixExist, setIsPrefixExist] = useState(false); // State to track if prefix exists
  const [oldPrefix, setOldPrefix] = useState(""); // Store old prefix for edit
  const [mainProductOptions, setMainProductOptions] = useState([]); // Main product options for dropdown
  const prefixInputRef = useRef(); // Ref for the second input field

  // Fetch main product list from API


  // Fetch data from the API
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
    axios
      .get(`${CREATE_jwel}/api/Master/MasterPrefixMasterList`, {
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
      .get(`${CREATE_jwel}/api/Master/MasterPrefixMasterSearch?Prefix=${prefix}`, {
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

  const handleAdd = (values) => {
    if (isPrefixExist) {
      message.error("Prefix already exists!");
      return;
    }

    // Proceed to add the new prefix if it does not exist
    axios
      .post(
        `${CREATE_jwel}/api/Master/MasterPrefixMasterInsert`,
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
      .then(() => {
        message.success("Prefix added successfully!");
        setData([
          ...data,
          {
            key: data.length + 1,
            mainProduct: values.mainProduct,
            prefix: values.prefix,
            pure: values.pure,
            displayOnDailyRates: values.displayOnDailyRates,
          },
        ]);
        form.resetFields(); // Clear form after submission
      })
      .catch((error) => {
        message.error("Failed to add prefix");
      });
  };



  // Handle editing a prefix
  const handleEdit = (record) => {
    form.setFieldsValue({
      mainProduct: record.mainProduct,
      prefix: record.prefix,
      pure: record.pure,
      displayOnDailyRates: record.displayOnDailyRates,
    });
    setEditingKey(record.key);
    setOldPrefix(record.prefix); // Store the old prefix for delete
  };
  const handleSave = (values) => {
    if (isPrefixExist) {
      message.error("Prefix already exists!");
      return;
    }
    // Check if the record being edited is the same as the existing data
    if (editingKey && oldPrefix === values.prefix) {
      setEditingKey(null); // Reset editing mode after no changes
      form.resetFields(); // Reset form fields after save
      return;
    }
    // Check if the prefix has changed (i.e., oldPrefix !== newPrefix)
    if (oldPrefix && oldPrefix !== values.prefix) {
      // Call delete API before updating
      axios
        .post(
          `${CREATE_jwel}/api/Master/MasterPrefixMasterDelete?Prefix=${oldPrefix}`,
          null,
          {
            headers: {
              tenantName: tenantNameHeader,
            },
          }
        )
        .then(() => {
          // Proceed with updating the prefix after deletion
          savePrefix(values);
        })
        .catch((error) => {
          message.error("Failed to delete old prefix");
        });
    } else {
      // If prefix is not changed, directly proceed with saving the new data
      savePrefix(values);
    }
  };
  const savePrefix = (values) => {
    // Post request to add or update prefix
    axios
      .post(
        `${CREATE_jwel}/api/Master/MasterPrefixMasterInsert`,
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
      .then(() => {
        message.success("Prefix saved successfully!");
        // Update the table data
        if (editingKey) {
          setData(
            data.map((item) =>
              item.key === editingKey ? { ...item, ...values } : item
            )
          );
        } else {
          // If it's a new entry
          setData([
            ...data,
            {
              key: data.length + 1,
              mainProduct: values.mainProduct,
              prefix: values.prefix,
              pure: values.pure,
              displayOnDailyRates: values.displayOnDailyRates,
            },
          ]);
        }
        setEditingKey(null); // Reset editing mode
        form.resetFields(); // Clear form
      })
      .catch((error) => {
        message.error("Failed to save prefix");
      });
  };


  // Handle deleting a prefix
  const handleDelete = (prefix) => {
    axios
      .post(
        `${CREATE_jwel}/api/Master/MasterPrefixMasterDelete?Prefix=${prefix}`,
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
      align:'center',

      key: "prefix",
    },
    {
      title: "Pure",
      dataIndex: "pure",
      key: "pure",
      
      align:'center',

      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Display Rates",
      dataIndex: "displayOnDailyRates",
      align:'center',

      key: "displayOnDailyRates",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Actions",
      key: "actions",
      align:'center',

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
  const handleCancel = useCallback(() => {
    form.resetFields(); // Reset form fields
    setEditingKey(null); // Set editingKey to null to switch to Add mode
  }, [form]);

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
    <div style={{ backgroundColor: "#f4f6f9" }}>
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
                      if (form.getFieldValue("mainProduct") && prefixInputRef.current) {
                        prefixInputRef.current.focus();
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
                name="prefix"
                label="Prefix"
                rules={[{ required: true, message: "Prefix is required" }]}
              >
                <Input
                  placeholder="Enter Prefix"
                  ref={prefixInputRef}
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    form.setFieldsValue({ prefix: uppercaseValue });
                    checkDuplicatePrefix(uppercaseValue);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      const nextPureCheckbox = document.getElementById("pureCheckbox");
                      if (nextPureCheckbox) {
                        nextPureCheckbox.focus(); // Move focus to Pure checkbox
                      }
                    }
                  }}
                />
              </Form.Item>

            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item name="pure" valuePropName="checked">
                <Checkbox id="pureCheckbox">Pure</Checkbox>
              </Form.Item>

            </Col>
            <Col xs={24} sm={8}>
              <Form.Item name="displayOnDailyRates" valuePropName="checked">
                <Checkbox id="displayOnDailyRatesCheckbox">Display on Daily Rates</Checkbox>
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
              onClick={handleCancel} // Call handleCancel to reset form and go back to Add mode
              style={{ backgroundColor: "#f0f0f0" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>

      {/* Search Field */}
      <div style={{ float: "right" }}>

        <Input.Search
          placeholder="Search records"
          style={{ width: "100%", borderRadius: "4px", marginBottom: "10px" }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        size="small"
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
