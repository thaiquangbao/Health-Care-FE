import { appointmentContext } from "@/context/AppointmentContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  compare2Date,
  compareTimeDate1GreaterThanDate2,
  convertDateToDayMonthYearObject,
  convertDateToDayMonthYearTimeObject,
  convertDateToDayMonthYearVietNam,
  isALargerThanBPlus60Minutes,
  isALargerWithin10Minutes,
  isALargerWithin60Minutes,
  sortByAppointmentDate,
} from "@/utils/date";
import { returnNumber } from "@/utils/other";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import FormReason from "../appointment/FormReason";
const CuocHen = ({ type, setType, typeStatus }) => {
  const { userData } = useContext(userContext);
  const [appointments, setAppointments] = useState([]);
  const { appointmentData, appointmentHandler } =
    useContext(appointmentContext);
  const { globalHandler } = useContext(globalContext);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(
    new Date().getHours() + ":" + new Date().getMinutes()
  );
  const [displayConnect, setDisplayConnect] = useState(false);
  const intervalRef = useRef();
  const [visibleFormReason, setVisibleFormReason] = useState(false);
  const [dataSelected, setDataSelected] = useState();
  const [reason, setReason] = useState("");
  const typeTime = {
    1: "Tất cả",
    2: "Hôm Nay",
    3: "Ngày Mai",
    4: "Tuần Này",
    5: "Tháng Này",
    6: "Tháng Sau",
  };
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTime(new Date().getHours() + ":" + new Date().getMinutes());
    }, 60000);
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      sortByAppointmentDate(appointments.filter((item) => item.status === "ACCEPTED")).forEach((item) => {
        if (compare2Date(convertDateToDayMonthYearTimeObject(new Date().toISOString()), item.appointment_date)) {
          if (isALargerWithin10Minutes(item.appointment_date.time, time) || isALargerWithin60Minutes(time, item.appointment_date.time)) {
            setDisplayConnect(item._id);
          }
        }
      })
    }
  }, [appointments, time]);

  useEffect(() => {
    if (appointmentData.doctorRecord) {
      if (type === "1") {
        setLoading(true);
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointments/findByRecords",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            setAppointments(res.filter(item => item.status === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setAppointments(res.filter(item => item.status === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setAppointments(res.filter(item => item.status === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setAppointments(res.filter(item => item.status === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setAppointments(res.filter(item => item.status === 'CANCELED').reverse())
          }
        });
      } else if (type === "2" || type === "3") {
        let date = new Date();
        date.setDate(date.getDate() + (Number(type) - 1));
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
          time: {
            ...convertDateToDayMonthYearObject(date.toISOString()),
          },
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointments/findByDate",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            setAppointments(res.filter(item => item.status === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setAppointments(res.filter(item => item.status === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setAppointments(res.filter(item => item.status === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setAppointments(res.filter(item => item.status === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setAppointments(res.filter(item => item.status === 'CANCELED').reverse())
          }
        });
      } else if (type === "4") {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointments/findByWeek",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            setAppointments(res.filter(item => item.status === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setAppointments(res.filter(item => item.status === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setAppointments(res.filter(item => item.status === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setAppointments(res.filter(item => item.status === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setAppointments(res.filter(item => item.status === 'CANCELED').reverse())
          }
        });
      } else if (type === "5") {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointments/findByMonth",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            setAppointments(res.filter(item => item.status === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setAppointments(res.filter(item => item.status === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setAppointments(res.filter(item => item.status === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setAppointments(res.filter(item => item.status === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setAppointments(res.filter(item => item.status === 'CANCELED').reverse())
          }
        });
      } else if (type === "6") {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointments/findByNextMonth",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            setAppointments(res.filter(item => item.status === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setAppointments(res.filter(item => item.status === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setAppointments(res.filter(item => item.status === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setAppointments(res.filter(item => item.status === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setAppointments(res.filter(item => item.status === 'CANCELED').reverse())
          }
        });
      }
    }
  }, [type, appointmentData.doctorRecord, typeStatus]);


  const handleAcceptAppointment = (appointment) => {
    const body = {
      _id: appointment._id,
      status: "ACCEPTED",
      status_message: "Đã chấp nhận",
    };
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác");
    api({
      sendToken: true,
      path: "/appointments/doctor-accept",
      type: TypeHTTP.POST,
      body: body,
    })
      .then((res) => {
        let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord));
        let schedule = record.schedules.filter(
          (item) =>
            item.date.day === appointment.appointment_date.day &&
            item.date.month === appointment.appointment_date.month &&
            item.date.year === appointment.appointment_date.year
        )[0];
        let time = schedule.times.filter(
          (item) => item.time === appointment.appointment_date.time
        )[0];
        time.status = "Booked";
        api({
          type: TypeHTTP.POST,
          path: "/doctorRecords/update",
          sendToken: false,
          body: record,
        }).then((res1) => {
          setAppointments((prev) =>
            prev.map((item) => {
              if (item._id === res._id) {
                return res;
              }
              return item;
            })
          );
          globalHandler.notify(notifyType.SUCCESS, "Đã chấp nhận cuộc hẹn");
        });
      })
      .catch((err) => {
        globalHandler.notify(notifyType.WARNING, err.message);
        globalHandler.reload();
      });
  };

  const handleCancelAppointment = (appointment) => {
    setVisibleFormReason(true);
    setDataSelected(appointment);
  };

  const handleRejectAppointment = (appointment) => {
    const body = {
      _id: appointment._id,
      status: "REJECTED",
      status_message: "Đã từ chối",
    };
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác");
    api({
      sendToken: true,
      path: "/appointments/doctor-reject",
      type: TypeHTTP.POST,
      body: body,
    })
      .then((res) => {
        let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord));
        let schedule = record.schedules.filter(
          (item) =>
            item.date.day === appointment.appointment_date.day &&
            item.date.month === appointment.appointment_date.month &&
            item.date.year === appointment.appointment_date.year
        )[0];
        let time = schedule.times.filter(
          (item) => item.time === appointment.appointment_date.time
        )[0];
        time.status = "";
        api({
          type: TypeHTTP.POST,
          path: "/doctorRecords/update",
          sendToken: false,
          body: record,
        }).then((res1) => {
          setAppointments((prev) =>
            prev.map((item) => {
              if (item._id === res._id) {
                return res;
              }
              return item;
            })
          );
          globalHandler.notify(notifyType.SUCCESS, "Đã từ chối cuộc hẹn");
        });
      })
      .catch((err) => {
        globalHandler.notify(notifyType.WARNING, err.message);
        globalHandler.reload();
      });
  };
  const handleCancel = () => {
    if (reason === "") {
      globalHandler.notify(
        notifyType.WARNING,
        "Vui lòng nhập lý do hủy cuộc hẹn"
      );
      return;
    }
    const body = {
      _id: dataSelected._id,
      status: "CANCELED",
      status_message: "Bác sĩ đã hủy cuộc hẹn",
      note: "",
      reason: reason,
    };
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác");
    api({
      sendToken: true,
      path: "/appointments/doctor-cancel",
      type: TypeHTTP.POST,
      body: body,
    })
      .then((res) => {
        let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord));
        let schedule = record.schedules.filter(
          (item) =>
            item.date.day === dataSelected.appointment_date.day &&
            item.date.month === dataSelected.appointment_date.month &&
            item.date.year === dataSelected.appointment_date.year
        )[0];
        let time = schedule.times.filter(
          (item) => item.time === dataSelected.appointment_date.time
        )[0];
        time.status = "";
        api({
          type: TypeHTTP.POST,
          path: "/doctorRecords/update",
          sendToken: false,
          body: record,
        }).then((res1) => {
          setAppointments((prev) =>
            prev.map((item) => {
              if (item._id === res._id) {
                // res._id ???
                return res;
              }
              return item;
            })
          );
          setReason("");

          globalHandler.notify(notifyType.SUCCESS, "Đã hủy cuộc hẹn");
          setVisibleFormReason(false);
        });
      })
      .catch((err) => {
        globalHandler.notify(notifyType.WARNING, err.message);
        globalHandler.reload();
      });
  };
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mt-2">
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/EndlessRiver.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-calendar-check"></i>
            <span className="text-[25px] font-semibold">
              {returnNumber(appointments.length)}
            </span>
          </div>
          <span className="font-medium text-[15px]">Tất cả cuộc hẹn</span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Flare.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-calendar-check"></i>
            <span className="text-[25px] font-semibold">
              {returnNumber(
                appointments.filter((item) => item.status === "ACCEPTED").length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">Cuộc hẹn đã chấp nhận</span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Quepal.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[30px] translate-y-[-5px] fa-regular fa-hourglass"></i>
            <span className="text-[25px] font-semibold">
              {returnNumber(
                appointments.filter((item) => item.status === "QUEUE").length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">Cuộc hẹn đang chờ</span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/SinCityRed.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-error"></i>
            <span className="text-[25px] font-semibold">
              {returnNumber(
                appointments.filter((item) => item.status === "REJECTED").length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">Cuộc hẹn đã từ chối</span>
        </div>
      </div>

      <div className="w-full max-h-[500px] mt-4 overflow-y-auto relative">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-[5%] py-3 text-center">
                #
              </th>
              <th scope="col" className="w-[15%] py-3">
                Bệnh Nhân
              </th>
              <th scope="col" className="w-[20%] py-3">
                Trạng Thái
              </th>
              <th scope="col" className="w-[23%] py-3">
                Thời Gian Cuộc Hẹn
              </th>
              <th scope="col" className="w-[20%] py-3">
                Ghi Chú
              </th>
              <th scope="col" className="w-[17%] py-3 text-center">
                Các Chức Năng
              </th>
            </tr>
          </thead>
          <tbody className=" w-[full] bg-black font-medium">
            {!loading &&
              appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    onClick={() =>
                      appointmentHandler.showFormDetailAppointment(
                        appointment,
                        displayConnect === appointment._id ? true : false
                      )
                    }
                    scope="row"
                    className="px-6 py-4 text-center font-medium"
                  >
                    {index + 1}
                  </td>
                  <td
                    onClick={() =>
                      appointmentHandler.showFormDetailAppointment(
                        appointment,
                        displayConnect === appointment._id ? true : false
                      )
                    }
                    className="py-4 text-[15px]"
                  >
                    {appointment.patient.fullName}
                  </td>
                  <td
                    onClick={() =>
                      appointmentHandler.showFormDetailAppointment(
                        appointment,
                        displayConnect === appointment._id ? true : false
                      )
                    }
                    style={{
                      color:
                        appointment.status === "QUEUE"
                          ? "black"
                          : appointment.status === "ACCEPTED"
                            ? "green"
                            : appointment?.status === "COMPLETED"
                              ? "blue"
                              : "red",
                    }}
                    className="py-4"
                  >
                    {appointment.status_message}
                  </td>
                  <td
                    onClick={() =>
                      appointmentHandler.showFormDetailAppointment(
                        appointment,
                        displayConnect === appointment._id ? true : false
                      )
                    }
                    className="py-4"
                  >
                    {`${convertDateToDayMonthYearVietNam(
                      appointment.appointment_date
                    )}`}
                  </td>
                  <td
                    onClick={() =>
                      appointmentHandler.showFormDetailAppointment(
                        appointment,
                        displayConnect === appointment._id ? true : false
                      )
                    }
                    className="py-4"
                  >
                    {appointment.note}
                  </td>
                  <td className="py-4 flex gap-2 items-center justify-center">
                    {appointment.status === "QUEUE" ? (
                      <>
                        <button
                          onClick={() => handleAcceptAppointment(appointment)}
                          className="hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                        >
                          Chấp Nhận
                        </button>
                        <button
                          onClick={() => handleRejectAppointment(appointment)}
                          className="hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                        >
                          Từ Chối
                        </button>
                      </>
                    ) : (
                      <>
                        {displayConnect !== appointment._id && (
                          appointment.status === "ACCEPTED" && (
                            <button
                              onClick={() => handleCancelAppointment(appointment)}
                              className="hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                            >
                              Hủy
                            </button>
                          )
                        )}
                      </>
                    )}
                    {displayConnect === appointment._id && (
                      <Link
                        href={`https://health-haven-iuh.vercel.app/zero/${appointment._id}/${userData.user?.role === "USER" ? "patient" : "doctor"
                          }`}
                      >
                        <button className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[13px] font-medium px-2 rounded-md py-1">
                          Tham Gia Cuộc Hẹn
                        </button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {visibleFormReason && (
          <div
            style={{
              height: "250px",
              width: "550px",
              transition: "0.3s",
              backgroundImage: "url(/bg.png)",
              backgroundSize: "cover",
              overflow: "hidden",
            }}
            className="z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          >
            <div
              style={{
                transition: "0.5s",
                // marginLeft: `-${(currentStep - 1) * 100}%`,
              }}
              className="w-[100%] flex"
            >
              <div className="min-w-[100%] flex flex-col gap-4 px-4 pt-9">
                <span className="font-space font-bold text-[20px]">
                  Lý do hủy cuộc hẹn
                </span>
                <div className="flex flex-row justify-between">
                  <span className="font-space text-[14px]">
                    Bệnh nhân: {dataSelected.patient?.fullName}
                  </span>
                  <span className="font-space text-[14px]">
                    Thời gian hẹn:{" "}
                    {`${convertDateToDayMonthYearVietNam(
                      dataSelected.appointment_date
                    )}`}
                  </span>
                </div>

                <div className="flex items-center justify-evenly">
                  <input
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Lý do..."
                    className="text-[13px] mt-1 w-[100%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                onClick={() => handleCancel()}
                style={{
                  background: "linear-gradient(to right, #11998e, #38ef7d)",
                }}
                className="text-[white] z-[50] shadow-[#767676] absolute bottom-2 text-[15px] shadow-md rounded-xl px-[200px] py-2 transition-all cursor-pointer font-semibold"
              >
                Xác nhận hủy
              </button>
            </div>
            <button onClick={() => setVisibleFormReason(false)}>
              <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
            </button>
          </div>
        )}
        {!loading && appointments.length === 0 && (
          <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
            Không có cuộc hẹn khám trong {typeTime[type]}
          </div>
        )}
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
    </>
  );
};

export default CuocHen;
