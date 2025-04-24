import React, { useState, useEffect, useCallback } from "react";
import {
    Form,
    Input,
    Button,
    Select,
    Radio,
    DatePicker,
    Row,
    Col,
    Card,
    Table,
    Space,
    Popconfirm,
    message,
    Breadcrumb,
    Pagination,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from 'moment';

const { Option } = Select;

const SchemeMember = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [collectionPoint, setCollectionPoint] = useState("Shop");
    const [oldSchemeMember, setOldSchemeMember] = useState({}); // Store old values for deletion

    const [schemeTypes, setSchemeTypes] = useState([]);
    const [schemeGroups, setSchemeGroups] = useState([]);
    const [schemeNames, setSchemeNames] = useState([]);
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=SCHEME_MEMBER"
            );

            const mappedData = response.data.map((item, index) => ({
                key: index + 1,
                ...item,
            }));

            const types = [...new Set(mappedData.map((item) => item.SchemeType).filter(Boolean))];
            const groups = [...new Set(mappedData.map((item) => item.SchemeGroup).filter(Boolean))];
            const names = [...new Set(mappedData.map((item) => item.SchemeName).filter(Boolean))];
            const cityList = [...new Set(mappedData.map((item) => item.area).filter(Boolean))];
            const districtList = [...new Set(mappedData.map((item) => item.District).filter(Boolean))];

            setSchemeTypes(types);
            setSchemeGroups(groups);
            setSchemeNames(names);
            setCities(cityList);
            setDistricts(districtList);
            setData(mappedData);
        } catch (error) {
            message.error("Failed to fetch scheme member data.");
        }
    };


    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (values) => {
        if (loading) return;

        setLoading(true);
        try {
            const payload = {
                schemeType: values.schemeType,
                schemeGroup: values.schemeGroup,
                schemeName: values.schemeName,
                schemeMember: values.memberName,
                add1: values.address,
                add2: "", // You can add fields or leave as empty string if not collected
                add3: "",
                add4: "",
                area: values.city || "",
                pincode: values.pinCode,
                email: values.email || "",
                phone: values.mobile1,
                cardNo: values.cardNo,
                schemeAmount: 0,
                schemeDuration: 0,
                bonusAmount: 0,
                schemeValue: 0,
                recentPaidDate: new Date().toISOString(),
                schemeEnding: false,
                schemeDropping: false,
                dropping_Cause: "",
                schemeBDAmt: 0,
                schemeMode: "",
                bonusMonth: 0,
                giftVoucher: 0,
                gender: values.gender,
                state: values.state,
                district: values.district,
                mobile1: values.mobile1,
                mobile2: values.mobile2 || "",
                fax: "",
                dob: new Date().toISOString(),
                annversary: new Date().toISOString(),
                schemeJoinDate: values.joinDate?.toISOString() || new Date().toISOString(),
                webSite: "",
                entryDate: new Date().toISOString(),
                entryTime: new Date().toISOString(),
                uName: "Admin",
                schemeEndDate: new Date().toISOString(),
                billNo: 0,
                billDate: new Date().toISOString(),
                jewelType: "",
                saleCode: "",
                giftVocher_Status: false,
                giftVocher_BillNo: 0,
                giftVocher_BillDate: new Date().toISOString(),
                giftVocher_JewelType: "",
                giftVocher_SaleCode: 0,
                nominee: "",
                nmobileno: "",
                empname: "",
                commamt: 0,
                recno: 0,
                recdate: new Date().toISOString(),
                recamt: 0,
                collecT_POINT: values.collectionPoint,
                incharge: "",
                schemecompletion: false,
                duemonths: 0,
                cno: 0,
                cloud_upload: true,
                statecode: "",
                station: ""
            };

            const response = await axios.post(
                "http://www.jewelerp.timeserasoftware.in/api/Scheme/SchemeMemberInsert",
                payload
            );

            if (response.data) {
                message.success("Scheme Member added successfully!");
                fetchData();
                form.resetFields();
            } else {
                message.error("Failed to add Scheme Member.");
            }
        } catch (error) {
            console.error("Error adding Scheme Member:", error);
            message.error("An error occurred while adding the Scheme Member.");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (record) => {
        try {
            const response = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=SCHEME_MEMBER&where=CARDNO%3D%27${encodeURIComponent(
                    record.CardNo
                )}%27`
            );

            if (response.data === true) {
                setData(data.filter((item) => item.key !== record.key));
                message.success("Scheme Member deleted successfully!");
            } else {
                message.error("Failed to delete Scheme Member.");
            }
        } catch (error) {
            console.error(error);
            message.error("An error occurred while deleting the Scheme Member.");
        }
    };

    const handleEdit = (record) => {
        setOldSchemeMember({
            schemeType: record.SchemeType,
            schemeGroup: record.SchemeGroup,
            schemeName: record.SchemeName,
            cardNo: record.CardNo,
        }); // Store old values for deletion
        setEditingKey(record.key);
        form.setFieldsValue({
            schemeType: record.SchemeType,
            schemeGroup: record.SchemeGroup,
            schemeName: record.SchemeName,
            memberName: record.SchemeMember,
            cardNo: record.CardNo,
            gender: record.Gender,
            city: record.area,
            address: record.add1,
            pinCode: record.pincode,
            state: record.State,
            district: record.District,
            mobile1: record.Mobile1,
            mobile2: record.Mobile2,
            email: record.email,
            joinDate: record.SchemeJoinDate ? moment(record.schemeJoinDate) : null,
        collectionPoint: record.COLLECT_POINT === "Shop" || record.COLLECT_POINT === "Home" ? record.COLLECT_POINT : "Shop", // Default to "Shop" if value is invalid
        });
        window.scrollTo(0, 0);
    };
    const handleSave = async (values) => {
        if (loading) return;

        setLoading(true);
        try {
            // Delete the old Scheme Member
            const deleteResponse = await axios.post(
                `http://www.jewelerp.timeserasoftware.in/api/Master/DeleteDataFromGivenTableNameWithWhere?tableName=SCHEME_MEMBER&where=CARDNO%3D%27${encodeURIComponent(
                    oldSchemeMember.cardNo
                )}%27`
            );

            if (deleteResponse.data === true) {
                // Insert the updated Scheme Member
                const payload = {
                    schemeType: values.schemeType,
                    schemeGroup: values.schemeGroup,
                    schemeName: values.schemeName,
                    schemeMember: values.memberName,
                    add1: values.address,
                    add2: "", // You can add fields or leave as empty string if not collected
                    add3: "",
                    add4: "",
                    area: values.city || "",
                    pincode: values.pinCode,
                    email: values.email || "",
                    phone: values.mobile1,
                    cardNo: values.cardNo,
                    schemeAmount: 0,
                    schemeDuration: 0,
                    bonusAmount: 0,
                    schemeValue: 0,
                    recentPaidDate: new Date().toISOString(),
                    schemeEnding: false,
                    schemeDropping: false,
                    dropping_Cause: "",
                    schemeBDAmt: 0,
                    schemeMode: "",
                    bonusMonth: 0,
                    giftVoucher: 0,
                    gender: values.gender,
                    state: values.state,
                    district: values.district,
                    mobile1: values.mobile1,
                    mobile2: values.mobile2 || "",
                    fax: "",
                    dob: new Date().toISOString(),
                    annversary: new Date().toISOString(),
                    schemeJoinDate: values.joinDate?.toISOString() || new Date().toISOString(),
                    webSite: "",
                    entryDate: new Date().toISOString(),
                    entryTime: new Date().toISOString(),
                    uName: "Admin",
                    schemeEndDate: new Date().toISOString(),
                    billNo: 0,
                    billDate: new Date().toISOString(),
                    jewelType: "",
                    saleCode: "",
                    giftVocher_Status: false,
                    giftVocher_BillNo: 0,
                    giftVocher_BillDate: new Date().toISOString(),
                    giftVocher_JewelType: "",
                    giftVocher_SaleCode: 0,
                    nominee: "",
                    nmobileno: "",
                    empname: "",
                    commamt: 0,
                    recno: 0,
                    recdate: new Date().toISOString(),
                    recamt: 0,
                    collecT_POINT: values.collectionPoint,
                    incharge: "",
                    schemecompletion: false,
                    duemonths: 0,
                    cno: 0,
                    cloud_upload: true,
                    statecode: "",
                    station: ""
                };

                const insertResponse = await axios.post(
                    "http://www.jewelerp.timeserasoftware.in/api/Scheme/SchemeMemberInsert",
                    payload
                );

                if (insertResponse.data) {
                    message.success("Scheme Member updated successfully!");
                    fetchData();
                    setEditingKey(null);
                    form.resetFields();
                } else {
                    message.error("Failed to update Scheme Member.");
                }
            } else {
                message.error("Failed to delete the old Scheme Member.");
            }
        } catch (error) {
            console.error("Error saving Scheme Member:", error);
            message.error("An error occurred while saving the Scheme Member.");
        } finally {
            setLoading(false);
        }
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
            title: "S.No",
            dataIndex: "sno",
            key: "sno",
            width: 50,
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: "Scheme Group",
            dataIndex: "SchemeGroup",
            key: "SchemeGroup",
        },
        {
            title: "Scheme Name",
            dataIndex: "SchemeName",
            key: "SchemeName",
        },
        {
            title: "Scheme Member",
            dataIndex: "SchemeMember",
            key: "SchemeMember",
        },
        {
            title: "Mobile No. 1",
            dataIndex: "Mobile1",
            key: "Mobile1",
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
                        onConfirm={() => handleDelete(record)}
                    >
                        <Button type="link" icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const formRefs = {
        schemeType: React.createRef(),
        schemeGroup: React.createRef(),
        schemeName: React.createRef(),
        memberName: React.createRef(),
        cardNo: React.createRef(),
        gender: React.createRef(),
        city: React.createRef(),
        address: React.createRef(),
        pinCode: React.createRef(),
        state: React.createRef(),
        district: React.createRef(),
        mobile1: React.createRef(),
        mobile2: React.createRef(),
        email: React.createRef(),
        joinDate: React.createRef(),
        collectionPoint: React.createRef(),
    };

    const handleEnterPress = (e, currentField) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const fields = Object.keys(formRefs);
            const currentIndex = fields.indexOf(currentField);
            if (currentIndex !== -1) {
                if (currentIndex < fields.length - 1) {
                    const nextField = fields[currentIndex + 1];
                    formRefs[nextField].current.focus();
                } else {
                    if (editingKey) {
                        form.submit(); // Save the form when the last field is reached in edit mode
                    } else {
                        form.submit(); // Submit the form when the last field is reached in add mode
                    }
                }
            }
        }
    };

    return (
        <div style={{ backgroundColor: "#f4f6f9", }}>
            <Row justify="start" style={{ marginBottom: "10px" }}>
                <Col>
                    <Breadcrumb style={{ fontSize: "16px", fontWeight: "500", color: "#0C1154" }}>
                        <Breadcrumb.Item>Masters</Breadcrumb.Item>
                        <Breadcrumb.Item>Scheme Member</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
            </Row>

            <Card
                title={editingKey ? "Edit Scheme Member" : "Add Scheme Member"}
                bordered={false}
                style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
            >
                <Form form={form} layout="vertical" onFinish={editingKey ? handleSave : handleAdd}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Type"
                                name="schemeType"
                                rules={[{ required: true, message: "Scheme Type is required" }]}
                            >
                                <Select
                                    placeholder="Select Scheme Type"
                                    showSearch
                                    ref={formRefs.schemeType}
                                    onKeyDown={(e) => handleEnterPress(e, "schemeType")}
                                >
                                    {schemeTypes.map((type) => (
                                        <Option key={type} value={type}>{type}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Group"
                                name="schemeGroup"
                                rules={[{ required: true, message: "Scheme Group is required" }]}
                            >
                                <Select
                                    placeholder="Select Scheme Group"
                                    showSearch
                                    ref={formRefs.schemeGroup}
                                    onKeyDown={(e) => handleEnterPress(e, "schemeGroup")}
                                >
                                    {schemeGroups.map((group) => (
                                        <Option key={group} value={group}>{group}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Name"
                                name="schemeName"
                                rules={[{ required: true, message: "Scheme Name is required" }]}
                            >
                                <Select
                                    placeholder="Select Scheme Name"
                                    showSearch
                                    ref={formRefs.schemeName}
                                    onKeyDown={(e) => handleEnterPress(e, "schemeName")}
                                >
                                    {schemeNames.map((name) => (
                                        <Option key={name} value={name}>{name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Member Name"
                                name="memberName"
                                rules={[{ required: true, message: "Member Name is required" }]}
                            >
                                <Input
                                    placeholder="Enter Member Name"
                                    ref={formRefs.memberName}
                                    onKeyDown={(e) => handleEnterPress(e, "memberName")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Card No"
                                name="cardNo"
                                rules={[{ required: true, message: "Card No is required" }]}
                            >
                                <Input
                                    style={{ fontWeight: "bold", color: "red" }}
                                    ref={formRefs.cardNo}
                                    onKeyDown={(e) => handleEnterPress(e, "cardNo")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Gender"
                                name="gender"
                                rules={[{ required: true, message: "Gender is required" }]}
                            >
                                <Radio.Group
                                    ref={formRefs.gender}
                                    onKeyDown={(e) => handleEnterPress(e, "gender")}
                                >
                                    <Radio value="Male">Male</Radio>
                                    <Radio value="Female">Female</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[{ required: true, message: "City is required" }]}
                            >
                                <Select
                                    placeholder="Select City"
                                    showSearch
                                    ref={formRefs.city}
                                    onKeyDown={(e) => handleEnterPress(e, "city")}
                                >
                                    {cities.map((city) => (
                                        <Option key={city} value={city}>{city}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Address"
                                name="address"
                                rules={[{ required: true, message: "Address is required" }]}
                            >
                                <Input.TextArea
                                    rows={1}
                                    placeholder="Enter Address"
                                    ref={formRefs.address}
                                    onKeyDown={(e) => handleEnterPress(e, "address")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Pin Code"
                                name="pinCode"
                                rules={[{ required: true, message: "Pin Code is required" }]}
                            >
                                <Input
                                    placeholder="Enter Pin Code"
                                    ref={formRefs.pinCode}
                                    onKeyDown={(e) => handleEnterPress(e, "pinCode")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="State"
                                name="state"
                                rules={[{ required: true, message: "State is required" }]}
                            >
                                <Input
                                    placeholder="Enter State"
                                    ref={formRefs.state}
                                    onKeyDown={(e) => handleEnterPress(e, "state")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="District"
                                name="district"
                            >
                                <Select
                                    placeholder="Select District"
                                    showSearch
                                    ref={formRefs.district}
                                    onKeyDown={(e) => handleEnterPress(e, "district")}
                                >
                                    {districts.map((district) => (
                                        <Option key={district} value={district}>{district}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Mobile No. 1"
                                name="mobile1"
                                rules={[{ required: true, message: "Mobile No. 1 is required" }]}
                            >
                                <Input
                                    placeholder="Enter Mobile No. 1"
                                    ref={formRefs.mobile1}
                                    onKeyDown={(e) => handleEnterPress(e, "mobile1")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Mobile No. 2"
                                name="mobile2"
                            >
                                <Input
                                    placeholder="Enter Mobile No. 2"
                                    ref={formRefs.mobile2}
                                    onKeyDown={(e) => handleEnterPress(e, "mobile2")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Email"
                                name="email"
                                rules={[{ type: "email", message: "Enter a valid email" }]}
                            >
                                <Input
                                    placeholder="Enter Email"
                                    ref={formRefs.email}
                                    onKeyDown={(e) => handleEnterPress(e, "email")}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Scheme Join Date"
                                name="joinDate"
                                rules={[{ required: true, message: "Scheme Join Date is required" }]}
                            >
                                <DatePicker
                                    format="DD-MMM-YYYY"
                                    style={{ width: "100%" }}
                                    ref={formRefs.joinDate}
                                    onKeyDown={(e) => handleEnterPress(e, "joinDate")}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} lg={8}>
                            <Form.Item
                                label="Collection Point"
                                name="collectionPoint"
                                rules={[{ required: true, message: "Collection Point is required" }]}
                            >
                                <Radio.Group
                                    onChange={(e) => setCollectionPoint(e.target.value)}
                                    value={collectionPoint}
                                    ref={formRefs.collectionPoint}
                                    onKeyDown={(e) => handleEnterPress(e, "collectionPoint")}
                                >
                                    <Radio value="Shop">Shop</Radio>
                                    <Radio value="Home">Home</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button htmlType="submit" type="primary">
                                {editingKey ? "Save" : "Submit"}
                            </Button>
                        </Col>
                        <Col>
                            <Button htmlType="button" onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <div style={{ marginLeft: "5px", float: "right", marginBottom: "10px" }}>
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredData.length}
                    showSizeChanger
                    pageSizeOptions={["10", "20", "50", "100"]}
                    onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                />
            </div>

            <div style={{ float: "right", marginBottom: "10px" }}>
                <Input.Search
                    placeholder="Search"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                />
            </div>

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
        </div>
    );
};

export default SchemeMember;