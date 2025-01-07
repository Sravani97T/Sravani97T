import React from "react";
import { Card } from "antd";

const TodaysRates = () => {
  return (
    <Card style={{boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",    
          background: "#f0f2f5", // Background gradient
    }}>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
      <Card
        style={{
          backgroundColor: "#12246a",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          width: "350px",
          transform: "rotate(-5deg)",
          position: "relative",
        }}
        bordered={false}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            opacity: 0.8,
          }}
        >
          Today’s Rates
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "5px",
                // color: "#ffd700", // Gold color
                color:"#c0c0c0"
              }}
            >
              ₹5,432 <span style={{ fontSize: "18px" }}>↓</span>
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>
              Gold - 18k
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "5px",
                color: "#c0c0c0", // Silver color
              }}
            >
              ₹6500 <span style={{ fontSize: "18px" }}>↑</span>
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>
              Silver - 18k
            </div>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        ></div>
      </Card>
    </div>
    </Card>
  );
};

export default TodaysRates;
