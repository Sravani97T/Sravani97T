import React, { useEffect, useState } from "react";
import {
  CalendarOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  PercentageOutlined,
} from "@ant-design/icons";
import { CREATE_jwel } from "../../Config/Config";

const FirstColumn = () => {
  const [firmData, setFirmData] = useState(null);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";

  useEffect(() => {
    fetch(`${CREATE_jwel}/api/Erp/GetFirmConfihure`, {
      headers: { tenantName: tenantNameHeader },
    })
      .then((response) => response.json())
      .then((data) => setFirmData(data[0]))
      .catch((error) => console.error("Error fetching firm data:", error));
  }, []);

  useEffect(() => {
    fetch(`${CREATE_jwel}/api/DashBoard/GetTotalBills?fYear=2425&saleCode=1`, {
      headers: { tenantName: tenantNameHeader },
    })
      .then((response) => response.json())
      .then((data) => setTotalInvoice(data[0]?.BillCount || 0))
      .catch((error) => console.error("Error fetching total invoice data:", error));
  }, []);

  const cards = [
    {
      icon: <CalendarOutlined />, 
      title: "Final Year", 
      value: firmData?.FYEAR || "N/A", 
      borderColor: "#aad5aa",
    },
    {
      icon: <PercentageOutlined />, 
      title: "GST", 
      value: "18%", 
      borderColor: "#ffd59b",
    },
    {
      icon: <FileTextOutlined />, 
      title: "Invoice", 
      value: "₹1,50,000", 
      borderColor: "#a4d4f4",
    },
    {
      icon: <FileDoneOutlined />, 
      title: "Total Invoice", 
      value: totalInvoice, 
      borderColor: "#f6a5a5",
    },
  ];

  return (
    <div
      style={{
        borderRadius: "6px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        border: "1px solid #ddd",
      }}
    >
      <div style={{ textAlign: "left", marginBottom: "20px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#5a9",
            margin: "0",
          }}
        >
          {firmData?.FIRMNAME || "Firm Name"}
        </h3>
        <div style={{ fontSize: "14px", color: "#7d8a99", margin: "0" }}>
          CITY : {firmData?.CITY || "City"}
        </div>
        <div style={{ fontSize: "16px", color: "#12246A", margin: "0" }}>
          {firmData?.TINNO || "TIN No"}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
          gap: "8px",
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              padding: "12px 5px 12px",
              borderRadius: "6px",
              backgroundColor: "#fff",
              textAlign: "center",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              border: `1px solid ${card.borderColor}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-17px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#f8f9f9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: card.borderColor,
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {card.icon}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#333",
                marginTop: "16px", // Adjust margin to center content
              }}
            >
              {card.title}
            </div>
            <div style={{ fontSize: "12px", color: "#666" }}>{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FirstColumn;
