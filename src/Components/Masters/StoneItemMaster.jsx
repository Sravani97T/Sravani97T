import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  Space,
  Popconfirm,
  Row,
  Col,
  Card,
  message,
  Breadcrumb,
  Checkbox,
  Radio,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const StoneItemMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([
    {
      key: 1,
      stoneItem: "Diamond",
      stoneCode: "D001",
      printOnBilling: false,
      diamondValueFix: false,
      category: "CTS",
      netWeightDiamonds: false,
      netWeightOthers: false,
    },
    {
      key: 2,
      stoneItem: "Emerald",
      stoneCode: "E002",
      printOnBilling: true,
      diamondValueFix: true,
      category: "Diamonds",
      netWeightDiamonds: true,
      netWeightOthers: false,
    },
  ]);

  const [editingKey, setEditingKey] = useState(null);
  const [searchText, setSearchText] = useState("");

  const stoneItemRef = useRef(null);
  const stoneCodeRef = useRef(null);

  const handleAdd = (values) => {
    const newData = {
      key: Date.now(),
      ...values,
    };
    setData([...data, newData]);
    form.resetFields();
    message.success("Stone item added successfully!");
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Stone item deleted successfully!");
  };

  const handleEdit = (record) => {
    setEditingKey(record.key);
    form.setFieldsValue(record);
    window.scrollTo(0, 0);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((updatedData) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.key === editingKey ? { ...item, ...updatedData } : item
          )
        );
        setEditingKey(null);
        form.resetFields();
        message.success("Stone item updated successfully!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(null);
  }, [form]);

  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Stone Item",
      dataIndex: "stoneItem",
      key: "stoneItem",
      sorter: (a, b) => a.stoneItem.localeCompare(b.stoneItem),
    },
    {
      title: "Stone Code",
      dataIndex: "stoneCode",
      key: "stoneCode",
      sorter: (a, b) => a.stoneCode.localeCompare(b.stoneCode),
    },
    {
      title: "Print on Billing",
      dataIndex: "printOnBilling",
      key: "printOnBilling",
      render: (printOnBilling) => <Checkbox checked={printOnBilling} disabled />,
    },
    {
      title: "Diamond Value Fix Table",
      dataIndex: "diamondValueFix",
      key: "diamondValueFix",
      render: (diamondValueFix) => <Checkbox checked={diamondValueFix} disabled />,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Effect on Net Weight Diamonds",
      dataIndex: "netWeightDiamonds",
      key: "netWeightDiamonds",
      render: (netWeightDiamonds) => <Checkbox checked={netWeightDiamonds} disabled />,
    },
    {
      title: "Effect on Net Weight Others",
      dataIndex: "netWeightOthers",
      key: "netWeightOthers",
      render: (netWeightOthers) => <Checkbox checked={netWeightOthers} disabled />,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            disabled={editingKey === record.key}
          />
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleEnterPress = (e, nextFieldRef) => {
    e.preventDefault();
    if (nextFieldRef && nextFieldRef.current) {
      nextFieldRef.current.focus();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + S: Trigger Submit
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        form.submit();
      }
      // Alt + C: Trigger Cancel
      if (e.altKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [form, handleCancel]);

  return (
    <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
      {/* Breadcrumb */}
      <Row justify="start" style={{ marginBottom: "16px" }}>
        <Col>
          <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
            <Breadcrumb.Item>Masters</Breadcrumb.Item>
            <Breadcrumb.Item>Stone Item Master</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>

      <Card
        title={editingKey ? "Edit Stone Item" : "Add Stone Item"}
        style={{
          marginBottom: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={editingKey ? handleSave : handleAdd}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="stoneItem"
                label="Stone Item"
                rules={[{ required: true, message: "Stone Item is required" }]}
              >
                <Input
                  placeholder="Enter stone item"
                  ref={stoneItemRef}
                  onPressEnter={(e) => handleEnterPress(e, stoneCodeRef)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="stoneCode"
                label="Stone Code"
                rules={[{ required: true, message: "Stone Code is required" }]}
              >
                <Input
                  placeholder="Enter stone code"
                  ref={stoneCodeRef}
                  onPressEnter={(e) => handleEnterPress(e)}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="printOnBilling" valuePropName="checked">
                <Checkbox>Stone Item Print on Billing</Checkbox>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="diamondValueFix" valuePropName="checked">
                <Checkbox>Diamond Value Fix Table</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value="CTS">CTS</Radio>
                  <Radio value="Diamonds">Diamonds</Radio>
                  <Radio value="Uncuts">Uncuts</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="netWeightDiamonds" valuePropName="checked">
                <Checkbox>Effect on Net Weight Diamonds</Checkbox>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Form.Item name="netWeightOthers" valuePropName="checked">
                <Checkbox>Effect on Net Weight Others</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                marginRight: 8,
                backgroundColor: "#0C1154",
                borderColor: "#0C1154",
              }}
            >
              {editingKey ? "Save" : "Submit"}
            </Button>
            <Button
              htmlType="button"
              onClick={handleCancel}
              style={{ backgroundColor: "#f0f0f0" }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </Card>

      <Row gutter={16} style={{ marginBottom: "16px" }}>
        <Col xs={24} sm={16} lg={12}>
          <Input.Search
            placeholder="Search records"
            style={{ width: "100%", borderRadius: "4px" }}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={{ pageSize: 5 }}
        scroll={{ x: 1000 }}
        style={{
          background: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default StoneItemMaster;
