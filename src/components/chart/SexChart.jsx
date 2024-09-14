import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState } from "react";
export default function SexChart({ logBooks }) {
  const chartRef = useRef(null);
  const [male, setMale] = useState(0);
  const [feMale, setFeMale] = useState(0);
  const [normal, setNormal] = useState(0);
  const [warning, setWarning] = useState(0);
  useEffect(() => {
    if (logBooks.length > 0) {
      let normal_patient = 0;
      let warning_patient = 0;
      logBooks.forEach((logBook) => {
        if (logBook.status.status_type === "ACCEPTED") {
          let warning = 0;
          if (logBook.status_bloodPressure !== null) {
            warning++;
          }
          if (logBook.status_temperature !== null) {
            warning++;
          }
          if (logBook.status_heartRate !== null) {
            warning++;
          }
          if (logBook.status_bmi !== null) {
            warning++;
          }
          if (warning > 0) {
            warning_patient++;
          } else {
            normal_patient++;
          }
        }
        setWarning(warning_patient);
        setNormal(normal_patient);
      });
    }
  }, [logBooks]);
  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart && logBooks) {
        chartRef.current.chart.destroy();
      }
      const nam = logBooks.filter(
        (item) =>
          item.patient.sex === true &&
          item.status.status_type === "ACCEPTED"
      ).length;
      const nu = logBooks.filter(
        (item) =>
          item.patient.sex === false &&
          item.status.status_type === "ACCEPTED"
      ).length;
      setMale(nam);
      setFeMale(nu);
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "doughnut",
        data: {
          labels: ["Báo động", "Bình thường"],
          datasets: [
            {
              label: "Tỉ lệ",
              data: [warning, normal],
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(54, 162, 235)",
              ],
              hoverOffset: 4,
            },
          ],
        },
      });

      chartRef.current.chart = newChart;
    }
  }, [warning, normal]);
  return (
    <div className="mt-4 relative h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
}
