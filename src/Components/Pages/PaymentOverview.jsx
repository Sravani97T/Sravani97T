import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave } from "react-icons/fa"; // Icon for Cash
import { AiOutlineCreditCard } from "react-icons/ai"; // Icon for Card
import { MdOutlineQrCodeScanner } from "react-icons/md"; // Icon for UPI
import { HiOutlineGlobeAlt } from "react-icons/hi"; // Icon for Online

const PaymentOverview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        
        // Fetch bank transaction summary
        const bankTransResponse = await axios.get(
          `http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetBankTransSummary?date=${formattedDate}`
        );

        // Fetch cash book credit/debit
        const cashBookResponse = await axios.get(
          `http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetCashBookCreditDebit?fromDate=${formattedDate}&toDate=${formattedDate}&saleCode=1`
        );

        const cashAmount = cashBookResponse.data[0]?.AMT || 0;

        const apiData = bankTransResponse.data.map((item) => {
          let icon;
          let color;
          switch (item.MODE) {
            case "CARD":
              icon = <AiOutlineCreditCard />;
              color = "#FF9800";
              break;
            case "CHEQUE":
              icon = <FaMoneyBillWave />;
              color = "#4CAF50";
              break;
            case "UPI":
              icon = <MdOutlineQrCodeScanner />;
              color = "#3F51B5";
              break;
            case "ONLINE":
              icon = <HiOutlineGlobeAlt />;
              color = "#2196F3";
              break;
            case "CASH":
              icon = <FaMoneyBillWave />;
              color = "#FFD700";
              break;
            default:
              icon = <HiOutlineGlobeAlt />;
              color = "#9E9E9E"; // Default gray for unknown modes
          }
          return {
            title: item.MODE,
            amount: `₹ ${item.AMT.toLocaleString()}`,
            icon: React.cloneElement(icon, { color, size: 20 }),
          };
        });

        // Add cash amount to the beginning of the data
        apiData.unshift({
          title: "CASH",
          amount: `₹ ${cashAmount.toLocaleString()}`,
          icon: React.cloneElement(<FaMoneyBillWave />, { color: "#FFD700", size: 20}),
        });

        setData(apiData);
      } catch (error) {
        console.error("Error fetching payment data:", error);
      }
    };

    fetchData();
  }, []);

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "8px",
    padding: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s, box-shadow 0.3s",
  };

  const iconContainerStyle = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#f9f9f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "10px",
  };

  const textContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingLeft: "8px",
    paddingRight: "8px",
  };

  const titleStyle = {
    fontSize: "12px",
    color: "#555",
    marginRight: "auto",
  };

  const amountStyle = {
    fontSize: "12px",
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
    <div style={{  margin: "auto", marginTop: "10px",}}>
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
