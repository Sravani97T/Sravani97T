import React, { useState, useEffect, useRef } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sidebar from "./Sidebar";
import logo from "../Components/Assets/textLogo.png"; // Regular logo
import logo1 from "../Components/Assets/tlogo.png"; // Collapsed logo

const { Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false); // Default state for collapsed
  const [isMobile, setIsMobile] = useState(false); // Track if in mobile view
  const sidebarRef = useRef(null); // Reference to sidebar to detect outside clicks

  // Set screen size and handle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set to true for mobile screens
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Run on initial load
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setCollapsed(!collapsed); // Toggle collapse for both mobile and web
  };

  // Close sidebar when clicking outside of it in mobile view
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest(".ant-menu")) {
        setCollapsed(true); // Close sidebar if clicked outside while in mobile view
      }
    };

    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  // Styles for logos
  const expandedLogoStyle = { width: "160px", height: "25px" };
  const collapsedLogoStyle = { width: "35px", height: "25px" };

  return (
    <Layout  style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          backgroundColor: "#fff",
          width: collapsed ? "80px" : "200px",
          
          position: "relative", // Make sure sidebar itself doesn't interfere with sticky positioning
          borderTopLeftRadius: "10px", // Add border radius to the top-left corner

        }}
        ref={sidebarRef} // Attach the reference to sidebar
      >
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            position: "sticky", // Make logo sticky at the top of the sidebar
            top: 0, // Stick it to the top
            zIndex: 100, // Ensure logo stays on top of other content
            backgroundColor: "#150A4E", 
            borderTopLeftRadius: "30px",
          }}
        >
          <img
            src={logo1}
            alt="Collapsed Logo"
            style={collapsedLogoStyle}
          />
          {!collapsed && (
            <img
              src={logo}
              alt="Expanded Logo"
              style={expandedLogoStyle}
            />
          )}
        </div>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content style={{ margin: "16px" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
