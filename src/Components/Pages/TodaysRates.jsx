import React, { useEffect, useState, useRef } from "react";
import { Card, Tag, Popover, Table, Input, Button } from "antd";
import axios from "axios";
import { CREATE_jwel } from "../../Config/Config";

const TodaysRates = () => {
  const [goldRate, setGoldRate] = useState({ prefix: "18K", rate: 0 });
  const [silverRate, setSilverRate] = useState(0);
  const [currentPrefixIndex, setCurrentPrefixIndex] = useState(0);
  const [ratesData, setRatesData] = useState([]);
  const [tempRatesData, setTempRatesData] = useState([]); // Temporary data for editing
  const [visible, setVisible] = useState(false);
  const inputRefs = useRef([]);

  const prefixes = React.useMemo(() => {
    const goldPrefixes = ratesData
      .filter(item => item.MAINPRODUCT === "GOLD")
      .map(item => item.PREFIX);
    return [...new Set(goldPrefixes)];
  }, [ratesData]);

  const fetchRates = async () => {
    try {
      const response = await axios.get(`${CREATE_jwel}/api/Erp/GetDailyRatesList`);
      const data = response.data;
      const today = new Date().toISOString().split("T")[0];

      const todayRates = data.filter(item => item.RDATE.split("T")[0] === today);

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
        setTempRatesData(todayRates); // Initialize temp data
      } else {
        const masterResponse = await axios.get(`${CREATE_jwel}/api/Master/MasterPrefixMasterList`);
        const masterData = masterResponse.data.map(item => ({
          MAINPRODUCT: item.MAINPRODUCT,
          PREFIX: item.Prefix,
          ...item
        }));
        setRatesData(masterData);
        setTempRatesData(masterData); // Initialize temp data
      }
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
    const currentPrefix = prefixes[currentPrefixIndex];
    const goldRates = ratesData.filter(item => item.MAINPRODUCT === "GOLD" && item.PREFIX === currentPrefix);

    if (goldRates.length > 0) {
      setGoldRate({ prefix: goldRates[0].PREFIX, rate: goldRates[0].RATE });
    }
  }, [currentPrefixIndex, prefixes, ratesData]);
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape") {
        setVisible(false);
      }
    };
  
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);
  
  const handleVisibleChange = visible => {
    setVisible(visible);
    if (visible) {
      setTempRatesData([...ratesData]); // Reset temp data when opening
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        handleSubmit(); // Submit when Enter or Tab is pressed in the last input field
      }
    }
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      await axios.post(`${CREATE_jwel}/api/Erp/DailyRatesDelete?rDate=${today}`);
      for (const rate of tempRatesData) {
        await axios.post(`${CREATE_jwel}/api/Erp/DailyRatesInsert`, {
          rdate: today,
          mainproduct: rate.MAINPRODUCT,
          rate: rate.RATE || 0,
          prefix: rate.PREFIX,
          pureornot: rate.PUREORNOT,
          temP_RATE: rate.TEMP_RATE || 0,
          cloud_upload: rate.cloud_upload,
        });
      }
      setRatesData(tempRatesData); // Update ratesData with tempRatesData
      setVisible(false);
      fetchRates();
    } catch (error) {
      console.error("Error submitting rates:", error);
    }
  };

  const handleCancel = () => {
    setVisible(false); // Close the popover without saving changes
  };

  const columns = [
    {
      title: (
        <div style={{  fontSize: '18px', textAlign: 'center', }}>Main Product</div>
      ),
      dataIndex: 'MAINPRODUCT',
      key: 'MAINPRODUCT',
      render: (text, record) => (
        <div style={{ fontWeight: "bold", }}>{text}</div>
      ),
    },
    {
      title: (
        <div style={{  fontSize: '18px',textAlign: 'center',  }}>Prefix</div>
      ),
      dataIndex: 'PREFIX',
      key: 'PREFIX',
      render: (text, record) => (
        <div style={{ fontWeight: "bold",  textAlign: 'center',}}>{text}</div>
      ),
    },
    {
      title: (
        <div style={{ fontSize: '18px', textAlign: 'center' }}>Rate</div>
      ),
      dataIndex: 'RATE',
      key: 'RATE',
      width: 160,
      render: (text, record, index) => (
        <Input
          ref={el => (inputRefs.current[index] = el)}
          defaultValue={text}
          onFocus={e => e.target.select()} // Automatically select the value on focus
          onChange={e => {
            const newRate = e.target.value || 0;
            const newData = tempRatesData.map(item => {
              if (item.PREFIX === record.PREFIX) {
                return { ...item, RATE: newRate };
              }
              return item;
            });
            setTempRatesData(newData);
          }}
          onKeyDown={e => handleKeyDown(e, index)}
          style={{ fontWeight: "bold", alignItems: "center", textAlign: "center" }}
        />
      ),
    }
    
  ];

  const popoverContent = (
    <div>
      <div style={{color:"#fff" ,textAlign: 'center',padding:"5px",fontSize:"18px" }}>Daily Rates</div>
      <Table
        dataSource={tempRatesData}
        columns={columns}
       
        size="small"
        rowKey="PREFIX"
        pagination={false}
        bordered
        className="custom-rates-table"
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
        <Button type="default" onClick={handleCancel} style={{ marginRight: 10 }}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
  

  return (
    <div>
      <Card
        style={{
          backgroundColor: "#12246a",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transform: "rotate(-5deg)",
          position: "relative",
          marginTop: "20px"
        }}
        bordered={false}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "bold", opacity: 0.8 }}>Today’s Rates</h3>
        <Popover
          content={popoverContent}
          trigger="click"
          open={visible}
          overlayClassName="custom-popover"


          overlayStyle={{ width: "600px", backgroundColor: "#12246a", color: "white" }}
          onOpenChange={handleVisibleChange}
        >
          <Tag color="#28a745" style={{ position: "absolute", top: "10px", right: "10px", cursor: "pointer",borderRadius:"10px",borderColor:"white" }}>Change</Tag>
        </Popover>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "23px", fontWeight: "bold", marginBottom: "5px", color: "#c0c0c0" }}>
              ₹{goldRate.rate}{" "}
              <span style={{ fontSize: "18px", fontWeight: "bold", color: goldRate.rate > 0 ? "red" : "green" }}>
                {goldRate.rate > 0 ? "↑" : "↓"}
              </span>
            </div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>Gold - {goldRate.prefix}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "23px", fontWeight: "bold", marginBottom: "5px", color: "#c0c0c0" }}>
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
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.1)",
          }}
        ></div>
      </Card>
    </div>
  );
};

export default TodaysRates;
