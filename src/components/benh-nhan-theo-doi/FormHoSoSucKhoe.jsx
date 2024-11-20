import React, { useContext, useEffect, useRef, useState } from "react";
import { api, TypeHTTP } from "@/utils/api";
import { authContext } from "@/context/AuthContext";
import { healthContext } from "@/context/HealthContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
// import { revertDate } from "@/utils/date";
const FormHoSoSucKhoe = ({ visibleMedicalRecord, logBook, hidden }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  useEffect(() => {
    if (logBook?.doctor) {
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/medicalRecords/findByPatient/${logBook?.patient?._id}`,
      }).then((res) => setMedicalRecords(res));
    }
  }, [logBook]);

  return (
    <section
      style={{
        height: visibleMedicalRecord ? "90%" : 0,
        width: visibleMedicalRecord ? "85%" : 0,
        transition: "0.3s",
        backgroundSize: "cover",
        overflow: "auto",
        backgroundImage: "url(/bg.png)",
      }}
      className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col gap-2">
        <span className="font-semibold text-[20px]">Hồ sơ sức khỏe</span>
        <div className="w-full relative flex justify-start items-center gap-[2rem]">
          <div className="aspect-square w-[10%] relative flex items-center justify-start">
            <div
              className="w-[80px] aspect-square shadow-xl rounded-full"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${logBook?.patient?.image})`,
              }}
            ></div>
          </div>
          <div className="grid grid-cols-3 w-[80%] h-[10%] gap-3">
            <div className="w-full flex justify-start">
              <span className="text-[16px] text-[#5f5f5f]">Họ và tên:</span>
              <span className="text-[17px] font-semibold">
                {" "}
                {logBook?.patient?.fullName}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[16px] text-[#5f5f5f]">
                Giới tính:{"   "}
              </span>
              <span className="text-[17px] font-semibold">
                {logBook?.patient?.sex === true ? "Nam" : "Nữ"}{" "}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[16px] text-[#5f5f5f]">Email:</span>
              <span className="text-[17px] font-semibold">
                {" "}
                {logBook?.patient?.email}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[16px] text-[#5f5f5f]">Số điện thoại:</span>
              <span className="text-[17px] font-semibold">
                {" "}
                {logBook?.patient?.phone}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[16px] text-[#5f5f5f]">Ngày sinh:</span>
              <span className="text-[17px] font-semibold">
                {" "}
                {logBook?.patient?.dateOfBirth}
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center px-4">
          <span className="text-[19px] font-bold">Lịch sử khám</span>
        </div>
        <div className="w-full max-h-[500px] px-4 overflow-y-auto relative">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr className="text-center">
                <th scope="col" className="w-[5%] py-3 text-center">
                  #
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Bác Sĩ
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Triệu Chứng:
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Chẩn đoán
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Thời Gian Cuộc Hẹn
                </th>

                <th scope="col" className="w-[15%] py-3 text-center">
                  Ghi chú
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Thuốc
                </th>
              </tr>
            </thead>
            <tbody className=" w-[full] bg-black font-medium">
              {medicalRecords.map((medicalRecord, index) => (
                <tr
                  // onClick={() =>
                  //   appointmentHandler.showFormDetailAppointment(
                  //     appointment
                  //   )
                  // }
                  key={index}
                  className="odd:bg-white cursor-pointer hover:bg-[#eee] text-[13px] text-center transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 "
                >
                  <td scope="row" className="px-6 py-2 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="py-2">BS. {medicalRecord.doctor?.fullName}</td>
                  <td className="py-2">{medicalRecord.symptoms}</td>
                  <td className="py-2">{medicalRecord.diagnosisDisease}</td>
                  <td className="py-2">
                    Ngày: {medicalRecord.date?.day}- {medicalRecord.date?.month}
                    - {medicalRecord.date?.year}
                  </td>
                  <td className="py-2">{medicalRecord.note}</td>
                  <td className="py-2">
                    {medicalRecord.medical
                      .map((medicine) => medicine.medicalName)
                      .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </section>
  );
};
export default FormHoSoSucKhoe;
