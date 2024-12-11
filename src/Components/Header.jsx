import React, { useState, useEffect } from "react";
import { Avatar, Dropdown, Button,  Space, Typography } from "antd";
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, LogoutOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const Header = ({ collapsed, toggleSidebar }) => {
  const navigate = useNavigate(); // Using React Router's useNavigate hook
  const [isMobile, setIsMobile] = useState(false); // Track if in mobile view

  // Check if the view is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set to true for mobile screens
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Run on initial load
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to handle menu item click
  const handleMenuClick = ({ key }) => {
    if (key === "1") {
      navigate("/settings"); // Redirect to settings page
    } else if (key === "2") {
      navigate("/profile"); // Redirect to profile page
    } else if (key === "3") {
      // Logout action (could be handled by clearing user data or redirecting to login)
      console.log("Logging out...");
    }
  };

  const userMenu = {
    items: [
      {
        key: "1",
        icon: <SettingOutlined />,
        label: "Settings",
      },
      {
        key: "2",
        icon: <UserOutlined />,
        label: "Profile",
      },
      {
        key: "3",
        icon: <LogoutOutlined />,
        label: "Logout",
      },
    ],
    onClick: handleMenuClick,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        background: "#fff",
        borderBottom: "1px solid #d9d9d9",
        height: "64px",
        position: "sticky", // Make header sticky
        top: 0, // Keep header at the top
        zIndex: 100, // Ensures it's above other content
      }}
    >
      {/* Sidebar toggle button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleSidebar}
      />

<div style={{ display: "flex", alignItems: "center" }}>
        {isMobile ? (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} style={{ fontSize: "18px" }} />
          </Dropdown>
        ) : (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space>
              <Avatar size={30} icon={<UserOutlined />} style={{ cursor: "pointer" }} />
              <Text strong style={{ marginLeft: "8px" }}>Sravani Reddy</Text>
            </Space>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

export default Header;
