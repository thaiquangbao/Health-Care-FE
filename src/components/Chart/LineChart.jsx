import BloodPressure from "@/components/Chart/BloodPressure";
import HeartRate from "@/components/Chart/HealthRate";
import BMI from "@/components/Chart/BMI";
import Temperature from "@/components/Chart/Temperature";
import React, { useContext, useEffect, useRef, useState } from "react";
export default function LineChart() {
  const [activeMetric, setActiveMetric] = useState("huyetAp"); // default to Huyết áp

  const renderChart = () => {
    switch (activeMetric) {
      case "bmi":
        return <BMI />; // Show BMI component
      case "nhiptim":
        return <HeartRate />; // Show HeartRate component
      case "huyetAp":
        return <BloodPressure />; // Show BloodPressure component
      case "temperature":
        return <Temperature />; // Show Temperature component
      default:
        return null;
    }
  };
  return (
    <>
      <section
        style={{
          height: "95%",
          width: "95%",
          transition: "0.3s",
          backgroundSize: "cover",
          overflow: "auto",
          backgroundImage: "url(/bg.png)",
        }}
        className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <div className="px-[2rem] py-[1.5rem] flex item-start flex-col">
          <span className="font-bold text-[30px]">Các chỉ số của bạn</span>
          <div className="flex space-x-2">
            <button
              className={`border border-gray-300 rounded-full px-4 py-1 text-black ${
                activeMetric === "huyetAp"
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
              onClick={() => setActiveMetric("huyetAp")}
            >
              Huyết áp
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${
                activeMetric === "nhiptim"
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
              onClick={() => setActiveMetric("nhiptim")}
            >
              Nhịp tim
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${
                activeMetric === "bmi" ? "bg-blue-600 text-white" : "bg-white"
              }`}
              onClick={() => setActiveMetric("bmi")}
            >
              BMI
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${
                activeMetric === "temperature"
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
              onClick={() => setActiveMetric("temperature")}
            >
              Nhiệt độ cơ thể
            </button>
          </div>
          <div className="w-[100%]">{renderChart()}</div>
        </div>
      </section>
    </>
  );
}
