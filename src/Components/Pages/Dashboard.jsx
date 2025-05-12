import React, { useState, useEffect, forwardRef } from "react";
import { Row, Col, Table, Input, Select ,Tooltip} from "antd";
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
import { CREATE_jwel } from "../../Config/Config";
import { ReloadOutlined, } from "@ant-design/icons";

const { Option } = Select;

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    className="custom-date-input"
    onClick={onClick}
    ref={ref}
    style={{
      display: "flex",
      alignItems: "center",
      border: "1px solid #d9d9d9",
      borderRadius: 4,
      padding: "2px 8px",
      cursor: "pointer",
      width: "100%",
    }}
  >
    <input
      value={value}
      placeholder={placeholder}
      readOnly
      style={{
        border: "none",
        outline: "none",
        width: "100%",
        fontSize: "14px",
        background: "transparent",
      }}
    />
    <FaCalendarAlt className="calendar-icon" style={{ marginLeft: 4, fontSize: 14 }} />
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
  const [allJewelTypes, setAllJewelTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fromDate = moment(filters.fromDate).format('YYYY-MM-DD');
        const toDate = moment(filters.toDate).format('YYYY-MM-DD');
  
        const response = await axios.get(`${CREATE_jwel}/api/Erp/GetBillMast`, {
          params: {
            fromDate,
            toDate,
          },
        });
  
        if (response.data) {
          let rawData = response.data.map(item => ({
            ...item,
            BillDate: moment(item.BillDate).format('YYYY-MM-DD'),
          }));
  
          // Save all jewel types for dropdown
          const jewelTypes = [...new Set(rawData.map(item => item.JewelType))];
          setAllJewelTypes(jewelTypes);
  
          // Apply filtering based on current filters
          const filteredData = rawData.filter(item => {
            const billDate = moment(item.BillDate);
            const isInRange = billDate.isBetween(fromDate, toDate, null, '[]');
            const matchesBillNo = filters.billNo === "" || (item.BillNo && item.BillNo.toString().toLowerCase().includes(filters.billNo.toLowerCase()));
            const matchesJewelType = filters.jewelType === "" || item.JewelType === filters.jewelType;
          
            return isInRange && matchesBillNo && matchesJewelType;
          });
  
          setTableData(filteredData);
        } else {
          setTableData([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData([]);
      }
    };
  
    fetchData();
  }, [filters]);
  
  
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
      // className: 'blue-background-column', 
      render: (text, record, index) => index + 1,
      width: 50,
      align:"center",

    className: 'first-col-green',
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
        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{record.BillNo}</span>
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
      title: "GWT | NWT"      ,
      key: "Weight",
      align: "right",
      render: (text, record) => (
        <>
          <div
            style={{
              marginBottom: "6px",
              backgroundColor: "#e6f7ff",
              padding: "4px 8px",
              borderRadius: "6px",
              display: "inline-block",
              fontWeight: "bold",
              color: "#0050b3",
            }}
          >
            Gwt: {record.TotGwt.toFixed(3)}
          </div>
          <br />
          <div
            style={{
              backgroundColor: "#f6ffed",
              padding: "4px 8px",
              borderRadius: "6px",
              display: "inline-block",
              fontWeight: "bold",
              color: "#389e0d",
            }}
          >
            Nwt: {record.TotNwt.toFixed(3)}
          </div>
        </>
      ),
    },
    
    {
      title: "Gross Amt",
      dataIndex: "BillAmt",
      key: "BillAmt",
      align: 'right',
      render: (value) => <b>{value.toFixed(2)}</b>,
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
      // render: (value) => value.toFixed(2),
      render: (value) => <b>{value.toFixed(2)}</b>,
  
    },
  ];

  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={[16, 16]}>
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

          <Row gutter={[8, 16]} style={{ marginTop: "25px" }}>
          <Col xs={24} sm={12} md={6} lg={6}>
            <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: 4, fontSize: "16px", whiteSpace: "nowrap" }}>
          From Date 
          </label>
          <div className="custom-date-input-container">

          <DatePicker
            selected={filters.fromDate}
            onChange={(date) => handleFilterChange("fromDate", date)}
            customInput={<CustomInput placeholder="From Date" />}
            dateFormat="dd MMM yyyy"
          />
          </div>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <div style={{ display: "flex", alignItems: "center" }}>
          <label style={{ marginRight: 4, fontSize: "16px", whiteSpace: "nowrap" }}>
          To Date
          </label>
          <div className="custom-date-input-container">

          <DatePicker
            selected={filters.toDate}
            onChange={(date) => handleFilterChange("toDate", date)}
            customInput={<CustomInput placeholder="To Date" />}
            dateFormat="dd MMM yyyy"
          />
          </div>
          <button
            onClick={() => handleFilterChange("fromDate", new Date()) || handleFilterChange("toDate", new Date())}
            style={{
              
              // backgroundColor: "#1890ff",
              color: "blue",
              border: "none",
              cursor: "pointer",
              borderRadius:"50%"
            }}
          >
                        <Tooltip title="reset">  <ReloadOutlined /> </Tooltip>

          </button>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <label style={{ marginRight: 4, fontSize: "16px", whiteSpace: "nowrap" }}>
      Bill No
    </label>
    <Input
      placeholder="Search Bill No"
      value={filters.billNo}
      onChange={(e) => handleFilterChange("billNo", e.target.value)}
      style={{ width: "100%" }}
    />
  </div>
</Col>

<Col xs={24} sm={12} md={6} lg={6}>
  <div style={{ display: "flex", alignItems: "center" }}>
    <label style={{ marginRight: 4, fontSize: "16px", whiteSpace: "nowrap" }}>
      Jewel Type
    </label>
    <Select
      placeholder="Select Jewel Type"
      onChange={(value) => handleFilterChange("jewelType", value || "")}
      style={{ width: "100%" }}
      allowClear
      value={filters.jewelType || undefined}
    >
      {allJewelTypes.map((type) => (
        <Option key={type} value={type}>
          {type}
        </Option>
      ))}
    </Select>
  </div>
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
              <Table
                columns={columns}
                dataSource={tableData}
                pagination={false}
                // rowClassName="table-row"
                size="small"
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
              />
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

  .ant-table-thead > tr > th {
    background-color: #52BD91 !important; /* Light green header */
    color: #000;
    font-weight: bold;
    text-align: center;
  }

  .ant-table-tbody > tr > td:first-child {
    transition: background-color 0.3s;
  }

  .ant-table-tbody > tr:hover > td:first-child {
    background-color: #52BD91 !important; /* Green on hover only for 1st column */
    color: #000;
    font-weight: bold;
  }
/* Prevent hover background color when table is empty */
.ant-table-empty .ant-table-tbody > tr:hover > td {
  background: unset !important;
}

  .ant-table-tbody > tr:hover > td {
    background: unset !important; /* Prevent full-row hover background */
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
