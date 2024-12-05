import { appointmentContext } from "@/context/AppointmentContext";
import { bookingContext } from "@/context/BookingContext";
import { bookingHomeContext } from "@/context/BookingHomeContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, baseURL, TypeHTTP } from "@/utils/api";
import {
  convertDateToDayMonthYear,
  convertDateToMinuteHour,
} from "@/utils/date";
import { formatMoney } from "@/utils/other";
import React, { useContext, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io.connect(baseURL);
const ChoosePayment = () => {
  const { bookingHomeData, bookingHomeHandler } =
    useContext(bookingHomeContext);
  const { userData } = useContext(userContext);
  const { globalHandler } = useContext(globalContext);
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);
  const qrUrl = `https://qr.sepay.vn/img?bank=MBBank&acc=0834885704&template=compact&amount=${bookingHomeData.booking?.price_list?.price}&des=MaKH${userData.user?._id}2b`;
  const handleSubmit = () => {
    if (userData.user) {
      const body = {
        _id: bookingHomeData.booking._id,
        processAppointment: 2,
        status: {
          status_type: "ACCEPTED",
          message: "Bệnh nhân đã thanh toán",
        },
      };
      globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác");
      api({
        path: "/appointmentHomes/payment",
        body,
        sendToken: true,
        type: TypeHTTP.POST,
      }).then((res) => {
        const currentDate = new Date();
        const vietnamTimeOffset = 7 * 60; // GMT+7 in minutes
        const localTimeOffset = currentDate.getTimezoneOffset(); // Local timezone offset in minutes
        const vietnamTime = new Date(
          currentDate.getTime() + (vietnamTimeOffset + localTimeOffset) * 60000
        );
        const time = {
          day: vietnamTime.getDate(),
          month: vietnamTime.getMonth() + 1,
          year: vietnamTime.getFullYear(),
          time: `${vietnamTime.getHours()}:${vietnamTime.getMinutes()}`,
        };
        const payment = {
          patient_id: userData.user?._id,
          doctor_id: bookingHomeData.booking?.doctor?._id,
          category: res._id,
          namePayment: "APPOINTMENTHOME",
          date: time,
          status_payment: {
            type: "SUCCESS",
            messages: "Thanh toán thành công",
          },
          status_take_money: {
            type: "WAITING",
            messages: "Chưa rút tiền",
          },
          price: bookingHomeData.booking?.price_list?.price,
          description: `Thanh toán tư vấn sức khỏe tại nhà HealthHaven - MaKH${userData.user?._id}.Lịch hẹn lúc (${res.appointment_date.time}) ngày ${res.appointment_date.day}/${res.appointment_date.month}/${res.appointment_date.year}.`,
        };
        api({
          type: TypeHTTP.POST,
          path: "/payments/save",
          sendToken: false,
          body: payment,
        }).then((pay) => {
          globalHandler.notify(notifyType.SUCCESS, "Thanh Toán Thành Công");
          bookingHomeHandler.setCurrentStep(3);
        });
      });
    }
  };

  useEffect(() => {
    socket.on(`payment-appointment-offline${userData.user?._id}`, (data) => {
      if (data) {
        handleSubmit();
      } else {
        globalHandler.notify(notifyType.WARNING, "Thanh Toán Thất Bại");
      }
    });
    return () => {
      socket.off(`payment-appointment-offline${userData.user?._id}`);
    };
  }, [userData.user?._id]);
  return (
    <>
      <div className="border-[#cfcfcf] overflow-hidden relative w-[60%] gap-2 mt-6 rounded-md border-[1px] flex flex-col items-center">
        <div className="flex gap-3 py-2 mt-1 items-center px-4 w-full text-[13px] font-medium">
          <span className="text-[14px]">Thanh Toán Qua Mã QR</span>
        </div>

        <div className="flex flex-col gap-2 p-3 text-[14px] items-center border-[#cfcfcf] border-[1px]">
          <img className="w-[50%]" src={qrUrl} />
          <div className="flex flex-col items-center">
            <span className="rounded-md text-[12px]">
              Tên chủ TK: THAI ANH THU
            </span>
            <span className="font-medium">Số TK: 0834885704 </span>
            <span className="rounded-md text-[12px]">
              Sử dụng app Momo hoặc app Ngân hàng để thanh toán{" "}
            </span>
          </div>
        </div>
      </div>
      <div className="border-[#cfcfcf] relative py-1 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start">
        <div className="flex gap-3 py-2 items-center px-4 w-full border-[#cfcfcf] border-b-[1px] text-[13px] font-medium">
          <span className="text-[14px]">Giờ Hẹn:</span>
          <span className="px-2 py-1 bg-[blue] text-[white] rounded-md">
            {bookingHomeData.booking?.appointment_date.time}
          </span>
          <span className="px-2 py-1 bg-[#46e199] text-[white] rounded-md">
            {convertDateToDayMonthYear(
              bookingHomeData.booking?.appointment_date
            )}
          </span>
        </div>
        <div className="pt-2 px-4 gap-3 flex items-start pb-6">
          <img
            src={bookingHomeData.booking?.doctor?.image}
            className="rounded-full w-[60px]"
          />
          <div className="flex flex-col items-start gap-1 text-[14px]">
            <span className="font-medium">
              Khám bệnh tại nhà với BS{" "}
              {bookingHomeData.booking?.doctor?.fullName}
            </span>
            <span className="mt-3 px-[0.5rem] py-1 rounded-md text-[13px] bg-[#e0eff6]">
              Chuyên Khoa {bookingHomeData.booking?.doctor?.specialize}
            </span>
            <span className="font-medium mt-1">
              BS {bookingHomeData.booking?.doctor?.fullName}
            </span>
          </div>
          <span className="absolute top-[60px] text-[14px] right-2 font-medium text-[blue]">
            {formatMoney(bookingHomeData.booking?.price_list?.price)} đ
          </span>
        </div>
      </div>
      <div className="border-[#cfcfcf] relative py-3 px-5 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start">
        <div className="flex justify-between w-full text-[14px] font-medium">
          <span className="">Giá dịch vụ</span>
          <span>
            {formatMoney(bookingHomeData.booking?.price_list?.price)} đ
          </span>
        </div>
        <div className="flex justify-between w-full text-[14px] font-medium">
          <span className="text-[15px]">Tổng Thanh Toán</span>
          <span className="text-[red] text-[16px]">
            {formatMoney(bookingHomeData.booking?.price_list?.price)} đ
          </span>
        </div>
      </div>
      {/* <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex flex-col items-end'>
        <button onClick={() => handleSubmit()} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Bước Tiếp Theo</button>
      </div> */}
    </>
  );
};

export default ChoosePayment;
