"use client";
import DetailMedicalRecord from "@/components/ho-so-suc-khoe/DetailMedicalRecord";
import FormRecord from "@/components/ho-so-suc-khoe/FormRecord";
import Navbar from "@/components/navbar";
import { authContext } from "@/context/AuthContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
// import { revertDate } from "@/utils/date";
import React, { useContext, useEffect, useRef, useState } from "react";
const HoSoSucKhoe = () => {
  const { userData, userHandler } = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const { authHandler, authData } = useContext(authContext);
  const router = useRouter();
  useEffect(() => {
    if (userData.user) {
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/medicalRecords/findByPatient/${userData?.user?._id}`,
      }).then((res) => setMedicalRecords(res.reverse()));
    }
  }, [userData.user]);

  return (
    <div className="w-full flex flex-col min-h-screen pt-[60px] pb-[3%] px-[5%] background-public">
      <Navbar />
      <div className="flex flex-col gap-4 mt-2">
        <div className="items-center flex justify-center">
          <span className="text-[30px] font-semibold text-center">
            Hồ sơ sức khỏe
          </span>
        </div>
        <div className="w-full relative flex justify-start items-center gap-[2rem]">
          <div className="aspect-square w-[12%] relative flex items-center justify-start">
            <div
              style={{
                backgroundImage: `url(${userData.user?.image})`,
                backgroundSize: "cover",
              }}
              className="rounded-full w-[800px] aspect-square"
            />
          </div>
          <div className="grid grid-cols-3 w-[80%] h-[10%] gap-3">
            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">
                Họ và tên:{"   "}
              </span>
              <span className="text-[16px] font-semibold">
                {userData.user?.fullName}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">
                Giới tính:{"   "}
              </span>
              <span className="text-[16px] font-semibold">
                {userData.user?.sex === true ? "Nam" : "Nữ"}{" "}
              </span>
            </div>

            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">Email:{"   "}</span>
              <span className="text-[16px] font-semibold">
                {userData.user?.email}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">
                Địa chỉ:{"   "}
              </span>
              <span className="text-[16px] font-semibold">
                {userData.user?.address}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">
                Số điện thoại:{"   "}
              </span>
              <span className="text-[16px] font-semibold">
                {userData.user?.phone}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">
                Ngày sinh:{"   "}
              </span>
              <span className="text-[16px] font-semibold">
                {userData.user?.dateOfBirth}
              </span>
            </div>
            <div className="w-full flex justify-start">
              <span className="text-[15px] text-[#5f5f5f]">
                Căn cước công dân:{"   "}
              </span>
              <span className="text-[16px] font-semibold">
                {userData.user?.cccd}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full max-h-[500px] mt-4 overflow-y-auto relative">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-[5%] py-3 text-center">
                  #
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Bác sĩ
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Triệu chứng
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Chẩn đoán
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Ngày khám
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Ghi Chú
                </th>
              </tr>
            </thead>

            <tbody className=" w-[full] bg-black font-medium">
              {medicalRecords.map((medical, index) => (
                <tr
                  key={index}
                  onClick={() => authHandler.showDetailMedicalRecord(medical)}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 cursor-pointer even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td scope="row" className="px-6 py-4 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 text-[15px]">
                    BS. {medical.doctor?.fullName}
                  </td>
                  <td className="py-4 text-[15px]">{medical.symptoms}</td>
                  <td className="py-4">{medical.diagnosisDisease}</td>
                  <td className="py-4">
                    {medical.date?.day}/{medical.date?.month}/
                    {medical.date?.year}
                  </td>
                  <td className="py-4">{medical.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {medicalRecords.length === 0 && (
            <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
              Bạn chưa có hồ sơ sức khỏe nào
            </div>
          )}
        </div>
      </div>
      <DetailMedicalRecord medicalRecord={authData.detailMedicalRecord} />
    </div>
  );
};
export default HoSoSucKhoe;
