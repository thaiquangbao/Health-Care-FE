import { appointmentContext } from "@/context/AppointmentContext";
import { bookingContext } from "@/context/BookingContext";
import { notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";

import {
  compare2Date,
  compareDate1GetterThanDate2,
  convertDateToDayMonthYearObject,
  convertDateToDayMonthYearVietNam2,
  sortDates,
  sortTimes,
} from "@/utils/date";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";

const FormBooking = ({ visible, hidden, sick, notify }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [display, setDisplay] = useState(0);
  const { appointmentData } = useContext(appointmentContext);
  const { userData } = useContext(userContext);
  const [schedules, setSchedules] = useState([]);
  const { bookingHandler } = useContext(bookingContext);
  const [priceList, setPriceList] = useState(0);
  const [appointmentDate, setAppointmentDate] = useState({
    day: 0,
    month: 0,
    year: 0,
    time: "",
  });
  const timeRef = useRef();
  const today = {
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };

  useEffect(() => {
    if (appointmentData.priceList) {
      setPriceList(appointmentData.priceList);
    }
  }, [appointmentData.priceList]);

  useEffect(() => {
    setSchedules([]);
    if (appointmentData.doctorRecord?.schedules) {
      setSchedules(() => {
        let schedules = JSON.parse(
          JSON.stringify(appointmentData.doctorRecord.schedules)
        ).filter(
          (item) => compareDate1GetterThanDate2(item.date, today) === true
        );
        // là những cuộc hẹn có ngày sau ngày hôm nay trở đi
        schedules = schedules.map((item) => {
          item.times = item.times.filter((item1) => item1.status === "");
          return { ...item, times: item.times };
        });
        return schedules;
      });
    }
  }, [appointmentData?.doctorRecord?.schedules]);

  useEffect(
    () =>
      setAppointmentDate({
        day: 0,
        month: 0,
        year: 0,
        time: "",
      }),
    [display, visible]
  );

  const handleCreateAppointment = () => {
    api({
      type: TypeHTTP.GET,
      path: "/appointments/getAll",
      sendToken: false,
    }).then((res) => {
      if (userData.user) {
        const result = res
          .filter((item) => item.patient._id === userData.user._id)
          .filter(
            (item) =>
              item.appointment_date.day === appointmentDate.day &&
              item.appointment_date.month === appointmentDate.month &&
              item.appointment_date.year === appointmentDate.year &&
              item.appointment_date.time === appointmentDate.time &&
              item.status === "QUEUE" // mới thêm
          )[0];
        if (result) {
          notify(
            notifyType.WARNING,
            "Bạn không thể đăng ký giờ hẹn này, do đã trùng với lịch hẹn khác"
          );
        } else {
          const body = {
            doctor_record_id: appointmentData.doctorRecord._id,
            patient: userData.user ? userData.user._id : null,
            appointment_date: appointmentDate,
            status: "QUEUE",
            note: "",
            status_message: "Đang chờ bác sĩ xác nhận",
            priceList: priceList,
            sick,
          };
          bookingHandler.setBooking(body);
          bookingHandler.setDoctorRecord(appointmentData.doctorRecord);
          hidden();
          router.push("/ho-so-dang-ky");
        }
      } else {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
          patient: userData.user ? userData.user._id : null,
          appointment_date: appointmentDate,
          status: "QUEUE",
          note: "",
          status_message: "Đang chờ bác sĩ xác nhận",
          priceList: priceList,
          sick,
        };
        bookingHandler.setBooking(body);
        bookingHandler.setDoctorRecord(appointmentData.doctorRecord);
        hidden();
        router.push("/ho-so-dang-ky");
      }
    });
  };

  return (
    <div
      style={
        visible
          ? {
              height: "450px",
              width: "40%",
              transition: "0.3s",
              backgroundImage: "url(/bg-form.jpg)",
              backgroundSize: "cover",
              overflow: "hidden",
            }
          : {
              height: 0,
              width: 0,
              transition: "0.3s",
              overflow: "hidden",
            }
      }
      className="z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      {visible && (
        <div
          style={{
            transition: "0.5s",
            marginLeft: `-${(currentStep - 1) * 100}%`,
          }}
          className="w-[100%] flex overflow-auto h-[100%]"
        >
          <div className="min-w-[100%] px-[2.5rem] py-[1.5rem] flex justify-center">
            <div className="w-full h-full px-[0.25rem] flex flex-col gap-1">
              {sortDates(schedules).map((schedule, index) => (
                <div
                  key={index}
                  className="w-full px-[1rem] cursor-pointer flex flex-col shadow-[#35a4ff2a] border-[1px] border-[#0890ff2a] bg-[white] shadow-xl py-2 text-[15px] font-semibold rounded-lg"
                >
                  <span
                    onClick={() =>
                      display === index + 1
                        ? setDisplay(0)
                        : setDisplay(index + 1)
                    }
                    className="text-[16px] "
                  >
                    {convertDateToDayMonthYearVietNam2(schedule.date)}
                  </span>
                  {compare2Date(
                    schedule.date,
                    convertDateToDayMonthYearObject(new Date().toISOString())
                  ) ? (
                    <div
                      style={{
                        height:
                          display === index + 1
                            ? `${
                                40 +
                                (timeRef.current
                                  ? (timeRef.current.offsetHeight + 2) *
                                    schedule.times.filter(
                                      (time) =>
                                        new Date(
                                          new Date().getTime() + 120 * 60000
                                        ).getHours() <
                                        Number(time.time.split(":")[0])
                                    ).length
                                  : 0)
                              }px`
                            : 0,
                        transition: "0.5s",
                      }}
                      className="overflow-hidden flex flex-col gap-1"
                    >
                      <span className="mt-2 font-bold px-[1rem]">
                        Giờ hẹn hiện có
                      </span>
                      {sortTimes(schedule.times)
                        .filter(
                          (time) =>
                            new Date(
                              new Date().getTime() + 120 * 60000
                            ).getHours() < Number(time.time.split(":")[0])
                        )
                        .map((time, indexTime) => {
                          return (
                            <div
                              key={index}
                              style={{
                                backgroundColor:
                                  appointmentDate.time === time.time
                                    ? "#35a4ff2a"
                                    : "white",
                              }}
                              className="rounded-lg"
                            >
                              <button
                                onClick={() =>
                                  setAppointmentDate({
                                    day: schedule.date.day,
                                    month: schedule.date.month,
                                    year: schedule.date.year,
                                    time: time.time,
                                  })
                                }
                                ref={timeRef}
                                key={indexTime}
                                className="hover:bg-[#35a4ff2a] transition-all px-[1rem] rounded-lg py-2 w-full text-start font-semibold text-[14px]"
                              >
                                {time.time}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  ) : (
                    <div
                      style={{
                        height:
                          display === index + 1
                            ? `${
                                40 +
                                (timeRef.current
                                  ? (timeRef.current.offsetHeight + 2) *
                                    schedule.times.length
                                  : 0)
                              }px`
                            : 0,
                        transition: "0.5s",
                      }}
                      className="overflow-hidden flex flex-col gap-1"
                    >
                      <span className="mt-2 font-bold px-[1rem]">
                        Giờ hẹn hiện có
                      </span>
                      {sortTimes(schedule.times).map((time, indexTime) => {
                        return (
                          <div
                            key={index}
                            style={{
                              backgroundColor:
                                appointmentDate.time === time.time
                                  ? "#35a4ff2a"
                                  : "white",
                            }}
                            className="rounded-lg"
                          >
                            <button
                              onClick={() =>
                                setAppointmentDate({
                                  day: schedule.date.day,
                                  month: schedule.date.month,
                                  year: schedule.date.year,
                                  time: time.time,
                                })
                              }
                              ref={timeRef}
                              key={indexTime}
                              className="hover:bg-[#35a4ff2a] transition-all px-[1rem] rounded-lg py-2 w-full text-start font-semibold text-[14px]"
                            >
                              {time.time}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => handleCreateAppointment()}
        style={{
          right: appointmentDate.day === 0 ? "-120%" : "4px",
          background: "linear-gradient(to right, #11998e, #38ef7d)",
        }}
        className="text-[white] z-[50] shadow-[#767676] absolute bottom-2 text-[16px] shadow-md rounded-xl px-6 py-2 transition-all cursor-pointer font-semibold"
      >
        Đặt Khám
      </button>
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </div>
  );
};

export default FormBooking;
