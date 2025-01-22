import React, { useState, useEffect } from "react";
import { Card, Popover, Button } from "antd";
import { MoneyCollectOutlined, WalletOutlined } from "@ant-design/icons";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
const LatestDues = () => {
    const [openTodayDuesPopover, setOpenTodayDuesPopover] = useState(false);
    const [openTotalDuesPopover, setOpenTotalDuesPopover] = useState(false);
    const [todayDuesList, setTodayDuesList] = useState([]);
    const [totalDuesList, setTotalDuesList] = useState([]);
    const [totalTodayDues, setTotalTodayDues] = useState(0);
    const [totalDues, setTotalDues] = useState(0);

    useEffect(() => {
        const fetchDues = async () => {
            try {
                const currentDate = new Date().toLocaleDateString('en-US');
                const todayDuesResponse = await axios.get(`${CREATE_jwel}/api/DashBoard/GetTodayDues?date=${encodeURIComponent(currentDate)}`);
                const totalDuesResponse = await axios.get(`${CREATE_jwel}/api/DashBoard/GetTotalDues`);

                const todayDues = todayDuesResponse.data;
                const totalDues = totalDuesResponse.data;

                setTodayDuesList(todayDues.map(due => `${due.CustName} - ₹${due.BalanceAmt}`));
                setTotalDuesList(totalDues.map(due => `${due.CustName} - ₹${due.BalanceAmt}`));

                setTotalTodayDues(todayDues.reduce((acc, due) => acc + due.BalanceAmt, 0));
                setTotalDues(totalDues.reduce((acc, due) => acc + due.BalanceAmt, 0));
            } catch (error) {
                console.error("Error fetching dues data:", error);
            }
        };

        fetchDues();
    }, []);

    const todayDuesContent = (
        <div>
            <ul>
                {todayDuesList.map((due, index) => (
                    <li key={index}>{due}</li>
                ))}
            </ul>
        </div>
    );

    const totalDuesContent = (
        <div>
            <ul>
                {totalDuesList.map((due, index) => (
                    <li key={index}>{due}</li>
                ))}
            </ul>
        </div>
    );

    return (
        <Card
            style={{
                background: "linear-gradient(135deg,rgb(198, 200, 204),rgb(73, 74, 75))",
                color: "white",
                borderRadius: "16px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
                position: "relative",
                padding: "10px",
                overflow: "hidden",
            }}
            bordered={false}
        >
            <div
                style={{
                    position: "absolute",
                    top: "-40px",
                    left: "-40px",
                    width: "120px",
                    height: "120px",
                    background: "rgba(255, 255, 255, 0.15)",
                    borderRadius: "50%",
                }}
            ></div>
            <div
                style={{
                    position: "absolute",
                    bottom: "-30px",
                    right: "-30px",
                    width: "100px",
                    height: "100px",
                    background: "rgba(255, 255, 255, 0.1)",
                    borderRadius: "50%",
                }}
            ></div>
            <div
                style={{
                    margin: 0,
                    fontSize: "16px",
                    fontWeight: "bold",
                    opacity: 0.8,
                }}
            >
                Latest Dues
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ fontSize: "14px", opacity: 0.8 }}>Today's Dues</div>
                <MoneyCollectOutlined style={{ fontSize: "20px", color: "#ffd700" }} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{
                    fontSize: "12px", fontWeight: "bold", marginTop: "5px"
                }}>₹{totalTodayDues}</div>
                <Popover
                    content={todayDuesContent}
                    title="Today's Dues"
                    trigger="click"
                    open={openTodayDuesPopover}
                    onOpenChange={(open) => setOpenTodayDuesPopover(open)}
                >
                    <Button
                        size="small"
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            borderRadius: "10px",
                            marginTop: "5px"
                        }}
                    >
                        Check
                    </Button>
                </Popover>
            </div>

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{
                    fontSize: "14px", opacity: 0.8, marginTop: "5px"
                }}>Total Dues</div>
                <WalletOutlined style={{
                    fontSize: "13px", color: "#ffd700", marginTop: "5px"
                }} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "5px"
                }}
            >
                <div style={{
                    fontSize: "13px", fontWeight: "bold", marginTop: "5px"
                }}>₹{totalDues}</div>
                <Popover
                    content={totalDuesContent}
                    title="Total Dues"
                    trigger="click"
                    open={openTotalDuesPopover}
                    onOpenChange={(open) => setOpenTotalDuesPopover(open)}
                >
                    <Button
                        size="small"
                        style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            borderRadius: "10px",
                            marginTop: "10px"
                        }}
                    >
                        Check
                    </Button>
                </Popover>
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "-20px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)",
                }}
            ></div>
        </Card>
    );
};

export default LatestDues;
