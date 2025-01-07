import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer } from "recharts";

const TodaysSalesBarGraph = () => {
  // Sample data for the chart
  const data = [
    { category: "Gold", totalSales: 450, amount: 23000 },
    { category: "Silver", totalSales: 300, amount: 12000 },
    { category: "Diamond", totalSales: 150, amount: 50000 },
  ];

  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        marginTop:"6px"
      }}
    >
      {/* Chart Title */}
      <div style={{ fontSize: "14px", fontWeight: "600",  textAlign: "center", color: "#333" }}>
        Today's Sales Overview
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={205}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSales" fill="#8884d8" name="Total Sales" />
          <Bar dataKey="amount" fill="#82ca9d" name="Amount (₹)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TodaysSalesBarGraph;
