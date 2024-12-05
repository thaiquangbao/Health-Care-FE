import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  calculateDetailedTimeDifference,
  convertDateToDayMonthYearTimeObject,
  // revertDate,
} from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState, useRef } from "react";
import NhietDo from "@/components/benh-nhan-theo-doi/Nhiet-do";
import HuyetAp from "@/components/benh-nhan-theo-doi/Huyet-ap";
import BMI from "@/components/benh-nhan-theo-doi/Chi-so-BMI";
import NhipTim from "@/components/benh-nhan-theo-doi/Nhip-tim";
import { formatMoney } from "@/utils/other";
const FormDetailLogBook = ({ data, onClose }) => {
  const router = useRouter();
  const [doctorRecord, setDoctorRecord] = useState();
  const { userData } = useContext(userContext);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [logBook, setLogBook] = useState();
  const itemRef = useRef();
  useEffect(() => {
    if (data) {
      setLogBook(data);
    }
  }, [data]);

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
              overflow: "auto",
            }
      }
      className="z-[41] w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col gap-2 h-[100%] overflow-auto">
        <span className="font-semibold">{`Thông Tin Chi Tiết Cuộc Hẹn (Đặt khám lâu dài)`}</span>
        <div className="flex justify-between items-center px-4 mt-4">
          <div className="flex items-center gap-4">
            <div
              className="w-[60px] aspect-square shadow-xl rounded-full"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${
                  userData.user?.role !== "DOCTOR"
                    ? logBook?.doctor?.image
                    : logBook?.patient?.image
                })`,
              }}
            ></div>
            <div className="flex flex-col">
              <span className="font-semibold text-[15px]">
                BS.{" "}
                {userData.user?.role !== "DOCTOR"
                  ? logBook?.doctor?.fullName
                  : logBook?.patient?.fullName}
              </span>
              <span className="text-[14px]">
                {userData.user?.role !== "DOCTOR"
                  ? logBook?.doctor?.phone
                  : logBook?.patient?.phone}
              </span>
            </div>
          </div>
          {/* Khúc chổ này để hiển thị vào phòng khám định kỳ */}
          <div className="flex flex-col gap-1">
            <span className="text-[14px]">
              Thời gian hẹn: {logBook?.date?.time} ngày {logBook?.date?.day}{" "}
              tháng {logBook?.date?.month}, {logBook?.date?.year}
            </span>
            <div className="flex items-center space-x-2 justify-end">
              <span
                style={{
                  color:
                    logBook?.status?.status_type === "ACCEPTED"
                      ? "green"
                      : logBook?.status?.status_type === "QUEUE"
                      ? "#999"
                      : logBook?.status?.status_type === "COMPLETED"
                      ? "blue"
                      : "red",
                }}
                className="font-medium text-[14px]"
              >
                {logBook?.status?.status_type === "ACCEPTED"
                  ? "Bác sĩ đã đồng ý"
                  : logBook?.status?.message}
              </span>
              <div className="relative flex h-4 w-4">
                <span
                  style={{
                    backgroundColor:
                      logBook?.status?.status_type === "ACCEPTED"
                        ? "green"
                        : logBook?.status?.status_type === "QUEUE"
                        ? "#999"
                        : logBook?.status?.status_type === "COMPLETED"
                        ? "blue"
                        : "red",
                  }}
                  className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                ></span>
                <span
                  style={{
                    backgroundColor:
                      logBook?.status?.status_type === "ACCEPTED"
                        ? "green"
                        : logBook?.status?.status_type === "QUEUE"
                        ? "#999"
                        : logBook?.status?.status_type === "COMPLETED"
                        ? "blue"
                        : "red",
                  }}
                  className="relative inline-flex h-4 w-4 rounded-full"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div className="py-[1.5rem] min-w-[100%] flex flex-col">
          <span
            style={{
              color:
                logBook?.status?.status_type !== "STOPPED" ? "black" : "red",
            }}
            className="font-semibold text-[18px]"
          >
            Thông tin bệnh nhân (
            {logBook?.status?.status_type !== "CANCELED"
              ? "Đang theo dõi sức khỏe"
              : "Đã dừng theo dõi sức khỏe"}
            )
          </span>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col w-full">
              <div className="grid grid-cols-3 py-4 gap-3">
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Họ và tên:
                  </label>
                  <span className="px-2 py-1">
                    {logBook?.patient?.fullName}
                  </span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Ngày sinh:
                  </label>
                  <span className="px-2 py-1">
                    {logBook?.patient?.dateOfBirth}
                  </span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Giới tính:
                  </label>
                  <span className="px-2 py-1">
                    {logBook?.patient?.sex === true ? "Nam" : "Nữ"}
                  </span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Số điện thoại:
                  </label>
                  <span className="px-2 py-1">{logBook?.patient?.phone}</span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">Email:</label>
                  <span className="px-2 py-1">{logBook?.patient?.email}</span>
                </div>

                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Loại phiếu:
                  </label>
                  <span className="px-2 py-1">
                    {formatMoney(logBook?.priceList?.price)}đ/
                    {logBook?.priceList?.type}
                  </span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Ngày đặt khám:
                  </label>
                  <span className="px-2 py-1">
                    {logBook?.date?.time} ngày {logBook?.date?.day} tháng{" "}
                    {logBook?.date?.month}, {logBook?.date?.year}
                  </span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">Ghi chú:</label>
                  <span className="px-2 py-1">
                    {logBook?.disMon?.filter((item) => item.note !== "")
                      .length > 0
                      ? logBook?.disMon?.filter((item) => item.note !== "")[
                          logBook?.disMon?.filter((item) => item.note !== "")
                            .length - 1
                        ].note +
                        " " +
                        `(${
                          logBook?.disMon?.filter((item) => item.note !== "")[
                            logBook?.disMon?.filter((item) => item.note !== "")
                              .length - 1
                          ].date?.day
                        }/
                    ${
                      logBook?.disMon?.filter((item) => item.note !== "")[
                        logBook?.disMon?.filter((item) => item.note !== "")
                          .length - 1
                      ].date?.month
                    }/
                    ${
                      logBook?.disMon?.filter((item) => item.note !== "")[
                        logBook?.disMon?.filter((item) => item.note !== "")
                          .length - 1
                      ].date?.year
                    })`
                      : "Không"}
                  </span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Triệu chứng:
                  </label>
                  <span className="px-2 py-1">
                    {logBook?.disMon?.filter((item) => item.symptom !== "")
                      .length > 0
                      ? logBook?.disMon?.filter((item) => item.symptom !== "")[
                          logBook?.disMon?.filter((item) => item.symptom !== "")
                            .length - 1
                        ].symptom +
                        " " +
                        `(${
                          logBook?.disMon?.filter(
                            (item) => item.symptom !== ""
                          )[
                            logBook?.disMon?.filter(
                              (item) => item.symptom !== ""
                            ).length - 1
                          ].date?.day
                        }/
                    ${
                      logBook?.disMon?.filter((item) => item.symptom !== "")[
                        logBook?.disMon?.filter((item) => item.symptom !== "")
                          .length - 1
                      ].date?.month
                    }/
                    ${
                      logBook?.disMon?.filter((item) => item.symptom !== "")[
                        logBook?.disMon?.filter((item) => item.symptom !== "")
                          .length - 1
                      ].date?.year
                    })`
                      : "Không"}
                  </span>
                </div>
              </div>
            </div>
            {logBook && (
              <div className="flex flex-col gap-1 w-full">
                {logBook?.status?.status_type !== "STOPPED" ? (
                  <>
                    <div className="flex flex-row gap-4 p-2 w-full">
                      <div className="w-[50%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Nhiệt độ cơ thể</span>
                        </div>
                        <NhietDo logBook={logBook} />
                      </div>
                      <div className="w-[50%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Huyết áp</span>
                        </div>
                        <HuyetAp logBook={logBook} />
                      </div>
                    </div>
                    <div className="flex flex-row gap-4 p-2 h-[50%]">
                      <div className="w-[60%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Chỉ số BMI</span>
                        </div>
                        <BMI logBook={logBook} />
                      </div>
                      <div className="w-[60%]">
                        <div className="flex justify-center">
                          <span className="font-bold">Nhịp tim</span>
                        </div>
                        <NhipTim logBook={logBook} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col w-full h-full items-center justify-center">
                    <span className="text-[20px] font-semibold">
                      Đã Dừng Theo Dõi Sức Khỏe
                    </span>
                  </div>
                )}
              </div>
            )}
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
