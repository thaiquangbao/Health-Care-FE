import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function BMI({ logBook }) {
  const chartRef = useRef(null);
  const [times, setTimes] = useState([])
  const [bmis, setBmis] = useState([])
  const [heights, setHeights] = useState([])
  const [weights, setWeights] = useState([])

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const times = logBook?.disMon.filter(item => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0).map(item => `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`).slice(-10)
      const bmis = logBook?.disMon.filter(item => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0).map(item => (item.vitalSign.weight / ((item.vitalSign.height / 100) * (item.vitalSign.height / 100))).toFixed(2)).slice(-10)
      const heights = logBook?.disMon.filter(item => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0).map(item => item.vitalSign.height).slice(-10)
      const weights = logBook?.disMon.filter(item => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0).map(item => item.vitalSign.weight).slice(-10)
      setTimes(times)
      setBmis(bmis)
      setHeights(heights)
      setWeights(weights)
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: times,
          datasets: [
            {
              label: "BMI Trung bình",
              data: bmis,
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
              min: 10,
              max: 40,
              title: {
                display: true,
                text: "BMI",
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