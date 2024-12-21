import { appointmentContext } from "@/context/AppointmentContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
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
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
const KhamTaiNha = ({ type, setType, typeStatus }) => {
  const { userData } = useContext(userContext);
  const { appointmentData, appointmentHandler } =
    useContext(appointmentContext);
  const { globalHandler } = useContext(globalContext);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState(
    new Date().getHours() + ":" + new Date().getMinutes()
  );
  const [displayConnect, setDisplayConnect] =
    useState(false);
  const intervalRef = useRef();
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
      setTime(
        new Date().getHours() +
        ":" +
        new Date().getMinutes()
      );
    }, 60000);
  }, []);

  useEffect(() => {
    if (appointmentData.appointmentHomes.length > 0) {
      const theFirstAppointment = sortByAppointmentDate(
        appointmentData.appointmentHomes.filter(
          (item) => item.status === "ACCEPTED"
        )
      ).filter((item) =>
        compareTimeDate1GreaterThanDate2(
          item.appointment_date,
          convertDateToDayMonthYearTimeObject(
            new Date().toISOString()
          )
        )
      )[0];
      if (theFirstAppointment) {
        if (
          compare2Date(
            convertDateToDayMonthYearTimeObject(
              new Date().toISOString()
            ),
            theFirstAppointment.appointment_date
          )
        ) {
          if (
            isALargerWithin10Minutes(
              theFirstAppointment.appointment_date.time,
              time
            ) ||
            isALargerWithin60Minutes(
              time,
              theFirstAppointment.appointment_date.time
            )
          ) {
            setDisplayConnect(theFirstAppointment._id);
          }
        }
      }
    }
  }, [appointmentData.appointmentHomes, time]);

  useEffect(() => {
    if (appointmentData.doctorRecord) {
      if (type === "1") {
        setLoading(true);

        api({
          type: TypeHTTP.GET,
          path: `/appointmentHomes/findByRecord/${appointmentData.doctorRecord?._id}`,
          sendToken: true,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else if (type === "2" || type === "3") {
        let date = new Date();
        date.setDate(date.getDate() + (Number(type) - 1));
        const body = {
          doctor_record_id:
            appointmentData.doctorRecord._id,
          time: {
            ...convertDateToDayMonthYearObject(
              date.toISOString()
            ),
          },
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointmentHomes/findByDate",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else if (type === "4") {
        const body = {
          doctor_record_id:
            appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointmentHomes/findByWeek",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else if (type === "5") {
        const body = {
          doctor_record_id:
            appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointmentHomes/findByMonth",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else if (type === "6") {
        const body = {
          doctor_record_id:
            appointmentData.doctorRecord._id,
        };
        api({
          type: TypeHTTP.POST,
          path: "/appointmentHomes/findByNextMonth",
          body,
          sendToken: false,
        }).then((res) => {
          setLoading(false)
          if (typeStatus === '1') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            appointmentHandler.setAppointmentHomes(res.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      }
    }
  }, [type, appointmentData.doctorRecord, typeStatus]);

  const handleAcceptAppointmentHome = (appointment) => {
    const body = {
      _id: appointment._id,
      status: {
        status_type: "ACCEPTED",
        message: "Bác sĩ đồng ý",
      },
    };
    globalHandler.notify(
      notifyType.LOADING,
      "Đang thực hiện thao tác"
    );
    api({
      sendToken: true,
      path: "/appointmentHomes/doctor-accept",
      type: TypeHTTP.POST,
      body: body,
    }).then((res) => {
      // let record = JSON.parse(
      //     JSON.stringify(appointmentData.doctorRecord)
      // );
      // let schedule = record.schedules.filter(
      //     (item) =>
      //         item.date.day ===
      //         appointment.appointment_date.day &&
      //         item.date.month ===
      //         appointment.appointment_date.month &&
      //         item.date.year ===
      //         appointment.appointment_date.year
      // )[0];
      // let time = schedule.times.filter(
      //     (item) =>
      //         item.time === appointment.appointment_date.time
      // )[0];
      // time.status = "Booked";
      // api({
      //     type: TypeHTTP.POST,
      //     path: "/doctorRecords/update",
      //     sendToken: false,
      //     body: record,
      // }).then((res1) => {
      appointmentHandler.setAppointmentHomes((prev) =>
        prev.map((item) => {
          if (item._id === res._id) {
            return res;
          }
          return item;
        })
      );
      globalHandler.notify(
        notifyType.SUCCESS,
        "Đã chấp nhận cuộc hẹn"
      );
      // });
    });
  };

  const handleCancelAppointmentHomes = (appointment) => {
    const body = {
      _id: appointment._id,
      status: {
        status_type: "CANCELED",
        message: "Bác sĩ đã hủy cuộc hẹn",
      },
      note: "",
    };
    globalHandler.notify(
      notifyType.LOADING,
      "Đang thực hiện thao tác"
    );
    api({
      sendToken: true,
      path: "/appointmentHomes/doctor-cancel",
      type: TypeHTTP.POST,
      body: body,
    }).then((res) => {
      appointmentHandler.setAppointmentHomes((prev) =>
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
    });
  };

  const handleRejectAppointmentHome = (appointment) => {
    const body = {
      _id: appointment._id,
      status: {
        status_type: "REJECTED",
        message: "Bác sĩ đã từ chối",
      },
    };
    globalHandler.notify(
      notifyType.LOADING,
      "Đang thực hiện thao tác"
    );
    api({
      sendToken: true,
      path: "/appointmentHomes/doctor-reject",
      type: TypeHTTP.POST,
      body: body,
    })
      .then((res) => {
        // let record = JSON.parse(
        //     JSON.stringify(appointmentData.doctorRecord)
        // );
        // let schedule = record.schedules.filter(
        //     (item) =>
        //         item.date.day ===
        //         appointment.appointment_date.day &&
        //         item.date.month ===
        //         appointment.appointment_date.month &&
        //         item.date.year ===
        //         appointment.appointment_date.year
        // )[0];
        // let time = schedule.times.filter(
        //     (item) =>
        //         item.time === appointment.appointment_date.time
        // )[0];
        // time.status = "";
        // api({
        //     type: TypeHTTP.POST,
        //     path: "/doctorRecords/update",
        //     sendToken: false,
        //     body: record,
        // }).then((res1) => {
        appointmentHandler.setAppointmentHomes((prev) =>
          prev.map((item) => {
            if (item._id === res._id) {
              return res;
            }
            return item;
          })
        );
        globalHandler.notify(
          notifyType.SUCCESS,
          "Đã từ chối cuộc hẹn"
        );
        // });
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
              {returnNumber(
                appointmentData.appointmentHomes.length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Tất cả cuộc hẹn
          </span>
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
                appointmentData.appointmentHomes.filter(
                  (item) =>
                    item.status.status_type === "ACCEPTED"
                ).length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Cuộc hẹn đã chấp nhận
          </span>
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
                appointmentData.appointmentHomes.filter(
                  (item) =>
                    item.status.status_type === "QUEUE"
                ).length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Cuộc hẹn đang chờ
          </span>
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
                appointmentData.appointmentHomes.filter(
                  (item) =>
                    item.status.status_type === "REJECTED"
                ).length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Cuộc hẹn đã từ chối
          </span>
        </div>
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
              appointmentData.appointmentHomes.map(
                (appointmentHome, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white cursor-pointer odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
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
                      scope="row"
                      className="px-6 py-4 text-center font-medium"
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
                      {appointmentHome.patient?.fullName}
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
                              ?.status_type === "ACCEPTED"
                              ? "green"
                              : appointmentHome?.status
                                .status_type === "COMPLETED"
                                ? "blue"
                                : "red",
                      }}
                      className="py-4"
                    >
                      {appointmentHome.status?.message}
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
                      className="py-4"
                    >
                      {(appointmentHome.status
                        ?.status_type === "ACCEPTED" || appointmentHome.status
                          ?.status_type === "COMPLETED")
                        ? `${convertDateToDayMonthYearVietNam(
                          appointmentHome.appointment_date
                        )}`
                        : "Chưa rõ thời gian"}
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
                      className="py-4"
                    >
                      {appointmentHome.note}
                    </td>
                    <td className="py-4 flex gap-2 items-center justify-center">
                      {appointmentHome.status
                        ?.status_type === "QUEUE" && (
                          <>
                            <button
                              onClick={() =>
                                appointmentHandler.showFormAppointmentHomeCalendar(appointmentHome)
                              }
                              className="hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                            >
                              Chấp Nhận
                            </button>
                            <button
                              onClick={() =>
                                handleRejectAppointmentHome(appointmentHome)
                              }
                              className="hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                            >
                              Từ Chối
                            </button>
                          </>
                        )}
                    </td>
                  </tr>
                )
              )}
          </tbody>
        </table>
        {!loading &&
          appointmentData.appointmentHomes.length === 0 && (
            <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
              Không có cuộc hẹn khám tại nhà trong{" "}
              {typeTime[type]}
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

export default KhamTaiNha;
