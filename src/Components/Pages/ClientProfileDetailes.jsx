import React from "react";
import { CalendarOutlined, PercentageOutlined, FileTextOutlined, FileDoneOutlined } from "@ant-design/icons";

const FirstColumn = () => {
  return (
    <div
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        marginBottom: "7px",
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
            Sravani Jewelries
          </h3>
          <div style={{ fontSize: "14px", color: "#7d8a99", margin: "0" }}>
            Hyderabad
          </div>
          <div style={{ fontSize: "14px", color: "#7d8a99", margin: "0" }}>
            Kukatpally
          </div>
        </div>
        {/* Icons with square border and circular top */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "69px",
              border: "2px solid #aad5aa",
              borderRadius: "10px",
              backgroundColor: "#eaf8ea",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#76c776",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "16px",
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
              width: "80px",
              height: "69px",
              border: "2px solid #ffd59b",
              borderRadius: "10px",
              backgroundColor: "#fff9e6",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#ffb84d",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "16px",
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
              border: "2px solid #a4d4f4",
              borderRadius: "10px",
              backgroundColor: "#e3f5fc",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#64b7f7",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "16px",
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
              border: "2px solid #f6a5a5",
              borderRadius: "10px",
              backgroundColor: "#fdecec",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#f47174",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontSize: "16px",
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
