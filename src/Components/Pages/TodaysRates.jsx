import React, { useEffect, useState } from "react";
import { Card, Tag, Popover, Table, Input, Button } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";
const TodaysRates = () => {
  const [goldRate, setGoldRate] = useState({ prefix: "18K", rate: 0 });
  const [silverRate, setSilverRate] = useState(0);
  const [currentPrefixIndex, setCurrentPrefixIndex] = useState(0);
  const [ratesData, setRatesData] = useState([]);
  const [visible, setVisible] = useState(false);

  const prefixes = React.useMemo(() => ["18K", "22K", "24K"], []);

  const fetchRates = async () => {
    try {
      const response = await axios.get(`${CREATE_jwel}/api/Erp/GetDailyRatesList`);
      const data = response.data;
      const today = new Date().toISOString().split("T")[0];

      const goldRates = data.filter(item => item.RDATE.split("T")[0] === today && item.MAINPRODUCT === "GOLD");
      const silverRates = data.filter(item => item.RDATE.split("T")[0] === today && item.MAINPRODUCT === "SILVER");

      if (goldRates.length > 0) {
        setGoldRate({ prefix: goldRates[0].PREFIX, rate: goldRates[0].RATE });
      }

      if (silverRates.length > 0) {
        setSilverRate(silverRates[0].RATE);
      }

      const todayRates = data.filter(item => item.RDATE.split("T")[0] === today);
      setRatesData(todayRates);
    } catch (error) {
      console.error("Error fetching rates:", error);
    }
  };

  useEffect(() => {
    fetchRates();

    const interval = setInterval(() => {
      setCurrentPrefixIndex(prevIndex => (prevIndex + 1) % prefixes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [prefixes.length]);

  useEffect(() => {
    const fetchRatesByPrefix = async () => {
      try {
        const response = await axios.get(`${CREATE_jwel}/api/Erp/GetDailyRatesList`);
        const data = response.data;
        const today = new Date().toISOString().split("T")[0];

        const goldRates = data.filter(item => item.RDATE.split("T")[0] === today && item.MAINPRODUCT === "GOLD" && item.PREFIX === prefixes[currentPrefixIndex]);

        if (goldRates.length > 0) {
          setGoldRate({ prefix: goldRates[0].PREFIX, rate: goldRates[0].RATE });
        }
      } catch (error) {
        console.error("Error fetching rates:", error);
      }
    };

    fetchRatesByPrefix();
  }, [currentPrefixIndex, prefixes]);

  const handleVisibleChange = visible => {
    setVisible(visible);
  };

  const columns = [
    {
      title: 'Main Product',
      dataIndex: 'MAINPRODUCT',
      key: 'MAINPRODUCT',
    },
    {
      title: 'Prefix',
      dataIndex: 'PREFIX',
      key: 'PREFIX',
    },
    {
      title: 'Rate',
      dataIndex: 'RATE',
      key: 'RATE',
      render: (text, record) => (
        <Input
          defaultValue={text}
          onChange={e => {
            const newRate = e.target.value || 0;
            const newData = ratesData.map(item => {
              if (item.PREFIX === record.PREFIX) {
                return { ...item, RATE: newRate }; // Update all matching PREFIX values
              }
              return item;
            });
            setRatesData(newData);
          }}
        />
      ),
    },
  ];

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await axios.post(`http://www.jewelerp.timeserasoftware.in/api/Erp/DailyRatesDelete?rDate=${today}`);
      for (const rate of ratesData) {
        await axios.post("http://www.jewelerp.timeserasoftware.in/api/Erp/DailyRatesInsert", {
          rdate: today,
          mainproduct: rate.MAINPRODUCT,
          prefix: rate.PREFIX,
          rate: rate.RATE || 0,
          pureornot: rate.PUREORNOT,
          temP_RATE: rate.TEMP_RATE,
          cloud_upload: rate.cloud_upload,
        });
      }
      setVisible(false);
      fetchRates(); // Refresh the rates after submission
    } catch (error) {
      console.error("Error submitting rates:", error);
    }
  };
  

  const popoverContent = (
    <div>
      <Table dataSource={ratesData} columns={columns} style={{ width: '600px' }} size="small" rowKey="PREFIX" pagination={false} />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>
        Submit
      </Button>
    </div>
  );

  return (
    <Card style={{ boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", background: "#f0f2f5" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Card
          style={{
            backgroundColor: "#12246a",
            color: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: "350px",
            transform: "rotate(-5deg)",
            position: "relative",
          }}
          bordered={false}
        >
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "bold", opacity: 0.8 }}>Today’s Rates</h3>
          <Popover
            content={popoverContent}
            title="Rates"
            trigger="click"
            open={visible}
            onOpenChange={handleVisibleChange}
          >
            <Tag color="#28a745" style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer" }}>Change</Tag>
          </Popover>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "5px", color: "#c0c0c0" }}>
                ₹{goldRate.rate}{" "}
                <span style={{ fontSize: "18px", fontWeight: "bold", color: goldRate.rate > 0 ? "red" : "green" }}>
                  {goldRate.rate > 0 ? "↑" : "↓"}
                </span>
              </div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>Gold - {goldRate.prefix}</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "5px", color: "#c0c0c0" }}>
                ₹{silverRate}{" "}
                <span style={{ fontSize: "18px", fontWeight: "bold", color: silverRate > 0 ? "red" : "green" }}>
                  {silverRate > 0 ? "↑" : "↓"}
                </span>
              </div>
              <div style={{ fontSize: "14px", opacity: 0.8 }}>Silver</div>
            </div>
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
      </div>
    </Card>
  );
};

export default TodaysRates;
