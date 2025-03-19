import React, { useEffect, useState } from "react";
import { Card, Tag, Popover, Table, Input, Button } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";

const TodaysRates = ({setRatesAvailable }) => {
  const [goldRate, setGoldRate] = useState({ prefix: "18K", rate: 0 });
  const [silverRate, setSilverRate] = useState(0);
  const [currentPrefixIndex, setCurrentPrefixIndex] = useState(0);
  const [ratesData, setRatesData] = useState([]);
  const [visible, setVisible] = useState(false);
  // const [ratesAvailable, setRatesAvailable] = useState(false);

  const prefixes = React.useMemo(() => ["18K", "22K", "24K"], []);


  const fetchRates = React.useCallback(async () => {
    try {
      const response = await axios.get(`${CREATE_jwel}/api/Erp/GetDailyRatesList`);
      const data = response.data;
      const today = new Date().toISOString().split("T")[0];

      const todayRates = data.filter(item => item.RDATE.split("T")[0] === today);
      const allRatesZero = todayRates.every(item => item.RATE === 0);
      if (allRatesZero) {
        setRatesAvailable(true);
      }
console.log(allRatesZero);
      if (todayRates.length > 0) {
        const goldRates = todayRates.filter(item => item.MAINPRODUCT === "GOLD");
        const silverRates = todayRates.filter(item => item.MAINPRODUCT === "SILVER");

        if (goldRates.length > 0) {
          setGoldRate({ prefix: goldRates[0].PREFIX, rate: goldRates[0].RATE });
        }

        if (silverRates.length > 0) {
          setSilverRate(silverRates[0].RATE);
        }

        setRatesData(todayRates);
        setRatesAvailable(false);
      } else {
        const masterResponse = await axios.get("http://www.jewelerp.timeserasoftware.in/api/Master/MasterPrefixMasterList");
        const masterData = masterResponse.data.map(item =>({
          MAINPRODUCT : item.MAINPRODUCT,
          PREFIX : item.Prefix,
          
          ...item
        }));
        setRatesData(masterData);
        setRatesAvailable(true);

      }

    } catch (error) {
      console.error("Error fetching rates:", error);
      setRatesAvailable(false);
    }
  }, [ ]);

  useEffect(() => {
    fetchRates();

    const interval = setInterval(() => {
      setCurrentPrefixIndex(prevIndex => (prevIndex + 1) % prefixes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [prefixes.length ,fetchRates]);

  useEffect(() => {
    const currentPrefix = prefixes[currentPrefixIndex];
    const goldRates = ratesData.filter(item => item.MAINPRODUCT === "GOLD" && item.PREFIX === currentPrefix);

    if (goldRates.length > 0) {
      setGoldRate({ prefix: goldRates[0].PREFIX, rate: goldRates[0].RATE });
    }
  }, [currentPrefixIndex, prefixes, ratesData]);

  const handleVisibleChange = visible => {
    setVisible(visible);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const inputs = document.querySelectorAll(".rate-input");
      
      if (index < inputs.length - 1) {
        inputs[index + 1].focus(); // Move to the next input
      } else {
        handleSubmit(); // Submit if it's the last input field
      }
    }
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
      render: (text, record, index) => (
        <Input
          className="rate-input"
          defaultValue={text}
          onChange={e => {
            const newRate = e.target.value || 0;
            const newData = ratesData.map(item => {
              if (item.PREFIX === record.PREFIX) {
                return { ...item, RATE: newRate };
              }
              return item;
            });
            setRatesData(newData);
          }}
          onKeyDown={e => handleKeyDown(e, index)}
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
                rate: rate.RATE || 0,
                prefix: rate.PREFIX,
                pureornot: rate.PUREORNOT,
                temP_RATE: rate.TEMP_RATE || 0,
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
      <Table 
        dataSource={ratesData} 
        columns={columns} 
        style={{ width: '600px', backgroundColor: '#cdc9c9' }} 
        size="small" 
        rowKey="PREFIX" 
        pagination={false} 
      />
      <Button type="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>
        Submit
      </Button>
    </div>
  );

  return (
    <div >
      <Card
        style={{
          backgroundColor: "#12246a",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        //   transform: "rotate(-5deg)",
          position: "relative",
        }}
        bordered={false}
      >
        <h3 style={{ margin: 0, fontSize: "12px", fontWeight: "bold", opacity: 0.8 }}>Today’s Rates</h3>
        <Popover
          content={popoverContent}
          title="Rates"
          trigger="click"
          open={visible}
          onOpenChange={handleVisibleChange}
        >
          <Tag color="#28a745" style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer" }}>Change</Tag>
        </Popover>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",}}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px",marginTop:"10px", fontWeight: "bold", marginBottom: "5px", color: "#c0c0c0" }}>
            Gold - ₹{goldRate.rate}{" "}{goldRate.prefix}
              <span style={{ fontSize: "12px", fontWeight: "bold", color: goldRate.rate > 0 ? "red" : "green" }}>
               {goldRate.rate > 0 ? "↑" : "↓"}
              </span>
            </div>
            {/* <div style={{ fontSize: "12px", opacity: 0.8 }}>Gold - {goldRate.prefix}</div> */}
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "12px",marginTop:"10px", fontWeight: "bold", color: "#c0c0c0" }}>
            Silver ₹{silverRate}{" "}
              <span style={{ fontSize: "12px", fontWeight: "bold", color: silverRate > 0 ? "red" : "green" }}>
                {silverRate > 0 ? "↑" : "↓"}
              </span>
            </div>
            {/* <div style={{ fontSize: "12px", opacity: 0.8 }}>Silver</div> */}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-20px",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        ></div>
      </Card>
      <style jsx>{`
        @media (max-width: 768px) {
          .ant-card {
            width: 100% !important;
            transform: none !important;
            margin-left: 0 !important;
          }
          .ant-card h3 {
            font-size: 14px !important;
          }
          .ant-card .ant-tag {
            top: 5px !important;
            right: 5px !important;
          }
          .ant-card .ant-card-body {
            padding: 10px !important;
          }
          .ant-card .ant-card-body div {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TodaysRates;
