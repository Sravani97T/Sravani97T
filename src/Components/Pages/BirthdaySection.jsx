import React, { useState, useEffect } from "react";
import { Card, Popover, Button } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { FaBirthdayCake } from "react-icons/fa";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
const BirthdayAnniversaryCard = () => {
  const [birthdayCount, setBirthdayCount] = useState(0);
  const [anniversaryCount, setAnniversaryCount] = useState(0);
  const [birthdayList, setBirthdayList] = useState([]);
  const [anniversaryList, setAnniversaryList] = useState([]);
  const [openBirthdayPopover, setOpenBirthdayPopover] = useState(false);
  const [openAnniversaryPopover, setOpenAnniversaryPopover] = useState(false);

  useEffect(() => {
    const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";
    const currentDate = new Date().toLocaleDateString("en-US");

    const fetchBirthdayData = axios.get(
      `${CREATE_jwel}/api/DashBoard/GetBirthDayWishBoxDetails?date=${encodeURIComponent(currentDate)}`,
      { headers: { tenantName: tenantNameHeader } }
    );

    const fetchAnniversaryData = axios.get(
      `${CREATE_jwel}/api/DashBoard/GetAnniversaryWishBoxDetails?date=${encodeURIComponent(currentDate)}`,
      { headers: { tenantName: tenantNameHeader } }
    );

    Promise.all([fetchBirthdayData, fetchAnniversaryData])
      .then(([birthdayResponse, anniversaryResponse]) => {
        const birthdayData = birthdayResponse.data;
        const anniversaryData = anniversaryResponse.data;

        const birthdays = birthdayData.filter((item) => item.dob);
        const anniversaries = anniversaryData.filter((item) => item.ANNVERSARY);

        setBirthdayCount(birthdays.length);
        setAnniversaryCount(anniversaries.length);
        setBirthdayList(birthdays.map((item) => item.Dealername));
        setAnniversaryList(anniversaries.map((item) => item.Dealername));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const birthdayContent = (
    <div>
      <ul>
        {birthdayList.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );

  const anniversaryContent = (
    <div>
      <ul>
        {anniversaryList.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );

  const Circle = ({ count }) => (
    <div
      style={{
        width: "35px",
        height: "35px",
        borderRadius: "50%",
        backgroundColor: "#f0f0f0",
        color: "#555",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        marginBottom: "7px",
      }}
    >
      {count}
    </div>
  );

  return (
    <Card
      style={{
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#ffffff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 45%" }}>
          <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "10px", fontWeight: "bold" }}>Birthdays</div>
          <FaBirthdayCake
            style={{
              fontSize: "30px",
              color: "#ff69b4",
              marginBottom: "10px",
            }}
          />
          <Circle count={birthdayCount} />
          <Popover
            content={birthdayContent}
            title="Today's Birthdays"
            trigger="click"
            open={openBirthdayPopover}
            onOpenChange={(open) => setOpenBirthdayPopover(open)}
          >
            <Button
              size="small"
              style={{
                backgroundColor: openBirthdayPopover ? "#28a745" : "#28a745",
                color: "white",
                marginBottom: "20px",
                borderRadius: "10px",
                marginTop: "7px",
              }}
            >
              Check
            </Button>
          </Popover>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 45%" }}>
          <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "10px", fontWeight: "bold" }}>Anniversaries</div>
          <HeartOutlined style={{ fontSize: "30px", color: "#ff6347", marginBottom: "10px" }} />
          <Circle count={anniversaryCount} />
          <Popover
            content={anniversaryContent}
            title="Today's Anniversaries"
            trigger="click"
            open={openAnniversaryPopover}
            onOpenChange={(open) => setOpenAnniversaryPopover(open)}
          >
            <Button
              size="small"
              style={{
                backgroundColor: openAnniversaryPopover ? "#28a745" : "#28a745",
                color: "white",
                marginBottom: "15px",
                borderRadius: "10px",
                marginTop: "7px",
              }}
            >
              Check
            </Button>
          </Popover>
        </div>
      </div>
    </Card>
  );
};

export default BirthdayAnniversaryCard;
