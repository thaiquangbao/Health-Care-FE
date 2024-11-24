"use client";
import { authContext } from "@/context/AuthContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam, convertDateToDayMonthYearVietNam2 } from "@/utils/date";
import { useParams, useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const DetailMedicalRecord = ({ medicalRecord }) => {
  const { authHandler } = useContext(authContext)
  const router = useRouter();

  // Xử lý
  // Thêm thuốc

  return (
    <section
      style={{
        height: medicalRecord ? "95%" : 0,
        width: medicalRecord ? "65%" : 0,
        transition: "0.3s",
        backgroundSize: "cover",
        overflow: "hidden",
        backgroundImage: "url(/bg.png)",
      }}
      className="z-[45] shadow-xl bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <button
        onClick={() =>
          authHandler.hiddenDetailMedicalRecord()
        }
        className="absolute right-2 top-2"
      >
        <i className="bx bx-x text-[30px] text-[#5e5e5e]"></i>
      </button>
      <div className="px-[2rem] h-[100%] pt-5 overflow-auto w-full flex flex-col">
        <div className="flex justify-center items-center">
          <span className="font-semibold text-center text-[20px]">
            Hồ Sơ Bệnh Án
          </span>
        </div>

        <div className="flex items-center justify-between py-4 w-full space-x-8 p-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start">
              <span className="font-semibold mb-2">
                Bệnh nhân
              </span>
              <div className="flex gap-4 items-center">
                <div
                  className="w-[55px] aspect-square rounded-full shadow-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${medicalRecord?.patient?.image})`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="font-medium text-lg text-gray-800">
                    {medicalRecord?.patient?.fullName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {medicalRecord?.patient?.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-start">
              <span className="font-semibold mb-2">
                Bác sĩ
              </span>
              <div className="flex gap-4 items-center">
                <div
                  className="w-[55px] aspect-square rounded-full shadow-xl bg-cover bg-start"
                  style={{
                    backgroundImage: `url(${medicalRecord?.doctor?.image})`,
                  }}
                ></div>
                <div className="flex flex-col">
                  <span className="font-medium text-lg text-gray-800">
                    BS.{medicalRecord?.doctor?.fullName}
                  </span>
                  <span className="text-sm text-gray-600">
                    {medicalRecord?.doctor?.phone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <span className="mt-2">
          <span className="font-semibold px-2">
            Triệu Chứng:
          </span>{" "}
          {medicalRecord?.symptoms}
        </span>
        <div className="grid grid-cols-2 mt-2">
          <span>
            <span className="font-semibold px-2">
              Ngày Khám:
            </span>{" "}
            ({medicalRecord?.date?.time}){" "}
            {medicalRecord?.date?.day}/{""}
            {medicalRecord?.date?.month}/{" "}
            {medicalRecord?.date?.year}
          </span>
          <span className="">
            <span className="font-semibold px-2">
              Ngày tái khám:
            </span>{" "}
            {
              medicalRecord?.reExaminationDate?.month !==
                0 &&
                medicalRecord?.reExaminationDate?.month !== null
                ? `${medicalRecord?.reExaminationDate?.day}/${medicalRecord?.reExaminationDate?.month}/${medicalRecord?.reExaminationDate?.year}`
                : "Không"}
          </span>
        </div>
        <div className="grid grid-cols-3 h-auto gap-x-[0.5rem] mt-[0.5rem]">
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Huyết áp:
            </span>
            {medicalRecord?.bloodPressure === ""
              ? "Không"
              : medicalRecord?.bloodPressure + " mmHg"}
          </div>
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Nhịp tim:
            </span>
            {medicalRecord?.healthRate === 0
              ? "Không"
              : medicalRecord?.healthRate + " bpm"}
          </div>
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Cân nặng:
            </span>
            {medicalRecord?.weight === 0
              ? "Không"
              : medicalRecord?.weight + " kg"}
          </div>
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Chiều cao:
            </span>
            {medicalRecord?.height === 0
              ? "Không"
              : medicalRecord?.height + " cm"}
          </div>
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Nhiệt độ:
            </span>
            {medicalRecord?.temperature === 0
              ? "Không"
              : medicalRecord?.temperature + " °C"}
          </div>
        </div>
        <div className="flex px-2 py-2 gap-[2rem]">
          <span className="font-semibold mt-[1rem]">
            Hình ảnh mô tả:
          </span>
          <div className="flex items-center gap-5 text-[13px]">
            {medicalRecord?.images?.map(
              (image, index) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                  className="h-[50px] bg-cover aspect-video"
                />
              )
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] mt-[1rem] px-2">
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Chẩn đoán
            </span>
            <div className="disabled text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4">
              {medicalRecord?.diagnosisDisease}
            </div>
          </div>
          <div>
            <span className="font-semibold px-2 mt-[1rem]">
              Nhắc nhở
            </span>
            <div className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4">
              {medicalRecord?.note}
            </div>
          </div>
        </div>

        <span className="font-semibold px-2 mt-[1rem]">
          Đơn Thuốc
        </span>
        <div className="grid h-auto gap-x-[0.5rem] px-2 mt-1">
          <div className="w-full max-h-[120px] overflow-y-auto relative">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="w-[10%] py-2 text-center"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="w-[50%] py-2 text-center"
                  >
                    Tên Thuốc
                  </th>
                  <th
                    scope="col"
                    className="w-[20%] py-2"
                  >
                    Số Lượng
                  </th>
                  <th
                    scope="col"
                    className="w-[20%] py-2"
                  >
                    Đơn vị tính
                  </th>
                </tr>
              </thead>
              <tbody className=" w-[full] bg-black font-medium">
                {medicalRecord?.medical?.map(
                  (medical, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white cursor-pointer text-center hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <td
                        scope="row"
                        className="px-6 py-2 text-center font-medium"
                      >
                        {index + 1}
                      </td>
                      <td className="py-2 text-center">
                        {medical.medicalName}
                      </td>
                      <td className="py-2 text-center">
                        {medical.quantity}
                      </td>
                      <td className="py-2 text-center">
                        {medical.unitOfCalculation}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailMedicalRecord;
