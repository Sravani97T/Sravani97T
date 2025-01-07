import React from "react";
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
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    margin: "0 auto",
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
            style={cardStyle("#D1E4FF")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#D1E4FF"))}
          >
            <div>
              <div
                style={{ ...iconContainerStyle, background: "#D1E4FF" }}
              >
                <DollarCircleOutlined style={{ fontSize: "22px", color: "#4A90E2" }} />
              </div>
              <div style={textStyle}>Advances</div>
              <div style={valueStyle}>₹ 20,000</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#E4F5D6")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#E4F5D6"))}
          >
            <div>
              <div
                style={{ ...iconContainerStyle, background: "#E4F5D6" }}
              >
                <ShoppingCartOutlined style={{ fontSize: "22px", color: "#7ED321" }} />
              </div>
              <div style={textStyle}>Orders</div>
              <div style={valueStyle}>₹ 15,000</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#FFF4D1")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#FFF4D1"))}
          >
            <div>
              <div
                style={{ ...iconContainerStyle, background: "#FFF4D1" }}
              >
                <GoldOutlined style={{ fontSize: "22px", color: "#F8B800" }} />
              </div>
              <div style={textStyle}>URD Gold</div>
              <div style={valueStyle}>₹ 35,000</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#F1E6FF")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#F1E6FF"))}
          >
            <div>
              <div
                style={{ ...iconContainerStyle, background: "#F1E6FF" }}
              >
                <CrownOutlined style={{ fontSize: "22px", color: "#6A5BFE" }} />
              </div>
              <div style={textStyle}>URD Silver</div>
              <div style={valueStyle}>₹ 10,000</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#FFEBE6")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#FFEBE6"))}
          >
            <div>
              <div
                style={{ ...iconContainerStyle, background: "#FFEBE6" }}
              >
                <FileTextOutlined style={{ fontSize: "22px", color: "#F5222D" }} />
              </div>
              <div style={textStyle}>Receipts</div>
              <div style={valueStyle}>₹ 25,000</div>
            </div>
          </div>
        </Col>

        <Col span={8}>
          <div
            style={cardStyle("#E1F5FF")}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle("#E1F5FF"))}
          >
            <div>
              <div
                style={{ ...iconContainerStyle, background: "#E1F5FF" }}
              >
                <GiftFilled style={{ fontSize: "22px", color: "#1890FF" }} />
              </div>
              <div style={textStyle}>Scheme</div>
              <div style={valueStyle}>₹ 5,000</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdvancedDetailsCard;
