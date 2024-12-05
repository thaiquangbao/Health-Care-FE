import BMI from "@/components/benh-nhan-theo-doi/Chi-so-BMI";
import HuyetAp from "@/components/benh-nhan-theo-doi/Huyet-ap";
import NhietDo from "@/components/benh-nhan-theo-doi/Nhiet-do";
import NhipTim from "@/components/benh-nhan-theo-doi/Nhip-tim";
import FormChuyenBacSi from "@/components/chuyen-bac-si/FormChuyenBacSi";
import { authContext } from "@/context/AuthContext";
import { api, TypeHTTP } from "@/utils/api";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Chat from "./chat";

const FormBenhNhanDetail = ({
  logBookUpdate,
  onClose,
  visibleTransfer,
  setVisibleTransfer,
  visibleMedicalRecord,
  setVisibleMedicalRecord,
}) => {
  const [logBook, setLogBook] = useState();
  const [screen, setScreen] = useState(0);
  const { authHandler, authData } = useContext(authContext);
  const itemRef = useRef();
  const [room, setRoom] = useState();

  useEffect(() => {
    setLogBook(logBookUpdate);
    if (logBookUpdate) {
      setRoom(
        authData.rooms.filter(
          (item) =>
            item.doctor._id === logBookUpdate.doctor._id &&
            item.patient._id === logBookUpdate.patient._id
        )[0]
      );
    }
  }, [logBookUpdate]);

  return (
    <section
      ref={itemRef}
      style={{
        height:
          logBook &&
            visibleTransfer === false &&
            visibleMedicalRecord === false
            ? "90%"
            : 0,
        width:
          logBook &&
            visibleTransfer === false &&
            visibleMedicalRecord === false
            ? "90%"
            : 0,
        transition: "0.4s",
        backgroundSize: "cover",
        overflow: "auto",
        // backgroundImage: "url(/bg.png)",
      }}
      className="z-[41] shadow-xl bg-[white] flex rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      {logBook &&
        visibleTransfer === false &&
        visibleMedicalRecord === false && (
          <div
            style={{
              marginLeft: `${-screen * 50}%`,
              transition: "0.5s",
            }}
            className="flex w-[100%]"
          >
            <button onClick={onClose}>
              <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
            </button>
            <div className="px-[2rem] py-[1.5rem] min-w-[100%] flex flex-col">
              <span
                style={{
                  color:
                    logBook.status.status_type !== "CANCELED"
                      ? "black"
                      : "red",
                }}
                className="font-semibold text-[25px]"
              >
                Thông tin cá nhân (
                {logBook.status.status_type !== "CANCELED"
                  ? "Đang theo dõi sức khỏe"
                  : "Đã dừng theo dõi sức khỏe"}
                )
              </span>
              <div className="flex flex-row gap-2 w-full">
                <div className="flex flex-col w-[30%]">
                  <div className="flex flex-col py-4">
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
                        {logBook?.patient?.sex === true
                          ? "Nam"
                          : "Nữ"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <label className="text-[#5e5e5e] text-[15px]">
                        Số điện thoại:
                      </label>
                      <span className="px-2 py-1">
                        {logBook?.patient?.phone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <label className="text-[#5e5e5e] text-[15px]">
                        Email:
                      </label>
                      <span className="px-2 py-1">
                        {logBook?.patient?.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <label className="text-[#5e5e5e] text-[15px]">
                        Ghi chú:
                      </label>
                      <span className="px-2 py-1">
                        {logBook.disMon?.filter(
                          (item) => item.note !== ""
                        ).length > 0
                          ? logBook.disMon?.filter(
                            (item) => item.note !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) => item.note !== ""
                            ).length - 1
                          ].note +
                          " " +
                          `(${logBook.disMon?.filter(
                            (item) => item.note !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) => item.note !== ""
                            ).length - 1
                          ].date?.day
                          }/
                    ${logBook.disMon?.filter(
                            (item) => item.note !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) => item.note !== ""
                            ).length - 1
                          ].date?.month
                          }/
                    ${logBook.disMon?.filter(
                            (item) => item.note !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) => item.note !== ""
                            ).length - 1
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
                        {logBook.disMon?.filter(
                          (item) => item.symptom !== ""
                        ).length > 0
                          ? logBook.disMon?.filter(
                            (item) => item.symptom !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) =>
                                item.symptom !== ""
                            ).length - 1
                          ].symptom +
                          " " +
                          `(${logBook.disMon?.filter(
                            (item) =>
                              item.symptom !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) =>
                                item.symptom !== ""
                            ).length - 1
                          ].date?.day
                          }/
                    ${logBook.disMon?.filter(
                            (item) => item.symptom !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) => item.symptom !== ""
                            ).length - 1
                          ].date?.month
                          }/
                    ${logBook.disMon?.filter(
                            (item) => item.symptom !== ""
                          )[
                            logBook.disMon?.filter(
                              (item) => item.symptom !== ""
                            ).length - 1
                          ].date?.year
                          })`
                          : "Không"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <label className="text-[#5e5e5e] text-[15px]">
                        Trạng thái sức khỏe:
                      </label>
                      <span className="px-2 py-1">
                        {logBook.status_bloodPressure ===
                          null &&
                          logBook.status_temperature ===
                          null &&
                          logBook.status_heartRate === null &&
                          logBook.status_bmi === null
                          ? "Bình thường"
                          : "Báo động"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col py-2 gap-1 w-[100%]">
                    {logBook.status.status_type !==
                      "CANCELED" && (
                        <>
                          <button
                            className="py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                            onClick={() => {
                              setVisibleTransfer(true);
                            }}
                          >
                            Chuyển bác sĩ
                          </button>
                          <button
                            className="py-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                            onClick={() => {
                              setVisibleMedicalRecord(true);
                            }}
                          >
                            Xem hồ sơ sức khỏe
                          </button>
                        </>
                      )}

                    <button
                      onClick={() => setScreen(2)}
                      className="py-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white"
                    >
                      {logBook.status.status_type !==
                        "CANCELED"
                        ? "Nhắc nhở bệnh nhân"
                        : "Gửi tin nhắn"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1 w-[75%]">
                  {logBook.status.status_type !==
                    "CANCELED" ? (
                    <>
                      <div className="flex flex-row gap-4 p-2 h-[50%]">
                        <div className="w-[50%]">
                          <div className="flex justify-center">
                            <span className="font-bold">
                              Nhiệt độ cơ thể
                            </span>
                          </div>
                          <NhietDo logBook={logBook} />
                        </div>
                        <div className="w-[50%]">
                          <div className="flex justify-center">
                            <span className="font-bold">
                              Huyết áp
                            </span>
                          </div>
                          <HuyetAp logBook={logBook} />
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 p-2 h-[50%]">
                        <div className="w-[50%]">
                          <div className="flex justify-center">
                            <span className="font-bold">
                              Chỉ số BMI
                            </span>
                          </div>
                          <BMI logBook={logBook} />
                        </div>
                        <div className="w-[50%]">
                          <div className="flex justify-center">
                            <span className="font-bold">
                              Nhịp tim
                            </span>
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
              </div>
            </div>
            <div className="p-[0.5rem] min-w-[100%] flex flex-col items-center">
              <Chat
                room={room}
                setRoom={setRoom}
                setScreen={setScreen}
              />
            </div>
          </div>
        )}
    </section>
  );
};
export default FormBenhNhanDetail;
