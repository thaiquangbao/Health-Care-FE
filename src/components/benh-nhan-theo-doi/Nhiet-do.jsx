import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function NhietDo({ logBook }) {
  const chartRef = useRef(null);
  const [temperature, setTemperature] = useState("");
  const [times, setTimes] = useState([])
  const [temperatures, setTemperatures] = useState([])

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current && logBook) {
        if (chartRef.current.chart) {
          chartRef.current.chart.destroy();
        }
      }
      const times = logBook.disMon.filter(item => item.vitalSign.temperature !== 0).map(item => `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`).slice(-10)
      const temperatures = logBook.disMon.filter(item => item.vitalSign.temperature !== 0).map(item => item.vitalSign.temperature).slice(-10)
      setTimes(times)
      setTemperatures(temperatures)
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: times,
          datasets: [
            {
              label: "Nhiệt độ cơ thể",
              data: temperatures,
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
              min: 25,
              max: 50,
              title: {
                display: true,
                text: "Nhiệt độ (°C)",
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