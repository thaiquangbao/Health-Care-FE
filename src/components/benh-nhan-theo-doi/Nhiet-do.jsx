import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function NhietDo() {
    const chartRef = useRef(null);
    useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: ["20-02-2024", "21-02-2024", "22-02-2024", "23-02-2024", "24-02-2024", "25-02-2024", "26-02-2024", "27-02-2024", "28-02-2024", "01-03-2024"],
          datasets: [
            {
              label: "Nhiệt độ cơ thể",
              data: [36.5, 36.6, 36.7, 36.8, 36.9, 37.0, 37.1, 37.2, 37.3, 37.4],
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
              min: 35,
              max: 42,
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
  }, []);
  return (
    <div className="flex flex-col">
        <div className="mt-4 relative h-[250px]">
            <canvas ref={chartRef} />
        </div>
    </div>
  )
}