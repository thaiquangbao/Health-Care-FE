import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  calculateDetailedTimeDifference,
  convertDateToDayMonthYearTimeObject,
} from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import NhietDo from "@/components/benh-nhan-theo-doi/Nhiet-do";
import HuyetAp from "@/components/benh-nhan-theo-doi/Huyet-ap";
import BMI from "@/components/benh-nhan-theo-doi/Chi-so-BMI";
import NhipTim from "@/components/benh-nhan-theo-doi/Nhip-tim";
const FormDetailLogBook = ({ data, onClose}) => {
  const router = useRouter();
  const [doctorRecord, setDoctorRecord] = useState();
  const { userData } = useContext(userContext);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [logBooks, setLogBooks] = useState([]);
  const itemRef = useRef()
  useEffect(() => {
    if (data) {
        setLogBooks(data)
    }
  },[data])
  return (
    <div
      ref={itemRef}
      style={
        data
          ? {
            height: "90%",
            width: "80%",
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
      className="z-[41] w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col gap-2">
        <span className="font-semibold">{`Thông Tin Chi Tiết Cuộc Hẹn (Đặt khám lâu dài)`}</span>
        <div className="flex justify-between items-center px-4 mt-4">
          <div className="flex items-center gap-4">
            <div
              className="w-[60px] aspect-square shadow-xl rounded-full"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${userData.user?.role !== "DOCTOR"
                  ? logBooks?.doctor?.image
                  : logBooks?.patient?.image
                  })`,
              }}
            ></div>
            <div className="flex flex-col">
              <span className="font-semibold text-[15px]">
                BS.{" "}
                {userData.user?.role !== "DOCTOR"
                  ? logBooks?.doctor?.fullName
                  : logBooks?.patient?.fullName}
              </span>
              <span className="text-[14px]">
                {userData.user?.role !== "DOCTOR"
                  ? logBooks?.doctor?.phone
                  : logBooks?.patient?.phone}
              </span>
            </div>
          </div>
          {/* Khúc chổ này để hiển thị vào phòng khám định kỳ */}
          <div className="flex flex-col gap-1">
            <span className="text-[14px]">
              Thời gian hẹn: {logBooks?.date?.time}{" "}
              ngày {logBooks?.date?.day} tháng{" "}
              {logBooks?.date?.month},{" "}
              {logBooks?.date?.year}
            </span>
            <div className="flex items-center space-x-2 justify-end">
              <span
                style={{
                  color:
                    logBooks?.status?.status_type === "ACCEPTED"
                      ? "green"
                      : logBooks?.status?.status_type === "QUEUE"
                        ? "#999"
                        : "red",
                }}
                className="font-medium text-[14px]"
              >
                {logBooks?.status?.status_type === "ACCEPTED"
                  ? calculateDetailedTimeDifference(
                    convertDateToDayMonthYearTimeObject(
                      new Date().toISOString()
                    ),
                    logBooks?.date
                  )
                  : logBooks?.status?.status_message}
              </span>
              <div className="relative flex h-4 w-4">
                <span
                  style={{
                    backgroundColor:
                      logBooks?.status?.status_type === "ACCEPTED"
                        ? "green"
                        : logBooks?.status?.status_type === "QUEUE"
                          ? "#999"
                          : "red",
                  }}
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                ></span>
                <span
                  style={{
                    backgroundColor:
                      logBooks?.status?.status_type === "ACCEPTED"
                        ? "green"
                        : logBooks?.status?.status_type === "QUEUE"
                          ? "#999"
                          : "red",
                  }}
                  className="relative inline-flex h-4 w-4 rounded-full"
                ></span>
              </div>
            </div>
          </div>
           
        </div> 
        <div className="py-[1.5rem] min-w-[100%] flex flex-col">
          <span style={{ color: logBooks?.status?.status_type !== 'STOPPED' ? 'black' : 'red' }} className="font-semibold text-[18px]">
              Thông tin bệnh nhân  ({logBooks?.status?.status_type !== 'STOPPED' ? 'Đang theo dõi sức khỏe' : "Đã dừng theo dõi sức khỏe"})
            </span>
            <div className="flex flex-row gap-2 w-full">
             <div className="flex flex-col w-[30%]">
                <div className="flex flex-col py-4 gap-3">
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Họ và tên:
                    </label>
                    <span className="px-2 py-1">{logBooks?.patient?.fullName}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Ngày sinh:
                    </label>
                    <span className="px-2 py-1">{logBooks?.patient?.dateOfBirth}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Giới tính:
                    </label>
                    <span className="px-2 py-1">{logBooks?.patient?.sex === true ? "Nam" : "Nữ"}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Số điện thoại:
                    </label>
                    <span className="px-2 py-1">{logBooks?.patient?.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Email:
                    </label>
                    <span className="px-2 py-1">{logBooks?.patient?.email}</span>
                  </div>
                 
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Loại phiếu:
                    </label>
                    <span className="px-2 py-1">{logBooks?.priceList?.price}đ/{logBooks?.priceList?.type}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Ngày đặt khám:
                    </label>
                    <span className="px-2 py-1">
                        {logBooks?.date?.time}{" "}
                        ngày {logBooks?.date?.day} tháng{" "}
                        {logBooks?.date?.month},{" "}
                        {logBooks?.date?.year}
                    </span>
                  </div>
                   <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Ghi chú:
                    </label>
                    <span className="px-2 py-1">{logBooks?.disMon?.filter(item => item.note !== "").length > 0  ? 
                    logBooks?.disMon?.filter(item => item.note !== "")[logBooks.disMon?.filter(item => item.note !== "").length - 1].note + " " + 
                    `(${logBooks?.disMon?.filter(item => item.note !== "")[logBooks?.disMon?.filter(item => item.note !== "").length - 1].date?.day}/
                    ${logBooks?.disMon?.filter(item => item.note !== "")[logBooks?.disMon?.filter(item => item.note !== "").length - 1].date?.month}/
                    ${logBooks?.disMon?.filter(item => item.note !== "")[logBooks?.disMon?.filter(item => item.note !== "").length - 1].date?.year})` : 'Không'}</span>
                  </div>
                  <div className="flex items-center">
                    <label className="text-[#5e5e5e] text-[15px]">
                      Triệu chứng:
                    </label>
                    <span className="px-2 py-1">{logBooks?.disMon?.filter(item => item.symptom !== "").length > 0 ? 
                    logBooks.disMon?.filter(item => item.symptom !== "")[logBooks.disMon?.filter(item => item.symptom !== "").length - 1].symptom + " " +
                    `(${logBooks?.disMon?.filter(item => item.symptom !== "")[logBooks?.disMon?.filter(item => item.symptom !== "").length - 1].date?.day}/
                    ${logBooks?.disMon?.filter(item => item.symptom !== "")[logBooks?.disMon?.filter(item => item.symptom !== "").length - 1].date?.month}/
                    ${logBooks?.disMon?.filter(item => item.symptom !== "")[logBooks?.disMon?.filter(item => item.symptom !== "").length - 1].date?.year})` : 'Không'}</span>
                  </div>
                </div>
               
              </div>
              {/* <div className="flex flex-col gap-1 w-[75%]">
                {logBooks?.status?.status_type !== 'STOPPED' ? (
                  <>
                    <div className="flex flex-row gap-4 p-2 h-[50%]">
                      <div className="w-[50%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Nhiệt độ cơ thể</span>
                        </div>
                        <NhietDo logBook={logBooks} />
                      </div>
                      <div className="w-[50%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Huyết áp</span>
                        </div>
                        <HuyetAp logBook={logBooks} />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 p-2 h-[50%]">
                      <div className="w-[50%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Chỉ số BMI</span>
                        </div>
                        <BMI logBook={logBooks} />
                      </div>
                      <div className="w-[50%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Nhịp tim</span>
                        </div>
                        <NhipTim logBook={logBooks} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col w-full h-full items-center justify-center">
                    <span className="text-[20px] font-semibold">Đã Dừng Theo Dõi Sức Khỏe</span>
                  </div>
                )}
              </div> */}
            </div>
        </div>
      </div>
      <button onClick={onClose}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </div>
  );
};

export default FormDetailLogBook;
