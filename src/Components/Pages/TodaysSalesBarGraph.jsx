import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const TodaysSalesBarGraph = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        const response = await axios.get(`http://www.jewelerp.timeserasoftware.in/api/DashBoard/GetTotalSaleValue?billDate=${formattedDate}&saleCode=1`);
        const apiData = response.data.map(item => ({
          category: item.JewelType.split(' ')[0],
          totalSales: item.TotPieces,
          amount: item.NetAmt,
          TotGwt: item.TotGwt,
          TotNwt: item.TotNwt
        }));
        setData(apiData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const getBarColors = () => {
    const dayOfWeek = new Date().getDay();
    const colors = [
      { totalSales: "#FF5733", amount: "#33FF57" }, // Sunday
      { totalSales: "#33C1FF", amount: "#FF33A1" }, // Monday
      { totalSales: "#FF33F6", amount: "#33FFBD" }, // Tuesday
      { totalSales: "#FF8C33", amount: "#33FF8C" }, // Wednesday
      { totalSales: "#8C33FF", amount: "#FF338C" }, // Thursday
      { totalSales: "#33FFEC", amount: "#FFEC33" }, // Friday
      { totalSales: "#FF3333", amount: "#33FF33" }  // Saturday
    ];
    return colors[dayOfWeek];
  };

  const barColors = getBarColors();

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        marginTop: "6px"
      }}
    >
      {/* Chart Title */}
      <div style={{ fontSize: "14px", fontWeight: "600", textAlign: "center", color: "#333" }}>
        Today's Sales Overview
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={205}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: '12px' }} />
          <YAxis />
          <Tooltip 
            content={({ payload }) => {
              if (payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div style={{ background: "#fff", padding: "5px", border: "1px solid #ccc" }}>
                  <p>{` ${item.category}`}</p>
                  <p>{`Total Pieces: ${item.totalSales}`}</p>
                  <p>{`Amount: ₹${item.amount.toFixed(2)}`}</p>
                  <p>{`Total Gross.Wt: ${item.TotGwt.toFixed(3)}`}</p>
                  <p>{`Total Net.Wt: ${item.TotNwt.toFixed(3)}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="totalSales" fill={barColors.totalSales} name="Total Sales" />
          <Bar dataKey="amount" fill={barColors.amount} name="Amount (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TodaysSalesBarGraph;
