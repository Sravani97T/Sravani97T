import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  GoldOutlined,
  CrownOutlined,
  FileTextOutlined,
  GiftFilled,
} from "@ant-design/icons";

const AdvancedDetailsCard = () => {
  const [advanceWorth, setAdvanceWorth] = useState(0);
  const [orderAdvance, setOrderAdvance] = useState(0);
  const [receiptWorth, setReceiptWorth] = useState(0);
  const [urdGold, setUrdGold] = useState(0);
  const [urdSilver, setUrdSilver] = useState(0);
  const [schemeAmount, setSchemeAmount] = useState(0);

  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-US");
    fetch(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetCustomerAdvance?date=${encodeURIComponent(currentDate)}&filter=NO`, {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setAdvanceWorth(data[0].WORTH))
      .catch((error) => console.error("Error fetching advance data:", error));
  }, []);

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-US");
    fetch(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetOrderAdvance?date=${encodeURIComponent(currentDate)}&filter=NO`, {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setOrderAdvance(data[0].WORTH))
      .catch((error) => console.error("Error fetching order advance data:", error));
  }, []);

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-US");
    fetch(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetReceipt?date=${encodeURIComponent(currentDate)}&filter=NO`, {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setReceiptWorth(data[0].PAIDAMT))
      .catch((error) => console.error("Error fetching receipt data:", error));
  }, []);

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-US");
    fetch(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetURDPurchaseGold?date=${encodeURIComponent(currentDate)}&filter=OLD%20GOLD`, {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setUrdGold(data[0].GWT))
      .catch((error) => console.error("Error fetching URD Gold data:", error));
  }, []);

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-US");
    fetch(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetURDPurchaseSilver?date=${encodeURIComponent(currentDate)}&filter=OLD%20SILVER`, {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setUrdSilver(data[0].GWT))
      .catch((error) => console.error("Error fetching URD Silver data:", error));
  }, []);

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-US");
    fetch(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetScheme?date=${encodeURIComponent(currentDate)}&filter=GOLD`, {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setSchemeAmount(data[0].RECAMOUNT || 0))
      .catch((error) => console.error("Error fetching scheme data:", error));
  }, []);

  const cardStyle = (backgroundColor) => ({
    backgroundColor: backgroundColor,
    textAlign: "center",
    borderRadius: "12px",
    height: "105px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s, box-shadow 0.3s",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "5px 5px 6px 5px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    
  });

  const hoverStyle = {
    transform: "scale(1.05)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  };

  const iconContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "5px",
    width: "30px",
    height: "30px",
    margin: "0 auto",
    background: "#FFFFFF",
    marginBottom:"10px"
  };

  const textStyle = {
    fontSize: "12px",
    fontWeight: "500",
    color: "#555",
  };

  const valueStyle = {
    fontSize: "16px",
    marginTop: "5px",
    fontWeight: "600",
    color: "#333",
  };

  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "750px",
        margin: "auto",
      }}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <div
            style={cardStyle("#EAF2F8")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#EAF2F8"))}
          >
            <div>
              <div
                style={iconContainerStyle}
              >
                <DollarCircleOutlined style={{ fontSize: "18px", color: "#12246A" }} />
              </div>
              <div style={textStyle}>Advances</div>
              <div style={valueStyle}>₹ {advanceWorth ? advanceWorth.toFixed(3) : "0.000"}</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#F4ECF7")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#F4ECF7"))}
          >
            <div>
              <div
                style={iconContainerStyle}
              >
                <ShoppingCartOutlined style={{ fontSize: "18px", color: "#12246A" }} />
              </div>
              <div style={textStyle}>Orders</div>
              <div style={valueStyle}>₹ {orderAdvance ? orderAdvance.toFixed(3) : "0.000"}</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#EAFAF1")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#EAFAF1"))}
          >
            <div>
              <div
                style={iconContainerStyle}
              >
                <GoldOutlined style={{ fontSize: "18px", color: "#12246A" }} />
              </div>
              <div style={textStyle}>URD Gold</div>
              <div style={valueStyle}>{urdGold ? urdGold.toFixed(3) : "0.000"} g</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#FDEDEC")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#FDEDEC"))}
          >
            <div>
              <div
                style={iconContainerStyle}
              >
                <CrownOutlined style={{ fontSize: "18px", color: "#12246A" }} />
              </div>
              <div style={textStyle}>URD Silver</div>
              <div style={valueStyle}>{urdSilver ? urdSilver.toFixed(3) : "0.000"} g</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#F2F4F4")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#F2F4F4"))}
          >
            <div>
              <div
                style={iconContainerStyle}
              >
                <FileTextOutlined style={{ fontSize: "18px", color: "#12246A" }} />
              </div>
              <div style={textStyle}>Receipts</div>
              <div style={valueStyle}>₹ {receiptWorth ? receiptWorth.toFixed(3) : "0.000"}</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#FDF2E9")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#FDF2E9"))}
          >
            <div>
              <div
                style={iconContainerStyle}
              >
                <GiftFilled style={{ fontSize: "18px", color: "#12246A" }} />
              </div>
              <div style={textStyle}>Scheme</div>
              <div style={valueStyle}>₹ {schemeAmount ? schemeAmount.toFixed(3) : "0.000"}</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedDetailsCard;
