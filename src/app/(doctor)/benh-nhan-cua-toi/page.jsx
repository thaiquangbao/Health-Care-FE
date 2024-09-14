"use client";
import FormBenhNhanDetail from "@/components/benh-nhan-theo-doi/FormBenhNhanDetail";
import FormHoSoSucKhoe from "@/components/benh-nhan-theo-doi/FormHoSoSucKhoe";
import SexChart from "@/components/chart/SexChart";
import StatusChart from "@/components/chart/StatusChart";
import FormChuyenBacSi from "@/components/chuyen-bac-si/FormChuyenBacSi";
import Navbar from "@/components/navbar";
import { authContext } from "@/context/AuthContext";
import { healthContext } from "@/context/HealthContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const BenhNhanCuaToi = () => {
  const { authHandler } = useContext(authContext);
  const { userData } = useContext(userContext);
  const [logBooks, setLogBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLogBook, setSelectedLogBook] = useState();
  const { healthData } = useContext(healthContext);
  const [visibleTransfer, setVisibleTransfer] =
    useState(false);
  const [visibleMedicalRecord, setVisibleMedicalRecord] =
    useState(false);
  useEffect(() => {
    setLogBooks(healthData.logBooks);
    if (selectedLogBook) {
      setSelectedLogBook(
        healthData.logBooks.filter(
          (item) => item._id === selectedLogBook._id
        )[0]
      );
    }
  }, [healthData.logBooks]);

  const formDetail = (logBook) => {
    authHandler.showWrapper();
    setSelectedLogBook(logBook);
  };
  const handleCloseForm = () => {
    authHandler.hiddenWrapper();
    setSelectedLogBook();
  };
  const hiddenTransfer = () => {
    setVisibleTransfer(false);
  };
  const hiddenMedicalRecord = () => {
    setVisibleMedicalRecord(false);
  };
  const dataHealth = (data, type) => {
    if (type === "BLOODPRESSURE") {
      const filteredDisMon = data.disMon?.filter(
        (item) => item.vitalSign?.bloodPressure !== ""
      );
      if (filteredDisMon.length > 0) {
      }
      const bloodPressure =
        filteredDisMon.length > 0
          ? filteredDisMon[filteredDisMon.length - 1]
              .vitalSign?.bloodPressure
          : "N/A";
      return data.status_bloodPressure === null
        ? bloodPressure
        : `${bloodPressure} (${data.status_bloodPressure.status_type})`;
    } else if (type === "TEMPERATURE") {
      const filteredDisMon = data.disMon?.filter(
        (item) => item.vitalSign?.temperature !== 0
      );
      const temperature =
        filteredDisMon.length > 0
          ? filteredDisMon[filteredDisMon.length - 1]
              .vitalSign?.temperature
          : "N/A";
      return data.status_temperature === null
        ? `${temperature} °C`
        : `${temperature} °C (${data.status_temperature.status_type})`;
    } else if (type === "BMI") {
      const filteredWeight = data.disMon?.filter(
        (item) => item.vitalSign?.weight !== 0
      );
      const filteredHeight = data.disMon?.filter(
        (item) => item.vitalSign?.height !== 0
      );

      if (
        filteredWeight.length > 0 &&
        filteredHeight.length > 0
      ) {
        const weight =
          filteredWeight[filteredWeight.length - 1]
            .vitalSign?.weight;
        const height =
          filteredHeight[filteredHeight.length - 1]
            .vitalSign?.height / 100; // Convert height from cm to meters
        const bmi = weight / (height * height);
        return data.status_bmi === null
          ? bmi.toFixed(2)
          : `${bmi.toFixed(2)} (${
              data.status_bmi.status_type
            })`; // Return BMI rounded to 2 decimal places
      } else {
        return "N/A";
      }
    } else if (type === "SYMPTOM") {
      const filteredDisMon = data.disMon?.filter(
        (item) => item.symptom !== ""
      );
      const symptom =
        filteredDisMon.length > 0
          ? filteredDisMon[filteredDisMon.length - 1]
              .symptom +
            " " +
            `(${
              filteredDisMon[filteredDisMon.length - 1].date
                ?.day
            }/${
              filteredDisMon[filteredDisMon.length - 1].date
                ?.month
            }/${
              filteredDisMon[filteredDisMon.length - 1].date
                ?.year
            })`
          : "Không";
      return symptom;
    } else if (type === "NOTE") {
      const filteredDisMon = data.disMon?.filter(
        (item) => item.note !== ""
      );
      const note =
        filteredDisMon.length > 0
          ? filteredDisMon[filteredDisMon.length - 1].note
          : "Không";
      return note;
    } else {
      const filteredDisMon = data.disMon?.filter(
        (item) => item.vitalSign?.heartRate !== 0
      );
      const heartRate =
        filteredDisMon.length > 0
          ? filteredDisMon[filteredDisMon.length - 1]
              .vitalSign?.heartRate
          : "N/A";
      return data.status_heartRate === null
        ? `${heartRate} bpm`
        : `${heartRate} bpm (${data.status_heartRate.status_type})`;
    }
  };
  return (
    <div className="w-full h-screen flex flex-col pt-[60px] px-[5%] background-public">
      <Navbar />
      <div className="w-full mt-[2rem]">
        <div className="flex justify-center">
          <span className="font-bold text-[25px]">
            Bệnh nhân của tôi
          </span>
        </div>
        <div className="flex flex-row w-full items-center">
          <div className="flex flex-col justify-center items-center w-[50%]">
            <span className="font-bold text-[20px]">
              Thống kê sức khỏe
            </span>
            <div className="flex items-center justify-center w-full">
              <StatusChart logBooks={logBooks} />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-[50%]">
            <span className="font-bold text-[20px]">
              Thống kê trạng thái sức khỏe bệnh nhân
            </span>
            <div className="flex items-center justify-center w-full">
              <SexChart logBooks={logBooks} />
            </div>
          </div>
        </div>
        <div className="w-full max-h-[500px] mt-4 overflow-y-auto relative">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="w-[5%] py-3 text-center"
                >
                  #
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Họ tên
                </th>
                <th scope="col" className="w-[10%] py-3">
                  Huyết áp
                </th>
                <th scope="col" className="w-[10%] py-3">
                  Nhiệt độ cơ thể
                </th>
                <th scope="col" className="w-[10%] py-3">
                  BMI trung bình
                </th>
                <th scope="col" className="w-[10%] py-3">
                  Nhịp tim
                </th>
                <th scope="col" className="w-[13%] py-3">
                  Ghi Chú
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Triệu chứng
                </th>
                <th scope="col" className="w-[12%] py-3">
                  Trạng thái sức khỏe
                </th>
              </tr>
            </thead>
            <tbody className=" w-[full] bg-black font-medium">
              {!loading &&
                logBooks.map((logBook, index) => {
                  if (
                    logBook.status.status_type ===
                    "ACCEPTED"
                  ) {
                    return (
                      <tr
                        key={index}
                        className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                        onClick={() => formDetail(logBook)}
                      >
                        <td className=" py-2 text-center text-[#252525]">
                          {index + 1}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {logBook.patient?.fullName}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {dataHealth(
                            logBook,
                            "BLOODPRESSURE"
                          )}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {dataHealth(
                            logBook,
                            "TEMPERATURE"
                          )}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {dataHealth(logBook, "BMI")}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {dataHealth(logBook, "HEARTRATE")}{" "}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {dataHealth(logBook, "NOTE")}{" "}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {dataHealth(logBook, "SYMPTOM")}{" "}
                        </td>
                        <td className=" py-2 text-[#252525]">
                          {logBook.status_bloodPressure ===
                            null &&
                          logBook.status_temperature ===
                            null &&
                          logBook.status_heartRate ===
                            null &&
                          logBook.status_bmi === null
                            ? "Bình thường"
                            : "Báo động"}
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>
          {loading && (
            <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          )}
          <FormBenhNhanDetail
            setVisibleMedicalRecord={
              setVisibleMedicalRecord
            }
            visibleMedicalRecord={visibleMedicalRecord}
            setVisibleTransfer={setVisibleTransfer}
            visibleTransfer={visibleTransfer}
            logBookUpdate={selectedLogBook}
            onClose={handleCloseForm}
          />
          <FormChuyenBacSi
            hidden={hiddenTransfer}
            visibleTransfer={visibleTransfer}
            logBook={selectedLogBook}
          />
          <FormHoSoSucKhoe
            hidden={hiddenMedicalRecord}
            visibleMedicalRecord={visibleMedicalRecord}
            logBook={selectedLogBook}
          />
        </div>
      </div>
    </div>
  );
};

export default BenhNhanCuaToi;
