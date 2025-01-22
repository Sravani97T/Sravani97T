import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Checkbox,
  message,
  Breadcrumb,
  Pagination
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import TableHeaderStyles from "../Pages/TableHeaderStyles";

const { Option } = Select;

const JewelryTypeMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [mainProductOptions, setMainProductOptions] = useState([]);
  const [isJwelTypeExist, setIsJwelTypeExist] = useState(false);
  const [rowData, setRowData] = useState();
  // Refs for handling "Enter" key navigation
  const jewelryTypeRef = useRef(null);
  const mainProductRef = useRef(null);
  const hsnCodeRef = useRef(null);
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant name header
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  // Fetch Main Products
  const fetchMainProducts = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/MasterMainProductList`
      );
      const options = response.data.map((item) => item.MNAME);  // Assuming the response contains MNAME
      setMainProductOptions(options); // Set the main product options
    } catch (error) {
      message.error("Failed to fetch main products.");
    }
  };

  // Fetch Table Data
  const fetchTableData = async () => {
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/MasterJewelTypeMasterList`
      );
      const tableData = response.data.map((item, index) => ({
        key: item.JewelType,  // Using JewelType as the key
        sno: index + 1,  // Adding serial number
        jewelryType: item.JewelType,
        mainProduct: item.MName,
        hsnCode: item.HSNCODE,
        isDefault: item.DEFAULTTYPE,
      }));
      setData(tableData); // Set the table data
    } catch (error) {
      message.error("Failed to fetch jewelry types.");
    }
  };

  useEffect(() => {
    fetchMainProducts();
    fetchTableData();
  }, []);
  const handleJewelTypeCheck = (brandName) => {
    if (!brandName) return; // Prevent making an API request if the brandName is empty

    axios.get(`${CREATE_jwel}/api/Master/MasterJewelTypeMasterSearch?JewelType=${brandName}`, {
      headers: {
        "tenantName": tenantNameHeader,
      }
    })
      .then(response => {
        console.log(response.data); // Log the response for debugging

        // Check if the response contains a valid result
        const brandExists = response.data.some(item => item.JewelType === brandName);

        if (brandExists) {
          setIsJwelTypeExist(true);
          message.error("Jewelry type already exists.");
        } else {
          setIsJwelTypeExist(false);
        }
      })
      .catch(error => {
        message.error("Failed to check Jewelry type");
        console.error(error); // Log the error for debugging
      });
  };

  // Handle Add with API Call (Check if JewelType exists, then Insert)
  const handleAdd = async (values) => {
    try {

      if (isJwelTypeExist) {
        // If the JewelType exists, show an error message
        message.error("Jewelry type already exists.");
      } else {
        // If JewelType does not exist, proceed with adding it
        const insertResponse = await axios.post(
          `${CREATE_jwel}/api/Master/MasterJewelTypeMasterInsert`,
          {
            jewelType: values.jewelryType,
            mName: values.mainProduct,
            code: 0, // Add appropriate value for 'code'
            hsncode: values.hsnCode,
            defaulttype: values.isDefault || false,
            pureornot: true, // Assuming a default value for pureornot
            metaltype: "string", // Set appropriate value or pass from the form
            subtype: "string", // Set appropriate value or pass from the form
            gst: 0, // Add appropriate value for GST
            clouD_UPLOAD: true, // Assuming this is always true
          }
        );

        if (insertResponse.data === true) {
          // Successfully inserted
          const newData = {
            key: Date.now(),
            sno: data.length + 1,  // Adding serial number
            ...values,
          };
          setData([...data, newData]);
          form.resetFields();
          jewelryTypeRef.current && jewelryTypeRef.current.focus(); // Refocus on the first field
          message.success("Jewelry type added successfully!");
          fetchTableData();
          setIsJwelTypeExist(false);

        } else {
          message.error("Failed to add jewelry type.");
        }
      }
    } catch (error) {
      message.error("Error occurred while adding jewelry type.");
      console.error(error);
    }
  };

  // Handle Save for Edit

  // Handle Save for Edit
  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Get the form values


      if (isJwelTypeExist) {
        // If JewelType already exists, show error message and return
        message.error("Jewelry type already exists.");

      }

      // Delete the old record using the delete API
      const deleteResponse = await axios.post(
        `${CREATE_jwel}/api/Master/MasterJewelTypeMasterDelete?JewelType=${data.find(item => item.key === rowData)?.jewelryType}`
      );

      if (deleteResponse.data === true) {
        // Proceed with adding the new record using the insert API
        const insertResponse = await axios.post(
          `${CREATE_jwel}/api/Master/MasterJewelTypeMasterInsert`,
          {
            jewelType: values.jewelryType,
            mName: values.mainProduct,
            code: 0, // Add appropriate value for 'code'
            hsncode: values.hsnCode,
            defaulttype: values.isDefault || false,
            pureornot: true, // Assuming a default value for pureornot
            metaltype: "string", // Set appropriate value or pass from the form
            subtype: "string", // Set appropriate value or pass from the form
            gst: 0, // Add appropriate value for GST
            clouD_UPLOAD: true, // Assuming this is always true
          }
        );

        if (insertResponse.data === true) {
          // Update the table data with the new values
          setData(data.map((item) =>
            item.key === editingKey
              ? { ...item, ...values }
              : item
          ));

          // Reset form and close the edit mode
          form.resetFields();
          setEditingKey(false);
          message.success("Jewelry type updated successfully!");
          fetchTableData();
          setIsJwelTypeExist(false);
        } else {
          message.error("Failed to update jewelry type.");
        }
      }
    } catch (error) {
      message.error("Error occurred while updating jewelry type.");
      console.error(error);
    }
  };




  // Handle Delete with API Call
  const handleDelete = async (key, jewelType) => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/MasterJewelTypeMasterDelete?JewelType=${jewelType}`
      );

      if (response.data === true) {
        // Only update the state if the response is true
        setData(data.filter((item) => item.key !== key));
        message.success("Jewelry type deleted successfully!");
        fetchTableData();  // Fetch updated data after deletion
      } else {
        message.error("Failed to delete jewelry type.");
      }
    } catch (error) {
      message.error("Error deleting jewelry type.");
    }
  };

  const handleEdit = (record) => {
    setEditingKey(true);
    setRowData(record.key);
    form.setFieldsValue(record);
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(false);
  }, [form]);

  const handleEnterPress = (e, nextFieldRef) => {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName === "input" || tagName === "textarea") {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent form submission
        if (nextFieldRef && nextFieldRef.current) {
          nextFieldRef.current.focus(); // Move to next field
        }
      }
    }
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      className: 'blue-background-column', 
      width: 50, 
    },
    {
      title: "Jewelry Type",
      dataIndex: "jewelryType",
      key: "jewelryType",
      sorter: (a, b) => a.jewelryType.localeCompare(b.jewelryType),
    },
    {
      title: "Main Product",
      dataIndex: "mainProduct",
      key: "mainProduct",
      sorter: (a, b) => a.mainProduct.localeCompare(b.mainProduct),
    },
    {
      title: "HSN Code",
      dataIndex: "hsnCode",
      align: 'center',

      key: "hsnCode",
    },
    {
      title: "Default",
      dataIndex: "isDefault",
      key: "isDefault",
      align: 'center',

      render: (isDefault) => (isDefault ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      align: 'center',

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
            onConfirm={() => handleDelete(record.key, record.jewelryType)} // Pass jewelType for deletion
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: "#f4f6f9" }}>
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
            <Breadcrumb.Item>Masters</Breadcrumb.Item>
            <Breadcrumb.Item>JewelryType Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Card
        title={editingKey ? "Edit Jewelry Type" : "Add Jewelry Type"}
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
                name="jewelryType"
                label="Jewelry Type"
                rules={[{ required: true, message: "Jewelry type is required" }]}
              >
                <Input
                  placeholder="Enter jewelry type"
                  ref={jewelryTypeRef}
                  onKeyDown={(e) => handleEnterPress(e, mainProductRef)}
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();  // Convert to uppercase
                    form.setFieldsValue({ jewelryType: uppercaseValue });  // Set the transformed value back to the form field
                    handleJewelTypeCheck(uppercaseValue);  // Check brand name with uppercase value
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="mainProduct"
                label="Main Product"
                rules={[{ required: true, message: "Main product is required" }]}
              >
                <Select
                  placeholder="Select main product"
                  ref={mainProductRef}
                  showSearch
                  value={form.getFieldValue("mainProduct")}
                  onChange={(value) => form.setFieldsValue({ mainProduct: value })}
                  onKeyDown={(e) => handleEnterPress(e, hsnCodeRef)}
                >
                  {mainProductOptions.map((product, index) => (
                    <Option key={index} value={product}>
                      {product}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="hsnCode"
                label="HSN Code"
                rules={[{ required: true, message: "HSN code is required" }]}
              >
                <Input
                  placeholder="Enter HSN code"
                  ref={hsnCodeRef}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.submit();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="isDefault" valuePropName="checked">
                <Checkbox>Default</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 8, backgroundColor: "#0C1154" }}
            >
              {editingKey ? "Save" : "Submit"}
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </div>
        </Form>
      </Card>

      <div style={{marginLeft:"5px" , float: "right", marginBottom: "10px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data.length}
          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}

          style={{ marginBottom: "10px" }}
        />
      </div>

      <div style={{ float: "right", marginBottom: "10px" }}>
        <Input.Search
          placeholder="Search"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>

      <TableHeaderStyles>
        <Table
          columns={columns}
          dataSource={data.filter((item) =>
            Object.values(item)
              .join(" ")
              .toLowerCase()
              .includes(searchText.toLowerCase())
          ).slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          rowKey="key"
          size="small"
          pagination={false}
          style={{
            background: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        />
      </TableHeaderStyles>
    </div>
  );
};

export default JewelryTypeMaster;
