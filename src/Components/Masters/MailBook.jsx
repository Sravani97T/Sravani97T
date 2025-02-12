import React, { useState, useCallback, useRef, useEffect } from "react";
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
  Radio,
  DatePicker,
  Pagination

} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import TableHeaderStyles from "../Pages/TableHeaderStyles";
import { CREATE_jwel } from "../../Config/Config";

const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0="; // Your tenant name header

const { Option } = Select;

const MailBook = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [isBrandNameExist, setIsBrandNameExist] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [editingKey, setEditingKey] = useState(null);
  const refs = {
    nameRef: useRef(),
    category: useRef(),
    stateCodeRef: useRef(),
    mobileNo1Ref: useRef(),
    mobileNo2Ref: useRef(),
    cityRef: useRef(),
    addressRef: useRef(),
    stateRef: useRef(),
    GSTINRef: useRef(),
    eMailRef: useRef(),
    pinCodeRef: useRef(),
    PANRef: useRef(),
    proofTypeRef: useRef(),
    proofNumberRef: useRef(),
    dobRef: useRef(),
    anniversaryRef: useRef(),
    locationTypeRef: useRef(),
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${CREATE_jwel}/api/Master/MasterDealerMasterList`);
      
      const dataWithSerialNumbers = response.data.map((item, index) => ({
        ...item,
        sno: index + 1,
        key: index + 1, // Ensure each item has a unique key
      }));
      
      setData(dataWithSerialNumbers);
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch data from the API.");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);
  // Check if the brand name exists
  const handleBrandNameCheck = (category, dealerName) => {
    // Only call API if both category and dealer name are provided
    if (!category || !dealerName) return;

    axios
      .get(`${CREATE_jwel}`+`/api/Master/MasterDealerMasterSearch?CustType=${category}&DealerName=${dealerName}`, {
        headers: {
          "tenantName": tenantNameHeader,
        },
      })
      .then(response => {
        const result = response.data;

        const brandExists = result.some(item => item.CustType === category && item.Dealername === dealerName);
        if (brandExists) {
          setIsBrandNameExist(true);
          message.error(`Record already exists! Category: ${category}, Dealer Name: ${dealerName}`);
        } else {
          setIsBrandNameExist(false);
        }
      })
      .catch(error => {
        message.error("Failed to check brand name");
        console.error(error);
      });
  };


  const handleEnterPress = (e, nextRef) => {
    e.preventDefault();
    if (nextRef?.current) {
      nextRef.current.focus();
    } else {
      form.submit(); // Submit the form if there's no next field
    }
  };


  const handleAdd = async (values) => {
    if (isBrandNameExist) {
      message.error(" already exists!");
      return;
    }
    const requestBody = {
      // Mapping fields from the form
      custType: values.category,
      street: values.address || "-",
      dealername: values.dealername,
      address1: values.address1,
      address2: values.address2 || "-",
      address3: values.address3 || "-",
      address4: values.address4 || "-",
      cityName: values.cityName,
      phonenum: values.phonenum || "-",
      mobilenum: values.mobilenum || "111111111111",
      mobileNum2: values.mobileNum2 || "-",
      card: values.card ,
      cardno: values.cardno,
      state: values.state,
      district: values.district || "ffff",
      pinCode: values.pinCode,
      education: values.education || "-",
      eMail: values.eMail,
      dob: values.dob ? values.dob.format("YYYY-MM-DD") : "",
      annversary: values.anniversary ? values.anniversary.format("YYYY-MM-DD") : "", // Fixed typo here
      gender: values.gender || "female",
      website: values.website || "https://johndoe.com",
      fax: values.fax || "11",
      tinNo: values.tinNo,
      cst: values.cst || "11",
      bcouponno: values.bcouponno || "11",
      acouponno: values.acouponno || "11",
      entrydate: new Date().toISOString().split("T")[0],
      statecode: values.statecode || "-",
      station: values.station || "-",
      clouD_UPLOAD: true,
      entryno: values.entryno || "1",
    };

    try {
      setLoading(true);
      const response = await axios.post(
        `${CREATE_jwel}`+"/api/Master/MasterDealerMasterInsert",
        requestBody
      );
      setLoading(false);

      if (response.data === true) {
        message.success("Data inserted successfully!");
        form.resetFields();
        fetchData();
      } else {
        message.error("Failed to insert data. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      message.error("Error submitting data: " + error.message);
    }
  };
  const handleDelete = async (record) => {
    try {
      const url = `${CREATE_jwel}`+`/api/Master/MasterDealerMasterDelete?CustType=${encodeURIComponent(record.CustType)}&DealerName=${encodeURIComponent(record.Dealername)}`;

      const response = await axios.post(url);

      if (response.data === true) {
        setData((prevData) => prevData.filter((item) => item.key !== record.key));
        message.success("Record deleted successfully!");
        fetchData(); // Refresh data
      } else {
        message.error("Failed to delete the record. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      message.error("An error occurred while deleting the record. Please try again.");
    }
  };

  const handleEdit = (record) => {
    console.log("record", record);
    setEditingKey(record.key);
    form.setFieldsValue({
      category: record.CustType,
      dealername: record.Dealername,
      mobilenum: record.Mobilenum,
      mobileNum2: record.MobileNum2,
      cityName: record.CityName,
      address1: record.address1,
      state: record.STATE,
      statecode: record.STATECODE,
      pinCode: record.PinCode,
      tinNo: record.TinNo,
      card: record.CARD, // Corrected field name for PAN
      proofType: record.proofType,
      cardno: record.cardno, // Corrected field name for Proof Number
      eMail: record.EMail,
      dob: record.dob ? moment(record.dob, "YYYY-MM-DD") : null, // Use moment to parse date
      anniversary: record.ANNVERSARY ? moment(record.ANNVERSARY, "YYYY-MM-DD") : null, // Use moment to parse date
      station: record.STATION,
    });
    window.scrollTo(0, 0);
  };

  const handleSave = async (values) => {
    const updatedData = form.getFieldsValue();
    const category = updatedData.category;
    const dealerName = updatedData.dealername;

    // Check for duplicate
    handleBrandNameCheck(category, dealerName);

    if (isBrandNameExist) {
      message.error("Record already exists!");
      return;
    }

    // Prevent multiple submissions
    if (loading) return;

    setLoading(true);

    try {
      // Delete the old record
      const deleteUrl = `${CREATE_jwel}`+`/api/Master/MasterDealerMasterDelete?CustType=${encodeURIComponent(category)}&DealerName=${encodeURIComponent(dealerName)}`;
      const deleteResponse = await axios.post(deleteUrl);

      if (deleteResponse.data === true) {
        // Insert the new record
        const requestBody = {
          custType: updatedData.category,
          street: updatedData.address1 || "-",
          dealername: updatedData.dealername,
          address1: updatedData.address1,
          address2: updatedData.address2 || "-",
          address3: updatedData.address3 || "-",
          address4: updatedData.address4 || "-",
          cityName: updatedData.cityName,
          phonenum: updatedData.phonenum || "-",
          mobilenum: updatedData.mobilenum || "111111111111",
          mobileNum2: updatedData.mobileNum2 || "-",
          card: updatedData.card,
          cardno: updatedData.cardno,
          state: updatedData.state,
          district: updatedData.district || "ffff",
          pinCode: updatedData.pinCode,
          education: updatedData.education || "-",
          eMail: updatedData.eMail,
          dob: updatedData.dob ? updatedData.dob.format("YYYY-MM-DD") : "",
          annversary: updatedData.anniversary ? updatedData.anniversary.format("YYYY-MM-DD") : "",
          gender: updatedData.gender || "female",
          website: updatedData.website || "https://johndoe.com",
          fax: updatedData.fax || "11",
          tinNo: updatedData.tinNo,
          cst: updatedData.cst || "11",
          bcouponno: updatedData.bcouponno || "11",
          acouponno: updatedData.acouponno || "11",
          entrydate: new Date().toISOString().split("T")[0],
          statecode: updatedData.statecode || "-",
          station: updatedData.station || "-",
          clouD_UPLOAD: true,
          entryno: updatedData.entryno || "1",
        };

        const insertUrl = `${CREATE_jwel}`+"/api/Master/MasterDealerMasterInsert";
        const insertResponse = await axios.post(insertUrl, requestBody);

        if (insertResponse.data) {
          message.success("Record updated successfully!");
          setData((prevData) =>
            prevData.map((item) =>
              item.key === editingKey ? { ...item, ...updatedData } : item
            )
          );
          setEditingKey(null);
          form.resetFields();
          fetchData(); // Refresh data
        } else {
          message.error("Failed to insert new record.");
        }
      } else {
        message.error("Failed to delete the old record.");
      }
    } catch (error) {
      console.error("Error updating record:", error);
      message.error("An error occurred while updating the record.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };


  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  // const filteredData = data.filter((item) =>
  //   Object.values(item)
  //     .join(" ")
  //     .toLowerCase()
  // );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === "s") {
        e.preventDefault();
        form.submit(); // Trigger form submission
      }
      if (e.altKey && e.key === "c") {
        e.preventDefault();
        handleCancel(); // Reset the form
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form, handleCancel]);

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      className: 'blue-background-column', 
      width: 50, 
    },
    { title: "Category", dataIndex: "CustType", key: "CustType" },
    { title: "Name", dataIndex: "Dealername", key: "Dealername" },
    { title: "Mobile No.1", dataIndex: "Mobilenum", key: "Mobilenum" },
    { title: "Mobile No.2", dataIndex: "MobileNum2", key: "MobileNum2" },
    { title: "City", dataIndex: "CityName", key: "CityName" },
    { title: "Location Type", dataIndex: "STATION", key: "STATION" },
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
            onConfirm={() => handleDelete(record)} // Pass the whole record object
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
            <Breadcrumb.Item>Mail Book</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card
        title={editingKey ? "Edit Bank Details" : "Add Bank Details"}
        style={{
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Category is required" }]}
              >
                <Select
                  placeholder="Select Category"
                  showSearch
                  ref={refs.category}
                  onChange={(value) => {
                    const uppercaseValue = value.toUpperCase();
                    form.setFieldsValue({ category: uppercaseValue });
                    const dealername = form.getFieldValue("dealername"); // Get dealer name
                    handleBrandNameCheck(uppercaseValue, dealername); // Call API with category and dealer name
                  }}
                  onKeyDown={(e) => e.key === "Enter" && refs.nameRef.current?.focus()}
                >
                  <Option value="CUSTOMER">CUSTOMER</Option>
                  <Option value="DEALER">DEALER</Option>
                  <Option value="WORKER">WORKER</Option>
                  <Option value="INCHARGE">INCHARGE</Option>
                  <Option value="PERSONAL">PERSONAL</Option>
                  <Option value="OFFICIAL">OFFICIAL</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dealername"
                label="Name"
                rules={[{ required: true, message: "Name is required" }]}
              >
                <Input
                  placeholder="Enter Name"
                  ref={refs.nameRef}
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    form.setFieldsValue({ dealername: uppercaseValue });
                    const dealername = form.getFieldValue("dealername");
                    const category = form.getFieldValue("category"); // Get category
                    handleBrandNameCheck(category, dealername); // Call API with category and dealer name
                  }}
                  onPressEnter={(e) => handleEnterPress(e, refs.mobileNo1Ref)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mobilenum"
                label="Mobile No. 1"
                rules={[
                  { required: true, message: "Mobile Number 1 is required" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Mobile No. 1"
                  ref={refs.mobileNo1Ref}
                  type="phone"
                  maxLength={10}
                  onPressEnter={(e) => handleEnterPress(e, refs.eMailRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="eMail"
                label="Email"
                rules={[
                  { required: true, message: "Email is required" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input
                  placeholder="Enter Email"
                  ref={refs.eMailRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.mobileNo2Ref)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="mobileNum2"
                label="Mobile No. 2"
                rules={[
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Enter a valid 10-digit mobile number",
                  },
                ]}
              >
                <Input
                  placeholder="Enter Mobile No. 2"
                  ref={refs.mobileNo2Ref}
                  type="phone"
                  maxLength={10}
                  onPressEnter={(e) => handleEnterPress(e, refs.cityRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cityName"
                label="City"
                rules={[{ required: true, message: "City is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select City"
                  ref={refs.cityRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.addressRef.current?.focus()
                  }
                >
                  <Option value="NELLORE">NELLORE</Option>
                  <Option value="YANAM">YANAM</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="address1"
                label="Address"
                rules={[{ required: true, message: "Address is required" }]}
              >
                <Input.TextArea
                  rows={1}
                  placeholder="Enter Address"
                  ref={refs.addressRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.stateRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: "State is required" }]}
              >
                <Select
                  showSearch
                  placeholder="Select State"
                  ref={refs.stateRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.stateCodeRef.current?.focus()
                  }
                >
                  <Option value="AP">AP</Option>
                  <Option value="TS">TS</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                name="statecode"
                label="State Code"
                rules={[{ required: true, message: "State Code is required" }]}
              >
                <Input
                  placeholder="Enter State Code"
                  ref={refs.stateCodeRef}
                  style={{ width: "120px" }} // Smaller input box for state code
                  onPressEnter={(e) => handleEnterPress(e, refs.pinCodeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                name="pinCode"
                label="pinCode"
                rules={[{ required: true, message: "pinCode is required" }]}
              >
                <Input
                  placeholder="Enter  Code"
                  ref={refs.pinCodeRef}
                  style={{ width: "120px" }} // Smaller input box for state code
                  onPressEnter={(e) => handleEnterPress(e, refs.GSTINRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="tinNo"
                label="GSTIN"
                rules={[{ required: true, message: "GSTIN is required" }]}
              >
                <Input
                  placeholder="Enter GSTIN"
                  ref={refs.GSTINRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.PANRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="card"
                label="PAN"
                rules={[{ required: true, message: "PAN is required" }]}
              >
                <Input
                  placeholder="Enter PAN"
                  ref={refs.PANRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.proofTypeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="proofType"
                label="Proof Type"
                rules={[{ required: true, message: "Proof Type is required" }]}
              >
                <Select
                  showSearch
                  ref={refs.proofTypeRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && refs.proofNumberRef.current?.focus()
                  }
                >
                  <Option value="Aadhaar">Aadhaar</Option>
                  <Option value="Voter ID">Voter ID</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="cardno"
                label="Proof Number"
                rules={[{ required: true, message: "Proof Number is required" }]}
              >
                <Input
                  placeholder="Enter Proof Number"
                  ref={refs.proofNumberRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.dobRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="dob" label="Date of Birth">
                <DatePicker
                  format="YYYY-MM-DD"
                  ref={refs.dobRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.anniversaryRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="anniversary" label="Anniversary">
                <DatePicker
                  format="YYYY-MM-DD"
                  ref={refs.anniversaryRef}
                  onPressEnter={(e) => handleEnterPress(e, refs.locationTypeRef)}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item
                name="station"
                label="Location Type"
                rules={[{ required: true, message: "Location Type is required" }]}
              >
                <Radio.Group
                  ref={refs.locationTypeRef}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleEnterPress(e, null)
                  }
                >
                  <Radio value="Out Station">Out Station</Radio>
                  <Radio value="Local">Local</Radio>
                </Radio.Group>
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
              onClick={() => form.resetFields()}
              style={{ backgroundColor: "#f0f0f0" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>

      <div style={{ marginLeft:"5px",float: "right", marginBottom: "10px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={data?.length || 0}
          showSizeChanger
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}

          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          style={{ marginBottom: "10px" }}
        />
      </div>
      <TableHeaderStyles>

      <Table
        columns={columns}
        dataSource={data?.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
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

export default MailBook;
