import React, { useState, useEffect, useRef, forwardRef } from "react";
import { Input, Button, Row, Col, Table, Card, Typography, Select, message, Form, Popconfirm, Popover, Space, } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../../Config/Config";

import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";
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
    const [, setLoading] = useState(false);
    const [, setTableData1] = useState([]);

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


    // Search Function
    const handleSearch = async () => {
        if (!searchValue.trim()) {
            message.warning("Please enter a Receipt Number");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPT_MAST&where=RECNO%3D${searchValue}`);

            // Map the response data to match the table columns
            const mappedData = response.data.map(item => ({
                RecNo: item.RecNo,
                RecDate: item.RecDate,
                SchemeName: item.SchemeName,
                SchemeAmount: item.SchemeAmount,
                cardNo: item.CardNo,
                SchemeMember: item.SchemeMember,
                Mobile1: item.Phno,
                add1: item?.add1,
                add2: item?.add2,
                add3: item?.add3,
                installmentNo: item.INSTNO,
                SchemeType: item.SchemeType,
                SchemeDuration: item.SchemeDuration,
                BonusAmount: item.BonusAmount,
                SchemeValue: item.SchemeValue,
                SchemeJoinDate: item.SchemeJDate,
                INCHARGE: item.Incharger,
                narr: item.Narr,
                area: item.AREA,
                schemeENDDate: item.SchemeENDDate,

            }));

            setSchemeData(mappedData[0]);
            setCardNo(mappedData[0]?.cardNo || ""); // Update cardNo state

            // Fetch payment details for the matching receipt number
            const paymentResponse = await axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=RECEIPT_PAYMENT&where=CARDNO%3D%27${mappedData[0]?.cardNo}%27`);
            const paymentDetails = paymentResponse.data
                .filter(item => item.RECNO === mappedData[0]?.RecNo)
                .map(item => ({
                    key: item.SNO,
                    paymentMode: item.PAYMODE,
                    particulars: item.PARTICULARS,
                    accNo: item.ACCNO,
                    amount: item.AMT,
                    descr: item.DESCR,
                }));

            setTableData(paymentDetails);
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
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableName?tableName=ONLINEMODE_MAST`
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
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=SCHEME_MEMBER&where=CARDNO%3D${cardNo}`
            );
            setSchemeData(response.data[0]);

            // Fetch installment number
            const installmentResponse = await axios.get(
                `${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTableWithOrder?tableName=RECEIPT_MAST&column=INSTNO&where=CARDNO%3D%27${cardNo}%27`
            );
            const installmentData = installmentResponse.data;

            // Extract and properly convert Column1 value
            const maxInstallment = installmentData.length > 0 && installmentData[0].Column1 !== null
                ? Math.floor(Number(installmentData[0].Column1)) + 1
                : 1;

            setInstallmentNo(maxInstallment);

            // Fetch FYEAR from firm configuration
            const firmConfigResponse = await axios.get(
                `${CREATE_jwel}/api/Erp/GetFirmConfihure`
            );
            const fyear = firmConfigResponse.data?.[0]?.FYEAR || "default_fyear"; // Adjusted to handle array response
            console.log("fyear", fyear);

            // Pass FYEAR to handleSave function
            setSchemeData((prev) => ({ ...prev, fyear: fyear || "default_fyear" })); // Ensure fyear is set with a fallback
        } catch (error) {
            console.error("Error fetching scheme details, installment number, or FYEAR:", error);
            message.error("Failed to fetch scheme details, installment number, or FYEAR.");
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
            descr: description,
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


        fetchReceiptNo();
    }, []);
    const fetchReceiptNo = async () => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTable`,
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
    console.log("schemeData", schemeData);
    const handleSave = async () => {
        const paidAmount = tableData.reduce((sum, record) => sum + parseFloat(record.amount || 0), 0); // Calculate paid amount

        // No need to check here as the condition is applied when adding a record to the table.

        if (cardNo !== "1") {
            return;
        }
        const selectedDateISO = selectedDate.toISOString(); // Use the selected date from the date picker
        const cashAmount = tableData
            .filter((record) => record.paymentMode === "CASH")
            .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

        const cardAmount = tableData
            .filter((record) => record.paymentMode === "CARD")
            .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

        const upiAmount = tableData
            .filter((record) => record.paymentMode === "UPI")
            .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

        const onlineAmount = tableData
            .filter((record) => record.paymentMode === "ONLINE")
            .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

        const chequeAmount = tableData
            .filter((record) => record.paymentMode === "CHEQUE")
            .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

        const payload = {
            recNo: receiptNo, // Use receiptNo
            recDate: selectedDateISO, // Use the selected date
            rectime: selectedDateISO, // Use the selected date
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
            amount: paidAmount,
            schemeValue: schemeData?.SchemeValue || 0,
            schemeJDate: schemeData?.SchemeJoinDate || new Date().toISOString(),
            schemeENDDate: schemeData?.schemeENDDate || new Date().toISOString(),

            recAmount: paidAmount, // Use paid amount
            goldWt: 0,
            mode: "string",
            accno: "string",
            chequeno: "string",
            incharger: schemeData?.INCHARGE || "",
            narr: schemeData?.narr,
            uname: "string",
            schemeType: schemeData?.SchemeType || "string",
            schemeMode: "string",
            sbMonths: 0,
            giftVoucher: 0,
            collect_Point: "string",
            paymode: "string",
            modetype: "string",
            accname: "string",
            fyear: schemeData?.fyear || "string", // Pass FYEAR here
            instno: installmentNo,
            pregoldwt: 0,
            cash: cashAmount,
            card: cardAmount,
            upi: upiAmount,
            online: onlineAmount,
            cheque: chequeAmount,
            area: schemeData?.area,
            clouD_UPLOAD: true,
        };

        try {
            const response = await axios.post(
                `${CREATE_jwel}/api/Master/ReceiptMastInsert`,
                payload
            );
            message.success("Data saved successfully!");

            // Save table data
            const tablePayloads = tableData.map((record, index) => ({
                recno: receiptNo, // Use receiptNo
                recdate: selectedDateISO, // Use the selected date
                scmgroup: schemeData?.SchemeGroup || "string",
                scmname: schemeData?.SchemeName || "string",
                scmmember: schemeData?.SchemeMember || "string",
                cardno: cardNo,
                sno: index + 1, // Pass the serial number (index + 1)
                paymode: record.paymentMode || "string",
                accno: record.accNo || "string",
                descr: record.descr || description || "string",
                particulars: record.particulars || "string",
                amt: parseFloat(record.amount) || 0,
                recamt: paidAmount, // Pass the calculated paid amount
                fyear: schemeData?.fyear || "string", // Pass FYEAR here
                clouD_UPLOAD: true,
            }));

            try {
                const response = await axios.post(
                    `http://www.jewelerp.timeserasoftware.in/api/Master/ReceiptPaymentInsert`,
                    tablePayloads // Send the entire array as the request body
                );

                // Check responses for success
                const allSuccessful = response.every(
                    (response) => response.data?.[0]?.isInsert === true
                );

                if (allSuccessful) {
                    message.success("All payment records saved successfully!");
                } else {
                    message.warning("Some payment records were not saved successfully.");
                }
            } catch (error) {
                console.error("Error saving payment records:", error);
                // message.error("Failed to save payment records.");
            }

            // Call MemberCardDetailsInsert API
            if (installmentNo === 1) {
                const memberCardPayload = {
                    sno: index + 1, // Use installmentNo as sno
                    recno: receiptNo,
                    recdate: selectedDateISO,
                    pstatus: true,
                    cardno: cardNo,
                    month: schemeData?.SchemeJoinDate || "", // Use SchemeJoinDate for month
                    schemetype: schemeData?.SchemeType || "string",
                    schemegroup: schemeData?.SchemeGroup || "string",
                    schemename: schemeData?.SchemeName || "string",
                    schememember: schemeData?.SchemeMember || "string",
                    adD1: schemeData?.add1 || "string",
                    adD2: schemeData?.add2 || "string",
                    adD3: schemeData?.add3 || "string",
                    adD4: "",
                    area: schemeData?.area || "string",
                    schemeamount: schemeData?.SchemeAmount || 0,
                    schemeduration: schemeData?.SchemeDuration || 0,
                    schemejoindate: schemeData?.SchemeJoinDate || new Date().toISOString(),
                    schemeenddate: schemeData?.SchemeEndDate || new Date().toISOString(),
                    bonusMonth: 0,
                };

                await axios.post(
                    `${CREATE_jwel}/api/Scheme/MemberCardDetailsInsert`,
                    memberCardPayload
                );
            }

            setSchemeData();
            setCardNo("");
            setTableData([]);
            fetchReceiptNo();
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
            title: "S.No",
            dataIndex: "key",
            key: "key",
            render: (text, record, index) => index + 1, // Display serial number
        },
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

            {/* Buttons */}
            <Space style={{ marginTop: 10, display: "flex", justifyContent: "flex-end" }}>
                <Button onClick={handleClear}>Clear</Button>
                <Button
                    type="primary"
                    onClick={() => {
                        setReceiptNo(searchValue); // Update receiptNo with the entered value
                        setVisible(false);
                        handleSearch();
                    }}
                >
                    OK
                </Button>
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
                                            <Text style={{ fontSize: "14px", fontWeight: "bold" }}>{schemeData ? schemeData.add1 : ""}{schemeData ? schemeData.add2 : ""}{schemeData ? schemeData.add3 : ""}</Text>
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
                                        {installmentNo || 0}
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
                                        ₹  {schemeData?.SchemeAmount || 0}
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
                                        ₹ {schemeData?.TotalDues || 0}
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
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                const filteredOptions = accountNumbers.filter((acc) =>
                                                    acc.toLowerCase().includes(e.target.value.toLowerCase())
                                                );
                                                if (filteredOptions.length > 0) {
                                                    setSelectedAccount(filteredOptions[0]); // Select first matched option
                                                }
                                                setTimeout(() => descriptionRef.current.focus(), 0); // Move focus to next field
                                            } else {
                                                handleKeyDown(e, descriptionRef);
                                            }
                                        }}
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
                                        onChange={(e) => {
                                            const enteredAmount = parseFloat(e.target.value) || 0;
                                            const totalPaid = tableData.reduce(
                                                (sum, record) => sum + parseFloat(record.amount || 0),
                                                0
                                            );
                                            const remainingAmount = (schemeData?.SchemeAmount || 0) - totalPaid;

                                            if (enteredAmount > remainingAmount) {
                                                message.warning(
                                                    `You can only enter up to ₹${remainingAmount.toFixed(2)}`
                                                );
                                                setAmount(remainingAmount.toString());
                                            } else {
                                                setAmount(e.target.value);
                                            }
                                        }}
                                        ref={amountRef}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault(); // Prevent default Enter behavior
                                                okButtonRef.current.click(); // Programmatically trigger button click
                                            }
                                        }}
                                    />

                                </Col>

                                {/* OK Button */}
                                <Col span={2} style={{ textAlign: "center", marginTop: "15px" }}>
                                    <Button
                                        type="primary"
                                        ref={okButtonRef}
                                        onClick={() => {
                                            const totalPaid = tableData.reduce(
                                                (sum, record) => sum + parseFloat(record.amount || 0),
                                                0
                                            );
                                            const remainingAmount = (schemeData?.SchemeAmount || 0) - totalPaid;

                                            if (parseFloat(amount) > remainingAmount) {
                                                message.error(
                                                    `The total paid amount cannot exceed the scheme amount of ₹${schemeData?.SchemeAmount}`
                                                );
                                            } else {
                                                handleAddRecord();
                                                setTimeout(() => document.getElementById("paymentModeDropdown").focus(), 2000);
                                            }
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
                                    <Select
                                        placeholder="Select Incharge"
                                        style={{ width: "100%" }}
                                        onChange={(value) => setSchemeData((prev) => ({ ...prev, incharge: value }))}
                                    >
                                        {schemeData?.INCHARGE?.split(",").map((incharge, index) => (
                                            <Option key={index} value={incharge}>
                                                {incharge}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>

                                <Col span={12}>
                                    <Text strong style={{ fontSize: "14px", fontWeight: "bold" }}>Narration:</Text>
                                    <Input
                                        placeholder="Enter Narration"
                                        value={schemeData?.narr || ""}
                                        onChange={(e) => setSchemeData((prev) => ({ ...prev, narr: e.target.value }))}
                                    />
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
