import React, { useState } from "react";
import { Card, Popover, Button } from "antd";
import {  HeartOutlined } from "@ant-design/icons";
import { FaBirthdayCake } from "react-icons/fa"; 
const BirthdayAnniversaryCard = () => {
  const [birthdayCount] = useState(5); // Example count for birthdays
  const [anniversaryCount] = useState(3); // Example count for anniversaries
  const [openBirthdayPopover, setOpenBirthdayPopover] = useState(false);
  const [openAnniversaryPopover, setOpenAnniversaryPopover] = useState(false);

  // Example list of birthdays and anniversaries today
  const birthdayList = ["John Doe", "Jane Smith", "Alice Johnson"];
  const anniversaryList = ["Tom & Mary", "Jack & Lily"];

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
        backgroundColor: "#f0f0f0", // Subtle background color
        color: "#555", // Less intense text color
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
          <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "10px",fontWeight:"bold" }}>Birthdays</div>
          <FaBirthdayCake
            style={{
              fontSize: "30px",
              color: "#ff69b4",
              marginBottom: "10px",
            }}
          />          <Circle count={birthdayCount} />
          
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
                borderRadius:"10px",
                marginTop:"7px"
              }}
            >
              Check
            </Button>
          </Popover>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "1 1 45%" }}>
          <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "10px" ,fontWeight:"bold"}}>Anniversaries</div>
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
                borderRadius:"10px",
                marginTop:"7px"

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
