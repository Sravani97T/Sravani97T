import React from "react";
import { FaMoneyBillWave } from "react-icons/fa"; // Icon for Cash
import { AiOutlineCreditCard } from "react-icons/ai"; // Icon for Card
import { MdOutlineQrCodeScanner } from "react-icons/md"; // Icon for UPI
import { HiOutlineGlobeAlt } from "react-icons/hi"; // Icon for Online

const PaymentOverview = () => {
  const data = [
    {
      title: "Cash",
      amount: "₹ 30,038.00",
      icon: <FaMoneyBillWave color="#4CAF50" size={20} />, // Green for Cash
    },
    {
      title: "Card",
      amount: "₹ 94,139.00",
      icon: <AiOutlineCreditCard color="#FF9800" size={20} />, // Orange for Card
    },
    {
      title: "UPI",
      amount: "₹ 54,175.00",
      icon: <MdOutlineQrCodeScanner color="#3F51B5" size={20} />, // Blue for UPI
    },
    {
      title: "Online",
      amount: "₹ 1,67,024.00",
      icon: <HiOutlineGlobeAlt color="#2196F3" size={20} />, // Bright blue for Online
    },
  ];

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px", // Slightly larger gap for better readability
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
    
  };

  const iconContainerStyle = {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    backgroundColor: "#f9f9f9", // Very light background color
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "15px", // Space between icon and text
  };

  const textContainerStyle = {
    display: "flex",
    flexDirection: "column", // Align text vertically
    alignItems: "flex-start", // Align text to the start
  };

  const titleStyle = {
    fontSize: "14px",
    color: "#555",
    marginBottom: "5px", // Space between title and amount
  };

  const amountStyle = {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  };

  const handleHoverEffect = (e, isHovering) => {
    if (isHovering) {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
    } else {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" ,marginTop:"6px"}}>
      {data.map((item, index) => (
        <div
          key={index}
          style={cardStyle}
          onMouseEnter={(e) => handleHoverEffect(e, true)}
          onMouseLeave={(e) => handleHoverEffect(e, false)}
        >
          {/* Icon with light circle background */}
          <div style={iconContainerStyle}>{item.icon}</div>

          {/* Text */}
          <div style={textContainerStyle}>
            <div style={titleStyle}>{item.title}</div>
            <div style={amountStyle}>{item.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentOverview;
