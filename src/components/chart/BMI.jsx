import { api, baseURL, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState, useContext } from "react";
import { userContext } from "@/context/UserContext";
import { authContext } from "@/context/AuthContext";
import { io } from "socket.io-client";
import { utilsContext } from "@/context/UtilsContext";
import { notifyType } from "@/context/GlobalContext";
const socket = io.connect(baseURL);

export default function BMI({ logBook, setLogBook }) {
  const chartRef = useRef(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [times, setTimes] = useState([]);
  const [bmis, setBmis] = useState([]);
  const [heights, setHeights] = useState([]);
  const [weights, setWeights] = useState([]);
  const { utilsHandler } = useContext(utilsContext);
  const { authHandler } = useContext(authContext);
  const { userData } = useContext(userContext);
  const resetForm = () => {
    setHeight("");
    setWeight("");
  };

  useEffect(() => {
    if (chartRef.current && logBook) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const times = logBook.disMon
        .filter(
          (item) => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0
        )
        .map(
          (item) =>
            `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`
        )
        .slice(-10);
      const bmis = logBook.disMon
        .filter(
          (item) => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0
        )
        .map((item) =>
          (
            item.vitalSign.weight /
            ((item.vitalSign.height / 100) * (item.vitalSign.height / 100))
          ).toFixed(2)
        )
        .slice(-10);
      const heights = logBook.disMon
        .filter(
          (item) => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0
        )
        .map((item) => item.vitalSign.height)
        .slice(-10);
      const weights = logBook.disMon
        .filter(
          (item) => item.vitalSign.height !== 0 && item.vitalSign.weight !== 0
        )
        .map((item) => item.vitalSign.weight)
        .slice(-10);
      setTimes(times);
      setBmis(bmis);
      setHeights(heights);
      setWeights(weights);
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
              min: 0,
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

  const handleSubmit = () => {
    if (weight === "" || height === "") {
      utilsHandler.notify(notifyType.WARNING, "Hãy nhập đầy đủ thông tin");
      return;
    }
    if (isNaN(Number(weight)) || isNaN(Number(height))) {
      utilsHandler.notify(notifyType.WARNING, "Hãy nhập số");
      return;
    }

    const dataAI = {
      patient: {
        sex: userData.user?.sex,
        dateOfBirth: userData.user?.dateOfBirth,
      },
      bmi: (weight / ((height / 100) * (height / 100))).toFixed(1),
    };

    api({
      sendToken: false,
      type: TypeHTTP.POST,
      path: "/chats/bmi-warning",
      body: dataAI,
    }).then((resAI) => {
      authHandler.showHealthResponse({
        message: `Chỉ số BMI ngày hôm nay của bạn: ${resAI.comment} ${resAI.advice}`,
      });
      const body = {
        _id: logBook._id,
        disMonItem: {
          vitalSign: {
            height,
            weight,
          },
          date: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
        },
        status_bmi: {
          status_type: resAI.status,
          message: resAI.comment,
        },
      };
      api({
        type: TypeHTTP.POST,
        sendToken: true,
        path: "/healthLogBooks/update-bmi",
        body,
      }).then((res) => {
        setLogBook(res);
        api({
          type: TypeHTTP.POST,
          sendToken: true,
          path: "/rooms/get-patient-doctor",
          body: {
            patient_id: logBook.patient._id,
            doctor_id: logBook.doctor._id,
          },
        }).then((res) => {
          const newMessage = {
            vitals: {
              weight,
              height,
            },
            time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
            author: "PATIENT",
            type: "REPORT",
          };
          const newMessages = JSON.parse(JSON.stringify(res[0]));
          newMessages.messages.push(newMessage);
          resetForm();
          api({
            sendToken: true,
            type: TypeHTTP.POST,
            path: "/messages/update",
            body: newMessages,
          });
          api({
            sendToken: true,
            type: TypeHTTP.GET,
            path: `/rooms/get-one/${res[0].room}`,
          }).then((room1) => {
            const room = JSON.parse(JSON.stringify(room1));
            room.lastMessage = {
              author: "PATIENT",
              content: "Đã gửi báo cáo BMI",
              time: convertDateToDayMonthYearTimeObject(
                new Date().toISOString()
              ),
            };
            api({
              sendToken: true,
              type: TypeHTTP.POST,
              path: "/rooms/update",
              body: room,
            });
          });
        });
      });
    });
  };

  return (
    <div className="flex flex-col">
      <div className="text-center">
        <span className="text-2xl font-semibold">Biểu đồ BMI</span>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-[40%]">
            <input
              type="text"
              id="height"
              name="height"
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Chiều cao (cm)..."
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </div>
          <div className="my-1"></div>
          <div className="w-[40%]">
            <input
              type="text"
              id="weight"
              name="weight"
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Cân nặng (kg)..."
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <button
            style={{
              background: "linear-gradient(to right, #11998e, #38ef7d)",
            }}
            onClick={() => handleSubmit()}
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
                Chiều cao (cm)
              </th>
              <th scope="col" className="w-[20%] py-2">
                Cân nặng (kg)
              </th>
              <th scope="col" className="w-[20%] py-2">
                BMI trung bình
              </th>
              <th scope="col" className="w-[20%] py-2">
                Ngày tạo
              </th>
            </tr>
          </thead>
          <tbody className="w-full bg-black font-medium">
            {times.map((time, index) => (
              <tr
                key={index}
                className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td scope="row" className="px-6 py-2 text-center font-medium">
                  {index + 1}
                </td>
                <td className="py-2">{heights[index]}cm</td>
                <td className="py-2">{weights[index]}kg</td>
                <td className="py-2">{bmis[index]}</td>
                <td className="py-2">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
