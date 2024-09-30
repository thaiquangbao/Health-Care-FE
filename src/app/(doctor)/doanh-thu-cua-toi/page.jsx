"use client";
import HenKham from "@/components/doanh-thu/HenKham";
import TheoDoiSucKhoe from "@/components/doanh-thu/TheoDoiSucKhoe";
import Navbar from "@/components/navbar";
import { userContext } from "@/context/UserContext";
import { useContext, useState } from "react";
const DoanhThuCuaToi = () => {
  const { userData } = useContext(userContext);
  const [type, setType] = useState("1");
  const [ticketType, setTicketType] = useState("1");
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
                  userData.user?.fullName.split(" ")
                    .length - 1
                ]
              }{" "}
              <img src="/hand.png" width={"30px"} />
            </h2>
            <span className="font-medium text-[16px]">
              Doanh Thu Của Bác Sĩ
            </span>
          </div>
          <div className="flex gap-3">
            <select
              onChange={(e) =>
                setTicketType(e.target.value)
              }
              className="px-2 py-2 text-[15px] shadow-lg text-center focus:outline-0 rounded-md font-medium"
            >
              <option value={1}>
                Doanh Thu Đăng Ký Hẹn Khám
              </option>
              <option value={2}>
                Doanh Thu Theo Dõi Sức Khỏe
              </option>
            </select>
            <select
              onChange={(e) => setType(e.target.value)}
              className="px-4 py-2 text-[15px] shadow-lg focus:outline-0 rounded-md font-medium"
            >
              <option value={1}>Tất cả</option>
              <option value={2}>Tuần này</option>
              <option value={3}>Tháng Này</option>
            </select>
          </div>
        </div>
        {ticketType === "1" ? (
          <HenKham type={type} setType={setType} />
        ) : (
          <TheoDoiSucKhoe type={type} setType={setType} />
        )}
      </div>
    </div>
  );
};
export default DoanhThuCuaToi;
