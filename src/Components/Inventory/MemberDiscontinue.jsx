import React, { useState, useEffect, forwardRef } from "react";
import { Input, Button, Row, Col, Card, Typography, Table, message, Select, Checkbox,  } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
import moment from "moment";
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
const MemberDiscontinue = () => {
    const [cardNo, setCardNo] = useState("");
    const [memberData, setMemberData] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [rates, setRates] = useState([]);
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
    }, [goldRates.length]); const voucherData = {
        voucherNo: "12345",
        date: "2024-03-31",
        address: "123 Street Name",
        mobile1: "9876543210",
        mobile2: "9876543211",
    };

    const schemeData = {
        amount: "5000",
        joinDate: "2024-01-01",
        schemeValue: "5500",
        noOfMonths: "12",
        bonusAmount: "500",
        bonusMonths: "2",
        totalSchemeAmount: "6000",
    };

    const paymentData = {
        paidAmount: "3000",
        bonusAmount: "200",
        totalAmount: "3200",
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
        { title: "S.No", dataIndex: "sno", key: "sno" },
        { title: "Date", dataIndex: "MONTH", key: "month", render: (text) => text ? moment(text, "MM/DD/YYYY").format("DD MMM YYYY") : "" },
        { title: "Rec No", dataIndex: "RECNO", key: "recNo" },
        { title: "Rec Date", dataIndex: "RECDATE", key: "recDate", render: (text) => text ? moment(text, "MM/DD/YYYY").format("DD MMM YYYY") : "" },
        { title: "Rec Amt", dataIndex: "SCHEMEAMOUNT", key: "recAmount" },
        { title: "Gold Wt", dataIndex: "goldWeight", key: "goldWeight" },
        { title: "Gold(1Gram)", dataIndex: "goldOneGram", key: "goldOneGram", width: 100 },
        { title: "Pay Mode", dataIndex: "modeOfPay", key: "modeOfPay", width: 100 },
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
                    TotalGoldWeight: "N/A",
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
                    <Col span={17}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
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

                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span>Member Discontinue</span>

                                <div style={{ display: "flex", gap: "20px" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Text strong style={{ fontSize: "16px", color: "#d10507" }}>Entry No</Text>
                                        <Text strong style={{ marginLeft: "4px", color: "#d10507" }}>:</Text>
                                        <Text strong style={{ marginLeft: "6px", fontSize: "16px", color: "#d10507" }}>{voucherData?.voucherNo}</Text>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Text strong style={{ fontSize: "16px", color: "#060491" }}>Date</Text>
                                        <Text strong style={{ marginRight: "10px", color: "#060491" }}>:</Text>

                                        <DatePicker
                                            selected={new Date()} // Sets the current date as default
                                            dateFormat="dd MMM yyyy" // Formats date as "27 Mar 2025"
                                            customInput={<CustomInput />}
                                            popperPlacement="bottom"
                                            portalId="root"
                                            container="body"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Table
                                size="small"
                                columns={columns}
                                dataSource={tableData}
                                pagination={false}
                                style={{ marginTop: "10px" }}
                                rowKey="sno"
                                scroll={{ y: 300 }}
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
                                    <Select placeholder="Select Incharge" style={{ width: "100%" }}>
                                        <Option value="incharge1">Incharge 1</Option>
                                        <Option value="incharge2">Incharge 2</Option>
                                    </Select>
                                </Col>

                                {/* Description Input */}
                                <Col span={5} style={{ display: "flex", alignItems: "center" }}>
                                    <Text strong>Description</Text>
                                    <Text strong style={{ marginLeft: "4px" }}>:</Text>
                                </Col>
                                <Col span={7}>
                                    <Input placeholder="Enter Description" />
                                </Col>
                            </Row>
                        </Card>



                    </Col>
                    <Col span={7}>
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>VOUCHER DETAILS</div>
                            <Row>


                                <Col span={10}><Text strong>Address</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{voucherData?.address}</Col>

                                <Col span={10}><Text strong>Mobile No 1</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{voucherData?.mobile1}</Col>

                                <Col span={10}><Text strong>Mobile No 2</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{voucherData?.mobile2}</Col>
                            </Row>
                        </Card>

                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)", marginTop: "10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>SCHEME DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong>Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.amount}</Col>

                                <Col span={10}><Text strong>Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.joinDate}</Col>

                                <Col span={10}><Text strong>Scheme Value</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.schemeValue}</Col>

                                <Col span={10}><Text strong>No of Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.noOfMonths}</Col>

                                <Col span={10}><Text strong>Bonus Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.bonusAmount}</Col>

                                <Col span={10}><Text strong>Bonus Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.bonusMonths}</Col>

                                <Col span={10}><Text strong>Total Scheme Amt</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeData?.totalSchemeAmount}</Col>
                            </Row>
                        </Card>

                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)", marginTop: "10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>PAYMENT DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong>Pending Dues</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{paymentData?.paidAmount}</Col>

                                <Col span={10}><Text strong>Balence Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{paymentData?.bonusAmount}</Col>

                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Checkbox>Discontinue</Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Input />
                                </Col>
                            </Row>
                            <Button type="primary" style={{ marginTop: "10px", width: "100%" }}>Save</Button>
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default MemberDiscontinue;
