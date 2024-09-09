import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function SexChart() {
    const chartRef = useRef(null);
    useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: 'doughnut',
        data: {
          labels: [
            'Nam',
            'Nữ',
        ],
        datasets: [{
            label: 'Tỉ lệ',
            data: [20,80],
            backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
        },
        
      });

      chartRef.current.chart = newChart;
    }
  }, []);
   return (
    <div className="mt-4 relative h-[300px]">
        <canvas ref={chartRef} />
    </div>
    );
}