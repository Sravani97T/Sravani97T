import React, { useState } from "react";
import { Breadcrumb, Table, Input, Button, Space ,Row,Col} from "antd";
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

const DailyRates = () => {
  const initialData = [
    { key: "1", mainProduct: "Gold", prefix: "G", rate: '' },
    { key: "2", mainProduct: "Silver", prefix: "S", rate: ''},
    { key: "3", mainProduct: "Platinum", prefix: "P", rate: ''},
  ];

  const [dataSource, setDataSource] = useState(initialData);
  const [editingKey, setEditingKey] = useState(null);
  const [editingRate, setEditingRate] = useState(null);

  const handleEdit = (record) => {
    setEditingKey(record.key);
    setEditingRate(record.rate);
  };

  const handleCancel = () => {
    setEditingKey(null);
    setEditingRate(null);
  };

  const handleSave = (record) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === record.key);
    if (index > -1) {
      newData[index] = { ...record, rate: editingRate };
      setDataSource(newData);
      setEditingKey(null);
      setEditingRate(null);
    }
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSubmit = () => {
    console.log("Updated Rates:", dataSource);
    // Submit logic can be added here
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
          editingKey === record.key ? (
            <Input
              type="number"
              value={editingRate}
              onChange={(e) => setEditingRate(Number(e.target.value))}
              autoFocus // This will focus the input field when it's in edit mode
            />
          ) : (
            <span>{text}</span>
          ),
      },
      
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        editingKey === record.key ? (
          <Space>
            <Button
              type="text"
              icon={<CheckOutlined style={{ color: "green" }} />}
              onClick={() => handleSave(record)}
            />
            <Button
              type="text"
              icon={<CloseOutlined style={{ color: "red" }} />}
              onClick={handleCancel}
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
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Daily Rates</Breadcrumb.Item>
      </Breadcrumb>
      </Col></Row>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        footer={() => (
          <Button
            type="primary"
            style={{ marginTop: 16 ,float:"right",backgroundColor:"#0C1154"}}
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
