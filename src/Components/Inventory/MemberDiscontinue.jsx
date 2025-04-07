import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Input, Button, Row, Col, Card, Typography, Table, message, Select, Checkbox } from "antd";
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
    const [index, setIndex] = useState(0);
    const [inchargeList, setInchargeList] = useState([]);

    const cardNoRef = useRef(null);
    const inchargeRef = useRef(null);
    const inputRef = useRef(null);
    const saveButtonRef = useRef(null);

    const [isDiscontinued, setIsDiscontinued] = useState(false);
    const [schemeCardData, setSchemeCardData] = useState({});
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
                `${CREATE_jwel}/api/Scheme/GetSchemeMaxNumberInTable?tableName=SCHEME_MIDDLEDROP&column=smdRecno`
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
                setTableData([]);
                setMemberData(null);
                message.error("No payment data found for the entered Card No.");
            }

            // 3️⃣ Handle scheme/voucher/payment detail card values
            if (schemeData) {
                setSchemeCardData({
                    address: schemeData.add1,
                    mobile1: schemeData.Mobile1,
                    mobile2: schemeData.Mobile2,

                    amount: schemeData.SchemeAmount,
                    joinDate: moment(schemeData.SchemeJoinDate).format("DD-MM-YYYY"),
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

    const handleSave = async () => {
        const now = new Date().toISOString();
        const safeDate = (val) => val ? new Date(val).toISOString() : now;

        const body = {
            smdRecno: Number(voucherNo) || 0,
            smdRecDate: now,
            smdRecTime: now,
            empCode: schemeCardData?.empCode ?? "",
            schemeGroup: schemeCardData?.schemeGroup ?? "",
            schemeName: schemeCardData?.schemeName ?? "",
            goldRate: Number(schemeCardData?.goldRate) || 0,
            cardNo: schemeCardData?.cardNo ?? "",
            phno: schemeCardData?.mobile1 ?? "",
            schemeMember: schemeCardData?.memberName ?? "",
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
            uname: schemeCardData?.uname ?? "",
            schemeType: schemeCardData?.schemeType ?? "",
            schemeMode: schemeCardData?.schemeMode ?? "",
            mobile1: schemeCardData?.mobile1 ?? "",
            mobile2: schemeCardData?.mobile2 ?? "",
            cloud_upload: true,
            schemE_ENDDATE: now,
            incharge: schemeCardData?.incharge,


        };
console.log("schemeCardData",schemeCardData)
        try {
            await axios.post("http://www.jewelerp.timeserasoftware.in/api/Scheme/SchemeMiddleDropInsert", body);
            message.success("Scheme saved successfully!");
            setTimeout(() => {
                cardNoRef.current?.focus();
              }, 0);
           // Second: update member dropping
    await axios.post(`http://www.jewelerp.timeserasoftware.in/api/Scheme/UpdateSchemeMemberDropping?schemeDropping=true&cardNO=${cardNo}`, {
       
      });
  
  
    

      fetchVoucherNo();
  
      // Reset fields
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
            title: "S.No",
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
            title: "Date",
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
        {
            title: "Balance",
            dataIndex: "balance",
            key: "balance",
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
                            }}
                        >
                            <ReloadOutlined style={{ fontSize: "20px" }} />
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
                                <span>MEMBER DISCONTINUE</span>

                                <div style={{ display: "flex", gap: "20px" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <Text strong style={{ fontSize: "16px", color: "#d10507" }}>Voucher No</Text>
                                        <Text strong style={{ marginLeft: "4px", color: "#d10507" }}>:</Text>
                                        <Text strong style={{ marginLeft: "6px", fontSize: "16px", color: "#d10507" }}> {voucherNo !== null ? voucherNo : "Loading..."}</Text>
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
                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>VOUCHER DETAILS</div>
                            <Row>


                                <Col span={10}><Text strong>Address</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.address}</Col>

                                <Col span={10}><Text strong>Mobile No 1</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.mobile1}</Col>

                                <Col span={10}><Text strong>Mobile No 2</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.mobile2}</Col>
                            </Row>
                        </Card>

                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)", marginTop: "10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>SCHEME DETAILS</div>
                            <Row>
                                <Col span={10}><Text strong>Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.amount}</Col>

                                <Col span={10}><Text strong>Join Date</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.joinDate}</Col>

                                <Col span={10}><Text strong>Scheme Value</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.schemeValue}</Col>

                                <Col span={10}><Text strong>No of Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.noOfMonths}</Col>

                                <Col span={10}><Text strong>Bonus Amount</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.bonusAmount}</Col>

                                <Col span={10}><Text strong>Bonus Months</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.bonusMonths}</Col>

                                <Col span={10}><Text strong>Total Scheme Amt</Text></Col>
                                <Col span={2} style={{ textAlign: "center" }}><Text strong>:</Text></Col>
                                <Col span={12}>{schemeCardData?.totalSchemeAmount}</Col>
                            </Row>
                        </Card>

                        <Card className="customeproductcard" style={{ backgroundImage: "linear-gradient(to right, #cdcddf, #a8b1ff)", marginTop: "10px" }}>
                            <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "5px" }}>PAYMENT DETAILS</div>
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
                            <Button type="primary" style={{ marginTop: "10px", width: "100%" }} ref={saveButtonRef}
                                onClick={handleSave}>Save</Button>
                        </Card>
                    </Col>
                </Row>

            </div>
        </div>
    );
};

export default MemeberDiscontinue;
