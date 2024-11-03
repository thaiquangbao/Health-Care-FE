import { appointmentContext } from "@/context/AppointmentContext";
import { bookingContext } from "@/context/BookingContext";
import { notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { utilsContext } from "@/context/UtilsContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  compare2Date,
  compare2DateTime,
  convertDateInputToObject,
  convertDateToDayMonthYearVietNam,
  generateTimes,
} from "@/utils/date";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const FormReason = ({ visible, hidden, data, setId }) => {
  const { utilsHandler } = useContext(utilsContext);
  const { userData } = useContext(userContext);
  const { appointmentData, appointmentHandler } =
    useContext(appointmentContext);
  const [reason, setReason] = useState("");
  const handleCancel = () => {
    if (reason === "") {
      utilsHandler.notify(
        notifyType.WARNING,
        "Vui lòng nhập lý do hủy cuộc hẹn"
      );
      return;
    }
    const body = {
      _id: data._id,
      status: "CANCELED",
      status_message: "Bác sĩ đã hủy cuộc hẹn",
      note: "",
      reason: reason,
    };
    utilsHandler.notify(
      notifyType.LOADING,
      "Đang thực hiện thao tác"
    );
    api({
      sendToken: true,
      path: "/appointments/doctor-cancel",
      type: TypeHTTP.POST,
      body: body,
    }).then((res) => {
      let record = JSON.parse(
        JSON.stringify(appointmentData.doctorRecord)
      );
      let schedule = record.schedules.filter(
        (item) =>
          item.date.day === data.appointment_date.day &&
          item.date.month === data.appointment_date.month &&
          item.date.year === data.appointment_date.year
      )[0];
      let time = schedule.times.filter(
        (item) => item.time === data.appointment_date.time
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
        setReason("");
        utilsHandler.notify(
          notifyType.SUCCESS,
          "Đã hủy cuộc hẹn"
        );
      });
    });
  };

  return (
    <div
      style={
        visible
          ? {
              height: "250px",
              width: "550px",
              transition: "0.3s",
              backgroundImage: "url(/bg.png)",
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
              Bệnh nhân: {data.patient?.fullName}
            </span>
            <span className="font-space text-[14px]">
              Thời gian hẹn:{" "}
              {`${convertDateToDayMonthYearVietNam(
                data.appointment_date
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
            background:
              "linear-gradient(to right, #11998e, #38ef7d)",
          }}
          className="text-[white] z-[50] shadow-[#767676] absolute bottom-2 text-[15px] shadow-md rounded-xl px-[200px] py-2 transition-all cursor-pointer font-semibold"
        >
          Xác nhận hủy
        </button>
      </div>
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </div>
  );
};

export default FormReason;
