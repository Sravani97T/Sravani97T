import React, { useState, useEffect, useRef } from "react";
import { Input, Button, Row, Col, Card, Typography, Table, message, Divider } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import { ReloadOutlined, } from "@ant-design/icons";

const { Text } = Typography;

const MemberCard = () => {
    const [cardNo, setCardNo] = useState("");
    const [memberData, setMemberData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [rates, setRates] = useState([]);
    const [, setIndex] = useState(0);
    const cardNoRef = useRef(null);


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })?.format(date);
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
    const columns = [
        {
            title: "Inst.No", dataIndex: "sno", key: "sno", align: "center",
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
            title: "Inst.Date", dataIndex: "MONTH", width: 90, key: "month", render: (text) => (text ? formatDate(text) : "")
        },
        { title: "Rec No", dataIndex: "RECNO", key: "recNo", align: "center" },
        { title: "Rec Date", dataIndex: "RECDATE", key: "receiptdate", render: (text) => (text ? formatDate(text) : "") },

        { title: "Rec Amt", dataIndex: "SCHEMEAMOUNT", key: "recAmount", align: "right" },
        { title: "Gold Wt", dataIndex: "goldWeight", key: "goldWeight" },
        { title: "Gold(1Gram)", dataIndex: "goldOneGram", key: "goldOneGram" },
        { title: "Mode of Pay", dataIndex: "modeOfPay", key: "modeOfPay" },
    ];

    // const fetchMemberData = async () => {
    //     if (!cardNo) {
    //         message.error("Please enter a valid Card No.");
    //         return;
    //     }

    //     try {
    //         const response = await axios.get(
    //             `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
    //             {
    //                 params: {
    //                     tableName: "MEMBER_CARD_DET",
    //                     where: `CARDNO=${cardNo}`,
    //                 },
    //             }
    //         );

    //         const data = response.data;

    //         if (data && data.length > 0) {
    //             setTableData(data);

    //             const firstRecord = data[0];
    //             const paidAmount = data.reduce((sum, item) => sum + (item.RECNO ? item.SCHEMEAMOUNT : 0), 0);
    //             const totalAmount = firstRecord.SCHEMEAMOUNT * firstRecord.SCHEMEDURATION;
    //             const balanceMonths = data.filter(item => !item.RECNO).length;

    //             setMemberData({
    //                 MemberName: firstRecord.SCHEMEMEMBER,
    //                 SchemeType: firstRecord.SCHEMETYPE,
    //                 GroupName: firstRecord.SCHEMEGROUP,
    //                 SchemeAmount: firstRecord.SCHEMEAMOUNT,
    //                 SchemeDuration: firstRecord.SCHEMEDURATION,

    //                 TotalPaid: paidAmount,
    //                 BalanceAmount: totalAmount - paidAmount,
    //                 TotalGoldWeight: "N/A", // Update if you calculate from GOLDWT
    //                 MembershipType: firstRecord.SCHEMENAME,
    //                 JoinDate: firstRecord.SCHEMEJOINDATE,
    //                 ExpiryDate: firstRecord.SCHEMEENDDATE,

    //                 // Address and contact fields from ADD1-ADD4 and AREA
    //                 Address: `${firstRecord.ADD1 || ""} ${firstRecord.ADD2 || ""} ${firstRecord.ADD3 || ""} ${firstRecord.ADD4 || ""}`.trim(),
    //                 Area: firstRecord.AREA,
    //                 Pincode: firstRecord.PINCODE || "", // Only if PINCODE exists
    //                 Email: firstRecord.EMAIL || "",     // Only if EMAIL exists
    //                 Phone: firstRecord.MOBILE1 || "",   // Only if MOBILE1 exists

    //                 // Calculated fields
    //                 RecentPaidDate: data.find(item => item.RECNO)?.RECDATE || "N/A",
    //                 PendingDues: totalAmount - paidAmount,
    //                 BalanceMonths: balanceMonths,
    //             });
    //         } else {
    //             message.error("No data found for the entered Card No.");
    //             setTableData([]);
    //             setMemberData(null);
    //         }
    //     } catch (error) {
    //         message.error("Failed to fetch data. Please try again.");
    //         console.error(error);
    //     }
    // };
    const fetchMemberData = async () => {
        if (!cardNo) {
            message.error("Please enter a valid Card No.");
            return;
        }

        try {
            // First API: MEMBER_CARD_DET
            const memberCardResponse = await axios.get(
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
                {
                    params: {
                        tableName: "MEMBER_CARD_DET",
                        where: `CARDNO=${cardNo}`,
                    },
                }
            );

            const memberCardData = memberCardResponse.data;

            // Second API: SCHEME_MEMBER
            const schemeMemberResponse = await axios.get(
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
                {
                    params: {
                        tableName: "SCHEME_MEMBER",
                        where: `CARDNO='${cardNo}'`,
                    },
                }
            );

            const schemeMemberData = schemeMemberResponse.data?.[0] || {};

            if (memberCardData && memberCardData.length > 0) {
                setTableData(memberCardData);

                const firstRecord = memberCardData[0];
                const paidAmount = memberCardData.reduce(
                    (sum, item) => sum + (item.RECNO ? item.SCHEMEAMOUNT : 0),
                    0
                );
                const totalAmount = firstRecord.SCHEMEAMOUNT * firstRecord.SCHEMEDURATION;
                const balanceMonths = memberCardData.filter(item => !item.RECNO).length;

                setMemberData({
                    MemberName: firstRecord.SCHEMEMEMBER,
                    SchemeType: firstRecord.SCHEMETYPE,
                    GroupName: firstRecord.SCHEMEGROUP,
                    SchemeAmount: firstRecord.SCHEMEAMOUNT,
                    SchemeDuration: firstRecord.SCHEMEDURATION,

                    TotalPaid: paidAmount,
                    BalanceAmount: totalAmount - paidAmount,
                    TotalGoldWeight: "N/A", // Placeholder
                    MembershipType: firstRecord.SCHEMENAME,
                    JoinDate: firstRecord.SCHEMEJOINDATE,
                    ExpiryDate: firstRecord.SCHEMEENDDATE,

                    Address: `${firstRecord.ADD1 || ""} ${firstRecord.ADD2 || ""} ${firstRecord.ADD3 || ""} ${firstRecord.ADD4 || ""}`.trim(),
                    Area: firstRecord.AREA,
                    Pincode: firstRecord.PINCODE || "",
                    Email: firstRecord.EMAIL || "",
                    Phone: firstRecord.MOBILE1 || "",

                    RecentPaidDate: memberCardData.find(item => item.RECNO)?.RECDATE || "N/A",
                    PendingDues: totalAmount - paidAmount,
                    BalanceMonths: balanceMonths,

                    // Added from SCHEME_MEMBER
                    SchemeDropping: schemeMemberData.SchemeDropping || false,
                });
            } else {
                message.warning("No data found for the entered Card No.");
                setTableData([]);
                setMemberData(null);
            }
        } catch (error) {
            message.error("Failed to fetch data. Please try again.");
            console.error(error);
        }
    };

    const Paidmonths = tableData.filter(item => item.RECNO).length;
    return (
        <div>

            <Card
                className="customeproductcard"
                style={{
                    background: "linear-gradient(135deg, rgb(20, 54, 117), rgb(66, 110, 185))",
                    position: "relative",
                    overflow: "hidden",
                    color: "white",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px)",
                        backgroundSize: "10px 10px",
                        opacity: 0.2,
                    }}
                ></div>

                <Row gutter={[16, 16]} align="middle" justify="space-between" style={{ zIndex: 1 }}>
                    {/* Left Section: Card No */}
                    <Col xs={24} md={8} style={{ display: "flex", alignItems: "center" }}>
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    fetchMemberData();
                                }
                            }}
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
                        />

                        <Button type="primary" style={{ width: "40px", height: "40px" }} onClick={fetchMemberData}>
                            OK
                        </Button>
                        <Button
                            style={{ marginLeft: 10, fontSize: "16px", fontWeight: "bold" }}
                            onClick={() => {
                                setCardNo("");
                                setMemberData(null);
                                setTableData([]);
                                setTimeout(() => cardNoRef.current?.focus(), 100); // Focus after clearing

                            }}
                        >
                            <ReloadOutlined style={{ fontSize: "20px" }} />
                        </Button>
                    </Col>

                    {/* Middle Section: Bill Details */}
                    <Col xs={24} md={7}>
                        <div style={{ border: "1px solid lightgrey", borderRadius: "6px", padding: "5px" }}>
                            <Row gutter={[16, 8]}>
                                {/* Bill No and Bill Date - Side by Side */}
                                <Col span={12}>
                                    <Row gutter={[4, 4]}>
                                        <Col span={10}><Text strong style={{ fontSize: "12px", color: "white" }}>Bill No</Text></Col>
                                        <Col span={2}><Text strong style={{ color: "white" }}>:</Text></Col>
                                        <Col span={12}><Text strong style={{ color: "white" }}>{memberData?.BillNo}</Text></Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row gutter={[4, 4]}>
                                        <Col span={10}><Text strong style={{ fontSize: "12px", color: "white" }}>Bill Date</Text></Col>
                                        <Col span={2}><Text strong style={{ color: "white" }}>:</Text></Col>
                                        <Col span={12}><Text strong style={{ color: "white" }}>{memberData?.BillDate}</Text></Col>
                                    </Row>
                                </Col>

                                {/* Jewel Type - Full Row */}
                                <Col span={24}>
                                    <Row gutter={[4, 4]}>
                                        <Col span={10}><Text strong style={{ fontSize: "12px", color: "white" }}>Jewel Type</Text></Col>
                                        <Col span={2}><Text strong style={{ color: "white" }}>:</Text></Col>
                                        <Col span={12}><Text strong style={{ color: "white" }}>{memberData?.JewelType}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>

                        </div>
                    </Col>

                    {/* Right Section: Settlement Details */}
                    <Col xs={24} md={7}>
                        <div style={{ border: "1px solid lightgrey", borderRadius: "6px", padding: "5px" }}>

                            <Row gutter={[4, 8]}>
                                <Col span={10}><Text strong style={{ fontSize: "12px", color: "white" }}>Settlement No</Text></Col>
                                <Col span={2}><Text strong style={{ color: "white" }}>:</Text></Col>
                                <Col span={12}><Text strong style={{ color: "white" }}>{memberData?.settlementNo}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "12px", color: "white" }}>Dropped Entry No</Text></Col>
                                <Col span={2}><Text strong style={{ color: "white" }}>:</Text></Col>
                                <Col span={12}><Text strong style={{ color: "white" }}>{memberData?.dropEntryNo}</Text></Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Card>

            <div style={{ marginTop: "6px" }}>
                <Row gutter={16}>
                    <Col span={17}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "5px" }}>MEMBER DETAILS</div>
                            {/* ✅ Top-Right Scheme Completed Tag */}
                            {memberData?.SchemeDropping ? (
                                <div style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    backgroundColor: "#fa1414",
                                    color: "#fff",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                }}>
                                    Member Discontinued
                                </div>
                            ) : memberData?.SchemeDuration === Paidmonths && (
                                <div style={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    backgroundColor: "#52c41a",
                                    color: "#fff",
                                    padding: "4px 12px",
                                    borderRadius: "20px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                }}>
                                    Scheme Completed
                                </div>
                            )}

                            <Card
                                className="customeproductcard"
                                style={{
                                    backgroundImage: "linear-gradient(to right,rgb(73, 73, 143),rgb(44, 55, 155))",
                                    position: "relative",
                                    color: "white",
                                    marginTop: "15px",
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
                                                {memberData?.MemberName}
                                            </Col>

                                            {/* Scheme Type */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Scheme Type</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {memberData?.SchemeType}
                                            </Col>

                                            {/* Group Name */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Group Name</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {memberData?.GroupName}
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
                                                {memberData?.Area}
                                            </Col>

                                            {/* Address */}
                                            <Col span={8}>
                                                <Text strong style={{ fontSize: "12px", fontWeight: "bold", color: "white" }}>Address</Text>
                                            </Col>
                                            <Col span={2} style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                                                :
                                            </Col>
                                            <Col span={14} style={{ fontSize: "11px", fontWeight: "bold", color: "white" }}>
                                                {memberData?.Address}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>


                            </Card>
                            <Table
                                size="small"
                                columns={columns}
                                dataSource={tableData}
                                pagination={false}
                                style={{ marginTop: "10px" }}
                                rowKey="sno"
                                className="custom-table" // 👈 Add a class for more styling control
                                scroll={{ y: 200 }} // 👈 Set table height and enable vertical scrolling
                            />

                            <Row gutter={[16, 8]} style={{ marginTop: "10px", justifyContent: "space-between", alignItems: "center", }}>
                                <Col span={6}><Text strong>Total Gold Weight:</Text> {memberData?.TotalGoldWeight}</Col>

                                <Col span={6}><Text strong>Total Paid:</Text> {memberData?.TotalPaid}</Col>
                                <Col span={6}><Text strong>Balance Amount:</Text> {memberData?.BalanceAmount}</Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={7}>
                        {/* Scheme Details */}
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>SCHEME DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>No. Of Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.SchemeDuration}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Monthly Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.SchemeAmount}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Scheme Value</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.SchemeValue} WT</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Bonus Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.BonusAmount}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Total Scheme Amt</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.SchemeAmount}</Text></Col>
                            </Row>
                        </Card>
                        <Card className="customeproductcard" style={{
                            backgroundImage: "linear-gradient(to right, #ff9a9e, #fad0c4)",
                        }}>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Scheme Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{memberData?.JoinDate ? formatDate(memberData?.JoinDate) : ""}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Scheme End Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{memberData?.ExpiryDate ? formatDate(memberData?.ExpiryDate) : ""}</Col>
                            </Row>
                        </Card>
                        {/* Pending Dues */}
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>PENDING DUES</div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Total Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{memberData ? memberData.SchemeDuration : ""}</Col>
                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Paid Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{Paidmonths}</Col>

                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Balance Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}> {memberData ? memberData.SchemeDuration - Paidmonths : ""}</Col>
                                <Col span={10}><Text strong style={{ fontSize: "12px", fontWeight: "bold" }}>Paid Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong style={{ fontSize: "16px", fontWeight: "bold" }}>:</Text></Col>
                                <Col span={12} style={{ fontSize: "12px", fontWeight: "bold" }}>{memberData ? memberData?.SchemeAmount * Paidmonths : ""}</Col>

                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MemberCard;