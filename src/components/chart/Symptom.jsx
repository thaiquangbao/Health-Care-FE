import { api, TypeHTTP } from "@/utils/api";
import {
  adjustDisplayTime,
  convertDateToDayMonthYearTimeObject,
} from "@/utils/date";
import React, { useContext, useEffect, useRef, useState } from "react";
import { utilsContext } from "@/context/UtilsContext";
import { notifyType } from "@/context/GlobalContext";
export default function Symptom({ logBook, setLogBook }) {
  const [note, setNote] = useState("");
  const [symptom, setSymptom] = useState("");
  const [dsTrieuChung, setDsTrieuChung] = useState([]);
  const [dsNote, setDsNote] = useState([]);
  const [dsTimes, setDsTimes] = useState([]);
  const { utilsHandler } = useContext(utilsContext);
  const resetForm = () => {
    setNote("");
    setSymptom("");
  };
  useEffect(() => {
    if (logBook) {
      const times = logBook.disMon
        ?.filter((item) => item.symptom !== "")
        .map(
          (item) =>
            `(${item.date.time}) ${item.date.day}/${item.date.month}/${item.date.year}`
        )
        .slice(-10);
      const dsTrieuChung = logBook.disMon
        ?.filter((item) => item.symptom !== "")
        .map((item) => item.symptom)
        .slice(-10);
      const dsNote = logBook.disMon
        ?.filter((item) => item.note !== "")
        .map((item) => item.note)
        .slice(-10);
      setDsTimes(times);
      setDsTrieuChung(dsTrieuChung);
      setDsNote(dsNote);
    }
  }, [logBook]);
  const handleSubmit = () => {
    if (symptom === "" && note === "") {
      utilsHandler.notify(notifyType.WARNING, "Hãy nhập ít nhật một thông tin");
      return;
    }
    const body = {
      _id: logBook._id,
      disMonItem: {
        symptom,
        date: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
        note,
      },
    };
    api({
      type: TypeHTTP.POST,
      sendToken: true,
      path: "/healthLogBooks/update-symptom-note",
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
            content: "Đã gửi triệu chứng và ghi chú",
            time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
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
  };
  return (
    <div className="flex flex-col">
      <div className="text-center">
        <span className="text-2xl font-semibold">Triệu chứng và ghi chú</span>

        <div className="flex flex-col items-center justify-center w-full">
          <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Triệu chứng"
            />
          </div>
          <div className="my-1"></div>
          <div className="w-[40%]">
            <input
              type="text"
              id="title"
              name="title"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Ghi chú"
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
      <div className="mt-5 w-[80%] max-h-[400px] overflow-y-auto relative justify-center flex mx-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-[8%] py-2 text-center">
                #
              </th>
              <th scope="col" className="w-[35%] text-center py-2">
                Triệu chứng
              </th>
              <th scope="col" className="w-[35%] text-center py-2">
                Ghi chú
              </th>
              <th scope="col" className="w-[20%] text-center py-2">
                Thời gian
              </th>
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
                <td className="py-2 text-center border-none">{dsTrieuChung[index]}</td>
                <td className="py-2 text-center border-none">{dsNote[index]}</td>
                <td className="py-2 text-center border-none">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
