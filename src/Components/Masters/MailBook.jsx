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
      const response = await axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterDealerMasterList");

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
      .get(`http://www.jewelerp.timeserasoftware.in/api/Master/MasterDealerMasterSearch?CustType=${category}&DealerName=${dealerName}`, {
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
      card: values.card,
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
        "http://www.jewelerp.timeserasoftware.in/api/Master/MasterDealerMasterInsert",
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
      const url = `http://www.jewelerp.timeserasoftware.in/api/Master/MasterDealerMasterDelete?CustType=${encodeURIComponent(record.CustType)}&DealerName=${encodeURIComponent(record.Dealername)}`;

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
      const deleteUrl = `http://www.jewelerp.timeserasoftware.in/api/Master/MasterDealerMasterDelete?CustType=${encodeURIComponent(category)}&DealerName=${encodeURIComponent(dealerName)}`;
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

        const insertUrl = "http://www.jewelerp.timeserasoftware.in/api/Master/MasterDealerMasterInsert";
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
    <div style={{ backgroundColor: "#f4f6f9", }}>
      <Row justify="start" style={{ marginBottom: "5px" }}>
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
          boxShadow: "9px 6px 8px 5px rgba(209, 180, 180, 0.1)",
          // backgroundColor:"#8abbb9"
        }}
      >
        <Form form={form} layout="horizontal" onFinish={editingKey ? handleSave : handleAdd}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>Category</span>
                <Form.Item
                  name="category"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Category is required" }]}
                >
                  <Select
                    placeholder="Select Category"
                    showSearch
                    ref={refs.category}
                    onChange={(value) => {
                      const uppercaseValue = value.toUpperCase();
                      form.setFieldsValue({ category: uppercaseValue });
                      const dealername = form.getFieldValue("dealername");
                      handleBrandNameCheck(uppercaseValue, dealername);
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
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>Name</span>
                <Form.Item
                  name="dealername"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Name is required" }]}
                >
                  <Input
                    placeholder="Enter Name"
                    ref={refs.nameRef}
                    onChange={(e) => {
                      const uppercaseValue = e.target.value.toUpperCase();
                      form.setFieldsValue({ dealername: uppercaseValue });
                      const category = form.getFieldValue("category");
                      handleBrandNameCheck(category, e.target.value);
                    }}
                    onPressEnter={(e) => handleEnterPress(e, refs.mobileNo1Ref)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>Mobile No. 1</span>
                <Form.Item
                  name="mobilenum"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Mobile Number 1 is required" }, { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" }]}
                >
                  <Input
                    placeholder="Enter Mobile No. 1"
                    ref={refs.mobileNo1Ref}
                    type="phone"
                    maxLength={10}
                    onPressEnter={(e) => handleEnterPress(e, refs.eMailRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>Email</span>
                <Form.Item
                  name="eMail"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Enter a valid email" }]}
                >
                  <Input
                    placeholder="Enter Email"
                    ref={refs.eMailRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.mobileNo2Ref)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>Mobile No. 2</span>
                <Form.Item
                  name="mobileNum2"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit mobile number" }]}
                >
                  <Input
                    placeholder="Enter Mobile No. 2"
                    ref={refs.mobileNo2Ref}
                    type="phone"
                    maxLength={10}
                    onPressEnter={(e) => handleEnterPress(e, refs.cityRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>City</span>
                <Form.Item
                  name="cityName"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "City is required" }]}
                >
                  <Select
                    showSearch
                    placeholder="Select City"
                    ref={refs.cityRef}
                    onKeyDown={(e) => e.key === "Enter" && refs.addressRef.current?.focus()}
                  >
                    <Option value="NELLORE">NELLORE</Option>
                    <Option value="YANAM">YANAM</Option>
                  </Select>
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>Address</span>
                <Form.Item
                  name="address1"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Address is required" }]}
                >
                  <Input.TextArea
                    rows={1}
                    placeholder="Enter Address"
                    ref={refs.addressRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.stateRef)}
                  />
                </Form.Item>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", gap: "24px" }}>
                {/* State Field */}
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>State</span>
                  <Form.Item
                    name="state"
                    style={{ marginBottom: 0, flex: 1 }}
                    rules={[{ required: true, message: "State is required" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select State"
                      ref={refs.stateRef}
                      onKeyDown={(e) => e.key === "Enter" && refs.stateCodeRef.current?.focus()}
                    >
                      <Option value="AP">AP</Option>
                      <Option value="TS">TS</Option>
                    </Select>
                  </Form.Item>
                </div>

                {/* State Code Field */}
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <span style={{ width: "120px", marginRight: "8px", paddingLeft: "10px" }}>State Code</span>
                  <Form.Item
                    name="statecode"
                    style={{ marginBottom: 0, flex: 1 }}
                    rules={[{ required: true, message: "State Code is required" }]}
                  >
                    <Input
                      placeholder="Enter State Code"
                      ref={refs.stateCodeRef}
                      style={{ width: "120px" }}
                      onPressEnter={(e) => handleEnterPress(e, refs.pinCodeRef)}
                    />
                  </Form.Item>
                </div>
              </div>

            </Col>

            <Col span={1}>
              <div style={{ borderLeft: "1px solid #d9d9d9", height: "100%" }}></div>
            </Col>

            <Col span={11} >


              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>Pin Code</span>
                <Form.Item
                  name="pinCode"
                  style={{ marginBottom: 0, width: '200px' }}
                  rules={[{ required: true, message: "Pin Code is required" }]}
                >
                  <Input
                    placeholder="Enter Pin Code"
                    ref={refs.pinCodeRef}
                    style={{ width: "120px" }}
                    onPressEnter={(e) => handleEnterPress(e, refs.GSTINRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>GSTIN</span>
                <Form.Item
                  name="tinNo"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "GSTIN is required" }]}
                >
                  <Input
                    placeholder="Enter GSTIN"
                    ref={refs.GSTINRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.PANRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>PAN</span>
                <Form.Item
                  name="card"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "PAN is required" }]}
                >
                  <Input
                    placeholder="Enter PAN"
                    ref={refs.PANRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.proofTypeRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>Proof Type</span>
                <Form.Item
                  name="proofType"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Proof Type is required" }]}
                >
                  <Select
                    showSearch
                    ref={refs.proofTypeRef}
                    onKeyDown={(e) => e.key === "Enter" && refs.proofNumberRef.current?.focus()}
                  >
                    <Option value="Aadhaar">Aadhaar</Option>
                    <Option value="Voter ID">Voter ID</Option>
                  </Select>
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>Proof Number</span>
                <Form.Item
                  name="cardno"
                  style={{ marginBottom: 0, width: '300px' }}
                  rules={[{ required: true, message: "Proof Number is required" }]}
                >
                  <Input
                    placeholder="Enter Proof Number"
                    ref={refs.proofNumberRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.dobRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>Date of Birth</span>
                <Form.Item
                  name="dob"
                  style={{ marginBottom: 0, width: '200px' }}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    ref={refs.dobRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.anniversaryRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>Anniversary</span>
                <Form.Item
                  name="anniversary"
                  style={{ marginBottom: 0, width: '200px' }}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    ref={refs.anniversaryRef}
                    onPressEnter={(e) => handleEnterPress(e, refs.locationTypeRef)}
                  />
                </Form.Item>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                <span style={{ width: "120px", marginRight: "8px" }}>Location Type</span>
                <Form.Item
                  name="station"
                  style={{ marginBottom: 0, width: '200px' }}
                  rules={[{ required: true, message: "Location Type is required" }]}
                >
                  <Radio.Group
                    ref={refs.locationTypeRef}
                    onKeyDown={(e) => e.key === "Enter" && handleEnterPress(e, null)}
                  >
                    <Radio value="Out Station">Out Station</Radio>
                    <Radio value="Local">Local</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </Col>
          </Row>

          <div style={{ textAlign: "right", marginTop: "16px" }}>
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

      <div style={{ marginLeft: "5px", float: "right", marginBottom: "10px" }}>
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
