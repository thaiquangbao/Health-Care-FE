"use client";
import FormDetailLogBook from "@/components/ho-so-dang-ky-theo-doi/FormDetailLogBook";
import Navbar from "@/components/navbar";
import { appointmentContext } from "@/context/AppointmentContext";
import { authContext } from "@/context/AuthContext";
import { bookingHomeContext } from "@/context/BookingHomeContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam } from "@/utils/date";
import { formatMoney } from "@/utils/other";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const KhamSucKhoeTaiNha = () => {
  const router = useRouter();
  const { bookingHomeHandler } = useContext(
    bookingHomeContext
  );
  const { authHandler } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const { userData } = useContext(userContext);
  const [appointmentHomes, setAppointmentHomes] = useState(
    []
  );
  const { globalHandler } = useContext(globalContext);
  const { appointmentData, appointmentHandler } =
    useContext(appointmentContext);
  const [doctorRecords, setDoctorRecords] = useState([]);
  const [displayConnect, setDisplayConnect] =
    useState(false);
  useEffect(() => {
    if (userData.user) {
      setLoading(true);
      api({
        type: TypeHTTP.GET,
        path: `/appointmentHomes/findByPatient/${userData.user._id}`,
        sendToken: true,
      }).then((logBooks) => {
        setAppointmentHomes(logBooks.reverse());
        setLoading(false);
      });
      api({
        type: TypeHTTP.GET,
        path: "/doctorRecords/getAll",
        sendToken: false,
      }).then((res) => {
        setDoctorRecords(res);
      });
    }
  }, [userData.user]);
  const handleCancelAppointmentHome = (appointment) => {
    const body = {
      _id: appointment._id,

      status: {
        status_type: "CANCELED",
        message: "Bệnh nhân đã hủy cuộc hẹn",
      },
      note: "",
    };
    globalHandler.notify(
      notifyType.LOADING,
      "Đang thực hiện thao tác"
    );
    api({
      sendToken: true,
      path: "/appointmentHomes/patient-cancel",
      type: TypeHTTP.POST,
      body: body,
    })
      .then((res) => {
        // let record = JSON.parse(JSON.stringify(doctorRecords.filter(item => item._id === appointment.doctor_record_id)[0]))
        // let schedule = record.schedules.filter(item => item.date.day === appointment.appointment_date.day && item.date.month === appointment.appointment_date.month && item.date.year === appointment.appointment_date.year)[0]
        // let time = schedule.times.filter(item => item.time === appointment.appointment_date.time)[0]
        // time.status = ''
        // api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
        //     .then(res1 => {
        setAppointmentHomes((prev) =>
          prev.map((item) => {
            if (item._id === res._id) {
              return res;
            }
            return item;
          })
        );
        globalHandler.notify(
          notifyType.SUCCESS,
          "Đã hủy cuộc hẹn"
        );
        globalHandler.reload();
        // })
      })
      .catch((err) => {
        globalHandler.notify(
          notifyType.WARNING,
          err.message
        );
        globalHandler.reload();
      });
  };

  return (
    <div className="w-full min-h-screen pb-4 flex flex-col pt-[60px] px-[5%]">
      <Navbar />
      <div className="flex flex-col gap-2 items-center mt-6 px-[6rem]">
        <div className="my-2 flex flex-col items-center">
          <h2 className="text-[23px] font-semibold flex items-end gap-3">
            Chào {userData.user?.fullName}
          </h2>
          <span className="font-medium text-[16px]">
            Đăng ký khám sức khỏe tại nhà với các bác sĩ để
            nhận được lời khuyên tốt nhất.
          </span>
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
                  Bác Sĩ
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Trạng Thái
                </th>
                <th scope="col" className="w-[23%] py-3">
                  Thời Gian
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Ghi chú của bạn
                </th>
                <th
                  scope="col"
                  className="w-[17%] py-3 text-center"
                >
                  Các Chức Năng
                </th>
              </tr>
            </thead>
            <tbody className=" w-[full] bg-black font-medium">
              {!loading &&
                appointmentHomes.map(
                  (appointmentHome, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white cursor-pointer odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <td
                        scope="row"
                        className="px-6 py-4 text-center font-medium"
                        onClick={() =>
                          appointmentHandler.showFormDetailAppointmentHome(
                            appointmentHome,
                            displayConnect ===
                              appointmentHome._id
                              ? true
                              : false
                          )
                        }
                      >
                        {index + 1}
                      </td>
                      <td
                        onClick={() =>
                          appointmentHandler.showFormDetailAppointmentHome(
                            appointmentHome,
                            displayConnect ===
                              appointmentHome._id
                              ? true
                              : false
                          )
                        }
                        className="py-4 text-[15px]"
                      >
                        BS.{" "}
                        {
                          doctorRecords.filter(
                            (item) =>
                              item._id ===
                              appointmentHome.doctor_record_id
                          )[0]?.doctor?.fullName
                        }
                      </td>
                      <td
                        onClick={() =>
                          appointmentHandler.showFormDetailAppointmentHome(
                            appointmentHome,
                            displayConnect ===
                              appointmentHome._id
                              ? true
                              : false
                          )
                        }
                        style={{
                          color:
                            appointmentHome.status
                              ?.status_type === "QUEUE"
                              ? "black"
                              : appointmentHome.status
                                ?.status_type ===
                                "ACCEPTED"
                                ? "green"
                                : appointmentHome.status
                                  ?.status_type ===
                                  "COMPLETED"
                                  ? "blue"
                                  : "red",
                        }}
                        className="py-4"
                      >
                        {appointmentHome.status?.message}
                      </td>
                      <td
                        className="py-4"
                        onClick={() =>
                          appointmentHandler.showFormDetailAppointmentHome(
                            appointmentHome,
                            displayConnect ===
                              appointmentHome._id
                              ? true
                              : false
                          )
                        }
                      >
                        {appointmentHome.appointment_date
                          .month !== null &&
                          appointmentHome.appointment_date
                            .month !== 0
                          ? `${convertDateToDayMonthYearVietNam(
                            appointmentHome.appointment_date
                          )}`
                          : "Chưa rõ thời gian"}
                      </td>
                      <td
                        className="py-4"
                        onClick={() =>
                          appointmentHandler.showFormDetailAppointmentHome(
                            appointmentHome,
                            displayConnect ===
                              appointmentHome._id
                              ? true
                              : false
                          )
                        }
                      >
                        {appointmentHome.note}
                      </td>
                      <td className="py-4 flex gap-2 items-center justify-center">
                        {appointmentHome.processAppointment ===
                          1 &&
                          appointmentHome.status
                            ?.status_type ===
                          "ACCEPTED" && (
                            <button
                              onClick={() => {
                                bookingHomeHandler.setBooking(
                                  appointmentHome
                                );
                                router.push(
                                  "/ho-so-dang-ky-tai-nha"
                                );
                              }}
                              className="hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                            >
                              Thanh toán
                            </button>
                          )}
                        {![
                          "CANCELED",
                          "REJECTED",
                          "COMPLETED",
                        ].includes(
                          appointmentHome.status
                            ?.status_type
                        ) &&
                          appointmentHome.processAppointment !==
                          2 && (
                            <button
                              onClick={() =>
                                handleCancelAppointmentHome(
                                  appointmentHome
                                )
                              }
                              className="hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                            >
                              Hủy Cuộc Hẹn
                            </button>
                          )}
                      </td>
                    </tr>
                  )
                )}
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
        </div>
      </div>
    </div>
  );
};

export default KhamSucKhoeTaiNha;
