import React, { useState, useEffect } from "react";
import { Table, Space, Button, Breadcrumb, Card, message, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import LotForm from "./LotForm";
import axios from "axios";

const LotCreation = () => {
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [currentRecord, setCurrentRecord] = useState(null);

    const baseURL = "http://www.jewelerp.timeserasoftware.in/api/Erp/";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}GetLotCreationList`);
            if (response.data) {
                setData(response.data);
            } else {
                message.error("Failed to fetch lot data.");
            }
        } catch (error) {
            message.error("Error fetching lot data.");
        }
    };

    const handleAddOrUpdate = (newRecord) => {
        if (editingKey) {
            setData(data.map((item) => (item.lotno === newRecord.lotno ? newRecord : item)));
            message.success("Record updated successfully!");
        } else {
            setData([...data, newRecord]);
            message.success("Record added successfully!");
        }
        setEditingKey(null);
        setCurrentRecord(null);
    };

    const handleDelete = async (lotno) => {
        try {
            const response = await axios.post(`${baseURL}LotCreationDelete`, null, {
                params: { lotNumber: lotno },
            });

            if (response.data === true) {
                setData(data.filter((item) => item.lotno !== lotno));
                message.success("Record deleted successfully!");
            } else {
                message.error("Failed to delete the record.");
            }
        } catch (error) {
            message.error("Error occurred while deleting the record.");
        }
    };

    const handleEdit = (record) => {
        setEditingKey(record.lotno);
        setCurrentRecord(record);
    };

    const handleCancel = () => {
        setEditingKey(null);
        setCurrentRecord(null);
    };

    const columns = [
        {
            title: "Lot No",
            dataIndex: "lotno",
            key: "lotno",
        },
        {
            title: "Main Product",
            dataIndex: "mname",
            key: "mname",
        },
        {
            title: "Prefix",
            dataIndex: "prefix",
            key: "prefix",
        },
        {
            title: "Counter",
            dataIndex: "counter",
            key: "counter",
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={() => handleDelete(record.lotno)}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ backgroundColor: "#f4f6f9" }}>
            <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                <Breadcrumb.Item>Masters</Breadcrumb.Item>
                <Breadcrumb.Item>Lot Creation</Breadcrumb.Item>
            </Breadcrumb>

            <Card title={editingKey ? "Edit Lot" : "Add Lot"} style={{ marginBottom: "20px" }}>
                <LotForm
                    onSubmit={handleAddOrUpdate}
                    onCancel={handleCancel}
                    initialValues={currentRecord}
                    editingKey={editingKey}
                />
            </Card>

            <Table
                columns={columns}
                dataSource={data}
                size="small"
                rowKey="lotno"
                pagination={{ pageSize: 5 }}
            />
        </div>
    );
};

export default LotCreation;
