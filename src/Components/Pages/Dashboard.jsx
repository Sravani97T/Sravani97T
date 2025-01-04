import React from "react";
import { Row, Col, Card } from "antd";
import FirstColumn from "../Pages/ClientProfileDetailes";

const Dashboard = () => {
  return (
    <div style={{ backgroundColor: "#f0f2f5" }}>
      <Row gutter={16}>
        {/* First Column */}
        <Col span={9}>
          <FirstColumn />
        </Col>

        {/* Second Column with three new cards */}
        <Col span={15}>
          <Row gutter={[16, 16]}>
            {[1, 2, 3].map((index) => (
              <Col span={8} key={index}>
                <div
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "20px",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <h3 style={{ color: "#3a86ff", fontSize: "18px" }}>Card {index}</h3>
                  <p style={{ color: "#6c757d", fontSize: "14px" }}>
                    Content for card {index}.
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
