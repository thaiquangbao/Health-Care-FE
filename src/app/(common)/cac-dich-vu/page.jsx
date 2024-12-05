"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { appointmentContext } from "@/context/AppointmentContext";
import { api, TypeHTTP } from "@/utils/api";
import { formatMoney, removeDiacritics } from "@/utils/other";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const CacDichVu = () => {
  const { appointmentData, appointmentHandler } =
    useContext(appointmentContext);
  const [priceList, setPriceList] = useState(0);
  const router = useRouter();

  useEffect(() => {
    api({ path: "/sicks/get-all", sendToken: false, type: TypeHTTP.GET }).then(
      (res) => {
        appointmentHandler.setSicks(res);
      }
    );
  }, []);
  useEffect(() => {
    api({
      path: "/price-lists/getAll",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setPriceList(res.filter((item) => item.type === "Online")[0]);
    });
  }, [appointmentData.sicks]);

  return (
    <>
      <div className="w-full min-h-screen pt-[60px] pb-4 flex flex-col background-public">
        <Navbar />
        <div className="flex relative flex-col gap-2 text-[30px] font-bold text-[#171717] w-[100%] items-center">
          <img src="/banner.png" width={"100%"} />
          <div className="flex-col gap-3 text-[white] absolute w-[50%] flex items-start justify-center top-[50%] translate-y-[-50%] left-[5%]">
            <span className="text-[40px]">
              Bạn thấy không khỏe? Hãy để HealthHaven chăm sóc cho bạn!
            </span>
            <span className="text-[18px] font-medium">
              Tìm hiểu thêm về các dịch vụ chăm sóc sức khỏe của chúng tôi, từ
              cảm mạo thông thường đến các bệnh mạn tính - các bác sĩ Jio thân
              thiện sẽ tận tình chăm sóc bạn và gia đình.
            </span>
            <button
              style={{
                background: "linear-gradient(to right, #11998e, #38ef7d)",
              }}
              className="text-[16px] rounded-3xl px-6 py-3"
              onClick={() => router.push("/bac-si-noi-bat")}
            >
              Đặt Khám Ngay
            </button>
          </div>
          {/* <img className='absolute right-6s' src='/logo.png' width={'150px'} /> */}
        </div>
        <div className="flex z-0 relative text-[30px] font-bold text-[#171717] mt-[4rem] w-[100%] items-center">
          <img
            className="opacity-0"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg"
            width={"100%"}
          />
          <img
            className="absolute z-[3]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-person.png"
          />
          <img
            className="absolute z-[2]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-circle-1.svg"
          />
          <img
            className="absolute z-0"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-circle-2.svg"
          />
          <div className="absolute w-[35%] z-[5] flex flex-col gap-1 top-[50%] translate-y-[-50%] left-12">
            <h2 className="text-transparent text-[35px] bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-red-500">
              Khám Tổng Quát Tim Mạch
            </h2>
            <span></span>
            <p className="text-[17px] font-medium text-[#404040]">
              Dù cho bệnh trái gió trở trời, hay nhiễm khuẩn thì các Bác sĩ giàu
              kinh nghiệm của Jio Health luôn sẵn lòng khám bệnh ngay tại phòng
              khám, giúp bạn phục hồi nhanh chóng.
            </p>
            <div className="bg-[white] shadow-xl w-[90%] mt-2 px-3 py-2 rounded-lg flex justify-between">
              <div className="flex flex-col text-[#333333]">
                <span className="text-[15px]">GIÁ TƯ VẤN CHỈ TỪ</span>
                <span className="text-[20px]">
                  {formatMoney(priceList?.price)}đ
                </span>
              </div>
              <Link href={`/kham-tong-quat`}>
                <button
                  style={{
                    background: "linear-gradient(to right, #11998e, #38ef7d)",
                  }}
                  className="text-[16px] rounded-3xl px-6 py-3 z-50 cursor-pointer text-[white]"
                >
                  Đặt Khám Ngay
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex px-[5%] flex-col gap-2 text-[30px] font-bold text-[#171717] mt-[4rem] w-[100%] items-center">
          <span>Các bệnh lý tim mạch chúng tôi điều trị</span>
          <div className="bg-[#35a4ffa1] w-[100px] h-[2px] rounded-lg"></div>
          <div className="mt-[1.5rem] grid grid-cols-5 w-[95%] gap-3">
            {appointmentData.sicks.map((sick, index) => (
              <Link
                key={index}
                href={`/dich-vu/${removeDiacritics(sick.title)
                  .toLowerCase()
                  .split(" ")
                  .join("-")}`}
              >
                <div
                  key={index}
                  className={`flex cursor-pointer flex-col items-center gap-3 px-6 justify-center w-full bg-[white] h-[140px] rounded-2xl shadow-xl shadow-[#35a4ff2a]`}
                >
                  <div className="w-[50px] aspect-square flex items-center justify-center rounded-full bg-[white] shadow-xl shadow-[#35a4ff2a]">
                    <img src={sick.image} width={"35px"} />
                  </div>
                  <span className="text-[16px] text-center">{sick.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CacDichVu;
