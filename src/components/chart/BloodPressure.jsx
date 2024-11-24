import { authContext } from "@/context/AuthContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  adjustDisplayTime,
  convertDateToDayMonthYearTimeObject,
} from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "@/context/UserContext";
import { utilsContext } from "@/context/UtilsContext";
import { notifyType } from "@/context/GlobalContext";
export default function BloodPressure({ logBook, setLogBook }) {
  const chartRef = useRef(null);
  const [tamThu, setTamThu] = useState("");
  const [tamTruong, setTamTruong] = useState("");
  const [note, setNote] = useState("");
  const [symptom, setSymptom] = useState("");
  const [dsTamTruong, setDsTamTruong] = useState([]);
  const [dsTamThu, setDsTamThu] = useState([]);
  const [dsTimes, setDsTimes] = useState([]);
  const [dsTrieuChung, setDsTrieuChung] = useState([]);
  const [dsNote, setDsNote] = useState([]);
  const { authHandler } = useContext(authContext);
  const { userData } = useContext(userContext);
  const { utilsHandler } = useContext(utilsContext);
  const resetForm = () => {
    setTamTruong("");
    setTamThu("");
    // setNote('')
    // setSymptom('')
  };

  useEffect(() => {
    if (chartRef.current && logBook) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const times = logBook.disMon
        .filter((item) => item.vitalSign.bloodPressure !== "")
        .map(
          (item) =>
            `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`
        )
        .slice(-10);
      const dsTamTruong = logBook.disMon
        .filter((item) => item.vitalSign.bloodPressure !== "")
        .map((item) => item.vitalSign.bloodPressure.split("/")[1])
        .slice(-10);
      const dsTamThu = logBook.disMon
        .filter((item) => item.vitalSign.bloodPressure !== "")
        .map((item) => item.vitalSign.bloodPressure.split("/")[0])
        .slice(-10);
      // const dsTrieuChung = logBook.disMon.filter(item => item.vitalSign.bloodPressure !== '').map(item => item.symptom).slice(-10)
      // const dsNote = logBook.disMon.filter(item => item.vitalSign.bloodPressure !== '').map(item => item.note).slice(-10)
      setDsTimes(times);
      setDsTamTruong(dsTamTruong);
      setDsTamThu(dsTamThu);
      // setDsTrieuChung(dsTrieuChung)
      // setDsNote(dsNote)
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: times,
          datasets: [
            {
              label: "Diastolic (Tâm trương)",
              data: dsTamTruong,
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0)",
              borderWidth: 2,
              fill: true,
            },
            {
              label: "Systolic (Tâm thu)",
              data: dsTamThu,
              borderColor: "#28a745",
              backgroundColor: "rgba(40, 167, 69, 0)",
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
              max: 200,
              title: {
                display: true,
                text: "Huyết áp",
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
    // show

    if (tamThu === "" || tamTruong === "") {
      utilsHandler.notify(notifyType.WARNING, "Hãy nhập đầy đủ thông tin");
      return;
    }
    if (isNaN(Number(tamThu)) || isNaN(Number(tamTruong))) {
      utilsHandler.notify(notifyType.WARNING, "Hãy nhập số");
      return;
    }
    if (Number(tamThu) <= 0 || Number(tamThu) >= 200) {
      utilsHandler.notify(notifyType.WARNING, "Tâm thu không hợp lệ");
      return;
    }
    if (Number(tamTruong) <= 0 || Number(tamTruong) >= 200) {
      utilsHandler.notify(notifyType.WARNING, "Tâm trương không hợp lệ");
      return;
    }
    // AI gợi ý
    const dataAI = {
      patient: {
        sex: userData.user?.sex,
        dateOfBirth: userData.user?.dateOfBirth,
      },
      vitalSign: {
        bloodPressure: tamThu + "/" + tamTruong,
      },
    };
    api({
      sendToken: false,
      type: TypeHTTP.POST,
      path: "/chats/bloodPressure-warning",
      body: dataAI,
    }).then((resAI) => {
      authHandler.showHealthResponse({
        message: `Huyết áp ngày hôm nay của bạn: ${resAI.comment} ${resAI.advice}`,
      });
      const body = {
        _id: logBook._id,
        disMonItem: {
          vitalSign: {
            bloodPressure: tamThu + "/" + tamTruong,
          },
          date: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
        },
        status_bloodPressure: {
          status_type: resAI.status,
          message: resAI.comment,
        },
      };
      api({
        type: TypeHTTP.POST,
        sendToken: true,
        path: "/healthLogBooks/update-blood-pressure",
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
            content:
              symptom !== "" && note !== ""
                ? symptom
                : symptom !== ""
                  ? symptom
                  : note !== ""
                    ? note
                    : "",
            vitals: {
              bloodPressure: tamThu + "/" + tamTruong,
            },
            time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
            author: "PATIENT",
            type: "REPORT",
          };
          resetForm();
          const newMessages = JSON.parse(JSON.stringify(res[0]));
          newMessages.messages.push(newMessage);
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
              content: "Đã gửi báo cáo huyết áp",
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
        <span className="text-2xl font-semibold">Biểu đồ huyết áp</span>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              value={tamThu}
              onChange={(e) => setTamThu(e.target.value)}
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tâm thu..."
            />
          </div>
          <div className="my-1"></div>
          <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              value={tamTruong}
              onChange={(e) => setTamTruong(e.target.value)}
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Tâm trương..."
            />
          </div>
          {/* <div className="my-1"></div>
          <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              value={symptom}
              onChange={e => setSymptom(e.target.value)}
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Triệu chứng"
            />
          </div>
          <div className="my-1"></div> */}
          {/* <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ghi chú"
            />
          </div> */}
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
              <th scope="col" className="w-[20%] py-2 ">
                Tâm trương
              </th>
              <th scope="col" className="w-[20%] py-2">
                Tâm thu
              </th>
              <th scope="col" className="w-[20%] py-2">
                Thời gian
              </th>
              {/* <th scope="col" className="w-[20%] py-2">
                Triệu chứng
              </th>
              <th scope="col" className="w-[20%] py-2">
                Ghi chú
              </th> */}
            </tr>
          </thead>
          <tbody className=" w-[full] bg-black font-medium">
            {dsTimes.map((time, index) => (
              <tr
                key={index}
                className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td scope="row" className="px-6 py-2 text-center font-medium">
                  {index + 1}
                </td>
                <td className="py-2">{dsTamTruong[index]}</td>
                <td className="py-2">{dsTamThu[index]}</td>
                <td className="py-2">{time}</td>
                {/* <td className="py-2">{dsTrieuChung[index]}</td>
                <td className="py-2">{dsNote[index]}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
