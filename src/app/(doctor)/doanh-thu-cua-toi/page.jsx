"use client";
import DanhSachDanhGia from "@/components/danh-gia-cua-benh-nhan/DanhSachDanhGia";
import HenKham from "@/components/doanh-thu/HenKham";
import HenKhamTaiNha from "@/components/doanh-thu/HenKhamTaiNha";
import TheoDoiSucKhoe from "@/components/doanh-thu/TheoDoiSucKhoe";
import Navbar from "@/components/navbar";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { utilsContext } from "@/context/UtilsContext";
import { api, TypeHTTP } from "@/utils/api";
import { formatMoney } from "@/utils/other";
import { useContext, useEffect, useState } from "react";
const DoanhThuCuaToi = () => {
  const { userData } = useContext(userContext);
  const [ticketType, setTicketType] = useState("1");
  const [visibleForm, setVisibleForm] = useState(false);
  const [payBacks, setPayBacks] = useState([]);
  const [sumAvailable, setSumAvailable] = useState(0);
  const [sumRequest, setSumRequest] = useState(0);
  const [sumAccept, setSumAccept] = useState(0);
  const [sumComplete, setSumComplete] = useState(0);
  const { globalHandler } = useContext(globalContext);
  const { utilsHandler } = useContext(utilsContext);
  useEffect(() => {
    if (userData.user) {
      api({
        path: "/payBacks/get-by-doctor",
        type: TypeHTTP.POST,
        body: { doctor_id: userData.user?._id },
        sendToken: true,
      }).then((res) => {
        setPayBacks(res);
        const resultAvailable = (items) => {
          let result = 0;
          items
            .filter(
              (item) =>
                item.status?.type === "AVAILABLE" ||
                item.status?.type === "REFUSE"
            )
            .forEach((item) => {
              result += item.price;
            });
          return result;
        };
        const resultRequest = (items) => {
          let result = 0;
          items
            .filter((item) => item.status?.type === "REQUEST")
            .forEach((item) => {
              result += item.price;
            });
          return result;
        };
        const resultAccept = (items) => {
          let result = 0;
          items
            .filter((item) => item.status?.type === "ACCEPT")
            .forEach((item) => {
              result += item.price;
            });
          return result;
        };
        const resultComplete = (items) => {
          let result = 0;
          items
            .filter((item) => item.status?.type === "COMPLETE")
            .forEach((item) => {
              result += item.price;
            });
          return result;
        };
        setSumAvailable(resultAvailable(res));
        setSumRequest(resultRequest(res));
        setSumAccept(resultAccept(res));
        setSumComplete(resultComplete(res));
      });
    }
  }, [userData.user]);

  const handleReceive = () => {
    if (
      userData.user?.bank?.accountNumber === "" ||
      userData.user?.bank?.bankName === "" ||
      userData.user?.bank?.accountName === ""
    ) {
      utilsHandler.notify(
        notifyType.WARNING,
        "Bác sĩ chưa cập nhật thông tin ngân hàng!!!"
      );
      return;
    }
    if (sumAvailable === 0) {
      utilsHandler.notify(
        notifyType.WARNING,
        "Bác sĩ không có doanh thu để nhận!!!"
      );
      return;
    }
    utilsHandler.notify(notifyType.LOADING, "Đang xử lý yêu cầu");
    api({
      type: TypeHTTP.POST,
      path: "/payBacks/request-status",
      body: {
        doctor_id: userData.user?._id,
        status: {
          type: "REQUEST",
          messages: "Đã gửi yêu cầu",
        },
        priceValid: sumAvailable,
        descriptionTake: "Đang chờ xác nhận",
      },
      sendToken: true,
    }).then((res) => {
      setSumAvailable(0);
      setSumRequest((prevSumRequest) => prevSumRequest + sumAvailable);
      utilsHandler.notify(
        notifyType.SUCCESS,
        "Đã gửi yêu cầu nhận tiền thành công!!!"
      );
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col pt-[60px] px-[5%] background-public">
      <Navbar />
      <div className="w-full mt-4 flex flex-col gap-1 px-16 text-[#2a2a2a]">
        <div className="my-2 flex justify-between items-end">
          <div className="">
            <h2 className="text-[23px] font-semibold flex items-end gap-3">
              Chào Mừng Bác Sĩ{" "}
              {
                userData.user?.fullName.split(" ")[
                userData.user?.fullName.split(" ").length - 1
                ]
              }{" "}
              <img src="/hand.png" width={"30px"} />
            </h2>
            <span className="font-medium text-[16px]">
              Doanh Thu Của Bác Sĩ
            </span>
          </div>
          <div className="flex gap-3">
            <div
              className="px-5 h-[50px] justify-center flex items-center gap-2 shadow-lg text-center focus:outline-0 rounded-md font-medium "
              style={{
                backgroundImage: "url(/bg.png)",
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
              }}
            >
              <div className="flex flex-row">
                <i className="text-[25px] bx bx-dollar-circle"></i>
                <span className="font-semibold text-[18px]">
                  {sumAvailable === 0 ? 0 : formatMoney(sumAvailable)} đ
                </span>
              </div>
              <div
                className="px-2 bg-[#1dcbb6] text-[white] py-1 text-[14px] shadow-lg text-center focus:outline-0 rounded-md font-semibold cursor-pointer transition-transform transform hover:scale-105"
                onClick={() => handleReceive()}
              >
                <span>Nhận</span>
              </div>
            </div>
            <select
              onChange={(e) => setTicketType(e.target.value)}
              className="px-2 py-2 text-[15px] shadow-lg text-center focus:outline-0 rounded-md font-medium"
            >
              <option value={1}>Doanh Thu Đăng Ký Hẹn Khám</option>
              <option value={2}>Doanh Thu Theo Dõi Sức Khỏe</option>
              <option value={3}>Doanh Thu Hẹn Khám Tại Nhà</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
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
                {sumAvailable === 0 ? 0 : formatMoney(sumAvailable)} đ
              </span>
            </div>
            <span className="font-medium text-[15px]">Có thể nhận</span>
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
                {sumRequest === 0 ? 0 : formatMoney(sumRequest)} đ
              </span>
            </div>
            <span className="font-medium text-[15px]">Đang chờ nhận</span>
          </div>
          <div
            className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
            style={{
              backgroundImage: "url(/SinCityRed.jpg)",
              backgroundSize: "cover",
            }}
          >
            <div className="flex items-end gap-2">
              <i className="text-[40px] bx bx-line-chart"></i>
              <span className="text-[25px] font-semibold">
                {sumAccept === 0 ? 0 : formatMoney(sumAccept)} đ
              </span>
            </div>
            <span className="font-medium text-[15px]">Đã Duyệt</span>
          </div>
          <div
            className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
            style={{
              backgroundImage: "url(/Flare.jpg)",
              backgroundSize: "cover",
            }}
          >
            <div className="flex items-end gap-2">
              <i className="text-[40px] bx bx-dollar-circle"></i>
              <span className="text-[25px] font-semibold">
                {sumComplete === 0 ? 0 : formatMoney(sumComplete)} đ
              </span>
            </div>
            <span className="font-medium text-[15px]">Đã nhận</span>
          </div>
        </div>

        {ticketType === "1" ? (
          <HenKham />
        ) : ticketType === "2" ? (
          <TheoDoiSucKhoe />
        ) : (
          <HenKhamTaiNha />
        )}
      </div>
    </div>
  );
};
export default DoanhThuCuaToi;
