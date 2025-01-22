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
  Pagination
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios
import { CREATE_jwel } from "../../Config/Config";
import TableHeaderStyles from "../Pages/TableHeaderStyles";

const StoneItemMaster = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState(false);
  const [rowData, setRowData] = useState();
  const [searchText, setSearchText] = useState("");
  const stoneItemRef = useRef(null);
  const stoneCodeRef = useRef(null);
  const [isJwelTypeExist, setIsJwelTypeExist] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const tenantNameHeader = "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=";

  // Fetch all stone items from the API



  useEffect(() => {
    fetchStoneItems(); // Fetch the data when the component is mounted
  }, []);
  const fetchStoneItems = async () => {
    try {
      const response = await axios.get(`${CREATE_jwel}/api/Master/MasterItemMasterList`);
      const mappedData = response.data.map((item, index) => ({
        key: index, // Ensure each item has a unique key
        sno: index + 1, // Add serial number starting from 1
        stoneItem: item.ITEMNAME,
        stoneCode: item.ITEMCODE,
        printOnBilling: item.PRINT_BILL,
        diamondValueFix: item.DIAMONDVALUE_FIX,
        category: item.CTS ? "CTS" : item.DIAMONDS ? "Diamonds" : item.UNCUTS ? "Uncuts" : "Other",
        netWeightDiamonds: item.EFFECTON_DIAMOND,
        netWeightOthers: item.EFFECTON_GOLD,
      }));
      setData(mappedData); // Set the data for the table
    } catch (error) {
      console.error("Error fetching stone items:", error);
      message.error("Failed to fetch stone items.");
    }
  };
  
  const handleStoneItemCheck = async (itemName) => {
    if (!itemName) return false;
  
    try {
      const response = await axios.get(
        `${CREATE_jwel}/api/Master/MasterItemMasterSearch?itemName=${itemName}`,
        { headers: { tenantName: tenantNameHeader } }
      );
  
      // Check if the item exists in the API response
      const itemExists = response.data.some((item) => item.ITEMNAME === itemName);
      return itemExists;
    } catch (error) {
      console.error("Error checking stone item:", error);
      message.error("Error checking stone item. Please try again.");
      return false;
    }
  };
  


  // Handle adding a new stone item
  const handleAdd = async (values) => {
    if (isJwelTypeExist) {
      message.error("Stone Item already exists.");
      return;
    }

    const newData = {
      itemname: values.stoneItem,
      prinT_BILL: values.printOnBilling,
      ctS_RATE: 0,
      diamondvaluE_FIX: values.diamondValueFix,
      effectoN_DIAMOND: values.netWeightDiamonds,
      effectoN_GOLD: values.netWeightOthers,
      cts: values.category === "CTS",
      diamonds: values.category === "Diamonds",
      uncuts: values.category === "Uncuts",
      itemcode: values.stoneCode,
      cloud_upload: true,
    };

    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/MasterItemMasterInsert`,
        newData,
        { headers: { tenantName: tenantNameHeader } }
      );

      if (response.data) {
        form.resetFields();
        message.success("Stone item added successfully!");
        fetchStoneItems();
      } else {
        message.error("Failed to add stone item. Please try again.");
      }
    } catch (error) {
      console.error("Error adding stone item:", error);
      message.error("Error adding stone item. Please try again.");
    }
  };



  const handleSave = async () => {
    form
      .validateFields()
      .then(async (updatedData) => {
        try {
          // Find the old item from the data using the editing key
          const oldItem = data.find((item) => item.key === rowData);
          if (isJwelTypeExist) {
            // If JewelType already exists, show error message and return
            message.error("ItemName already exists.");

          }
          if (oldItem) {
            // First, delete the old record
            const deleteResponse = await axios.post(
              `${CREATE_jwel}/api/Master/MasterItemMasterDelete?itemName=${oldItem.stoneItem}`,
              {}, // Empty body since itemName is in the URL
              { headers: { tenantName: tenantNameHeader } }
            );

            // Check if delete was successful
            if (deleteResponse.data) {
              // If deletion was successful, proceed with the insert
              const newData = {
                itemname: updatedData.stoneItem,
                prinT_BILL: updatedData.printOnBilling,
                ctS_RATE: 0, // Default value, adjust as needed
                diamondvaluE_FIX: updatedData.diamondValueFix,
                effectoN_DIAMOND: updatedData.netWeightDiamonds,
                effectoN_GOLD: updatedData.netWeightOthers,
                cts: updatedData.category === "CTS",
                diamonds: updatedData.category === "Diamonds",
                uncuts: updatedData.category === "Uncuts",
                itemcode: updatedData.stoneCode,
                cloud_upload: true,
              };

              const insertResponse = await axios.post(
                `${CREATE_jwel}/api/Master/MasterItemMasterInsert`,
                newData,
                { headers: { tenantName: tenantNameHeader } }
              );

              if (insertResponse.data) {
                // If insertion is successful, update the table
                setData((prevData) =>
                  prevData.map((item) =>
                    item.key === editingKey ? { ...item, ...newData } : item
                  )
                );
                setEditingKey(false);
                form.resetFields();
                message.success("Stone item updated successfully!");
                setIsJwelTypeExist(false);

                fetchStoneItems();
              } else {
                message.error("Failed to insert the stone item. Please try again.");
              }
            } else {
              message.error("Failed to delete the old stone item. Please try again.");
            }
          }
        } catch (error) {
          console.error("Error updating stone item:", error);
          message.error("Error updating stone item.");
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEdit = (record) => {
    form.setFieldsValue(record);

    setEditingKey(true);  // Set the editing key to track the editing item
    setRowData(record.key);

  };

  // Handle updating an existing stone item

  // Handle deleting a stone item
  const handleDelete = async (itemName) => {
    try {
      const response = await axios.post(
        `${CREATE_jwel}/api/Master/MasterItemMasterDelete?itemName=${itemName}`,
        {}, // Empty body since itemName is in the URL
        { headers: { tenantName: tenantNameHeader } }
      );

      console.log(response.data); // Log the response to debug

      // Check if the response has a Download property and it's true
      if (response.data) {
        // If successful, re-fetch the stone items to update the table
        fetchStoneItems();  // Re-fetch the data to reflect the changes immediately
        message.success("Stone item deleted successfully!"); // Success message
        fetchStoneItems();
      } else {
        message.error("Failed to delete stone item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting stone item:", error);
      message.error("Error deleting stone item. Please try again.");
    }
  };


  // Handle cancel action
  const handleCancel = useCallback(() => {
    form.resetFields();
    setEditingKey(false);
  }, [form]);

  // Filter data based on search text
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      key: "sno",
      className: 'blue-background-column', 
      width: 50, 
    },
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
      align: 'center',
      sorter: (a, b) => a.stoneCode.localeCompare(b.stoneCode),
    },
    {
      title: "Print on Billing",
      dataIndex: "printOnBilling",
      key: "printOnBilling",
      align: 'center',

      render: (printOnBilling) => <Checkbox checked={printOnBilling} disabled />,
    },
    {
      title: "Dia Value Fix",
      dataIndex: "diamondValueFix",
      key: "diamondValueFix",
      align: 'center',

      render: (diamondValueFix) => <Checkbox checked={diamondValueFix} disabled />,
    },
    {
      title: "Category",
      dataIndex: "category",
      align: 'center',

      key: "category",
    },
    {
      title: "Effect on Net Wt Diamonds",
      dataIndex: "netWeightDiamonds",
      key: "netWeightDiamonds",
      align: 'center',

      render: (netWeightDiamonds) => <Checkbox checked={netWeightDiamonds} disabled />,
    },
    {
      title: "Effect on Net Wt Others",
      dataIndex: "netWeightOthers",
      key: "netWeightOthers",
      align: 'center',

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
            onClick={() => handleEdit(record)}  // This should call the handleEdit function
            disabled={editingKey === record.key}  // Disable if already in editing mode
          />

          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.stoneItem)} // Pass the stoneItem (itemName) for deletion
          >
            <Button type="link" icon={<DeleteOutlined />} danger />
          </Popconfirm>


        </Space>
      ),
    },
  ];


  // Handle enter key press to focus on the next input field
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
    <div style={{ backgroundColor: "#f4f6f9" }}>
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
          onFinish={editingKey ? handleSave : handleAdd}  // This decides whether to call handleSave or handleAdd
        >

          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <Form.Item
                name="stoneItem"
                label="Stone Item"
                rules={[
                  { required: true, message: "Stone Item is required" },
                  ({ getFieldValue }) => ({
                    validator: async (_, value) => {
                      if (!value) {
                        return Promise.resolve(); // No need to validate if value is empty
                      }
                      const exists = await handleStoneItemCheck(value);
                      if (exists) {
                        return Promise.reject(new Error("Stone Item already exists!"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
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

      <div style={{marginLeft:"5px", float: "right", marginBottom: "10px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredData.length}
          showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}

          showSizeChanger
          pageSizeOptions={['10', '20', '50', '100']}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          style={{ marginBottom: "10px" }}
        />
      </div>

      <div style={{ float: "right", marginBottom: "10px" }}>
        <Input.Search
          placeholder="Search"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </div>

      <TableHeaderStyles>
        <Table
          columns={columns}
          dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          rowKey="key"
          size="small"
          pagination={false}
          style={{
            background: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        />
      </TableHeaderStyles>
    </div>
  );
};

export default StoneItemMaster;
