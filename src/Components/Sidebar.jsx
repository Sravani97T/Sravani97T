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
// Define menuItems outside the component
const menuItems = [
  {
    key: "1",
    icon: <HomeOutlined />,
    label: <Link to="/">Dashboard</Link>,
    style: { backgroundColor: "#1cc88a" }, // Fixed background color for Dashboard
  },
  {
    key: "2",
    icon: <AppstoreOutlined />,
    label: "Masters",
    children: [
      { key: "2-1", label: <Link to="/main-product">Main Product</Link> },
      { key: "2-2", label: <Link to="/product-category">Product Category</Link> },
      { key: "2-3", label: <Link to="/product-master">Product Master</Link> },
      { key: "2-4", label: <Link to="/counter-master">Counter Master</Link> },
      { key: "2-5", label: <Link to="/category-master">Category Master</Link> },
      { key: "2-6", label: <Link to="/prefix-master">Prefix Master</Link> },
      { key: "2-7", label: <Link to="/stone-item-master">Stone Item </Link> },
      { key: "2-8", label: <Link to="/brand-master">Brand Master</Link> },
      { key: "2-9", label: <Link to="/manufacturer-master">Manufacturer</Link> },
      { key: "2-10", label: <Link to="/jewelry-type-master">Jewelry Type </Link> },
      { key: "2-11", label: <Link to="/bank-master">Bank Master</Link> },
      { key: "2-12", label: <Link to="/mail-book">Mail Book</Link> },
      { key: "2-13", label: <Link to="/employee-master">Employee Master</Link> },
      { key: "2-14", label: <Link to="/account-group">Account Group</Link> },
      { key: "2-15", label: <Link to="/journal-entry-master">Journal Entry </Link> },
      // { key: "2-16", label: <Link to="/customer-openings">Customer Openings</Link> },
      // { key: "2-17", label: <Link to="/dealer-openings">Dealer Openings</Link> },
      // { key: "2-18", label: <Link to="/company-openings">Company Openings</Link> },
      { key: "2-19", label: <Link to="/state-master">State Master</Link> },
      { key: "2-20", label: <Link to="/diamond-rate-fix">Diamond Rate Fix</Link> },
      { key: "2-21", label: <Link to="/online-mode">Online Mode</Link> },
      { key: "2-22", label: <Link to="/masters-report">Reports</Link> },

    ],
  },
  {
    key: "3",
    icon: <FileDoneOutlined />,
    label: "Inventory",
    children: [
      { key: "3-1", label: <Link to="/lot-creation">Lot Creation</Link> },
      { key: "3-2", label: <Link to="/tag-generation">Tag Genration</Link> },
    ],
  },
  {
    key: "4",
    icon: <ShopOutlined />,
    label: "Point of Sale",
    children: [
      { key: "4-1", label: <Link to="/pos-overview">POS Overview</Link> },
      { key: "4-2", label: <Link to="/pos-sales">Sales</Link> },
    ],
  },
  {
    key: "5",
    icon: <DollarOutlined />,
    label: "Accounts",
    children: [
      { key: "5-1", label: <Link to="/accounts-overview">Overview</Link> },
      { key: "5-2", label: <Link to="/dailyrates-report">Reports</Link> },
      { key: "5-3", label: <Link to="/bankstatement-report">Bank Report</Link> },
      { key: "5-4", label: <Link to="/billmaster-report">Bill Report</Link> },


    ],
  },
  {
    key: "6",
    icon: <TeamOutlined />,
    label: "CRM",
    children: [
      { key: "6-1", label: <Link to="/crm-leads">Leads</Link> },
      { key: "6-2", label: <Link to="/crm-customers">Customers</Link> },
    ],
  },
  {
    key: "7",
    icon: <LineChartOutlined />,
    label: "Analysis",
    children: [
      { key: "7-1", label: <Link to="/analysis-sales">Sales Analysis</Link> },
      { key: "7-2", label: <Link to="/analysis-performance">Performance</Link> },
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
    setOpenKeys(keys.slice(-1)); // Keep only the last opened submenu
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
    className="custom-scrollbar"
    style={{
      height: "100%",
      background: "#fff",
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
