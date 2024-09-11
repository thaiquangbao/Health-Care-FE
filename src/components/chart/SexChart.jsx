import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function SexChart({ logBooks }) {
    const chartRef = useRef(null);
    const [male, setMale] = useState(0);
    const [feMale , setFeMale] = useState(0);
    useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart && logBooks) {
        chartRef.current.chart.destroy();
      }
      const nam = logBooks.filter(item => item.patient.sex === true && item.status.status_type === "ACCEPTED").length
      const nu = logBooks.filter(item => item.patient.sex === false && item.status.status_type === "ACCEPTED").length
      setMale(nam)
      setFeMale(nu)
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
            data: [male,feMale],
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
  }, [logBooks]);
   return (
    <div className="mt-4 relative h-[300px]">
        <canvas ref={chartRef} />
    </div>
    );
}