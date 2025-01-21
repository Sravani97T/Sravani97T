import React, { useEffect, useState } from "react";
import { CalendarOutlined, FileTextOutlined, FileDoneOutlined, PercentageOutlined } from "@ant-design/icons";

const FirstColumn = () => {
  const [firmData, setFirmData] = useState(null);
  const [totalInvoice, setTotalInvoice] = useState(0);
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";

  useEffect(() => {
    fetch("http://www.jewelerp.timeserasoftware.in/api/Erp/GetFirmConfihure", {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setFirmData(data[0]))
      .catch((error) => console.error("Error fetching firm data:", error));
  }, []);

  useEffect(() => {
    fetch("http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetTotalBills?fYear=2425&saleCode=1", {
      headers: { "tenantName": tenantNameHeader }
    })
      .then((response) => response.json())
      .then((data) => setTotalInvoice(data[0]?.BillCount || 0))
      .catch((error) => console.error("Error fetching total invoice data:", error));
  }, []);

  return (
    <div
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "8px",
        backgroundColor: "#f9f9f9",
        marginBottom: "7px",
        border: "1px solid #ddd",
      }}
    >
      <div>
        {/* Address */}
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#5a9",
              margin: "0",
            }}
          >
            {firmData?.FIRMNAME}
          </h3>
          <div style={{ fontSize: "14px", color: "#7d8a99", margin: "0" }}>
            CITY : {firmData?.CITY}
          </div>
          <div style={{ fontSize: "16px", color: "#12246A", margin: "0" }}>
            {firmData?.TINNO}
          </div>
        </div>
        {/* Icons with card style */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "69px",
              borderRadius: "10px",
              backgroundColor: "#fff",
              textAlign: "center",
              marginBottom: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              border: "1px solid #aad5aa",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#F8F9F9",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#aad5aa",
                fontSize: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CalendarOutlined />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                width: "100%",
                fontSize: "12px",
                color: "#333",
              }}
            >
              Final Year
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                width: "100%",
                fontSize: "12px",
                color: "#666",
              }}
            >
              {firmData?.FYEAR}
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "69px",
              border: "2px solid #ffd59b",
              borderRadius: "10px",
              backgroundColor: "#fff",
              textAlign: "center",
              marginBottom: "10px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#ffd59b",
                fontSize: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <PercentageOutlined />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                width: "100%",
                fontSize: "12px",
                color: "#333",
              }}
            >
              GST
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                width: "100%",
                fontSize: "12px",
                color: "#666",
              }}
            >
              18%
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "69px",
              borderRadius: "10px",
              backgroundColor: "#fff",
              textAlign: "center",
              marginBottom: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              border: "1px solid #a4d4f4",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#a4d4f4",
                fontSize: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FileTextOutlined />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                width: "100%",
                fontSize: "12px",
                color: "#333",
              }}
            >
              Invoice
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                width: "100%",
                fontSize: "12px",
                color: "#666",
              }}
            >
              ₹1,50,000
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "69px",
              borderRadius: "10px",
              backgroundColor: "#fff",
              textAlign: "center",
              marginBottom: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              border: "1px solid #f6a5a5",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#f6a5a5",
                fontSize: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FileDoneOutlined />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                width: "100%",
                fontSize: "12px",
                color: "#333",
              }}
            >
              Total Invoice
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                width: "100%",
                fontSize: "12px",
                color: "#666",
              }}
            >
              {totalInvoice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstColumn;
