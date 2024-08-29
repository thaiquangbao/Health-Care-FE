import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";

export default function Temperature() {
  const chartRef = useRef(null);
  const [temperature, setTemperature] = useState("");
  const [temperatureData, setTemperatureData] = useState([]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: [
            "21-03-2023",
            "27-03-2023",
            "28-03-2023",
            "04-04-2023",
            "13-04-2023",
          ],
          datasets: [
            {
              label: "Nhiệt độ cơ thể",
              data: [20, 30, 25, 35, 38],
              borderColor: "#ff6384",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
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
  }, [temperatureData]);

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <span className="text-2xl font-semibold">Biểu đồ nhiệt độ cơ thể</span>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-[40%]">
            <input
              type="text"
              id="temperature"
              name="temperature"
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Nhiệt độ (°C)..."
            />
          </div>
          <button
            style={{
              background: "linear-gradient(to right, #11998e, #38ef7d)",
            }}
            className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676] w-[40%]"
          >
            Xác nhận
          </button>
        </div>
      </div>
      <div className="mt-4 relative h-[400px]">
        <canvas ref={chartRef} />
      </div>
      <div className="w-[80%] max-h-[140px] overflow-y-auto relative justify-center flex mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-[5%] py-2 text-center">
                #
              </th>
              <th scope="col" className="w-[20%] py-2">
                Nhiệt độ (°C)
              </th>
              <th scope="col" className="w-[20%] py-2">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody className="w-full bg-black font-medium">
            <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
              <td scope="row" className="px-6 py-2 text-center font-medium">
                1
              </td>
              <td className="py-2">30</td>
              <td className="py-2">06-09-2024 lúc 11:04</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
