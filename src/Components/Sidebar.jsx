import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
  ShopOutlined,
  DollarOutlined,
  TeamOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import "../Components/Assets/css/Style.css";

const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined style={{ color: "#fff" }} />,
    label: <Link to="/" style={{ color: "#fff" }}>Dashboard</Link>,
  },
  {
    key: "2",
    icon: <AppstoreOutlined style={{ color: "#fff" }} />,
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
    icon: <FileDoneOutlined style={{ color: "#fff" }} />,
    label: <span style={{ color: "#fff" }}>Inventory</span>,
    children: [
      { key: "3-1", label: <Link to="/lot-creation" style={{ color: "#fff" }}>Lot Creation</Link> },
      { key: "3-2", label: <Link to="/tag-generation" style={{ color: "#fff" }}>Tag Generation</Link> },
    ],
  },
  {
    key: "4",
    icon: <ShopOutlined style={{ color: "#fff" }} />,
    label: <span style={{ color: "#fff" }}>Point of Sale</span>,
    children: [
      { key: "4-1", label: <Link to="/pos-overview" style={{ color: "#fff" }}>POS Overview</Link> },
      { key: "4-2", label: <Link to="/pos-sales" style={{ color: "#fff" }}>Sales</Link> },
    ],
  },
  {
    key: "5",
    icon: <DollarOutlined style={{ color: "#fff" }} />,
    label: <span style={{ color: "#fff" }}>Accounts</span>,
    children: [
      // { key: "5-1", label: <Link to="/accounts-overview" style={{ color: "#fff" }}>Overview</Link> },
      // { key: "5-2", label: <Link to="/dailyrates-report" style={{ color: "#fff" }}>Reports</Link> },
      { key: "5-3", label: <Link to="/bankstatement-report" style={{ color: "#fff" }}>Bank Report</Link> },
      { key: "5-4", label: <Link to="/billmaster-report" style={{ color: "#fff" }}>Bill Report</Link> },
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
    icon: <TeamOutlined style={{ color: "#fff" }} />,
    label: <span style={{ color: "#fff" }}>CRM</span>,
    children: [
   
      { key: "6-3", label: <Link to="/cash-book" style={{ color: "#fff" }}>Cash Book</Link> },
      { key: "6-4", label: <Link to="/sale-reports" style={{ color: "#fff" }}>Sales Reports</Link> },
      { key: "6-5", label: <Link to="/product-wise-detailes" style={{ color: "#fff" }}>Product Details</Link> },
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
    icon: <LineChartOutlined style={{ color: "#fff" }} />,
    label: <span style={{ color: "#fff" }}>Analysis</span>,
    children: [
      { key: "7-1", label: <Link to="/analysis-sales" style={{ color: "#fff" }}>Sales Analysis</Link> },
      { key: "7-2", label: <Link to="/analysis-performance" style={{ color: "#fff" }}>Performance</Link> },
    ],
  },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState(["1"]);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const currentPath = location.pathname;

    const findKey = (items, path) =>
      items.reduce((acc, item) => {
        if (item.children) {
          const foundKey = findKey(item.children, path);
          return foundKey ? foundKey : acc;
        }
        return item.label?.props?.to === path ? item.key : acc;
      }, "");

    const currentKey = findKey(menuItems, currentPath);
    setSelectedKeys([currentKey]);

    const parentKey = menuItems.find((item) =>
      item.children?.some((child) => child.key === currentKey)
    )?.key;
    setOpenKeys(parentKey ? [parentKey] : []);
  }, [location]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys.slice(-1));
  };

  const handleMenuItemClick = () => {
    if (window.innerWidth <= 768) {
      setCollapsed(true);
    }
  };

  return (
    <Menu
    theme="light"
    mode="inline"
    items={menuItems}
    selectedKeys={selectedKeys}
    openKeys={openKeys}
    onOpenChange={onOpenChange}
    onClick={handleMenuItemClick}
    className="custom-scrollbar sidebar-menu white-text custom-menu no-padding-left"
    style={{
      height: "100%",
      background: "#150A4E",
      position: "sticky",
      top: 0,
      left: 0,
      zIndex: 100,
      maxHeight: "100vh",
      overflowY: "auto",
    }}
  />
  );
};

export default Sidebar;
