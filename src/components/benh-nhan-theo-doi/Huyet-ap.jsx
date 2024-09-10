import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function HuyetAp({ logBook }) {
  const chartRef = useRef(null);
  const [dsTamTruong, setDsTamTruong] = useState([])
  const [dsTamThu, setDsTamThu] = useState([])
  const [dsTimes, setDsTimes] = useState([])

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const times = logBook?.disMon.filter(item => item.vitalSign.bloodPressure !== '').map(item => `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`).slice(-10)
      const dsTamTruong = logBook?.disMon.filter(item => item.vitalSign.bloodPressure !== '').map(item => item.vitalSign.bloodPressure.split('/')[1]).slice(-10)
      const dsTamThu = logBook?.disMon.filter(item => item.vitalSign.bloodPressure !== '').map(item => item.vitalSign.bloodPressure.split('/')[0]).slice(-10)
      setDsTimes(times)
      setDsTamTruong(dsTamTruong)
      setDsTamThu(dsTamThu)
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: times,
          datasets: [
            {
              label: "Diastolic (Tâm trương)",
              data: dsTamTruong,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0)",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Systolic (Tâm thu)",
              data: dsTamThu,
              borderColor: "#28a745",
              backgroundColor: "rgba(40, 167, 69, 0)",
              borderWidth: 2,
              fill: true,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: false,
              min: 70,
              max: 150,
              title: {
                display: true,
                text: "Huyết áp",
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