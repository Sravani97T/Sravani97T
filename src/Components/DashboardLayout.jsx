import React, { useState, useEffect, useRef } from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sidebar from "./Sidebar";
import logo1 from "../Components/Assets/tlogo.png"; // Collapsed logo

const { Sider, Content } = Layout;

const DashboardLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".ant-menu")
      ) {
        setCollapsed(true);
      }
    };

    if (isMobile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile]);

  return (
    <Layout style={{ minHeight: "100vh" ,          minWidth:"220px"
    }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        style={{
          backgroundColor: "#150A4E",
          position: "sticky",
          top: 0,
          zIndex: 100,
          height: "100vh",
          overflow: "hidden",
       

        }}
        ref={sidebarRef}
        width={260} // Expanded width

      >
        {/* Logo Section */}
        <div
          style={{
            padding: "5px 5px 5px",
            textAlign: "center",
            backgroundColor: "#150A4E",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
            transition: "all 0.3s ease",
            position: "sticky",
            top: 0,
            zIndex: 101,
          }}
        >
          <img
            src={logo1}
            alt="Logo"
            style={{
              width: "35px",
              height: "35px",
              transition: "all 0.3s ease",
            }}
          />
        </div>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header collapsed={collapsed} toggleSidebar={toggleSidebar} />
        <Content
          style={{
            margin: "16px",
            padding: "16px",
            backgroundColor: "#f4f4f4",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            transition: "all 0.3s ease",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
