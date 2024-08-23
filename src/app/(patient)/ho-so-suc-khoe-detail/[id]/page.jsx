"use client";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam2 } from "@/utils/date";
import { useParams, useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const FormRecord = () => {
  const [medicalRecord, setMedicalRecord] = useState();
  const [medical, setMedical] = useState([]);
  const [nameMedical, setNameMedical] = useState("");
  const [quantity, setQuantity] = useState(0);
  const { globalHandler } = useContext(globalContext);
  const [unitOfCalculation, setUnitOfCalculation] =
    useState("");
  const [diagnosisDisease, setDiagnosisDisease] =
    useState("");
  const [note, setNote] = useState("");
  const { id } = useParams();
  const router = useRouter();
  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      sendToken: false,
      path: `/medicalRecords/findById/${id}`,
    }).then((res) => setMedicalRecord(res));
  }, [id]);

  // Xử lý
  // Thêm thuốc

  return (
    <div className="w-full flex flex-col pt-[1%] pb-[3%] px-[5%] background-public">
      <section
        style={{
          height: "95%",
          width: "65%",
          transition: "0.3s",
          backgroundSize: "cover",
          overflow: "hidden",
          backgroundImage: "url(/bg.png)",
        }}
        className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
      >
        <div className="px-[2rem] py-[1.5rem] w-full flex flex-col">
          <div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
            >
              Trở về
            </button>
          </div>
          <div className="flex justify-center items-center">
            <span className="font-semibold text-center text-[20px]">
              Hồ Sơ Bệnh Án
            </span>
          </div>

          <div className="flex items-center justify-between py-4 w-full space-x-8 p-4">
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="font-semibold mb-2">
                  Bệnh nhân
                </span>
                <div
                  className="w-[60px] aspect-square rounded-full shadow-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${medicalRecord?.patient?.image})`,
                  }}
                ></div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-lg text-gray-800">
                  {medicalRecord?.patient?.fullName}
                </span>
                <span className="text-sm text-gray-600">
                  {medicalRecord?.patient?.phone}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                <span className="font-semibold mb-2">
                  Bác sĩ
                </span>
                <div
                  className="w-[60px] aspect-square rounded-full shadow-xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${medicalRecord?.doctor?.image})`,
                  }}
                ></div>
              </div>
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

          <span>
            <span className="font-semibold px-2">
              Ngày Khám:
            </span>{" "}
            {medicalRecord?.date?.day} /{" "}
            {medicalRecord?.date?.month} /{" "}
            {medicalRecord?.date?.year}
          </span>
          <span className="mt-2">
            <span className="font-semibold px-2">
              Ngày tái khám:
            </span>{" "}
            Không
          </span>
          <span className="mt-2">
            <span className="font-semibold px-2">
              Triệu Chứng:
            </span>{" "}
            {medicalRecord?.symptoms}
          </span>
          <div className="grid grid-cols-3 h-auto gap-x-[0.5rem] mt-[1rem]">
            <div>
              <span className="font-semibold px-2 mt-[1rem]">
                Huyết áp:
              </span>
              Không
            </div>
            <div>
              <span className="font-semibold px-2 mt-[1rem]">
                Nhịp tim:
              </span>
              Không
            </div>
            <div>
              <span className="font-semibold px-2 mt-[1rem]">
                Cân nặng:
              </span>
              Không
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
            <div className="w-full max-h-[140px] overflow-y-auto relative">
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
                        className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                      >
                        <td
                          scope="row"
                          className="px-6 py-2 text-center font-medium"
                        >
                          {index + 1}
                        </td>
                        <td className="py-2 text-[15px] text-center">
                          {medical.medicalName}
                        </td>
                        <td className="py-2">
                          {medical.quantity}
                        </td>
                        <td className="py-2">
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
    </div>
  );
};

export default FormRecord;
