import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Input, Button, Row, Col, Card, Typography, Table, message, Select, Checkbox, Divider } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import moment from "moment";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import { ReloadOutlined, } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div className="custom-date-input" onClick={onClick} ref={ref}>
        <input value={value} placeholder={placeholder} readOnly />
        <FaCalendarAlt className="calendar-icon" />
    </div>
));
const MemeberDiscontinue = () => {
    const [cardNo, setCardNo] = useState("");
    const [memberData, setMemberData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [rates, setRates] = useState([]);
    const [, setIndex] = useState(0);
    const [inchargeList, setInchargeList] = useState([]);

    const cardNoRef = useRef(null);
    const inchargeRef = useRef(null);
    const inputRef = useRef(null);
    const saveButtonRef = useRef(null);

    const [isDiscontinued, setIsDiscontinued] = useState(false);
    const [schemeCardData, setSchemeCardData] = useState({});
    const [isEligibleForDrop, setIsEligibleForDrop] = useState(false);

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setIsDiscontinued(checked);

        // Focus the input if checked
        if (checked && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 0);
        }
    };
    // Focus input after it's rendered when checkbox is checked
    useEffect(() => {
        if (isDiscontinued && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isDiscontinued]);
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
    const [voucherNo, setVoucherNo] = useState(null);
    const fetchVoucherNo = async () => {
        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTable?tableName=SCHEME_MIDDLEDROP&column=SMDRECNO`
            );
            const data = response.data;

            if (data && data.length > 0) {
                const maxNo = data[0].Column1;
                setVoucherNo(maxNo === null ? 1 : maxNo + 1);
            } else {
                setVoucherNo(1);
            }
        } catch (error) {
            console.error("Error fetching voucher number:", error);
            setVoucherNo(1); // fallback
        }
    };
    useEffect(() => {


        fetchVoucherNo();
    }, []);

    const fetchIncharges = async () => {
        try {
            const res = await axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableName`, {
                params: {
                    tableName: "SCHEME_MEMBER",
                },
            });

            const allIncharges = res.data
                .map(item => item.INCHARGE)
                .filter((val, index, self) => val && self.indexOf(val) === index); // remove duplicates and nulls

            setInchargeList(allIncharges);
        } catch (err) {
            console.error("Error fetching incharges:", err);
            message.error("Failed to fetch incharge list.");
        }
    };
    useEffect(() => {
        fetchIncharges();
    }, []);

    const fetchMemberData = async () => {
        if (!cardNo) {
            message.error("Please enter a valid Card No.");
            return;
        }

        try {
            // 1️⃣ Fetch from MEMBER_CARD_DET
            const [paymentRes, schemeRes] = await Promise.all([
                axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`, {
                    params: {
                        tableName: "MEMBER_CARD_DET",
                        where: `CARDNO='${cardNo}'`,
                    },
                }),
                axios.get(`${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`, {
                    params: {
                        tableName: "SCHEME_MEMBER",
                        where: `CARDNO='${cardNo}'`,
                    },
                }),
            ]);

            const paymentData = paymentRes.data || [];
            const schemeData = schemeRes.data && schemeRes.data.length > 0 ? schemeRes.data[0] : null;

            // 2️⃣ Handle payment table and member metrics
            if (paymentData.length > 0) {
                setIsEligibleForDrop(true); // ✅ Eligible for drop

                const formattedData = paymentData.map((item, index) => ({
                    key: index,
                    sno: item.sno,
                    MONTH: item.MONTH,
                    RECNO: item.RECNO,
                    RECDATE: item.RECDATE,
                    SCHEMEAMOUNT: item.SCHEMEAMOUNT,
                    goldWeight: item.GOLDWT ?? "N/A",
                    goldOneGram: item.GOLDRATE ?? "N/A",
                    modeOfPay: item.RECNO ? "Cash" : "Pending",
                    balance: item.RECNO ? 0 : item.SCHEMEAMOUNT,
                    PSTATUS: item.PSTATUS,
                }));

                const totalPaid = paymentData.reduce(
                    (sum, item) => sum + (item.RECNO ? item.SCHEMEAMOUNT : 0),
                    0
                );

                const schemeAmt = paymentData[0].SCHEMEAMOUNT;
                const duration = paymentData[0].SCHEMEDURATION;

                setTableData(formattedData);
                setMemberData({
                    MemberName: paymentData[0].SCHEMEMEMBER,
                    SchemeType: paymentData[0].SCHEMETYPE,
                    GroupName: paymentData[0].SCHEMEGROUP,
                    SchemeAmount: schemeAmt,
                    TotalPaid: totalPaid,
                    BalanceAmount: schemeAmt * duration - totalPaid,
                    TotalGoldWeight: "N/A",
                    MembershipType: paymentData[0].SCHEMENAME,
                    JoinDate: paymentData[0].SCHEMEJOINDATE,
                    ExpiryDate: paymentData[0].SCHEMEENDDATE,
                });
            } else {
                setIsEligibleForDrop(false); // ❌ Not eligible
                setTableData([]);
                setMemberData(null);
                message.warning("No payment data found for the entered Card No.");
            }


            // 3️⃣ Handle scheme/voucher/payment detail card values
            if (schemeData) {
                setSchemeCardData({
                    address: schemeData.add1,
                    mobile1: schemeData.Mobile1,
                    mobile2: schemeData.Mobile2,
                    MemberName: schemeData.SchemeMember,
                    SchemeType: schemeData.SchemeType,
                    GroupName: schemeData.SchemeGroup,
                    Address: `${schemeData.add1 || ""} ${schemeData.add2 || ""} ${schemeData.add3 || ""} ${schemeData.add4 || ""}`.trim(),
                    Area: schemeData.area,
                    cardNo: schemeData.CardNo,
                    recNo: schemeData.RECNO,
                    amount: schemeData.SchemeAmount,
                    joinDate: moment(schemeData.SchemeJoinDate).format("DD-MM-YYYY"),
                    SchemeEndDate: moment(schemeData.SchemeEndDate).format("DD-MM-YYYY"),

                    schemeValue: schemeData.SchemeValue,
                    noOfMonths: schemeData.SchemeDuration,
                    bonusAmount: schemeData.BonusAmount,
                    bonusMonths: schemeData.BonusMonth,
                    totalSchemeAmount: schemeData.SchemeValue,
                    incharge: schemeData.INCHARGE,

                    paidAmount: paymentData.reduce(
                        (sum, item) => sum + (item.RECNO ? item.SCHEMEAMOUNT : 0),
                        0
                    ),
                    totalAmount: schemeData.SchemeValue,
                });
            } else {
                message.warning("No scheme info found in SCHEME_MEMBER table.");
                setSchemeCardData(null);
            }
        } catch (error) {
            message.error("Failed to fetch data. Please try again.");
            console.error(error);
        }
    };

    // const handleSave = async () => {
    //     const now = new Date().toISOString();
    //     const safeDate = (val) => val ? new Date(val).toISOString() : now;

    //     const body = {
    //         smdRecno: schemeCardData?.recNo || 0,
    //         smdRecDate: now,
    //         smdRecTime: now,
    //         empCode: schemeCardData?.empCode ?? "",
    //         schemeGroup: schemeCardData?.schemeGroup ?? "",
    //         schemeName: schemeCardData?.schemeName ?? "",
    //         goldRate: Number(schemeCardData?.goldRate) || 0,
    //         cardNo: cardNo,
    //         phno: schemeCardData?.mobile1 ?? "",
    //         schemeMember: schemeCardData?.memberName ?? "",
    //         add1: schemeCardData?.address ?? "",
    //         add2: "",
    //         add3: "",
    //         schemeAmount: Number(schemeCardData?.amount) || 0,
    //         schemeDuration: Number(schemeCardData?.noOfMonths) || 0,
    //         bonusAmount: Number(schemeCardData?.bonusAmount) || 0,
    //         amount: Number(schemeCardData?.paidAmount) || 0,
    //         schemeValue: Number(schemeCardData?.schemeValue) || 0,
    //         schemeJDate: safeDate(schemeCardData?.joinDate),
    //         recAmount: Number(schemeCardData?.paidAmount) || 0,
    //         goldWt: Number(schemeCardData?.goldWeight) || 0,
    //         narr: schemeCardData?.narr ?? "",
    //         giftVoucher: Number(voucherNo) || 0,

    //         uname: schemeCardData?.uname ?? "",
    //         schemeType: schemeCardData?.schemeType ?? "",
    //         schemeMode: schemeCardData?.schemeMode ?? "",
    //         mobile1: schemeCardData?.mobile1 ?? "",
    //         mobile2: schemeCardData?.mobile2 ?? "",
    //         cloud_upload: true,
    //         schemE_ENDDATE: now,
    //         incharge: schemeCardData?.incharge,


    //     };
    //     console.log("schemeCardData", schemeCardData)
    //     try {
    //         await axios.post("http://www.jewelerp.timeserasoftware.in/api/Scheme/SchemeMiddleDropInsert", body);
    //         message.success("Scheme saved successfully!");
    //         setTimeout(() => {
    //             cardNoRef.current?.focus();
    //         }, 0);
    //         // Second: update member dropping
    //         await axios.post(`http://www.jewelerp.timeserasoftware.in/api/Scheme/UpdateSchemeMemberDropping?schemeDropping=true&cardNO=${cardNo}`, {

    //         });




    //         fetchVoucherNo();

    //         // Reset fields
    //         setSchemeCardData(null);
    //         setVoucherNo("");
    //         setCardNo("");
    //         setTableData([]);
    //         setIsDiscontinued(false);
    //         setMemberData(null);
    //     } catch (error) {
    //         console.error("Save failed:", error);
    //         message.error("Failed to save scheme.");
    //     }
    // };

    const handleSave = async () => {
        const now = new Date().toISOString();
        const safeDate = (val) => val ? new Date(val)?.toISOString() : now;

        const body = {
            smdRecno: schemeCardData?.recNo || 0,
            smdRecDate: now,
            smdRecTime: now,
            empCode: schemeCardData?.empCode ?? "",
            schemeName: schemeCardData?.SchemeName ?? "",

            schemeMember: schemeCardData?.MemberName ?? "",
            schemeType: schemeCardData?.SchemeType ?? "",
            schemeGroup: schemeCardData?.GroupName ?? "",
            goldRate: Number(schemeCardData?.goldRate) || 0,
            cardNo: cardNo,
            area: schemeCardData?.Area ?? "",

            phno: schemeCardData?.mobile1 ?? "",
            add1: schemeCardData?.address ?? "",
            add2: "",
            add3: "",
            schemeAmount: Number(schemeCardData?.amount) || 0,
            schemeDuration: Number(schemeCardData?.noOfMonths) || 0,
            bonusAmount: Number(schemeCardData?.bonusAmount) || 0,
            amount: Number(schemeCardData?.paidAmount) || 0,
            schemeValue: Number(schemeCardData?.schemeValue) || 0,
            schemeJDate: safeDate(schemeCardData?.joinDate),
            recAmount: Number(schemeCardData?.paidAmount) || 0,
            goldWt: Number(schemeCardData?.goldWeight) || 0,
            narr: schemeCardData?.narr ?? "",
            giftVoucher: Number(voucherNo) || 0,

            uname: schemeCardData?.uname ?? "",
            schemeMode: schemeCardData?.schemeMode ?? "",
            mobile1: schemeCardData?.mobile1 ?? "",
            mobile2: schemeCardData?.mobile2 ?? "",
            cloud_upload: true,
            schemE_ENDDATE: now,
            incharge: schemeCardData?.incharge,
        };

        try {
            await axios.post("http://www.jewelerp.timeserasoftware.in/api/Scheme/SchemeMiddleDropInsert", body);

            if (isDiscontinued && cardNo) {
                const droppingUrl = `http://www.jewelerp.timeserasoftware.in/api/Scheme/UpdateSchemeMemberDropping?schemeDropping=true&cardNO=${cardNo}`;
                const res = await axios.post(droppingUrl);

                if (res.data !== true) {
                    throw new Error("Failed to update scheme dropping status");
                }
            }

            message.success("Scheme saved successfully!");

            setTimeout(() => {
                cardNoRef.current?.focus();
            }, 0);

            fetchVoucherNo();

            setSchemeCardData(null);
            setVoucherNo("");
            setCardNo("");
            setTableData([]);
            setIsDiscontinued(false);
            setMemberData(null);
        } catch (error) {
            console.error("Save failed:", error);
            message.error("Failed to save scheme.");
        }
    };


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

            setRates(ratesResponse.data);
        } catch (error) {
            message.error("Error fetching rates");
        }
    };

    const columns = [
        {
            title: "Inst.No",
            dataIndex: "sno",
            key: "sno",
            onHeaderCell: () => ({
                style: { fontSize: "12px" },
            }),
            render: (text, record) => (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }}>
                    <span
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: record.PSTATUS ? "green" : "red",
                        }}
                    ></span>
                    {text}
                </div>
            ),
        },
        {
            title: "Inst.Date",
            dataIndex: "MONTH",
            width: 100,
            key: "month",
            onHeaderCell: () => ({
                style: { fontSize: "12px" },
            }),
            render: (text) => (
                <span style={{ fontSize: "12px" }}>
                    {text ? moment(text, "YYYY-MM-DD").format("DD MMM YYYY") : ""}
                </span>
            ),
        },
        {
            title: "Rec No",
            dataIndex: "RECNO",
            key: "recNo",
            align: "center",
            onHeaderCell: () => ({ style: { fontSize: "12px" } }),
            render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
        },
        {
            title: "Rec Date",
            dataIndex: "RECDATE",
            width: 100,
            key: "recDate",
            onHeaderCell: () => ({ style: { fontSize: "12px" } }),
            render: (text) => (
                <span style={{ fontSize: "12px" }}>
                    {text ? moment(text).format("DD MMM YYYY") : ""}
                </span>
            ),
        },
        {
            title: "Rec Amt",
            dataIndex: "SCHEMEAMOUNT",
            key: "recAmount",
            align: "right",
            onHeaderCell: () => ({ style: { fontSize: "12px" } }),
            render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
        },
        {
            title: "Gold Wt",
            dataIndex: "goldWeight",
            key: "goldWeight",
            onHeaderCell: () => ({ style: { fontSize: "12px" } }),
            render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
        },
        {
            title: "Gold(1Gram)",
            dataIndex: "goldOneGram",
            key: "goldOneGram",
            width: 100,
            onHeaderCell: () => ({ style: { fontSize: "12px" } }),
            render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
        },
        {
            title: "Pay Mode",
            dataIndex: "modeOfPay",
            key: "modeOfPay",
            width: 100,
            onHeaderCell: () => ({ style: { fontSize: "12px" } }),
            render: (text) => <span style={{ fontSize: "12px" }}>{text}</span>,
        },

    ];


    return (
        <div>
            <Card
                className="customeproductcard"
                style={{
                    background: "linear-gradient(135deg,rgb(20, 54, 117),rgb(66, 110, 185))",
                    position: "relative",
                    overflow: "hidden",
                    color: "white",
                }}
            >

                <Row justify="space-between" align="middle" gutter={16}>
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
                            ref={cardNoRef}
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchMemberData();
                                    setTimeout(() => {
                                        inchargeRef.current?.focus();
                                    }, 100); // Slight delay ensures UI updates
                                }
                            }}
                            autoFocus
                        />

                        <Button type="primary" style={{ width: "40px", height: "40px" }} onClick={fetchMemberData}>
                            OK
                        </Button>
                        <Button
                            style={{ marginLeft: 10, fontSize: "16px", fontWeight: "bold" }}
                            onClick={() => {
                                setCardNo("");
                                setMemberData(null);
                                setSchemeCardData(null);
                                setTableData([]);
                                setTimeout(() => cardNoRef.current?.focus(), 100); // Focus after clearing

                            }}
                        >
                            <ReloadOutlined style={{ fontSize: "20px" }} />
                        </Button>
                    </Col>
                    {/* Right Side - Voucher No and Date Side by Side */}
                    <Col>
                        <Row gutter={16} align="middle">
                            {/* Voucher No Section */}
                            <Col style={{ display: "flex", alignItems: "center" }}>
                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white", marginRight: 4 }}>
                                    Voucher No
                                </Text>
                                <Text style={{ fontSize: "14px", fontWeight: "bold", color: "white", margin: "0 6px" }}>:</Text>
                                <Text style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>
                                    {voucherNo !== null ? voucherNo : "Loading..."}
                                </Text>
                            </Col>

                            {/* Date Section */}
                            <Col style={{ display: "flex", alignItems: "center" }}>
                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white", marginLeft: 15 }}>
                                    Date
                                </Text>
                                <Text style={{ fontSize: "14px", fontWeight: "bold", color: "white", margin: "0 6px" }}>:</Text>
                                <DatePicker
                                    selected={new Date()} // Replace with your date state
                                    dateFormat="dd MMM yyyy"
                                    customInput={<CustomInput />}
                                    popperPlacement="bottom"
                                    portalId="root"
                                    container="body"
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>

            <div style={{ marginTop: "6px" }}>
                <Row gutter={16}>
                    <Col span={17}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <Card
                                className="customeproductcard"
                                style={{
                                    backgroundImage: "linear-gradient(to right,rgb(73, 73, 143),rgb(44, 55, 155))",
                                    position: "relative",
                                    color: "white"
                                }}
                            >

                                <Row gutter={[16, 16]}>
                                    {/* Left Side: 3 columns */}
                                    <Col span={11}>
                                        <Row>
                                            {/* Member Name */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Member Name</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {schemeCardData?.MemberName}
                                            </Col>

                                            {/* Scheme Type */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Scheme Type</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {schemeCardData?.SchemeType}
                                            </Col>

                                            {/* Group Name */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Group Name</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {schemeCardData?.GroupName}
                                            </Col>
                                        </Row>
                                    </Col>

                                    {/* Vertical Divider */}
                                    <Col span={1} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Divider type="vertical" style={{ height: "100%", borderColor: "white", margin: "0" }} />
                                    </Col>

                                    {/* Right Side: 3 columns */}
                                    <Col span={11}>
                                        <Row>
                                            {/* Area */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Area</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {schemeCardData?.Area}
                                            </Col>

                                            {/* Address */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Address</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {schemeCardData?.Address}
                                            </Col>

                                            <Col span={8}><Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Mobile No </Text></Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :</Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>{schemeCardData?.mobile1}</Col>


                                        </Row>
                                    </Col>
                                </Row>

                            </Card>
                            {/* Colored Status Dots */}
                            <div style={{ position: "absolute", top: "14px", right: "10px", display: "flex", gap: "5px" }}>
                                {/* Red Dot - Dropped */}
                                <div
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        backgroundColor: "red",
                                        borderRadius: "50%",
                                    }}
                                    title="Dropped"
                                ></div>

                                {/* Green Dot - Receipt Paid */}
                                <div
                                    style={{
                                        width: "12px",
                                        height: "12px",
                                        backgroundColor: "green",
                                        borderRadius: "50%",
                                    }}
                                    title="Receipt Paid"
                                ></div>
                            </div>

                            <div style={{ fontSize: "12px", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "5px" }}>
                                <span>MEMBER DISCONTINUE</span>


                            </div>

                            <Table
                                size="small"
                                columns={columns}
                                dataSource={tableData}
                                pagination={false}
                                style={{ marginTop: "5px" }}
                                className="custom-table"
                                rowKey="sno"
                                scroll={{ y: 250 }}
                            />

                            <Row gutter={[16, 8]} style={{ marginTop: "10px" }}>
                                <Col span={6}><Text strong>Scheme Amt:</Text> {memberData?.SchemeAmount}</Col>
                                <Col span={6}><Text strong>Total Paid:</Text> {memberData?.TotalPaid}</Col>
                                <Col span={6}><Text strong>Balance Amt:</Text> {memberData?.BalanceAmount}</Col>
                                <Col span={6}><Text strong>Total Gold Wt:</Text> {memberData?.TotalGoldWeight}</Col>
                            </Row>

                            {/* Incharge and Description in the same row */}
                            <Row gutter={[16, 8]} style={{ marginTop: "10px", alignItems: "center" }}>
                                {/* Incharge Dropdown */}
                                <Col span={5} style={{ display: "flex", alignItems: "center" }}>
                                    <Text strong>Incharge</Text>
                                    <Text strong style={{ marginLeft: "4px" }}>:</Text>
                                </Col>
                                <Col span={7}>
                                    <div
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                if (isDiscontinued && inputRef.current) {
                                                    inputRef.current.focus();
                                                } else {
                                                    saveButtonRef.current?.click(); // Triggers Save
                                                }
                                            }
                                        }}
                                    >
                                        <Select
                                            ref={inchargeRef}
                                            showSearch
                                            placeholder="Select Incharge"
                                            style={{ width: "100%" }}
                                            value={schemeCardData?.incharge}
                                            onChange={(value) => {
                                                setSchemeCardData(prev => ({ ...prev, incharge: value }));
                                            }}
                                        >
                                            {inchargeList.map(incharge => (
                                                <Option key={incharge} value={incharge}>
                                                    {incharge}
                                                </Option>
                                            ))}
                                        </Select>
                                    </div>
                                </Col>

                            </Row>
                        </Card>

                    </Col>
                    <Col span={7}>


                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)", marginTop: "10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>SCHEME DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong>Monthly Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.amount}</Col>

                                {/* <Col span={10}><Text strong>Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.joinDate}</Col> */}

                                <Col span={10}><Text strong>Scheme Value</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.schemeValue}</Col>

                                <Col span={10}><Text strong>No of Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.noOfMonths}</Col>


                                <Col span={10}><Text strong>Total Scheme Amt</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.totalSchemeAmount}</Col>
                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{
                            backgroundImage: "linear-gradient(to right, #ff9a9e, #fad0c4)",
                        }}>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Scheme Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{schemeCardData?.joinDate}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Scheme End Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{schemeCardData?.SchemeEndDate}</Col>
                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{
                            backgroundImage: "linear-gradient(to right,rgb(24, 9, 66),rgb(245, 167, 154))",
                            color: "white"
                        }}>
                            <Row>
                                <Col span={10}><Text strong style={{ color: "white" }}>Bonus Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center", color: "white" }}><Text strong style={{ textAlign: "center", color: "white" }}>:</Text></Col>
                                <Col span={12}>{schemeCardData?.bonusAmount}</Col>
                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)", marginTop: "5px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", }}>PAYMENT DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong>Pending Dues</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.paidAmount}</Col>

                                <Col span={10}><Text strong>Balence Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.bonusAmount}</Col>

                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Checkbox checked={isDiscontinued} onChange={handleCheckboxChange}>
                                        <b>Discontinue</b>
                                    </Checkbox>
                                </Col>

                                {/* Description Input */}
                                {isDiscontinued && (
                                    <>
                                        <Col span={10} style={{ display: "flex", alignItems: "center" }}>
                                            <Text strong>Remarks</Text>
                                        </Col>
                                        <Col span={2} style={{ textAlign: "center" }}>
                                            <Text strong>:</Text>
                                        </Col>
                                        <Col span={12}>
                                            <Input
                                                ref={inputRef}
                                                placeholder="Enter Narr"
                                                value={schemeCardData?.narr || ""}
                                                onChange={(e) => {
                                                    const narrValue = e.target.value;
                                                    setSchemeCardData(prev => ({ ...prev, narr: narrValue }));
                                                }}
                                                onPressEnter={() => {
                                                    saveButtonRef.current?.click(); // Triggers Save
                                                }}
                                            />

                                        </Col>
                                    </>
                                )}
                            </Row>
                            {isEligibleForDrop ? (
                                <Button
                                    type="primary"
                                    style={{ marginTop: "10px", width: "100%" }}
                                    ref={saveButtonRef}
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            ) : (
                                <Text
                                    style={{
                                        marginTop: "10px",
                                        display: "block",
                                        width: "100%",
                                        textAlign: "center",
                                        color: "red",
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}
                                >
                                    Not eligible for drop
                                </Text>
                            )}


                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default MemeberDiscontinue;
