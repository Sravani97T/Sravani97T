import React, { useState, useEffect, forwardRef } from "react";
import { Row, Col, Table, Input, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import FirstColumn from "../Pages/ClientProfileDetailes"; // assuming FirstColumn is a custom component
import BirthdayAnniversaryCard from "../Pages/BirthdaySection"; // import the BirthdayAnniversaryCard component
import LatestDues from "../Pages/LatestDues";
import TodaysRates from "./TodaysRates";
import TodaysSalesBarGraph from "./TodaysSalesBarGraph";
import AdvanceDetails from "./AdvanceDetailes";
import PaymentOverview from "./PaymentOverview";
import TableHeaderStyles from "./TableHeaderStyles"; // Import the TableHeaderStyles component

const { Option } = Select;

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="custom-date-input" onClick={onClick} ref={ref}>
    <input value={value} placeholder={placeholder} readOnly />
    <FaCalendarAlt className="calendar-icon" />
  </div>
));

const Dashboard = () => {
  const [filters, setFilters] = useState({
    fromDate: new Date(),
    toDate: new Date(),
    billNo: "",
    jewelType: ""
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fromDate = moment(filters.fromDate).format('YYYY-MM-DD');
        const toDate = moment(filters.toDate).format('YYYY-MM-DD');
        
        // Log filters for debugging
        console.log("Fetching data with filters:", { fromDate, toDate, ...filters });
  
        const response = await axios.get(`http://www.jewelerp.timeserasoftware.in/api/Erp/GetBillMast`, {
          params: {
            fromDate,
            toDate,
            billNo: filters.billNo || "", // Ensure empty strings are sent instead of undefined
            jewelType: filters.jewelType || "",
          },
        });
  
        // Ensure response is valid
        if (response.data) {
          const data = response.data
            .map(item => ({
              ...item,
              BillDate: moment(item.BillDate).format('YYYY-MM-DD'),
            }))
            .filter(item => {
              const billDate = moment(item.BillDate);
              return billDate.isBetween(fromDate, toDate, null, '[]');
            });
          setTableData(data);
        } else {
          console.error("No data returned from API");
          setTableData([]); // Reset table data if no data
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData([]); // Reset table data on error
      }
    };
  
    fetchData(); // Call the function immediately
  
  }, [filters]); // Fetch data when filters change

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  const columns = [
    {
      title: "S.No",
      key: "sno",
      className: 'blue-background-column', 
      render: (text, record, index) => index + 1,
      width: 50,
    },
    {
      title: "Inv Date",
      dataIndex: "BillDate",
      key: "BillDate",
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: "Inv No",
      dataIndex: "BillNo",
      key: "BillNo",
      align: 'center',
      render: (text, record, index) => (
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{index + 1}</span>
      ),
    },
    
    {
      title: "Jewel Type",
      dataIndex: "JewelType",
      key: "JewelType",
      width:100,
    },
    {
      title: "Customer Name",
      dataIndex: "CustName",
      key: "CustName",
    },
    {
      title: "Pcs",
      dataIndex: "TotPieces",
      key: "TotPieces",
      align: 'right',
    },
    {
      title: "Weight",
      key: "Weight",
      align: 'right',
      render: (text, record) => (
        <>
          <div>Gwt: {record.TotGwt.toFixed(3)}</div>
          <div>Nwt: {record.TotNwt.toFixed(3)}</div>
        </>
      ),
    },
    {
      title: "Gross Amt",
      dataIndex: "BillAmt",
      key: "BillAmt",
      align: 'right',
      render: (value) => value.toFixed(2),
    },
    {
      title: "Tax",
      key: "Tax",
      align: 'right',
      render: (text, record) => {
        const totalTax = (record.CGST + record.SGST + record.IGST).toFixed(2);
        return (
          <>
            <div>{totalTax}</div>
          </>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "NetAmt",
      key: "NetAmt",
      align: 'right',
      render: (value) => value.toFixed(2),
    },
  ];

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
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
            <Col xs={24} md={8} lg={8}>
              <LatestDues />
            </Col>
            <Col xs={24} md={8} lg={8}>
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

      {/* Filter Row */}
      <Row gutter={[16, 16]} style={{ marginTop: "15px" }}>
  <Col xs={24} sm={12} md={6} lg={6}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ marginRight: 8, fontSize: "16px", whiteSpace: "nowrap" }}>
        Start Date:
      </label>
      <DatePicker
        selected={filters.fromDate}
        onChange={(date) => handleFilterChange("fromDate", date)}
        customInput={<CustomInput placeholder="From Date" />}
        dateFormat="dd/MM/yyyy"
      />
    </div>
  </Col>
  <Col xs={24} sm={12} md={6} lg={6}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <label style={{ marginRight: 8, fontSize: "16px", whiteSpace: "nowrap" }}>
        End Date:
      </label>
      <DatePicker
        selected={filters.toDate}
        onChange={(date) => handleFilterChange("toDate", date)}
        customInput={<CustomInput placeholder="To Date" />}
        dateFormat="dd/MM/yyyy"
      />
    </div>
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
    </Select>
  </Col>
</Row>


      {/* Ant Design Table */}
      <Row gutter={[16, 16]} style={{ marginTop: "5px" }}>
        <Col span={24}>
          <div
            className="table-responsive scroll-horizontal"
            style={{
              maxHeight: "calc(99vh - 250px)",
              overflowY: "auto",
              overflowX: "auto",
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
              borderRadius: '8px'
            }}
          >
            <TableHeaderStyles>
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                size="small"
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
              />
            </TableHeaderStyles>
          </div>
        </Col>
      </Row>

      <style jsx>{`
        .table-row-light {
          background-color: #fafafa;
        }
        .table-row-dark {
          background-color: rgb(223, 230, 246);
        }
        .ant-table-tbody > tr:hover > td {
          background: unset !important;
        }
        .custom-date-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border: 1px solid #d9d9d9;
          padding: 4px 11px;
          border-radius: 4px;
          cursor: pointer;
        }
        .calendar-icon {
          margin-left: 8px;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
