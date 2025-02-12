import React, { useState, useEffect, useRef } from "react";
import { Table, Space, Button, Breadcrumb, Card, message, Popconfirm, Form, Input, Select, Row, Col, Checkbox, Pagination } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const LotCreation = () => {
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [form] = Form.useForm();
    const [mainProductOptions, setMainProductOptions] = useState([]);
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [prefixOptions, setPrefixOptions] = useState([]);
    const [filteredPrefixOptions, setFilteredPrefixOptions] = useState([]);
    const [counterOptions, setCounterOptions] = useState([]);
    const [lotNumber, setLotNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const baseURL = `${CREATE_jwel}`+"/api/Erp/";

    const mainProductRef = useRef(null);
    const piecesRef = useRef(null);
    const weightRef = useRef(null);
    const dealerRef = useRef(null);
    const manufacturerRef = useRef(null);
    const prefixRef = useRef(null);
    const counterRef = useRef(null);

    useEffect(() => {
        fetchData();
        fetchLotNumber();
        fetchOptions();
    }, []);

    useEffect(() => {
        if (currentRecord) {
            form.setFieldsValue(currentRecord);
        }
    }, [currentRecord, form]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${baseURL}GetLotCreationList`);
            if (response.data) {
                const formattedData = response.data.map((item, index) => ({
                    ...item,
                    key: item.lotno,
                    sno: index + 1,
                }));
                setData(formattedData);
            } else {
                message.error("Failed to fetch lot data.");
            }
        } catch (error) {
            message.error("Error fetching lot data.");
        }
    };

    const fetchLotNumber = async () => {
        try {
            const response = await axios.get(`${baseURL}LotCreationMaxNumber`);
            let lotNo = response.data?.[0]?.LOTMAXNUMBER ?? 1;
            if (lotNo === null || lotNo === 1) {
                lotNo = 2;
            } else {
                lotNo += 1;
            }
            setLotNumber(lotNo);
            form.setFieldsValue({ lotno: lotNo });
        } catch (error) {
            message.error("Failed to fetch Lot Number.");
            setLotNumber(2);
            form.setFieldsValue({ lotno: 2 });
        }
    };

    const fetchOptions = async () => {
        const fetchData = async (url, setState) => {
            try {
                const response = await axios.get(url);
                setState(response.data);
            } catch (error) {
                message.error(`Failed to fetch data from ${url}`);
            }
        };
    
        fetchData(`${CREATE_jwel}`+"/api/Master/MasterMainProductList", setMainProductOptions);
        fetchData(`${CREATE_jwel}`+"/api/Master/MasterManufacturerMasterList", setManufacturerOptions);
        fetchData(`${CREATE_jwel}`+"/api/Master/MasterPrefixMasterList", setPrefixOptions);
        fetchData(`${CREATE_jwel}`+"/api/Master/MasterCounterMasterList", setCounterOptions);
    };

    const handleMainProductChange = (value) => {
        form.setFieldsValue({ prefix: undefined }); // Reset prefix field
        const filteredPrefixes = prefixOptions.filter(prefix => prefix.MAINPRODUCT === value);
        setFilteredPrefixOptions(filteredPrefixes);  // Set the filtered options
    
        // Check if the current prefix is in the filtered options
        const currentPrefix = form.getFieldValue('prefix');
        if (currentPrefix && !filteredPrefixes.some(prefix => prefix.Prefix === currentPrefix)) {
            form.setFieldsValue({ prefix: undefined });
        }
    };

    const handleAddOrUpdate = async (values) => {
        if (editingKey) {
            try {
                await axios.post(`${baseURL}LotCreationDelete`, null, {
                    params: { lotNumber: editingKey },
                });

                const response = await axios.post(`${baseURL}LotCreationInsert`, {
                    mname: values.mainProduct,
                    lotno: editingKey,
                    pieces: values.pieces,
                    weight: values.weight,
                    dealerName: values.dealer,
                    manufacturer: values.manufacturer,
                    balpieces: values.pieces,
                    balweight: values.weight,
                    prefix: values.prefix,
                    counter: values.counter,
                    lotdate: new Date().toISOString().split('T')[0],
                    lottime: new Date().toLocaleTimeString(),
                    approvals: values.approvals,
                    touch: values.touch || 0,
                    wastage: values.wastage || 0,
                    suspence: values.suspence || false,
                    purecost: values.purecost || 0,
                    mcper: values.mcper || 0,
                    mcamt: values.mcamt || 0,
                    cosT_CATEGORY: "JEWELRY",
                    cloud_upload: true,
                });

                if (response.data === true) {
                    setData(data.map((item) => (item.lotno === editingKey ? values : item)));
                    message.success("Record updated successfully!");
                    fetchData();
                    fetchLotNumber();
                    form.resetFields();
                } else {
                    message.error("Failed to update lot.");
                }
            } catch (error) {
                message.error("Error occurred while updating the lot.");
            }
        } else {
            values.lotno = lotNumber;

            try {
                await axios.post(`${baseURL}LotCreationDelete`, null, {
                    params: { lotNumber: values.lotno },
                });

                const response = await axios.post(`${baseURL}LotCreationInsert`, {
                    mname: values.mainProduct,
                    lotno: values.lotno,
                    pieces: values.pieces,
                    weight: values.weight,
                    dealerName: values.dealer,
                    manufacturer: values.manufacturer,
                    balpieces: values.pieces,
                    balweight: values.weight,
                    prefix: values.prefix,
                    counter: values.counter,
                    lotdate: new Date().toISOString().split('T')[0],
                    lottime: new Date().toLocaleTimeString(),
                    approvals: values.approvals,
                    touch: values.touch || 0,
                    wastage: values.wastage || 0,
                    suspence: values.suspence || false,
                    purecost: values.purecost || 0,
                    mcper: values.mcper || 0,
                    mcamt: values.mcamt || 0,
                    cosT_CATEGORY: "JEWELRY",
                    cloud_upload: true,
                });

                if (response.data === true) {
                    setData([...data, values]);
                    message.success("Lot added successfully!");
                    fetchData();
                    fetchLotNumber();
                    form.resetFields();
                } else {
                    message.error("Failed to add lot.");
                }
            } catch (error) {
                message.error("Error occurred while adding the lot.");
            }
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
        form.setFieldsValue({
            ...record,
            mainProduct: record.mname,
            dealer: record.dealerName,
            approvals: record.Approvals,
        });
    };

    const handleCancel = () => {
        setEditingKey(null);
        setCurrentRecord(null);
        form.resetFields();
        form.setFieldsValue({ lotno: lotNumber });
    };

    const handleEnterPress = (e, nextFieldRef) => {
        e.preventDefault();
        if (nextFieldRef.current) {
            nextFieldRef.current.focus();
        }
    };

    const columns = [
        {
            title: "S.No",
            dataIndex: "sno",
            key: "sno",
            width: 50,
            className: 'blue-background-column',
        },
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
            title: "Weight",
            dataIndex: "weight",
            key: "weight",
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

    const filteredData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div style={{ backgroundColor: "#f4f6f9" }}>
            <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                <Breadcrumb.Item>Masters</Breadcrumb.Item>
                <Breadcrumb.Item>Lot Creation</Breadcrumb.Item>
            </Breadcrumb>

            <Card title={editingKey ? "Edit Lot" : "Add Lot"} style={{ marginBottom: "20px" }}>
                <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={8}>
                            <Card style={{ backgroundColor: "#249ac1", color: "#fff" }}>
                                <Form.Item
                                    name="lotno"
                                    label={<span style={{ color: "#fff" }}>Lot No.</span>}
                                    labelCol={{ span: 10 }}
                                    wrapperCol={{ span: 18 }}
                                    style={{ display: 'flex', alignItems: 'center' }}
                                >
                                    <Input
                                        disabled
                                        style={{
                                            width: '100%',
                                            borderRadius: '4px',
                                            height: '40px',
                                            paddingLeft: '10px',
                                            boxSizing: 'border-box',
                                            color: "#fff"
                                        }}
                                    />
                                </Form.Item>
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Card style={{ backgroundColor: "#249ac1" }}>
                                <Form.Item name="approvals" valuePropName="checked">
                                    <Checkbox><span style={{ color: "white" }}>Approval</span></Checkbox>
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="mainProduct" label="Main Product" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Main Product"
                                    ref={mainProductRef}
                                    onChange={handleMainProductChange}
                                    onPressEnter={(e) => handleEnterPress(e, piecesRef)}
                                >
                                    {mainProductOptions.map((product, index) => (
                                        <Option key={index} value={product.MNAME}>{product.MNAME}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="pieces" label="Pieces" rules={[{ required: true }]}>
                                <Input
                                    placeholder="Enter Pieces"
                                    ref={piecesRef}
                                    onPressEnter={(e) => handleEnterPress(e, weightRef)}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="weight" label="Weight" rules={[{ required: true }]}>
                                <Input
                                    placeholder="Enter Weight"
                                    ref={weightRef}
                                    onPressEnter={(e) => handleEnterPress(e, dealerRef)}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="dealer" label="Dealer" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Dealer"
                                    ref={dealerRef}
                                    onPressEnter={(e) => handleEnterPress(e, manufacturerRef)}
                                >
                                    <Option value="dealer1">Dealer 1</Option>
                                    <Option value="dealer2">Dealer 2</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="manufacturer" label="Manufacturer" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Manufacturer"
                                    ref={manufacturerRef}
                                    onPressEnter={(e) => handleEnterPress(e, prefixRef)}
                                >
                                    {manufacturerOptions.map((manufacturer, index) => (
                                        <Option key={index} value={manufacturer.MANUFACTURER}>{manufacturer.MANUFACTURER}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="prefix" label="Prefix" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Prefix"
                                    ref={prefixRef}
                                    onPressEnter={(e) => handleEnterPress(e, counterRef)}
                                >
                                    {filteredPrefixOptions.map((prefix, index) => (
                                        <Option key={index} value={prefix.Prefix}>{prefix.Prefix}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={[16, 16]} style={{ marginTop: '10px' }}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item name="counter" label="Counter" rules={[{ required: true }]}>
                                <Select
                                    placeholder="Select Counter"
                                    ref={counterRef}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // Prevent default behavior
                                            form.submit(); // Submit the form
                                        }
                                    }}
                                >
                                    {counterOptions.map((counter, index) => (
                                        <Option key={index} value={counter.COUNTERNAME}>{counter.COUNTERNAME}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <div style={{ textAlign: "right", marginTop: "16px" }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: "8px" }}>
                            Submit
                        </Button>
                        <Button onClick={handleCancel}>Cancel</Button>
                    </div>
                </Form>
            </Card>

            <div style={{ float: "right", marginBottom: "10px", marginLeft: "5px" }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={data.length}
                    showSizeChanger
                    pageSizeOptions={['10', '20', '50', '100']}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    style={{ marginBottom: "10px" }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredData}
                size="small"
                rowKey="lotno"
                pagination={false}
            />
        </div>
    );
};

export default LotCreation;
