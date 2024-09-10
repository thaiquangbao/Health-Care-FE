import BloodPressure from "@/components/chart/BloodPressure";
import HeartRate from "@/components/chart/HealthRate";
import BMI from "@/components/chart/BMI";
import Temperature from "@/components/chart/Temperature";
import Symptom from "@/components/chart/Symptom";
import React, { useContext, useEffect, useRef, useState } from "react";
export default function LineChart({ logBook, hidden, setLogBook }) {
  const [activeMetric, setActiveMetric] = useState("huyetAp"); // default to Huyết áp

  const renderChart = () => {
    switch (activeMetric) {
      case "bmi":
        return <BMI logBook={logBook} setLogBook={setLogBook} />; // Show BMI component
      case "nhiptim":
        return <HeartRate logBook={logBook} setLogBook={setLogBook} />; // Show HeartRate component
      case "huyetAp":
        return <BloodPressure logBook={logBook} setLogBook={setLogBook} />; // Show BloodPressure component
      case "temperature":
        return <Temperature logBook={logBook} setLogBook={setLogBook} />; // Show Temperature component
      case "symptom":
        return <Symptom logBook={logBook} setLogBook={setLogBook} />; // Show Temperature component
      default:
        return null;
    }
  };
  return (
    <>
      <section
        style={{
          height: logBook ? "95%" : 0,
          width: logBook ? "95%" : 0,
          transition: "0.5s",
          backgroundSize: "cover",
          overflow: "auto",
          backgroundImage: "url(/bg.png)",
        }}
        className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <i onClick={() => hidden()} className="cursor-pointer bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>

        <div className="px-[2rem] py-[1.5rem] gap-2 flex item-start flex-col">
          <span className="font-bold text-[30px]">Các chỉ số của bạn</span>
          <div className="flex space-x-2">
            <button
              className={`border border-gray-300 rounded-full px-4 py-1 text-black ${activeMetric === "huyetAp"
                ? "bg-blue-600 text-white"
                : "bg-white"
                }`}
              onClick={() => setActiveMetric("huyetAp")}
            >
              Huyết áp
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${activeMetric === "nhiptim"
                ? "bg-blue-600 text-white"
                : "bg-white"
                }`}
              onClick={() => setActiveMetric("nhiptim")}
            >
              Nhịp tim
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${activeMetric === "bmi" ? "bg-blue-600 text-white" : "bg-white"
                }`}
              onClick={() => setActiveMetric("bmi")}
            >
              BMI
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${activeMetric === "temperature"
                ? "bg-blue-600 text-white"
                : "bg-white"
                }`}
              onClick={() => setActiveMetric("temperature")}
            >
              Nhiệt độ cơ thể
            </button>
            <button
              className={`border border-gray-300 rounded-full px-4 text-black ${activeMetric === "symptom"
                ? "bg-blue-600 text-white"
                : "bg-white"
                }`}
              onClick={() => setActiveMetric("symptom")}
            >
              Triệu chứng
            </button>
          </div>
          <div className="w-[100%]">{renderChart()}</div>
        </div>
      </section>
    </>
  );
}
