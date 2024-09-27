import { Chart } from "chart.js/auto";
import { set } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
export default function StatusChart({ logBooks }) {
  const chartRef = useRef(null);
  const [temperature, setTemperature] = useState(0);
  const [bloodPressure, setBloodPressure] = useState(0);
  const [heartRate, setHeartRate] = useState(0);
  const [bmi, setBmi] = useState(0);
  useEffect(() => {
    if (logBooks.length > 0) {
      let temperature = 0;
      let bloodPressure = 0;
      let heartRate = 0;
      let bmi = 0;
      logBooks.forEach((logBook) => {
        if (logBook.status.status_type === "ACCEPTED") {
          if (logBook.status_bloodPressure !== null) {
            bloodPressure++;
          }
          if (logBook.status_temperature !== null) {
            temperature++;
          }
          if (logBook.status_heartRate !== null) {
            heartRate++;
          }
          if (logBook.status_bmi !== null) {
            bmi++;
          }
          setTemperature(temperature);
          setBloodPressure(bloodPressure);
          setHeartRate(heartRate);
          setBmi(bmi);
        }
      });
    }
  }, [logBooks]);
  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "doughnut",
        data: {
          labels: [
            "Huyết áp",
            "Nhịp tim",
            "BMI",
            "Nhiệt độ",
          ],
          datasets: [
            {
              label: "Số lượng",
              data: [
                bloodPressure,
                heartRate,
                bmi,
                temperature,
              ],
              backgroundColor: [
                "rgb(54, 162, 235)",
                "rgb(255, 99, 132)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
              ],
              hoverOffset: 4,
            },
          ],
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [temperature, bloodPressure, heartRate, bmi]);
  return (
    <div className="mt-4 relative h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
}
