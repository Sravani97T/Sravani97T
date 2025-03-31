import React, { useState, useEffect } from "react";
import { Input, Button, Row, Col, Card, Typography, Table, message } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import moment from "moment";

const { Text } = Typography;

const MemberCard = () => {
    const [cardNo, setCardNo] = useState("");
    const [memberData, setMemberData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [rates, setRates] = useState([]);
    const [index, setIndex] = useState(0);

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
        { title: "S.No", dataIndex: "sno", key: "sno" },
        {
            title: "Month", dataIndex: "MONTH", key: "month", render: (text) => text ? moment(text, "MM/DD/YYYY").format("DD MMM YYYY") : "",
        },
        { title: "Rec No", dataIndex: "RECNO", key: "recNo" },
        { title: "Rec Amt", dataIndex: "SCHEMEAMOUNT", key: "recAmount" },
        { title: "Gold Wt", dataIndex: "goldWeight", key: "goldWeight" },
        { title: "Gold(1Gram)", dataIndex: "goldOneGram", key: "goldOneGram" },
        { title: "Mode of Pay", dataIndex: "modeOfPay", key: "modeOfPay" },
        { title: "Balance", dataIndex: "balance", key: "balance" },
    ];

    const fetchMemberData = async () => {
        if (!cardNo) {
            message.error("Please enter a valid Card No.");
            return;
        }

        try {
            const response = await axios.get(
                `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere`,
                {
                    params: {
                        tableName: "MEMBER_CARD_DET",
                        where: `CARDNO=${cardNo}`,
                    },
                }
            );

            const data = response.data;

            if (data && data.length > 0) {
                setTableData(data);
                setMemberData({
                    MemberName: data[0].SCHEMEMEMBER,
                    SchemeType: data[0].SCHEMETYPE,
                    GroupName: data[0].SCHEMEGROUP,
                    SchemeAmount: data[0].SCHEMEAMOUNT,
                    TotalPaid: data.reduce((sum, item) => sum + (item.RECNO ? item.SCHEMEAMOUNT : 0), 0),
                    BalanceAmount: data[0].SCHEMEAMOUNT * data[0].SCHEMEDURATION - data.reduce((sum, item) => sum + (item.RECNO ? item.SCHEMEAMOUNT : 0), 0),
                    TotalGoldWeight: "N/A", // Replace with actual calculation if available
                    MembershipType: data[0].SCHEMENAME,
                    JoinDate: data[0].SCHEMEJOINDATE,
                    ExpiryDate: data[0].SCHEMEENDDATE,
                });
            } else {
                message.error("No data found for the entered Card No.");
                setTableData([]);
                setMemberData(null);
            }
        } catch (error) {
            message.error("Failed to fetch data. Please try again.");
            console.error(error);
        }
    };

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
                        />
                        <Button type="primary" style={{ width: "40px", height: "40px" }} onClick={fetchMemberData}>
                            OK
                        </Button>
                    </Col>

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
                    <Col span={16}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>MEMBER DETAILS</div>
                            <Card
                                className="customeproductcard"
                                style={{
                                    backgroundImage: "linear-gradient(to right,rgb(73, 73, 143),rgb(44, 55, 155))",
                                    position: "relative",
                                    paddingTop: "10px",
                                    color: "white"
                                }}
                            >
                                {/* Colored Status Dots */}
                                <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
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

                                <Row>
                                    {/* Member Name */}
                                    <Col span={6}>
                                        <Text strong style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>Member Name</Text>
                                    </Col>
                                    <Col span={2} style={{ textAlign: "left" }}>
                                        <Text strong style={{ fontSize: "16px", fontWeight: "bold", color: "white" }}>:</Text>
                                    </Col>
                                    <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        {memberData?.MemberName}
                                    </Col>

                                    {/* Scheme Type */}
                                    <Col span={6}>
                                        <Text strong style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>Scheme Type</Text>
                                    </Col>
                                    <Col span={2} style={{ textAlign: "left" }}>
                                        <Text strong style={{ fontSize: "16px", fontWeight: "bold", color: "white" }}>:</Text>
                                    </Col>
                                    <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        {memberData?.SchemeType}
                                    </Col>

                                    {/* Group Name */}
                                    <Col span={6}>
                                        <Text strong style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>Group Name</Text>
                                    </Col>
                                    <Col span={2} style={{ textAlign: "left" }}>
                                        <Text strong style={{ fontSize: "16px", fontWeight: "bold", color: "white" }}>:</Text>
                                    </Col>
                                    <Col span={12} style={{ fontSize: "14px", fontWeight: "bold" }}>
                                        {memberData?.GroupName}
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
                                className="custom-small-table" // 👈 Add a class for more styling control

                                scroll={{ y: 300 }} // 👈 Set table height and enable vertical scrolling
                            />
                            <Row gutter={[16, 8]} style={{ marginTop: "10px" }}>
                                <Col span={6}><Text strong>Scheme Amount:</Text> {memberData?.SchemeAmount}</Col>
                                <Col span={6}><Text strong>Total Paid:</Text> {memberData?.TotalPaid}</Col>
                                <Col span={6}><Text strong>Balance Amount:</Text> {memberData?.BalanceAmount}</Col>
                                <Col span={6}><Text strong>Total Gold Weight:</Text> {memberData?.TotalGoldWeight}</Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={8}>
                        {/* Scheme Details */}
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>SCHEME DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>No. Of Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.noOfMonths}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Scheme Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.joinDate}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.amount}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Scheme Value</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.schemeValue} WT</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Bonus Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.bonusAmount}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Gift Voucher</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.giftVoucher}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Total Scheme Amt</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.totalSchemeAmt}</Text></Col>
                            </Row>
                        </Card>

                        {/* Pending Dues */}
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>PENDING DUES</div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Pending Dues</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.pendingDues}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Balance Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.balanceMonths}</Text></Col>
                            </Row>
                        </Card>

                        {/* Bill Details */}
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>BILL DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Bill No</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.billNo}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Bill Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.billDate}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Jewel Type</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.jewelType}</Text></Col>
                            </Row>
                        </Card>

                        {/* Settlement Details */}
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>SETTLEMENT DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Settlement No</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.settlementNo}</Text></Col>

                                <Col span={10}><Text strong style={{ fontSize: "14px" }}>Dropped Entry No</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}><Text strong>{memberData?.dropEntryNo}</Text></Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default MemberCard;