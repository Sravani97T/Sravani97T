import React from 'react';
import { Button } from 'antd';
import { RetweetOutlined } from '@ant-design/icons';

const ResetButton = ({ onReset }) => {
  return (
    <Button
      shape="circle"
      type="primary"
      icon={<RetweetOutlined className="rotating-icon" style={{ fontSize: "12px" }} />}
      style={{
        backgroundColor: "#fff", // Light blue
        color: "orange",
      }}
      onClick={onReset}
    />
  );
};

export default ResetButton;
