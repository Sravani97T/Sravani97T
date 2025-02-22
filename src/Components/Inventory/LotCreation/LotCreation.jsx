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
    const [dealerOptions, setDealerOptions] = useState([]);

    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [prefixOptions, setPrefixOptions] = useState([]);
    const [filteredPrefixOptions, setFilteredPrefixOptions] = useState([]);
    const [counterOptions, setCounterOptions] = useState([]);
    const [lotNumber, setLotNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [selectedMainProduct, setSelectedMainProduct] = useState(null);
    const [mainProductInputValue, setMainProductInputValue] = useState("");
    const baseURL = "http://www.jewelerp.timeserasoftware.in/api/Erp/";

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

        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterMainProductList", setMainProductOptions);
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterManufacturerMasterList", setManufacturerOptions);
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList", setPrefixOptions);
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/MasterCounterMasterList", setCounterOptions);
        fetchData("http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhereandOrder?tableName=DEALER_MASTER&where=CUSTTYPE%3D%27DEALER%27&order=DEALERNAME", setDealerOptions);
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
    const handleMainProductKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // ✅ Prevents reopening dropdown

            const typedValue = mainProductInputValue?.trim();
            if (!typedValue) return;

            const matchedOption = mainProductOptions.find(
                (p) => p.MNAME?.toLowerCase() === typedValue.toLowerCase()
            );

            if (matchedOption) {
                setSelectedMainProduct(matchedOption.MNAME);
            } else {
                setSelectedMainProduct(typedValue); // ✅ Allows new entry if not in the list
            }

            setMainProductInputValue(""); // ✅ Clears input after Enter

            setTimeout(() => {
                if (prefixRef.current) {
                    prefixRef.current.focus(); // ✅ Moves focus to next field
                }
            }, 100);
        }
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
                        <Col span={24}>
                            <Card
                                style={{
                                    position: "relative",
                                    background: "linear-gradient(135deg, #040e56, #1a237e)",
                                    borderRadius: "8px",
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Background Circles */}
                                {/* Big Circles */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-40px",
                                        left: "-50px",
                                        width: "120px",
                                        height: "120px",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderRadius: "50%",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "-50px",
                                        right: "-60px",
                                        width: "140px",
                                        height: "140px",
                                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                                        borderRadius: "50%",
                                        border: "3px solid rgba(255, 255, 255, 0.2)",
                                    }}
                                />

                                {/* Medium Circles */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "50px",
                                        left: "40%",
                                        width: "80px",
                                        height: "80px",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderRadius: "50%",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "30px",
                                        left: "20%",
                                        width: "90px",
                                        height: "90px",
                                        backgroundColor: "rgba(255, 255, 255, 0.12)",
                                        borderRadius: "50%",
                                        border: "2px solid rgba(255, 255, 255, 0.2)",
                                    }}
                                />

                                {/* Small Circles */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "20%",
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                                        borderRadius: "50%",
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "80px",
                                        right: "10%",
                                        width: "50px",
                                        height: "50px",
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        borderRadius: "50%",
                                    }}
                                />

                                {/* Content */}
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 1 }}>
                                    <span style={{ color: "#fff", whiteSpace: "nowrap" }}>Lot No.</span>

                                    <Form.Item name="lotno" style={{ marginBottom: 0 }}>
                                        <Input
                                            disabled
                                            style={{
                                                width: "200px",
                                                borderRadius: "4px",
                                                height: "40px",
                                                paddingLeft: "10px",
                                                boxSizing: "border-box",
                                                color: "#000",
                                                backgroundColor: "#fff",
                                                border: "1px solid #d9d9d9",
                                                textAlign: "center",
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item name="approvals" valuePropName="checked" style={{ marginBottom: 0 }}>
                                        <Checkbox style={{ color: "white" }}>Approval</Checkbox>
                                    </Form.Item>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Col span={24}>
                        <Card
                            style={{
                                position: "relative",
                                background: "linear-gradient(135deg, rgb(108, 144, 179) 0%, rgb(182, 189, 180) 100%)",
                                borderRadius: "8px",
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden", // Ensures shapes stay inside
                            }}
                        >
                            {/* Background Shapes */}
                            {/* Large Circles */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-40px",
                                    left: "-50px",
                                    width: "120px",
                                    height: "120px",
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    borderRadius: "50%",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-50px",
                                    right: "-60px",
                                    width: "140px",
                                    height: "140px",
                                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                                    borderRadius: "50%",
                                    border: "3px solid rgba(255, 255, 255, 0.2)",
                                }}
                            />

                            {/* Medium Circles */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "50px",
                                    left: "30%",
                                    width: "80px",
                                    height: "80px",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderRadius: "50%",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "30px",
                                    left: "10%",
                                    width: "90px",
                                    height: "90px",
                                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                                    borderRadius: "50%",
                                    border: "2px solid rgba(255, 255, 255, 0.2)",
                                }}
                            />

                            {/* Small Circles */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "20%",
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                                    borderRadius: "50%",
                                }}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "80px",
                                    right: "5%",
                                    width: "50px",
                                    height: "50px",
                                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                                    borderRadius: "50%",
                                }}
                            />

                            {/* Content */}
                            <div style={{ width: "100%", color: "#fff", zIndex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Main Product</span>
                                    <Form.Item
                                        name="mainProduct"
                                        style={{ marginBottom: 0, width: '200px' }}
                                        rules={[{ required: true, message: 'Please select a main product!' }]}
                                    >
                                        <Select
                                            placeholder="Select Main Product"
                                            ref={mainProductRef}
                                            value={selectedMainProduct || mainProductInputValue} // Display the selected or typed value
                                            onChange={handleMainProductChange} // Update selected value
                                            onSearch={(value) => setMainProductInputValue(value)} // Capture user input for search
                                            onKeyDown={handleMainProductKeyDown} // Handle keyboard events like Enter key
                                            showSearch // Enables search functionality in dropdown
                                            optionFilterProp="children" // Filter based on option text
                                            filterOption={(input, option) =>
                                                option?.children?.toLowerCase().includes(input?.toLowerCase()) // Case-insensitive search
                                            }
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
          .ant-select-item-option-active {
            background-color: rgb(125, 248, 156) !important;
          }
        `}</style>
                                                </div>
                                            )}
                                        >
                                            {mainProductOptions.map((product, index) => (
                                                <Option key={index} value={product.MNAME}>
                                                    {product.MNAME}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>


                                </div>

                                {/* Pieces */}
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Pieces</span>
                                    <Form.Item name="pieces" style={{ marginBottom: 0, width: "200px" }} rules={[{ required: true }]}>
                                        <Input placeholder="Enter Pieces" ref={piecesRef} onPressEnter={(e) => handleEnterPress(e, weightRef)} />
                                    </Form.Item>
                                </div>

                                {/* Weight */}
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Weight</span>
                                    <Form.Item name="weight" style={{ marginBottom: 0, width: "200px" }} rules={[{ required: true }]}>
                                        <Input placeholder="Enter Weight" ref={weightRef} onPressEnter={(e) => handleEnterPress(e, dealerRef)} />
                                    </Form.Item>
                                </div>

                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Dealer</span>
                                    <Form.Item
                                        name="dealer"
                                        style={{ marginBottom: 0, width: "200px" }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            placeholder="Select Dealer"
                                            ref={dealerRef}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            onPressEnter={(e) => handleEnterPress(e, manufacturerRef)} // Focuses on the next field after pressing Enter
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
                                                        .ant-select-item-option-active {
                                                            background-color: rgb(125, 248, 156) !important;
                                                        }
                                                    `}</style>
                                                </div>
                                            )}
                                        >
                                            {dealerOptions.map((dealer, index) => (
                                                <Option key={index} value={dealer.Dealername}>
                                                    {dealer.Dealername}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                {/* Manufacturer */}
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Manufacturer</span>
                                    <Form.Item
                                        name="manufacturer"
                                        style={{ marginBottom: 0, width: "200px" }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            placeholder="Select Manufacturer"
                                            ref={manufacturerRef}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            onPressEnter={(e) => handleEnterPress(e, prefixRef)}
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
                    .ant-select-item-option-active {
                        background-color: rgb(125, 248, 156) !important;
                    }
                `}</style>
                                                </div>
                                            )}
                                        >
                                            {manufacturerOptions.length > 0 ? (
                                                manufacturerOptions.map((manufacturer, index) => (
                                                    <Option key={index} value={manufacturer.MANUFACTURER}>
                                                        {manufacturer.MANUFACTURER}
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option disabled>No Manufacturers available</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </div>

                                {/* Prefix */}
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Prefix</span>
                                    <Form.Item name="prefix" style={{ marginBottom: 0, width: "200px" }} rules={[{ required: true }]}>
                                        <Select
                                            placeholder="Select Prefix"
                                            ref={prefixRef}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            onPressEnter={(e) => handleEnterPress(e, counterRef)} // Focus on the next field after pressing Enter
                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
                    .ant-select-item-option-active {
                        background-color: rgb(125, 248, 156) !important;
                    }
                `}</style>
                                                </div>
                                            )}
                                        >
                                            {filteredPrefixOptions.length > 0 ? (
                                                filteredPrefixOptions.map((prefix, index) => (
                                                    <Option key={index} value={prefix.Prefix}>{prefix.Prefix}</Option>
                                                ))
                                            ) : (
                                                <Option disabled>No Prefix Available</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </div>

                                {/* Counter */}
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                                    <span style={{ width: "120px", marginRight: "8px" }}>Counter</span>
                                    <Form.Item
                                        name="counter"
                                        style={{ marginBottom: 0, width: "200px" }}
                                        rules={[{ required: true }]}
                                    >
                                        <Select
                                            placeholder="Select Counter"
                                            ref={counterRef}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }

                                            dropdownRender={(menu) => (
                                                <div>
                                                    {menu}
                                                    <style jsx>{`
                    .ant-select-item-option-active {
                        background-color: rgb(125, 248, 156) !important;
                    }
                `}</style>
                                                </div>
                                            )}
                                        >
                                            {counterOptions.length > 0 ? (
                                                counterOptions.map((counter, index) => (
                                                    <Option key={index} value={counter.COUNTERNAME}>
                                                        {counter.COUNTERNAME}
                                                    </Option>
                                                ))
                                            ) : (
                                                <Option disabled>No Counters available</Option>
                                            )}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                        </Card>
                    </Col>

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
