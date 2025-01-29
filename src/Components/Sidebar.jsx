import React, { useState } from "react";
import { Menu, Divider, Popover } from "antd";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
  ShopOutlined,
  DollarOutlined,
  TeamOutlined,
  LineChartOutlined,
  RightCircleFilled
} from "@ant-design/icons";
import logo from "../Components/Assets/textLogo.png"; // Import the logo

const Sidebar = ({ collapsed }) => {
  const [selectedKey, setSelectedKey] = useState(""); // Track the selected key for highlighting
  const [openKeys, setOpenKeys] = useState([]); // Track open submenu items

  const handleMenuClick = (e) => {
    setSelectedKey(e.key); // Update selected key on click
    if (e.key === "1") {
      setOpenKeys([]); // Close all submenus when Dashboard is clicked
    }
    console.log("e", e);
  };

  const handleSubMenuOpenChange = (keys) => {
    console.log("Submenu open keys:", keys);
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []); // Only keep the last opened submenu
  };

  const iconStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#000",
    width: "24px",
    height: "24px",
    borderRadius: "5px",
    padding: "0px",
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined style={iconStyle} />,
      label: <Link to="/dashboard" style={{ color: "#fff" }}>Dashboard</Link>,
      style: !collapsed ? {
        backgroundColor: "#52BD91", // Light green background for Dashboard
        borderRadius: "10px",
        margin: "5px 0",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        border: "1px solid grey", // Grey border
        width: "227px",
        marginLeft: "20px",
        padding: "10px"
      } : {},
    },
    {
      key: "2",
      icon: <AppstoreOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Masters</span>,
      children: [
        { key: "2-1", label: <Link to="/main-product" style={{ color: "#fff" }}>Main Product</Link> },
        { key: "2-2", label: <Link to="/product-category" style={{ color: "#fff" }}>Product Category</Link> },
        { key: "2-3", label: <Link to="/product-master" style={{ color: "#fff" }}>Product Master</Link> },
        { key: "2-4", label: <Link to="/counter-master" style={{ color: "#fff" }}>Counter Master</Link> },
        { key: "2-5", label: <Link to="/category-master" style={{ color: "#fff" }}>Category Master</Link> },
        { key: "2-6", label: <Link to="/prefix-master" style={{ color: "#fff" }}>Prefix Master</Link> },
        { key: "2-7", label: <Link to="/stone-item-master" style={{ color: "#fff" }}>Stone Item</Link> },
        { key: "2-8", label: <Link to="/brand-master" style={{ color: "#fff" }}>Brand Master</Link> },
        { key: "2-9", label: <Link to="/manufacturer-master" style={{ color: "#fff" }}>Manufacturer</Link> },
        { key: "2-10", label: <Link to="/jewelry-type-master" style={{ color: "#fff" }}>Jewelry Type</Link> },
        { key: "2-11", label: <Link to="/bank-master" style={{ color: "#fff" }}>Bank Master</Link> },
        { key: "2-12", label: <Link to="/mail-book" style={{ color: "#fff" }}>Mail Book</Link> },
        { key: "2-13", label: <Link to="/employee-master" style={{ color: "#fff" }}>Employee Master</Link> },
        { key: "2-14", label: <Link to="/account-group" style={{ color: "#fff" }}>Account Group</Link> },
        { key: "2-15", label: <Link to="/journal-entry-master" style={{ color: "#fff" }}>Journal Entry</Link> },
        { key: "2-19", label: <Link to="/state-master" style={{ color: "#fff" }}>State Master</Link> },
        { key: "2-20", label: <Link to="/diamond-rate-fix" style={{ color: "#fff" }}>Diamond Rate Fix</Link> },
        { key: "2-21", label: <Link to="/online-mode" style={{ color: "#fff" }}>Online Mode</Link> },
        { key: "2-22", label: <Link to="/masters-report" style={{ color: "#fff" }}>Reports</Link> },
      ],
    },
    {
      key: "3",
      icon: <FileDoneOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Inventory</span>,
      children: [
        { key: "3-1", label: <Link to="/lot-creation" style={{ color: "#fff" }}>Lot Creation</Link> },
        { key: "3-2", label: <Link to="/tag-generation" style={{ color: "#fff" }}>Tag Generation</Link> },
      ],
    },
    {
      key: "4",
      icon: <ShopOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Point of Sale</span>,
      children: [
        { key: "4-1", label: <Link to="/day-glance" style={{ color: "#fff" }}>Day Glance</Link> },
        { key: "4-2", label: (
          <span style={{ color: "#fff" }}>
            Sales
            <Popover
              content={
                <Menu>
                  <Menu.Item key="4-2-1" style={{ backgroundColor: "#555E9F", width: "150px" }}>
                    <Link to="/sub-menu-1" style={{ color: "#fff" }}>Sub Menu 1</Link>
                  </Menu.Item>
                  <Menu.Item key="4-2-2" style={{ backgroundColor: "#555E9F", width: "150px" }}>
                    <Link to="/sub-menu-2" style={{ color: "#fff" }}>Sub Menu 2</Link>
                  </Menu.Item>
                </Menu>
              }
              trigger={collapsed ? "hover" : "click"} // Show popover on hover when collapsed, click otherwise
              placement="right" // Change the direction of the popover
              overlayStyle={{ width: "170px" }} // Increase the width of the popover
            >
              <RightCircleFilled style={{ marginLeft: "117px", color: "#fff" }} />
            </Popover>
          </span>
        ) },
      ],
    },
    {
      key: "5",
      icon: <DollarOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Accounts</span>,
      children: [
        { key: "5-3", label: <Link to="/bankstatement-report" style={{ color: "#fff" }}>Bank Report</Link> },
        { key: "5-4", label: <Link to="/billmaster-report" style={{ color: "#fff" }}>Sale Register</Link> },
        { key: "5-5", label: <Link to="/stockBalence-report" style={{ color: "#fff" }}>Stock Balance</Link> },
        { key: "5-6", label: <Link to="/stocksummry-report" style={{ color: "#fff" }}>Stock Summary</Link> },
        { key: "5-15", label: <Link to="/traysummery-report" style={{ color: "#fff" }}>Tray Summary</Link> },
        { key: "5-16", label: <Link to="/counterchart-report" style={{ color: "#fff" }}>Counter Chart</Link> },
        { key: "5-17", label: <Link to="/stonedetailes-report" style={{ color: "#fff" }}> Stone Detailes</Link> },
        { key: "5-7", label: <Link to="/productcategory-report" style={{ color: "#fff" }}>Product Category</Link> },
        { key: "5-8", label: <Link to="/categorynet-report" style={{ color: "#fff" }}>Category Net</Link> },
        { key: "5-9", label: <Link to="/DealerwisestockSummry-report" style={{ color: "#fff" }}>Dealer Summary</Link> },
        { key: "5-10", label: <Link to="/Dealerwisestockdetailes-report" style={{ color: "#fff" }}>Dealer Details</Link> },
        { key: "5-11", label: <Link to="/prifixnetsummry-report" style={{ color: "#fff" }}>Prefix Summary</Link> },
        { key: "5-12", label: <Link to="/counternetsummry-report" style={{ color: "#fff" }}>Counter Summary</Link> },
        { key: "5-13", label: <Link to="/dealernetsummry-report" style={{ color: "#fff" }}>Dealer Summary</Link> },
        { key: "5-14", label: <Link to="/daimondstockdetailes-report" style={{ color: "#fff" }}>Diamond Details</Link> },
      ],
    },
    {
      key: "6",
      icon: <TeamOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>CRM</span>,
      children: [
        { key: "6-3", label: <Link to="/cash-book" style={{ color: "#fff" }}>Cash Book</Link> },
        { key: "6-4", label: <Link to="/sale-reports" style={{ color: "#fff" }}>Sales Reports</Link> },
        { key: "6-5", label: <Link to="/product-wise-detailes" style={{ color: "#fff" }}>Product Wise Sale Details</Link> },
        { key: "6-6", label: <Link to="/new-ornament-purchase-register" style={{ color: "#fff" }}>Purchase Register</Link> },
        { key: "6-7", label: <Link to="/gs11-report" style={{ color: "#fff" }}>GS11</Link> },
        { key: "6-8", label: <Link to="/gs12-report" style={{ color: "#fff" }}>GS12</Link> },
        { key: "6-9", label: <Link to="/outstandingcustomers-report" style={{ color: "#fff" }}>Outstanding Customers</Link> },
        { key: "6-10", label: <Link to="/outstandingdealers-report" style={{ color: "#fff" }}>Outstanding Dealers</Link> },
        { key: "6-11", label: <Link to="/oldgoldbook-report" style={{ color: "#fff" }}>Old Gold Book</Link> },
      ],
    },
    {
      key: "7",
      icon: <LineChartOutlined style={iconStyle} />,
      label: <span style={{ color: "#fff" }}>Analysis</span>,
      children: [
        { key: "7-1", label: <Link to="/analysis-sales" style={{ color: "#fff" }}>Sales Analysis</Link> },
        { key: "7-2", label: <Link to="/upload" style={{ color: "#fff" }}>Upload</Link> },
      ],
    },
  ];

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        backgroundColor: "lightgreen",
      }}
    >
      {/* Logo */}
      {!collapsed && (
        <div
          style={{
            textAlign: "center",
            padding: "5px 0",
            backgroundColor: "#11083E",
          }}
        >
          <img src={logo} alt="Logo" style={{ width: "70%", height: "auto" }} />
        </div>
      )}

      <Menu
        mode="inline"
        theme="dark"
        style={{
          height: "calc(100vh - 50px)", // Leaves space for the sticky logo
          overflow: "hidden",
          backgroundColor: "#11083E", // Set the background color
          transition: "all 0.2s ease-in-out", // Add transition for quick expansion
        }}
        onClick={handleMenuClick} // Handle click event to select items
        selectedKeys={[selectedKey]} // Apply selected key for highlighting
        openKeys={openKeys} // Open submenu based on open keys
        onOpenChange={handleSubMenuOpenChange} // Handle submenu open state
      >
        {menuItems.map((menuItem) => {
          if (menuItem.children) {
            return (
              <Menu.SubMenu
                key={menuItem.key}
                icon={menuItem.icon}
                title={menuItem.label}
                style={{
                  maxHeight: "calc(100vh - 150px)", // Adjust height for submenu scroll
                  overflow: "hidden",
                }}
              >
                {/* Submenu Items */}
                <div
                  style={{
                    maxHeight: "280px", // Set a fixed height for scrolling
                    overflowY: "auto", // Enable vertical scrolling
                    scrollbarWidth: "thin", // Make scrollbar thin (for Firefox)
                    scrollbarColor: "rgba(255, 255, 255, 0.2) transparent", // Light scrollbar color
                  }}
                >
                  {/* Webkit scrollbar styling */}
                  {menuItem.children.map((submenu, index) => (
                    <React.Fragment key={submenu.key}>
                      <Menu.Item
                        key={submenu.key}
                        style={{
                          backgroundColor:
                            selectedKey === submenu.key ? "#aed2f385" : "transparent", // Highlight selected submenu item
                          borderRadius: selectedKey === submenu.key ? "10px" : "0px", // Rounded corners for selected item
                          position: "relative", // For positioning pseudo-element
                        }}
                      >
                        <span style={{ marginRight: "10px", color: "#fff" }}>
                          <AppstoreOutlined />
                        </span>
                        {submenu.label}
                        {selectedKey === submenu.key && (
                          <div
                            style={{
                              content: '""',
                              position: "absolute",
                              top: "-10px",
                              left: "-10px",
                              right: "-10px",
                              bottom: "-10px",
                              background: "rgba(173, 216, 230, 0.3)", // Light blue background for shape
                              borderRadius: "10px", // Rounded corners for the shape
                              zIndex: "-1", // Behind the text
                            }}
                          />
                        )}
                      </Menu.Item>
                      {index < menuItem.children.length - 1 && <Divider style={{ backgroundColor: "rgb(163 159 159)", padding: "0px", margin: "0px" }} />}
                    </React.Fragment>
                  ))}
                </div>
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item
                key={menuItem.key}
                icon={menuItem.icon}
                style={{
                  position: "relative", // Ensure the pseudo-element is positioned correctly
                  backgroundColor:
                    selectedKey === menuItem.key ? "#aed2f385" : "transparent", // Highlight when selected
                  margin: "5px 0", // Add margin for small card effect
                  border: "1px solid grey", // Grey border for menu item
                  ...menuItem.style, // Apply specific style for Dashboard
                }}
              >
                {menuItem.label}
                {selectedKey === menuItem.key && (
                  <div
                    style={{
                      content: '""',
                      position: "absolute",
                      top: "-10px",
                      left: "-10px",
                      right: "-10px",
                      bottom: "-10px",
                      background: "rgba(173, 216, 230, 0.3)", // Light blue background for shape
                      borderRadius: "10px", // Rounded corners for the shape
                      zIndex: "-1", // Behind the text
                    }}
                  />
                )}
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </div>
  );
};

export default Sidebar;
