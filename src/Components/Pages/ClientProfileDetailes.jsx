import React from "react";
import { Card } from "antd";
import { CalendarOutlined, PercentageOutlined, FileTextOutlined, FileDoneOutlined } from "@ant-design/icons";

const FirstColumn = () => {
  return (
    <div
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        backgroundColor: "#ffffff",
        marginBottom: "20px",
      }}
    >
      <div>
        {/* Address */}
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#3a86ff",
              margin: "0",
            }}
          >
            Sravani Jewelries
          </h3>
          <div style={{ fontSize: "14px", color: "#6c757d", margin: "0" }}>
            Hyderabad
          </div>
          <div style={{ fontSize: "14px", color: "#6c757d", margin: "0" }}>
            Kukatpally
          </div>
        </div>
        {/* Icons with square border and circular top */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
          <div
            style={{
              position: "relative",
              width: "120px",
              height: "80px",
              border: "2px solid #28a745",
              borderRadius: "10px",
              backgroundColor: "#d4edda",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#28a745",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "20px",
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
              2024
            </div>
          </div>
          <div
            style={{
              position: "relative",
              width: "120px",
              height: "80px",
              border: "2px solid #ffc107",
              borderRadius: "10px",
              backgroundColor: "#fff3cd",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#ffc107",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "20px",
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
              width: "120px",
              height: "80px",
              border: "2px solid #007bff",
              borderRadius: "10px",
              backgroundColor: "#cce5ff",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#007bff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "20px",
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
              width: "120px",
              height: "80px",
              border: "2px solid #dc3545",
              borderRadius: "10px",
              backgroundColor: "#f8d7da",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#dc3545",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "20px",
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
              50
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstColumn;
