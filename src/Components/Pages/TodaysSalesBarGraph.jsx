import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, 
} from "recharts";
import axios from "axios";
import dayjs from "dayjs";
import { CREATE_jwel } from "../../Config/Config";

const TodaysSalesBarGraph = () => {
  const [data, setData] = useState([]);
  const [salesGraph, setSalesGraph] = useState([]);
  const [selectedChart, setSelectedChart] = useState("today"); // 'today' or 'last4days'
  const colors = ["#FFBB28", "#FF8042", "#0088FE", "black"];
  const dotColors = {
    today: "#007BFF",
    last4days: "#FF5733",
  };
  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2
      },${y + height / 3}
    ${x + width / 2}, ${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width
      }, ${y + height}
    Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };
  // Fetch Today's Sales Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        const response = await axios.get(`${CREATE_jwel}/api/DashBoard/GetTotalSaleValue?billDate=${formattedDate}&saleCode=1`);
        const apiData = response.data.map(item => ({
          category: item.JewelType.split(' ')[0],
          totalSales: item.TotPieces,
          amount: item.NetAmt,
          TotGwt: item.TotGwt,
          TotNwt: item.TotNwt
        }));
        setData(apiData);
      } catch (error) {
        console.error("Error fetching today's data", error);
      }
    };
    fetchData();
  }, []);

  // Fetch Last 4 Days Sales Amounts
  useEffect(() => {
    const fetchTotalSaleAmt = async (date) => {
      try {
        const response = await axios.get(
          `${CREATE_jwel}/api/Master/GetDataFromGivenTableNameWithWhere?tableName=BILL_MAST&where=BILLDATE='${dayjs(date).format("MM/DD/YYYY")}'`,
          {
            headers: {
              tenantName: "PmlYjF0yAwEjNohFDKjzn/ExL/LMhjzbRDhwXlvos+0=",
            },
          }
        );
        const data = response.data;
        return Array.isArray(data)
          ? data.reduce((acc, item) => acc + (Number(item.BalanceAmt) || 0), 0)
          : 0;
      } catch (error) {
        console.error("Error fetching sale amount:", date, error);
        return 0;
      }
    };

    const loadSalesData = async () => {
      const dates = [0, 1, 2, 3].map((d) => dayjs().subtract(d, "day"));
      const results = await Promise.all(
        dates.map(date =>
          fetchTotalSaleAmt(date).then(amt => ({
            date: dayjs(date).format("DD-MMM"),
            amt: amt
          }))
        )
      );
      setSalesGraph(results.reverse());
    };

    loadSalesData();
  }, []);

  return (
    <div style={{ background: "#fff", borderRadius: "8px", padding: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" ,marginTop:"25px"}}>
     <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  }}
>
  <div style={{ fontWeight: 600 }}>
    {selectedChart === "today" ? "Today's Sales Overview" : (
      <>
        Sales Over the Last <span style={{ color: "red" }}>4</span> Days
      </>
    )}
  </div>
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <span
      onClick={() => setSelectedChart("today")}
      style={{
        height: 12,
        width: 12,
        borderRadius: "50%",
        backgroundColor: dotColors.today,
        cursor: "pointer",
        border: selectedChart === "today" ? "2px solid black" : "none"
      }}
    />
    <span
      onClick={() => setSelectedChart("last4days")}
      style={{
        height: 12,
        width: 12,
        borderRadius: "50%",
        backgroundColor: dotColors.last4days,
        cursor: "pointer",
        border: selectedChart === "last4days" ? "2px solid black" : "none"
      }}
    />
  </div>
</div>


      {selectedChart === "today" ? (
        <>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap={10} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount">
                {data.map((_, index) => (
                  <Cell key={index} fill={index === 0 ? "#150A4E" : "#52BD91"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      ) : (
        <>
        
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={salesGraph} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="amt"
                fill="#8884d8"
                shape={<TriangleBar />}
                label={{ position: "top" }}
                barSize={60}
              >                {salesGraph.map((_, index) => (
                <Cell key={index}
                  fill={colors[index % colors.length]}
                />
              ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default TodaysSalesBarGraph;
