'use client'

import Footer from "@/components/footer";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { appointmentContext } from "@/context/AppointmentContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { removeDiacritics } from "@/utils/other";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter()
  const { appointmentData, appointmentHandler } = useContext(appointmentContext)
  const { userData } = useContext(userContext)

  useEffect(() => {
    api({ path: '/sicks/get-all', sendToken: false, type: TypeHTTP.GET })
      .then(res => {
        appointmentHandler.setSicks(res)
      })
  }, [])

  return (
    <>
      <div className="w-full min-h-screen flex flex-col pt-[60px]">
        <Navbar />
        <div className="flex z-0 overflow-hidden relative text-[30px] pt-[7rem] background-public font-bold text-[#171717] w-[100%] items-center">
          <img
            className="z-[5]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg"
            width={"100%"}
          />
          <img
            className="absolute z-[3]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/images/doctor-profile/dr-profile-banner-dt-4.svg"
          />
          <img
            className="absolute z-[4] right-[-3%] bottom-[10%]"
            width={"50%"}
            src="/family.png"
          />
          <div className="flex flex-col w-[40%] top-[40%] left-[5%] translate-y-[-50%] absolute z-[10] justify-center">
            <div className="flex flex-col">
              <span className="text-[#229bff] font-space text-[18px]">HealthHaven</span>
              <span className="text-[32px] font-bold mt-2">Tham khảo ý kiến sức khỏe về bệnh tim mạch tại HealthHaven.</span>
              <div className="flex gap-4 items-center mt-[1rem]">
                <img src="/green-arrow.png" width={'30px'} />
                <span className="text-[#4b4b4b] text-[16px]">Sẽ giúp cải thiện sức khỏe tim mạch của bạn. Khám bệnh trực tuyến 1:1 với các bác sĩ chuyên gia</span>
              </div>
            </div>
            <div className="flex mt-4 gap-3 font-medium">
              {/* <Link href="http://localhost:3000/zero/833347"> */}
              <button onClick={() => {
                if (userData.user?.role !== 'DOCTOR') {
                  router.push('/bac-si-noi-bat')
                } else {
                  router.push('/phieu-dang-ky')
                }
              }} className="flex items-center cursor-pointer hover:scale-[1.05] transition-all bg-[#1dcbb6] text-[white] text-[15px] px-[1rem] py-[0.5rem] justify-center rounded-2xl gap-2">
                <span>{userData.user?.role !== 'DOCTOR' ? 'Đặt Lịch Khám Ngay' : 'Quản Lý Lịch Khám'}</span>
                <i className='bx bx-right-arrow-alt text-[20px]'></i>
              </button>
              {/* </Link> */}
              {userData.user?.role !== 'DOCTOR' && (
                <button onClick={() => router.push('/cac-dich-vu')} className="flex items-center text-[15px] px-[1rem] justify-center py-3 rounded-md gap-2">
                  <span>Xem Thêm</span>
                  <div className="flex items-center border-[1px] border-[black] rounded-full">
                    <i className='bx bx-right-arrow-alt text-[20px]'></i>
                  </div>
                </button>
              )}
              {/* <div className="flex flex-col justify-end z-10 text-[white] aspect-square rounded-2xl">
                <div className="flex bg-[#ffffffd1] rounded-xl shadow-md text-[#008cff] w-[400px] items-center gap-3 px-4 py-2 text-[15px] font-semibold absolute bottom-[-8px] left-[-20%]">
                  <img src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/images/heart-icon.svg" width={'50px'} /> Chăm sóc các bệnh lý tim mạch, tăng huyết áp, ngoại tâm thu, v.v.
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[30px] font-bold text-[#171717] bg-[white] mt-[2rem] w-[100%] items-center">
          <span>Tim mạch là gì?</span>
          <div className="bg-[#35a4ffa1] w-[100px] h-[2px] rounded-lg"></div>
          <span className="text-[16px] text-center font-medium mt-[1.5rem] w-[50%]">Tim mạch là một nhánh của y học, liên quan đến chẩn đoán và điều trị các rối loạn của tim và hệ thống mạch máu, bao gồm dị tật tim bẩm sinh, bệnh mạch vành, suy tim, bệnh van tim và rối loạn nhịp tim.</span>
        </div>
        <div className="flex px-[5%] flex-col gap-2 text-[30px] font-bold text-[#171717] my-[4rem] w-[100%] items-center">
          <span>Các bệnh lý tim mạch chúng tôi điều trị</span>
          <div className="bg-[#35a4ffa1] w-[100px] h-[2px] rounded-lg"></div>
          <div className="mt-[1.5rem] grid grid-cols-5 w-[95%] gap-3">
            {appointmentData.sicks.map((sick, index) => (
              <Link key={index} href={`/${removeDiacritics(sick.title).toLowerCase().split(' ').join('-')}`}>
                <div key={index} className={`flex cursor-pointer flex-col items-center gap-3 px-6 justify-center w-full bg-[white] h-[140px] rounded-2xl shadow-xl shadow-[#35a4ff2a]`}>
                  <div className="w-[50px] aspect-square flex items-center justify-center rounded-full bg-[white] shadow-xl shadow-[#35a4ff2a]">
                    <img src={sick.image} width={'35px'} />
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
}
