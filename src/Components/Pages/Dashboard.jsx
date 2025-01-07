import React, { useState } from "react";
import { Row, Col, Table, DatePicker, Input, Select } from "antd";
import FirstColumn from "../Pages/ClientProfileDetailes"; // assuming FirstColumn is a custom component
import BirthdayAnniversaryCard from "../Pages/BirthdaySection"; // import the BirthdayAnniversaryCard component
import LatestDues from "../Pages/LatestDues";
import TodaysRates from "./TodaysRates";
import TodaysSalesBarGraph from "./TodaysSalesBarGraph";
import AdvanceDetails from "./AdvanceDetailes";
import PaymentOverview from "./PaymentOverview";

const { Option } = Select;

const Dashboard = () => {
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    billNo: "",
    jewelType: "",
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Sample data for the table
  const tableData = [
    {
      key: "1",
      billDate: "2025-01-05",
      jewelType: "Gold",
      billNo: "B001",
      customerName: "John Doe",
      pcs: 3,
      gwt: 150.5,
      nwt: 148.2,
      totalAmount: 50000,
      discount: 5000,
      grossAmt: 45000,
      cgst: 900,
      sgst: 900,
      igst: 0,
      netAmount: 46400,
    },
    {
      key: "2",
      billDate: "2025-01-04",
      jewelType: "Silver",
      billNo: "B002",
      customerName: "Jane Smith",
      pcs: 5,
      gwt: 200.0,
      nwt: 195.0,
      totalAmount: 25000,
      discount: 2000,
      grossAmt: 23000,
      cgst: 460,
      sgst: 460,
      igst: 0,
      netAmount: 23580,
    },
    // Add more rows as necessary
  ];

  // Columns for the table
  const columns = [
    {
      title: "S.No",
      dataIndex: "key",
      key: "key",
      render: (text) => <>{text}</>,
    },
    {
      title: "Bill Date",
      dataIndex: "billDate",
      key: "billDate",
    },
    {
      title: "Jewel Type",
      dataIndex: "jewelType",
      key: "jewelType",
    },
    {
      title: "Bill No",
      dataIndex: "billNo",
      key: "billNo",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Pcs",
      dataIndex: "pcs",
      key: "pcs",
    },
    {
      title: "Gwt",
      dataIndex: "gwt",
      key: "gwt",
    },
    {
      title: "Nwt",
      dataIndex: "nwt",
      key: "nwt",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Gross Amt",
      dataIndex: "grossAmt",
      key: "grossAmt",
    },
    {
      title: "CGST",
      dataIndex: "cgst",
      key: "cgst",
    },
    {
      title: "SGST",
      dataIndex: "sgst",
      key: "sgst",
    },
    {
      title: "IGST",
      dataIndex: "igst",
      key: "igst",
    },
    {
      title: "Net Amount",
      dataIndex: "netAmount",
      key: "netAmount",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f0f2f5",  }}>
      <Row gutter={[16, 16]}>
        {/* First Row */}
        <Col xs={24} lg={9}>
          <FirstColumn />
        </Col>

        <Col xs={24} lg={15}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8} lg={8}>
              <BirthdayAnniversaryCard />
            </Col>
            <Col xs={24} md={8} lg={6}>
              <LatestDues />
            </Col>
            <Col xs={24} md={8} lg={10}>
              <TodaysRates />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Second Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={9}>
          <TodaysSalesBarGraph />
        </Col>
        <Col xs={24} md={12} lg={9}>
          <AdvanceDetails />
        </Col>
        <Col xs={24} md={24} lg={6}>
          <PaymentOverview />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "10px" }}>
        <Col xs={24} sm={12} md={6} lg={3}>
          <DatePicker
            placeholder="From Date"
            onChange={(date) => handleFilterChange("fromDate", date)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={3}>
          <DatePicker
            placeholder="To Date"
            onChange={(date) => handleFilterChange("toDate", date)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Input
            placeholder="Search Bill No"
            onChange={(e) => handleFilterChange("billNo", e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6} lg={6}>
          <Select
            placeholder="Select Jewel Type"
            onChange={(value) => handleFilterChange("jewelType", value)}
            style={{ width: "100%" }}
          >
            <Option value="Gold">Gold</Option>
            <Option value="Silver">Silver</Option>
            {/* Add more options as necessary */}
          </Select>
        </Col>
      </Row>

      {/* Ant Design Table */}
      <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            scroll={{ x: "max-content" }}
            size="small"
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
