import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function NhipTim({ logBook }) {
  const chartRef = useRef(null);
  const [times, setTimes] = useState([])
  const [heartRates, setHeartRates] = useState([])
  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const times = logBook?.disMon.filter(item => item.vitalSign.heartRate !== 0).map(item => `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`).slice(-10)
      const heartRates = logBook?.disMon.filter(item => item.vitalSign.heartRate !== 0).map(item => item.vitalSign.heartRate).slice(-10)
      setTimes(times)
      setHeartRates(heartRates)
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: times,
          datasets: [
            {
              label: "Heart Rate (Nhịp tim)",
              data: heartRates,
              borderColor: "#ff6384",
              backgroundColor: "rgba(255, 99, 132, 0)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
              min: 40,
              max: 150,
              title: {
                display: true,
                text: "Nhịp tim",
              },
            },
            x: {
              title: {
                display: true,
                text: "Thời gian",
              },
            },
          },
          plugins: {
            legend: {
              position: "top",
              labels: {
                usePointStyle: true,
              },
            },
          },
          maintainAspectRatio: false,
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [logBook]);
  return (
    <div className="flex flex-col">
      <div className="mt-4 relative h-[250px]">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}