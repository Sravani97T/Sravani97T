import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Input, Button, Row, Col, Table, Card, Typography, Select, message,Form, Popconfirm ,Popover,Space,Spin} from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../../Config/Config";

import { DeleteOutlined ,InfoCircleOutlined} from "@ant-design/icons";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
const { Text } = Typography;
const { Option } = Select;

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));

const SchemeDetails = () => {
    const [cardNo, setCardNo] = useState("");
    const [schemeData, setSchemeData] = useState(null);
    const [installmentNo, setInstallmentNo] = useState(1); // Default to 1
    const [paymentData, setPaymentData] = useState([]);
    const [payModes, setPayModes] = useState([]);
    const [accountNumbers, setAccountNumbers] = useState([]);
    const paymentModes = ["UPI", "ONLINE", "CARD", "CHEQUE", "CASH"];
    const [loading, setLoading] = useState(false);
    const [tableData1, setTableData1] = useState([]);

    const [selectedPaymentMode, setSelectedPaymentMode] = useState(null);
    const [selectedPayMode, setSelectedPayMode] = useState(null);
    // Input Refs for Keyboard Navigation
    const payModeRef = useRef(null);
    const accountRef = useRef(null);
    const descriptionRef = useRef(null);
    const amountRef = useRef(null);
    const okButtonRef = useRef(null);
     const [selectedDate, setSelectedDate] = useState(new Date()); // Set default to current date
     const [visible, setVisible] = useState(false);
     const [searchValue, setSearchValue] = useState("");
     const inputRef = useRef(null);

     useEffect(() => {
         if (visible) {
             setTimeout(() => inputRef.current?.focus(), 100); // Ensure focus when Popover opens
         }
     }, [visible]);
    const columns1 = [
       { title: "Receipt No", dataIndex: "RecNo", key: "RecNo" },
       { 
          title: "Date", 
          dataIndex: "RecDate", 
          key: "RecDate", 
          render: (date) => date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-" 
       },
       { title: "Scheme Name", dataIndex: "SchemeName", key: "SchemeName" },
       { title: "Amount", dataIndex: "SchemeAmount", key: "SchemeAmount", align: "right" },
    ];
 
  
     // Search Function
    const handleSearch = async () => {
       if (!searchValue.trim()) {
          message.warning("Please enter a Receipt Number");
          return;
       }

       setLoading(true);
       try {
          const response = await axios.get(`http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPT_MAST&where=RECNO%3D${searchValue}`);
          setTableData1(response.data);
       } catch (error) {
          message.error("Failed to fetch data");
       } finally {
          setLoading(false);
       }
    };
     // Clear Function
     const handleClear = () => {
         setSearchValue("");
         setTableData1([]);
     };
 
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    useEffect(() => {
        // Fetch data from API
        axios
            .get(
                "http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableName?tableName=ONLINEMODE_MAST"
            )
            .then((response) => {
                setPaymentData(response.data);


            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Handle Payment Mode Selection
    const handlePaymentModeChange = (ptype) => {
        setSelectedPaymentMode(ptype);
        setSelectedPayMode(null);
        setSelectedAccount(null);
        setAccountNumbers([]);

        if (ptype === "CASH") {
            // Skip Pay Mode & Account No, move directly to Amount
            setTimeout(() => amountRef.current?.focus(), 0);
        } else {
            // Move to Pay Mode
            setTimeout(() => payModeRef.current?.focus(), 0);
        }

        // Filter pay modes (PAYMODE) based on selected PTYPE
        const filteredPayModes = paymentData
            .filter((item) => item.PTYPE === ptype)
            .map((item) => item.PAYMODE);
        setPayModes([...new Set(filteredPayModes)]);
    };
    // Handle Payment Mode Selection

    // Handle Enter Key Navigation
    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter" && nextRef) {
            e.preventDefault();
            nextRef.current?.focus();
        }
    };

    // Handle Pay Mode Selection
    const handlePayModeChange = (paymode) => {
        setSelectedPayMode(paymode);

        // Filter account numbers based on selected PAYMODE
        const filteredAccounts = paymentData
            .filter((item) => item.PAYMODE === paymode)
            .map((item) => item.accno);
        setAccountNumbers([...new Set(filteredAccounts)]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    };
    const fetchSchemeDetails = async () => {
        try {
            // Fetch scheme details
            const response = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Master/GetDataFromGivenTableNameWithWhere?tableName=SCHEME_MEMBER&where=CARDNO%3D${cardNo}`
            );
            setSchemeData(response.data[0]);

            // Fetch installment number
            const installmentResponse = await axios.get(
                `http://www.jewelerp.timeserasoftware.in/api/Scheme/GetSchemeMaxNumberInTableWithOrder?tableName=RECEIPT_MAST&column=INSTNO&where=CARDNO%3D%27${cardNo}%27`
            );
            const installmentData = installmentResponse.data;

            // Extract and properly convert Column1 value
            const maxInstallment = installmentData.length > 0 && installmentData[0].Column1 !== null
                ? Math.floor(Number(installmentData[0].Column1)) + 1
                : 1;

            setInstallmentNo(maxInstallment);
        } catch (error) {
            console.error("Error fetching scheme details or installment number:", error);
            message.error("Failed to fetch scheme details or installment number.");
        }
    };

    const [selectedAccount, setSelectedAccount] = useState(null);
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [tableData, setTableData] = useState([]);
    const handleAddRecord = () => {
        if (!selectedPaymentMode || !amount) return;

        const newRecord = {
            key: Date.now(),
            paymentMode: selectedPaymentMode,
            particulars: selectedPayMode, // Use Pay Mode or Description
            accNo: selectedAccount,
            amount: amount,
        };

        setTableData([...tableData, newRecord]);

        // Clear form fields
        setSelectedPaymentMode(null);
        setSelectedPayMode(null);
        setSelectedAccount(null);
        setAmount("");
        setDescription("");
        setPayModes([]);
        setAccountNumbers([]);
    };
    const [rates, setRates] = useState([]);
    useEffect(() => {
        fetchRates1();
    }, []);
    const fetchRates1 = async () => {
        try {
            const currentDate = new Date();
            const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate
                .getDate()
                .toString()
                .padStart(2, "0")}/${currentDate.getFullYear()}`;

            const ratesResponse = await axios.get(
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=DAILY_RATES&where=RDATE%3D%27${formattedDate}%27`
            );

            const hasRates = ratesResponse.data.length > 0;
            setRates(ratesResponse.data);
        } catch (error) {
            message.error("Error fetching rates");
        }
    };
    const [index, setIndex] = useState(0);

    // Filter only GOLD products
    const goldRates = rates.filter(item => item.MAINPRODUCT.toLowerCase() === "gold");

    useEffect(() => {
        if (goldRates.length > 1) {
            const interval = setInterval(() => {
                setIndex(prevIndex => (prevIndex + 1) % goldRates.length);
            }, 5000); // Change rate every 2 seconds

            return () => clearInterval(interval);
        }
    }, [goldRates.length]);
    const [receiptNo, setReceiptNo] = useState("Loading...");

    useEffect(() => {
        const fetchReceiptNo = async () => {
            try {
                const response = await axios.get(
                    "http://www.jewelerp.timeserasoftware.in/api/Scheme/GetSchemeMaxNumberInTable",
                    {
                        params: {
                            tableName: "RECEIPT_MAST",
                            column: "RECNO",
                        },
                    }
                );

                const maxNumber = response.data?.[0]?.Column1 || 0;
                setReceiptNo(maxNumber + 1);
            } catch (error) {
                console.error("Error fetching receipt number:", error);
                setReceiptNo("Error");
            }
        };

        fetchReceiptNo();
    }, []);
    const handleSave = async () => {
        if (cardNo !== "1") {
            // message.error("Card No must be 1 to save the data.");
            return;
        }

        const payload = {
            recNo: 0,
            recDate: new Date().toISOString(),
            rectime: new Date().toISOString(),
            empCode: "string",
            schemeGroup: schemeData?.SchemeGroup || "string",
            schemeName: schemeData?.SchemeName || "string",
            goldRate: goldRates[index]?.RATE || 0,
            cardNo: cardNo,
            phno: schemeData?.Mobile1 || "string",
            schemeMember: schemeData?.SchemeMember || "string",
            add1: schemeData?.add1 || "string",
            add2: schemeData?.add2 || "string",
            add3: schemeData?.add3 || "string",
            schemeAmount: schemeData?.SchemeAmount || 0,
            schemeDuration: schemeData?.SchemeDuration || 0,
            bonusAmount: schemeData?.BonusAmount || 0,
            amount: 0, // Replace with actual amount if available
            schemeValue: schemeData?.SchemeValue || 0,
            schemeJDate: schemeData?.SchemeJoinDate || new Date().toISOString(),
            recAmount: 0, // Replace with actual received amount if available
            goldWt: 0, // Replace with actual gold weight if available
            mode: "string", // Replace with actual mode if available
            accno: "string", // Replace with actual account number if available
            chequeno: "string", // Replace with actual cheque number if available
            incharger: schemeData?.INCHARGE || "", // Replace with actual incharge if available
            narr: "string", // Replace with actual narration if available
            uname: "string",
            schemeType: schemeData?.SchemeType || "string",
            schemeMode: "string",
            sbMonths: 0, // Replace with actual months if available
            giftVoucher: 0, // Replace with actual gift voucher if available
            collect_Point: "string",
            paymode: "string",
            modetype: "string",
            accname: "string",
            fyear: "string",
            instno: installmentNo, // Replace with actual installment number if available
            pregoldwt: 0, // Replace with actual pre-gold weight if available
            clouD_UPLOAD: true,
        };

        try {
            const response = await axios.post(
                `${CREATE_jwel}/api/Master/ReceiptMastInsert`,
                payload
            );
            message.success("Data saved successfully!");
            setSchemeData();
            cardNo();
            console.log("Response:", response.data);
        } catch (error) {
            console.error("Error saving data:", error);
            message.error("Failed to save data.");
        }
    };
    const handleDelete = (key) => {
        setTableData((prevData) => prevData.filter((item) => item.key !== key));
    };

    const columns = [
        {
            title: "Payment Mode",
            dataIndex: "paymentMode",
            key: "paymentMode",
        },
        {
            title: "Particulars",
            dataIndex: "particulars",
            key: "particulars",
        },
        {
            title: "Account No",
            dataIndex: "accNo",
            key: "accNo",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            align: "right",
            key: "amount",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure you want to delete this record?"
                    onConfirm={() => handleDelete(record.key)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="text" icon={<DeleteOutlined style={{ color: "red" }} />} />
                </Popconfirm>
            ),
        },
    ];
    const popoverContent = (
        <div style={{ width: 450 }}>
            {/* Search Input with Label */}
            <Form layout="inline">
                <Form.Item label="Receipt No" style={{ flex: 1 }}>
                    <Input
                        ref={inputRef}
                        placeholder="Enter Receipt No"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onPressEnter={handleSearch}
                        allowClear
                    />
                </Form.Item>
            </Form>

            {/* Table */}
            {/* {loading ? (
                <Spin style={{ display: "block", marginTop: 10 }} />
            ) : (
                <Table
                    columns={columns1}
                    dataSource={tableData1}
                    pagination={false}
                    size="small"
                    style={{ marginTop: 10 }}
                    rowKey="sno"
                />
            )} */}

            {/* Buttons */}
            <Space style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleClear}>Clear</Button>
                <Button type="primary" onClick={() => setVisible(false)}>OK</Button>
            </Space>
        </div>
    );
    return (
        <div>
            <Card
                className="customeproductcard"
                style={{
                    background: "linear-gradient(135deg,rgb(20, 54, 117),rgb(66, 110, 185))", // Blue and Grey Gradient
                    position: "relative",
                    overflow: "hidden",
                    color: "white", // White text color
                }}
            >
                {/* Dotted Background using CSS */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage:
                            "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                        opacity: 0.2,
                    }}
                ></div>

                <Row justify="space-between" align="middle" gutter={16}>
                    {/* Card No Input & OK Button */}
                    <Col style={{ display: "flex", alignItems: "center", zIndex: 1 }}>
                        <Text
                            strong
                            style={{
                                fontSize: "16px",
                                marginRight: "10px",
                                marginLeft: "9px",
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            Card No:
                        </Text>
                        <Input
                            value={cardNo}
                            onChange={(e) => setCardNo(e.target.value)}
                            placeholder="Card no"
                            style={{
                                width: "120px",
                                height: "40px",
                                textAlign: "center",
                                marginLeft: "15px",
                                marginRight: "10px",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                            autoFocus
                            onPressEnter={() => {
                                fetchSchemeDetails();
                                setTimeout(() => document.getElementById("paymentModeDropdown").focus(), 0);
                            }} />
                        <Button type="primary" style={{ width: "40px", height: "40px" }}
                            onClick={() => {
                                fetchSchemeDetails();
                                setTimeout(() => document.getElementById("paymentModeDropdown").focus(), 0);
                            }}>
                            OK
                        </Button>
                        <Popover
            content={popoverContent}
            title="Search Receipt"
            trigger="click"
            open={visible}
            onOpenChange={(newVisible) => setVisible(newVisible)}
        >
            <Button icon={<InfoCircleOutlined />} shape="circle" style={{ marginLeft: 8 }} />
        </Popover>                        
                    </Col>

                    {/* Receipt No */}
                    <Col>
                        <Text strong style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>
                            Receipt No: {receiptNo}
                        </Text>
                    </Col>

                    {/* Receipt Date */}
                    <Col>
                        <Text strong style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>
                            Receipt Date:
                        </Text>{" "}
                        <div style={{ display: "inline-block", marginLeft: "10px" }}>
                            <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd MMM yyyy" // Formats date as "27 Mar 2025"
            customInput={<CustomInput />}
            popperPlacement="bottom"
            portalId="root"
            container="body"
        />
                        </div>
                    </Col>

                    {/* Gold Rates */}
                    <Col>
                        <Card
                            style={{
                                //   background: "rgba(255, 255, 255, 0.2)", // Semi-transparent white
                                background: "linear-gradient(135deg,rgb(20, 54, 117),rgb(66, 110, 185))", // Blue and Grey Gradient

                                position: "relative",
                                zIndex: 1,
                                borderRadius: "8px",
                                color: "white",
                            }}
                            className="custometagnocard"

                        >
                            <div style={{ fontSize: "13px", fontWeight: "bold", marginBottom: "5px", color: "white" }}>
                                Today's Gold Rates
                            </div>
                            {goldRates.length > 0 ? (
                                <div style={{ fontSize: "12px", fontWeight: "bold", color: "yellow" }}>
                                    {rates[index]?.MAINPRODUCT} - {goldRates[index]?.PREFIX} - ₹{goldRates[index]?.RATE}
                                </div>
                            ) : (
                                <div style={{ fontSize: "12px", color: "white" }}>No Gold Rates Available</div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Card>

            <div style={{ marginTop: "6px" }}>
                <Row gutter={16}>
                    {/* Member & Payment Details */}
                    <Col span={15}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
                                PERSON DETAILS
                            </div>
                            <Row gutter={[16, 8]}>
                                <Col span={24}>
                                    <Row align="middle">
                                        <Col span={6}>
                                            <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Member Name</Text>
                                        </Col>
                                        <Col span={1} style={{ textAlign: "center" }}>
                                            <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>:</Text>
                                        </Col>
                                        <Col span={17}>
                                            <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeMember : ""}</Text>
                                        </Col>

                                        <Col span={6}>
                                            <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Mobile No</Text>
                                        </Col>
                                        <Col span={1} style={{ textAlign: "center" }}>
                                            <Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text>
                                        </Col>
                                        <Col span={17}>
                                            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.Mobile1 : ""}</Text>
                                        </Col>

                                        <Col span={6}>
                                            <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>City</Text>
                                        </Col>
                                        <Col span={1} style={{ textAlign: "center" }}>
                                            <Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text>
                                        </Col>
                                        <Col span={17}>
                                            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.area : ""}</Text>
                                        </Col>

                                        <Col span={6}>
                                            <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Address</Text>
                                        </Col>
                                        <Col span={1} style={{ textAlign: "center" }}>
                                            <Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text>
                                        </Col>
                                        <Col span={17}>
                                            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.add2 : ""}</Text>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <div
                                style={{
                                    backgroundColor: "#f0f5ff",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #1890ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    // Ensures responsiveness
                                    width: "100%",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Text strong style={{ fontSize: "16px", color: "#003a8c" }}>Installment No</Text>
                                    <Text strong style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}>:</Text>
                                    <Text
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            color: "#d4380d",
                                            backgroundColor: "#fff1f0",
                                            padding: "6px 16px",
                                            borderRadius: "6px",
                                            border: "1px solid #d4380d",
                                            display: "inline-block",
                                            minWidth: "50px",
                                        }}
                                    >
                                        {installmentNo}
                                    </Text>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Text strong style={{ fontSize: "16px", color: "#003a8c" }}>Inst Amt</Text>
                                    <Text strong style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}>:</Text>
                                    <Text
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            color: "#389e0d",
                                            backgroundColor: "#f6ffed",
                                            padding: "6px 16px",
                                            borderRadius: "6px",
                                            border: "1px solid #389e0d",
                                            display: "inline-block",
                                            minWidth: "80px",
                                        }}
                                    >
                                        ₹ 5,000
                                    </Text>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <Text strong style={{ fontSize: "16px", color: "#003a8c" }}>Total Dues</Text>
                                    <Text strong style={{ fontSize: "18px", fontWeight: "bold", color: "#1890ff" }}>:</Text>
                                    <Text
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "bold",
                                            color: "#389e0d",
                                            backgroundColor: "#f6ffed",
                                            padding: "6px 16px",
                                            borderRadius: "6px",
                                            border: "1px solid #389e0d",
                                            display: "inline-block",
                                            minWidth: "80px",
                                        }}
                                    >
                                        ₹ 5,000
                                    </Text>
                                </div>
                            </div>

                            <div style={{ fontSize: "14px", fontWeight: "bold", margin: "15px 0 10px" }}>
                                PAYMENT DETAILS
                            </div>
                            <Row gutter={[8, 8]} justify="center" align="middle">
                                {/* Payment Mode */}
                                <Col span={5}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        Payment Mode:
                                    </Text>
                                    <Select
                                        id="paymentModeDropdown"
                                        showSearch
                                        style={{ width: "100%" }}
                                        onChange={(value) => {
                                            handlePaymentModeChange(value);
                                            if (value === "CASH" || value === "CHEQUE") {
                                                setTimeout(() => document.getElementById("amountInput").focus(), 0);
                                            }
                                        }}
                                        value={selectedPaymentMode}
                                        placeholder="Select"
                                        onKeyDown={(e) => handleKeyDown(e, payModeRef)}
                                    >
                                        {paymentModes.map((mode) => (
                                            <Option key={mode} value={mode}>
                                                {mode}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>

                                {/* Pay Mode */}
                                <Col span={4}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        Pay Mode:
                                    </Text>
                                    <Select
                                        showSearch
                                        ref={payModeRef}
                                        onKeyDown={(e) => handleKeyDown(e, accountRef)}
                                        style={{ width: "100%" }}
                                        onChange={handlePayModeChange}
                                        value={selectedPayMode}
                                        placeholder="Select"
                                        disabled={!selectedPaymentMode}
                                    >
                                        {payModes.map((paymode) => (
                                            <Option key={paymode} value={paymode}>
                                                {paymode}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>

                                {/* Account No */}
                                <Col span={4}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        Account No:
                                    </Text>
                                    <Select
                                        showSearch
                                        ref={accountRef}
                                        onKeyDown={(e) => handleKeyDown(e, descriptionRef)}
                                        style={{ width: "100%" }}
                                        placeholder="Select"
                                        disabled={!selectedPayMode}
                                        value={selectedAccount}
                                        onChange={(value) => setSelectedAccount(value)}
                                    >
                                        {accountNumbers.map((acc) => (
                                            <Option key={acc} value={acc}>
                                                {acc}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>

                                {/* Description */}
                                <Col span={5}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        Description:
                                    </Text>
                                    <Input
                                        ref={descriptionRef}
                                        onKeyDown={(e) => handleKeyDown(e, amountRef)}
                                        placeholder="Enter description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </Col>

                                {/* Amount */}
                                <Col span={4}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        Amount:
                                    </Text>
                                    <Input
                                        id="amountInput"
                                        placeholder="Enter Amount"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        ref={amountRef}
                                        onKeyDown={(e) => handleKeyDown(e, okButtonRef)}
                                    />
                                </Col>

                                {/* OK Button */}
                                <Col span={2} style={{ textAlign: "center", marginTop: "15px" }}>
                                    <Button
                                        type="primary"
                                        ref={okButtonRef}
                                        onClick={() => {
                                            if (!selectedPaymentMode || !amount) {
                                                const newRecord = {
                                                    key: Date.now(),
                                                    paymentMode: selectedPaymentMode || "N/A",
                                                    particulars: description || "N/A",
                                                    accNo: selectedAccount || "N/A",
                                                    amount: amount || "N/A",
                                                };
                                                setTableData([...tableData, newRecord]);
                                            } else {
                                                handleAddRecord();
                                            }
                                            setTimeout(() => document.getElementById("paymentModeDropdown").focus(), 2000);
                                        }}
                                    >
                                        OK
                                    </Button>
                                </Col>
                            </Row>



                            <div style={{ marginTop: "10px", maxHeight: 100, overflowY: 'auto' }}>
                                <Table
                                    dataSource={tableData}
                                    columns={columns}
                                    pagination={false}
                                    size="small"

                                />
                            </div>

                            <div style={{ marginTop: "10px", textAlign: "right" }}>
                                <Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>
                                    Paid Amount:{" "}
                                </Text>
                                <Text
                                    strong
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "bold",
                                        color:
                                            tableData.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0) ===
                                                (schemeData?.SchemeAmount || 0)
                                                ? "green"
                                                : "red",
                                    }}
                                >
                                    ₹{" "}
                                    {tableData
                                        .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0)
                                        .toFixed(2)}
                                </Text>
                            </div>

                            <Row gutter={[16, 8]} style={{ marginTop: "10px" }}>
                                <Col span={12}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Incharge:</Text>
                                    <Select placeholder="Select Incharge" style={{ width: "100%" }}>
                                        {schemeData?.INCHARGE?.split(",").map((incharge, index) => (
                                            <Option key={index} value={incharge}>
                                                {incharge}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>

                                <Col span={12}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Narration:</Text>
                                    <Input placeholder="Enter Narration" />
                                </Col>
                            </Row>
                        </Card>
                    </Col>

                    {/* Scheme Details */}
                    <Col span={9}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
                                SCHEME DETAILS
                            </div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Scheme Type</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeType : ""}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Scheme Name</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeName : ""}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Scheme Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeAmount : ""}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Scheme Duration</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeDuration : ""}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Bonus Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.BonusAmount : ""}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Total Scheme Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeValue : ""}</Col>

                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{
                            backgroundImage: "linear-gradient(to right, #ff9a9e, #fad0c4)",
                        }}>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Scheme Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? formatDate(schemeData.SchemeJoinDate) : ""}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Scheme End Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? formatDate(schemeData.SchemeEndDate) : ""}</Col>
                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{ background: "lightblue" }}>
                            <div style={{
                                fontSize: "14px",
                                fontWeight: "bold",
                                color: "yellow",
                                backgroundColor: "lightblue",
                                padding: "6px 16px",
                                borderRadius: "6px",
                                border: "1px solid rgb(238, 92, 56)",
                                display: "inline-block",
                                minWidth: "50px",
                            }}>
                                GOLD WALLET
                            </div>
                            <Row>

                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>
                                SCHEME PAYMENT DETAILS
                            </div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Total Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeDuration : ""}</Col>
                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Paid Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeDuration : "" - schemeData ? schemeData.DUEMONTHS : ""}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Balance Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}> {schemeData ? schemeData.DUEMONTHS : ""}</Col>
                                <Col span={10}><Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Total Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.SchemeValue : ""}</Col>

                            </Row>
                            <Row justify="end" style={{ marginTop: 5 }}>
                                <Button type="primary" onClick={handleSave} style={{ fontSize: "16px", fontWeight: "bold" }}>SAVE</Button>
                                <Button style={{ marginLeft: 10, fontSize: "16px", fontWeight: "bold" }}>CANCEL</Button>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>

        </div>
    );
};

export default SchemeDetails;
