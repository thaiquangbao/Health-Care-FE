import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { Chart } from "chart.js/auto";
import React, { useEffect, useRef, useState, useContext } from "react";
import { userContext } from "@/context/UserContext";
import { authContext } from "@/context/AuthContext";
export default function Temperature({ logBook, setLogBook }) {
  const chartRef = useRef(null);
  const [temperature, setTemperature] = useState("");
  const [times, setTimes] = useState([])
  const [temperatures, setTemperatures] = useState([])
  const [note, setNote] = useState('')
  const [symptom, setSymptom] = useState('')
  const [dsTrieuChung, setDsTrieuChung] = useState([])
  const [dsNote, setDsNote] = useState([])
  const { authHandler } = useContext(authContext)
  const { userData } = useContext(userContext)
  const resetForm = () => {
    setTemperature('')
    // setNote('')
    // setSymptom('')
  }

  useEffect(() => {
    if (chartRef.current && logBook) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
      const times = logBook.disMon.filter(item => item.vitalSign.temperature !== 0).map(item => `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`).slice(-10)
      const temperatures = logBook.disMon.filter(item => item.vitalSign.temperature !== 0).map(item => item.vitalSign.temperature).slice(-10)
      // const dsTrieuChung = logBook.disMon.filter(item => item.vitalSign.temperature !== 0).map(item => item.symptom).slice(-10)
      // const dsNote = logBook.disMon.filter(item => item.vitalSign.temperature !== 0).map(item => item.note).slice(-10)
      setTimes(times)
      setTemperatures(temperatures)
      // setDsTrieuChung(dsTrieuChung)
      // setDsNote(dsNote)
      const context = chartRef.current.getContext("2d");
      const newChart = new Chart(context, {
        type: "line",
        data: {
          labels: times,
          datasets: [
            {
              label: "Nhiệt độ cơ thể",
              data: temperatures,
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
  }, [logBook]);

  const handleSubmit = () => {
    
    const dataAI = {
      patient: {
        sex: userData.user?.sex,
        dateOfBirth: userData.user?.dateOfBirth
      },
      temperature: temperature
    }
    
    api({ sendToken: false, type: TypeHTTP.POST, path: '/chats/temperature-warning', body: dataAI })
      .then(resAI => {
        authHandler.showHealthResponse({ message: `Nhiệt độ cơ thể ngày hôm nay của bạn: ${resAI.comment} ${resAI.advice}` })
        const body = {
          _id: logBook._id,
          disMonItem: {
            vitalSign: {
              temperature
            },
            date: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
          },
          status_temperature: {
            status_type: resAI.status,
            message: resAI.comment
          }
        }
        api({ type: TypeHTTP.POST, sendToken: true, path: '/healthLogBooks/update-temperature', body })
      .then(res => {
        setLogBook(res)
        api({
          type: TypeHTTP.POST, sendToken: true, path: '/rooms/get-patient-doctor', body: {
            patient_id: logBook.patient._id,
            doctor_id: logBook.doctor._id
          }
        })
          .then(res => {
            const newMessage = {
              content: (symptom !== '' && note !== '') ? symptom : symptom !== '' ? symptom : note !== '' ? note : '',
              vitals: {
                temperature
              },
              time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
              author: 'PATIENT',
              type: 'REPORT'
            }
            resetForm()
            const newMessages = JSON.parse(JSON.stringify(res[0]))
            newMessages.messages.push(newMessage)
            api({ sendToken: true, type: TypeHTTP.POST, path: '/messages/update', body: newMessages })

            api({ sendToken: true, type: TypeHTTP.GET, path: `/rooms/get-one/${res[0].room}` })
              .then(room1 => {
                const room = JSON.parse(JSON.stringify(room1))
                room.lastMessage = {
                  author: 'PATIENT',
                  content: 'Đã gửi báo cáo nhiệt độ',
                  time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
                }
                api({ sendToken: true, type: TypeHTTP.POST, path: '/rooms/update', body: room })
              })

          })
      })
    })
    
  }

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
              value={temperature}
              onChange={e => setTemperature(e.target.value)}
            />
          </div>
          {/* <div className="my-1"></div>
          <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Triệu chứng"
              value={symptom}
              onChange={e => setSymptom(e.target.value)}
            />
          </div>
          <div className="my-1"></div> */}
          {/* <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ghi chú"
              value={note}
              onChange={e => setNote(e.target.value)}
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
              <th scope="col" className="w-[20%] py-2">
                Nhiệt độ (°C)
              </th>
              <th scope="col" className="w-[20%] py-2">
                Ngày tạo
              </th>
              {/* <th scope="col" className="w-[20%] py-2">
                Triệu chứng
              </th>
              <th scope="col" className="w-[20%] py-2">
                Ghi Chú
              </th> */}
            </tr>
          </thead>
          <tbody className="w-full bg-black font-medium">
            {times.map((time, index) => (
              <tr key={index} className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                <td scope="row" className="px-6 py-2 text-center font-medium">
                  {index + 1}
                </td>
                <td className="py-2">{temperatures[index]}</td>
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