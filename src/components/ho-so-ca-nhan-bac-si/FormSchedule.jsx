import { appointmentContext } from "@/context/AppointmentContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { healthContext } from "@/context/HealthContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  compare2Date,
  compareDate1GetterThanDate2,
  convertDateToDayMonthYearObject,
  formatVietnameseDate,
  generateTimes,
} from "@/utils/date";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

const FormSchedule = ({ visible, hidden, day }) => {
  const [currentStep, setCurrentStep] = useState(1);
  let times = generateTimes("08:00", "20:00", 60);
  const [doctorRecord, setDoctorRecord] = useState();
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);
  const { userHandler, userData } = useContext(userContext);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [visibleList, setVisibleList] = useState(false);
  const [logBooks, setLogBooks] = useState([]);
  const [priceList, setPriceList] = useState();

  useEffect(() => {
    if (visible === false) {
      setCurrentIndex(-1);
      setVisibleList(false);
    }
  }, [visible]);

  useEffect(() => {
    api({
      path: "/price-lists/getAll",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setPriceList(
        res.filter(
          (item) => item.type === "Theo Dõi Hàng Tuần"
        )[0]
      );
    });
  }, [appointmentData.sicks]);

  useEffect(() => {
    if (userData.user) {
      api({
        type: TypeHTTP.GET,
        path: `/healthLogBooks/findByDoctor/${userData.user._id}`,
        sendToken: true,
      }).then((logBooks) => {
        setLogBooks(logBooks);
      });
    }
  }, [userData.user]);

  useEffect(() => {
    setDoctorRecord(appointmentData.doctorRecord);
  }, [visible]);

  const checkSchedule = (time) => {
    for (
      let i = 0;
      i < doctorRecord?.schedules.length;
      i++
    ) {
      const scheduleItem = doctorRecord?.schedules[i];
      const date = scheduleItem.date;
      if (
        date.month === day.month &&
        date.year === day.year &&
        date.day === day.day
      ) {
        for (
          let j = 0;
          j < scheduleItem.times.length;
          j++
        ) {
          const timeItem = scheduleItem.times[j];
          if (timeItem.time === time) {
            if (timeItem.status !== "") {
              if (timeItem.status === "home") {
                return 4;
              } else if (timeItem.status === "health") {
                return 3;
              } else {
                return 2;
              }
            } else return 1;
          }
        }
      }
    }
    return 0;
  };

  const handleTime = (time1, booked) => {
    let record = JSON.parse(JSON.stringify(doctorRecord));
    let currentDay = appointmentData.currentDay;
    const schedule = record.schedules.filter(
      (item) =>
        item.date.month === currentDay.month &&
        item.date.day === currentDay.day &&
        item.date.year === currentDay.year
    )[0];
    if (schedule) {
      if (
        schedule.times
          .map((item) => item.time)
          .includes(time1)
      ) {
        // remove
        if (booked === false) {
          schedule.times = schedule.times.filter(
            (item) => item.time !== time1
          );
          setDoctorRecord(record);
        } else {
          userHandler.notify(
            notifyType.WARNING,
            "Bạn không thể hủy giờ hẹn đã được bệnh nhân đặt"
          );
        }
      } else {
        // add
        schedule.times.push({
          time: time1,
          status: "",
          price: 0,
        });
        setDoctorRecord(record);
      }
    } else {
      // add
      setDoctorRecord({
        ...record,
        schedules: [
          ...record.schedules,
          {
            date: currentDay,
            times: [
              {
                time: time1,
                status: "",
                price: 0,
              },
            ],
          },
        ],
      });
    }
  };

  const handleCreateLichTheoDoi = (time, patientId) => {
    let currentDay = appointmentData.currentDay;
    let record = JSON.parse(JSON.stringify(doctorRecord));
    const body = {
      doctor_record_id: appointmentData.doctorRecord._id,
      patient: patientId,
      appointment_date: {
        day: currentDay.day,
        month: currentDay.month,
        year: currentDay.year,
        time,
      },
      status: "ACCEPTED",
      note: "Theo dõi sức khỏe hàng tuần",
      priceList: priceList,
      price_list: priceList._id,
      status_message: "Đã xác nhận",
      sick: "Theo dõi sức khỏe hàng tuần",
    };
    api({
      type: TypeHTTP.POST,
      sendToken: true,
      path: "/appointments/create-appointment-logbook",
      body,
    }).then((res) => {
      let bodyUpdate = {};
      const schedule = record.schedules.filter(
        (item) =>
          item.date.month === currentDay.month &&
          item.date.day === currentDay.day &&
          item.date.year === currentDay.year
      )[0];
      if (schedule) {
        bodyUpdate = {
          ...record,
          schedules: record.schedules.map((item) => {
            if (
              item.date.month === currentDay.month &&
              item.date.day === currentDay.day &&
              item.date.year === currentDay.year
            ) {
              item.times.push({
                time: time,
                status: "health",
                price: 0,
              });
            }
            return item;
          }),
        };
      } else {
        bodyUpdate = {
          ...record,
          schedules: [
            ...record.schedules,
            {
              date: currentDay,
              times: [
                {
                  time: time,
                  status: "health",
                  price: 0,
                },
              ],
            },
          ],
        };
      }
      api({
        type: TypeHTTP.POST,
        path: "/doctorRecords/update",
        body: bodyUpdate,
        sendToken: false,
      }).then((res) => {
        appointmentHandler.setDoctorRecord(res);
        setDoctorRecord(res);
        setVisibleList(false);
        setCurrentIndex(-1);
      });
    });
  };

  const handleUpdate = () => {
    const body = {
      ...doctorRecord,
      doctor: appointmentData.doctorRecord.doctor.id,
    };
    api({
      type: TypeHTTP.POST,
      path: "/doctorRecords/update",
      body,
      sendToken: false,
    }).then((res) => {
      appointmentHandler.setDoctorRecord({
        ...res,
        doctor: appointmentData.doctorRecord.doctor,
      });
      hidden();
    });
  };

  return (
    <div
      style={
        visible
          ? {
            height: "auto",
            width: "60%",
            transition: "0.3s",
          }
          : { height: 0, width: 0, transition: "0.3s" }
      }
      className="z-[45] w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      {visible && (
        <div
          style={{
            transition: "0.5s",
            marginLeft: `-${(currentStep - 1) * 100}%`,
          }}
          className="w-[100%] flex px-8 py-4 flex-col"
        >
          <button onClick={() => hidden()}>
            <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
          </button>
          <span className="text-[17px] font-medium text-[#1c1c1c]">
            {formatVietnameseDate(day)}
          </span>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1">
              <div className="bg-[#eaeded] rounded-md p-3" />
              <span className="font-space text-[15px]">
                Lịch trống
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-[#abebc6] rounded-md p-3" />
              <span className="font-space text-[15px]">
                Lịch khám theo dõi sức khỏe
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-[#ffc1b4] rounded-md p-3" />
              <span className="font-space text-[15px]">
                Lịch khám tại nhà
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-[#fafac7] rounded-md p-3" />
              <span className="font-space text-[15px]">
                Lịch khám trực tuyến
              </span>
            </div>
          </div>
          <span className="text-[15px] mt-4 font-medium">
            Giờ Hẹn
          </span>
          <div className="grid grid-cols-8 gap-2 mt-2">
            {times.map((time, index) => {
              if (
                compare2Date(
                  convertDateToDayMonthYearObject(
                    new Date().toISOString()
                  ),
                  day
                )
              ) {
                if (
                  new Date(
                    new Date().getTime() + 120 * 60000
                  ).getHours() >= Number(time.split(":")[0])
                ) {
                  // return <div key={index} className={`px-4 flex item-center justify-center py-2 transition-all border-[1px] border-[#999] text-[13px] font-medium bg-[#b7b7b7] rounded-md`}>{time}</div>
                } else {
                  return (
                    <div
                      key={index}
                      style={{
                        backgroundColor:
                          checkSchedule(time) === 0
                            ? "white"
                            : checkSchedule(time) === 4
                              ? "#ffc1b4"
                              : checkSchedule(time) === 3
                                ? "#abebc6"
                                : checkSchedule(time) === 1
                                  ? "#eaeded"
                                  : "#fafac7",
                      }}
                      className=" border-[1px] border-[#999] cursor-pointer relative rounded-md flex justify-center"
                    >
                      <button
                        onClick={() => {
                          if (checkSchedule(time) === 1) {
                            handleTime(
                              time,
                              checkSchedule(time) === 2
                                ? true
                                : false
                            );
                          } else {
                            setVisibleList(false);
                            setCurrentIndex(index);
                          }
                        }}
                        key={index}
                        className={`transition-all cursor-pointer w-full h-full py-2 text-[13px] font-medium`}
                      >
                        {time}
                      </button>
                      {(checkSchedule(time) === 0 ||
                        checkSchedule(time) === 1) && (
                          <div
                            style={{
                              width:
                                currentIndex === index
                                  ? "auto"
                                  : 0,
                              height:
                                currentIndex === index
                                  ? visibleList
                                    ? "80px"
                                    : "50px"
                                  : 0,
                              bottom: "42px",
                            }}
                            className="absolute overflow-hidden bottom-[42px] left-0 shadow-xl flex gap-2 bg-[#e9e9e9] items-center justify-center rounded-md"
                          >
                            {visibleList === false ? (
                              <>
                                <button
                                  onClick={() => {
                                    setCurrentIndex(-1);
                                    handleTime(
                                      time,
                                      checkSchedule(time) ===
                                        2
                                        ? true
                                        : false
                                    );
                                  }}
                                  className="px-3 py-1 transition-all hover:scale-[1.05] rounded-md bg-[blue] w-[100px] text-[white] text-[14px]"
                                >
                                  Trực tuyến
                                </button>
                                <button
                                  onClick={() =>
                                    setVisibleList(true)
                                  }
                                  className="px-3 py-1 transition-all w-[100px] hover:scale-[1.05] rounded-md bg-[green] text-[white] text-[14px]"
                                >
                                  Theo Dõi
                                </button>
                              </>
                            ) : (
                              <div className="w-[100%] h-[100%] flex flex-col overflow-auto gap-1">
                                {logBooks.map(
                                  (item, index) => {
                                    if (
                                      item.status
                                        .status_type ===
                                      "ACCEPTED"
                                    ) {
                                      return (
                                        <button
                                          onClick={() =>
                                            handleCreateLichTheoDoi(
                                              time,
                                              item.patient._id
                                            )
                                          }
                                          className="w-full bg-[green] text-[white] text-[14px] py-2 "
                                          key={index}
                                        >
                                          {
                                            item.patient
                                              .fullName
                                          }
                                        </button>
                                      );
                                    }
                                  }
                                )}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  );
                }
              } else {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        checkSchedule(time) === 0
                          ? "white"
                          : checkSchedule(time) === 4
                            ? "#ffc1b4"
                            : checkSchedule(time) === 3
                              ? "#abebc6"
                              : checkSchedule(time) === 1
                                ? "#eaeded"
                                : "#fafac7",
                    }}
                    className=" border-[1px] border-[#999] cursor-pointer relative rounded-md flex justify-center"
                  >
                    <button
                      onClick={() => {
                        if (checkSchedule(time) === 1) {
                          handleTime(
                            time,
                            checkSchedule(time) === 2
                              ? true
                              : false
                          );
                        } else {
                          setVisibleList(false);
                          setCurrentIndex(index);
                        }
                      }}
                      key={index}
                      className={`transition-all cursor-pointer w-full h-full py-2 text-[13px] font-medium`}
                    >
                      {time}
                    </button>
                    {(checkSchedule(time) === 0 ||
                      checkSchedule(time) === 1) && (
                        <div
                          style={{
                            width:
                              currentIndex === index
                                ? "auto"
                                : 0,
                            height:
                              currentIndex === index
                                ? visibleList
                                  ? "80px"
                                  : "50px"
                                : 0,
                            bottom: "42px",
                          }}
                          className="absolute overflow-hidden bottom-[42px] px-2 left-0 shadow-xl flex gap-2 bg-[#e9e9e9] items-center justify-center rounded-md"
                        >
                          {visibleList === false ? (
                            <>
                              <button
                                onClick={() => {
                                  setCurrentIndex(-1);
                                  handleTime(
                                    time,
                                    checkSchedule(time) === 2
                                      ? true
                                      : false
                                  );
                                }}
                                className="px-3 py-1 transition-all hover:scale-[1.05] rounded-md bg-[blue] w-[100px] text-[white] text-[14px]"
                              >
                                Trực tuyến
                              </button>
                              <button
                                onClick={() =>
                                  setVisibleList(true)
                                }
                                className="px-3 py-1 w-[100px] transition-all hover:scale-[1.05] rounded-md bg-[green] text-[white] text-[14px]"
                              >
                                Theo Dõi
                              </button>
                            </>
                          ) : (
                            <div className="w-[150px] h-[100%] py-2 flex flex-col overflow-auto gap-1">
                              {logBooks.map((item, index) => {
                                if (
                                  item.status.status_type ===
                                  "ACCEPTED"
                                ) {
                                  return (
                                    <button
                                      onClick={() =>
                                        handleCreateLichTheoDoi(
                                          time,
                                          item.patient._id
                                        )
                                      }
                                      className="w-full bg-[green] rounded-md text-[white] text-[14px] py-2 "
                                      key={index}
                                    >
                                      {item.patient.fullName}
                                    </button>
                                  );
                                }
                              })}
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                );
              }
            })}
          </div>
          <div className="flex w-full justify-end mt-3">
            <button
              onClick={() => handleUpdate()}
              className="text-[white] bg-[blue] w-[200px] py-2 rounded-md font-medium text-[14px]"
            >
              Cập Nhật
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSchedule;
