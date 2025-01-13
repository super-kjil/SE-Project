import React from "react";
import { Chart } from "react-google-charts";

export const options = {
  title: "Expense Summary By Month",
  curveType: "function",
  hAxis: { title: "Month", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 },
  // chartArea: { width: "70%", height: "70%" },
  // colors: "#FF0000",
};

function HomeExpenseByMonthChart({ data = [] }) {
  if (data == null || data.length == 0) return null;
  return (
    <div>
      <div className="bg-white p-2 rounded-xl min-h-full m-[5px]">
        <Chart
          chartType="LineChart" //"ColumnChart" //"AreaChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      </div>
    </div>
  );
}

export default HomeExpenseByMonthChart;
