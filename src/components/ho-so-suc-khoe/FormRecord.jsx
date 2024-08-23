import { appointmentContext } from "@/context/AppointmentContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam2 } from "@/utils/date";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

const FormRecord = ({ data }) => {
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
  useEffect(() => {
    if (data) {
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/medicalRecords/findByPatient/${data}`,
      }).then((res) => setMedicalRecord(res));
    }
  }, [data, visible]);

  // Xử lý
  // Thêm thuốc

  return (
    <section
      style={
        visible
          ? {
              height: "90%",
              width: "65%",
              transition: "0.3s",
              backgroundSize: "cover",
              overflow: "hidden",
              backgroundImage: "url(/bg.png)",
            }
          : {
              height: 0,
              width: 0,
              transition: "0.3s",
              overflow: "hidden",
            }
      }
      className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col">
        <span className="font-semibold">Hồ Sơ Bệnh Án</span>
        <div className="flex items-center justify-between py-4 px-2 w-full">
          <div className="flex items-center gap-4 ">
            <div
              className="w-[60px] aspect-square rounded-full shadow-xl"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${medicalRecord?.patient?.image})`,
              }}
            ></div>
            <div className="flex flex-col">
              <span className="font-medium">
                {medicalRecord?.patient?.fullName}
              </span>
              <span className="text-[14px]">
                {medicalRecord?.patient?.phone}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-[14px]">
            <span>{medicalRecord?.date?.day}</span>
          </div>
        </div>
        <span>
          <span className="font-semibold px-2">
            Triệu Chứng:
          </span>{" "}
          {medicalRecord?.diagnosisDisease}
        </span>
        <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] mt-[1rem] px-2">
          <textarea
            placeholder="Chuẩn đoán bệnh"
            className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) =>
              setDiagnosisDisease(e.target.value)
            }
            value={diagnosisDisease}
          ></textarea>
          <textarea
            placeholder="Lời dặn bác sĩ"
            className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          ></textarea>
        </div>
        <span className="font-semibold px-2 mt-[1rem]">
          Đơn Thuốc
        </span>
        <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] px-2 mt-1">
          <div className="text-[14px] w-[100%] focus:outline-0 rounded-lg px-4">
            <input
              placeholder="Tên thuốc"
              className="text-[14px] w-[100%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) =>
                setNameMedical(e.target.value)
              }
              value={nameMedical}
            />
            <div className="flex items-center justify-between">
              <select
                className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                value={unitOfCalculation}
                onChange={(e) =>
                  setUnitOfCalculation(e.target.value)
                }
              >
                <option>Đơn vị tính</option>
                <option>Viên</option>
                <option>Vỉ</option>
                <option>Hộp</option>
                <option>Ống</option>
                <option>Gói</option>
                <option>Chai/Lọ</option>
                <option>Tuýp</option>
              </select>
              <input
                placeholder="Số lượng"
                className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                value={quantity}
              />
            </div>
            <button
              className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] flex justify-center items-center w-[30%] text-[white] mt-2 h-[37px] rounded-lg"
              onClick={() => addMedical()}
            >
              Thêm
            </button>
          </div>
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
                  <th scope="col" className="w-[20%] py-2">
                    Số Lượng
                  </th>
                  <th scope="col" className="w-[20%] py-2">
                    Đơn vị tính
                  </th>
                </tr>
              </thead>
              <tbody className=" w-[full] bg-black font-medium">
                {medical.map((medical, index) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormRecord;
