import React, { useState, useEffect } from "react";
import { Input, Button, Table, Space, Popconfirm, Row, Col, message, Breadcrumb } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const DaimondRate = () => {
    // const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Wholesal/GetDataFromGivenTableNameWithWhere?tableName=TAG_GENERATION&where=TAGNO%3D9904",
                {
                    headers: {
                        tenantName: "fd7V0CCCS3URhSfa/g6drA=="
                    }
                }
            );
            console.log(response.data); // Log the response data to the console
            setData(response.data.map((item, index) => ({ key: index, ...item })));
        } catch (error) {
            message.error("Failed to fetch data");
        }
    };
    
    const handleDelete = (key) => {
        setData(data.filter((item) => item.key !== key));
        message.success("Record deleted successfully!");
    };

    const filteredData = data.filter((item) =>
        Object.values(item).join(" ").toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        { title: "Serial No", dataIndex: "SERIALNO", key: "SERIALNO" },
        { title: "Slip No", dataIndex: "SLIPNO", key: "SLIPNO" },
        { title: "Worker Name", dataIndex: "workername", key: "workername" },
        { title: "Tag No", dataIndex: "TAGNO", key: "TAGNO" },
        { title: "Product Name", dataIndex: "PRODNAME", key: "PRODNAME" },
        { title: "Gross Weight", dataIndex: "GWT", key: "GWT" },
        { title: "Net Weight", dataIndex: "NWT", key: "NWT" },
        { title: "Total Pieces", dataIndex: "TOTPCS", key: "TOTPCS" },
        { title: "Total Gross Weight", dataIndex: "TOTGWT", key: "TOTGWT" },
        { title: "Total Stone Weight", dataIndex: "TOTSTONEWT", key: "TOTSTONEWT" },
        { title: "Total Net Weight", dataIndex: "TOTNWT", key: "TOTNWT" },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
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

    return (
        <div style={{ padding: "5px", backgroundColor: "#f4f6f9" }}>
            <Row justify="start" style={{ marginBottom: "16px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>DaimondRate</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col xs={24} sm={16} lg={12}>
                    <Input.Search
                        placeholder="Search records"
                        style={{ marginBottom: "16px", width: "100%", borderRadius: "4px" }}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredData}
                rowKey="key"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 1000 }}
                style={{ background: "#fff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}
            />
        </div>
    );
};

export default DaimondRate;