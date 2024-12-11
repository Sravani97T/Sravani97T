import React, { useState } from "react";
import { Breadcrumb, Table, Input, Button, Space, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const DailyRates = () => {
  const initialData = [
    { key: "1", mainProduct: "Gold", prefix: "G", rate: '' },
    { key: "2", mainProduct: "Silver", prefix: "S", rate: '' },
    { key: "3", mainProduct: "Platinum", prefix: "P", rate: '' },
  ];

  const [dataSource, setDataSource] = useState(initialData);
  const [editingKeys, setEditingKeys] = useState({});

  const handleEdit = (record) => {
    setEditingKeys({ ...editingKeys, [record.key]: record.rate });
  };

  const handleCancel = (key) => {
    const updatedEditingKeys = { ...editingKeys };
    delete updatedEditingKeys[key];
    setEditingKeys(updatedEditingKeys);
  };

  const handleSave = (record) => {
    const updatedData = dataSource.map((item) =>
      item.key === record.key ? { ...item, rate: editingKeys[record.key] } : item
    );
    setDataSource(updatedData);
    handleCancel(record.key);
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSubmit = () => {
    console.log("Updated Rates:", dataSource);
    // Additional submit logic can be added here
  };

  const columns = [
    {
      title: "Main Product",
      dataIndex: "mainProduct",
      key: "mainProduct",
    },
    {
      title: "Prefix",
      dataIndex: "prefix",
      key: "prefix",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (text, record) =>
        editingKeys[record.key] !== undefined ? (
          <Input
            type="number"
            value={editingKeys[record.key]}
            onChange={(e) =>
              setEditingKeys({ ...editingKeys, [record.key]: Number(e.target.value) })
            }
            autoFocus
          />
        ) : (
          <span>{text}</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        editingKeys[record.key] !== undefined ? (
          <Space>
            <Button
              type="text"
              icon={<CheckOutlined style={{ color: "green" }} />}
              onClick={() => handleSave(record)}
            />
            <Button
              type="text"
              icon={<CloseOutlined style={{ color: "red" }} />}
              onClick={() => handleCancel(record.key)}
            />
          </Space>
        ) : (
          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleDelete(record.key)}
            />
          </Space>
        ),
    },
  ];

  return (
    <div>
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Breadcrumb
            style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}
            items={[
              { title: "Estimation" },
              { title: "Daily Rates" },
            ]}
          />
        </Col>
      </Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        footer={() => (
          <Button
            type="primary"
            style={{ marginTop: 16, float: "right", backgroundColor: "#0C1154" }}
            onClick={handleSubmit}
          >
            Submit Rates
          </Button>
        )}
      />
    </div>
  );
};

export default DailyRates;
