'use client'

import Footer from "@/components/footer";
import Logo from "@/components/logo";
import Navbar from "@/components/navbar";
import { api, TypeHTTP } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  const [sicks, setSicks] = useState([])

  useEffect(() => {
    api({ path: '/sicks/get-all', sendToken: false, type: TypeHTTP.GET })
      .then(res => {
        setSicks(res)
      })
  }, [])

  return (
    <>
      <div className="w-full min-h-screen flex flex-col pt-[1%] py-[3%] px-[5%] background-public">
        <Navbar />
        <div className="flex mt-[1.5rem] w-[100%] items-center">
          <div className="w-[50%] flex items-center justify-center">
            <div className="w-[85%] flex flex-col justify-end relative pb-[1.5rem] px-[2rem] text-[white] aspect-square rounded-2xl" style={{ backgroundImage: 'url(/public-1.png)', backgroundSize: 'cover' }}>
              <div className="flex bg-[#ffffffd1] rounded-xl shadow-md text-[#008cff] w-[400px] items-center gap-3 px-4 py-2 text-[15px] font-semibold absolute bottom-[-8px] left-[-20%]">
                <img src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/images/heart-icon.svg" width={'50px'} /> Chăm sóc các bệnh lý tim mạch, tăng huyết áp, ngoại tâm thu, v.v.
              </div>
            </div>
          </div>
          <div className="flex flex-col w-[50%]">
            <div className="flex flex-col">
              <span className="text-[blue] font-medium text-[18px]">HealthHaven</span>
              <span className="text-[32px] font-semibold mt-2">Tham khảo ý kiến sức khỏe về bệnh tim mạch tại HealthHaven.</span>
              <div className="flex gap-4 items-center mt-[1rem]">
                <img src="/green-arrow.png" width={'30px'} />
                <span className="text-[#4b4b4b] text-[16px]">Sẽ giúp cải thiện sức khỏe tim mạch của bạn. Khám bệnh trực tuyến 1:1 với các bác sĩ chuyên gia</span>
              </div>
            </div>
            <div className="flex mt-4 gap-3 font-medium">
              {/* <Link href="http://localhost:3000/zero/833347"> */}
              <button className="flex items-center hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[15px] px-[1rem] justify-center rounded-md gap-2">
                <span>Đặt Lịch Khám Ngay</span>
                <i className='bx bx-right-arrow-alt text-[20px]'></i>
              </button>
              {/* </Link> */}
              <button className="flex items-center text-[15px] px-[1rem] justify-center py-3 rounded-md gap-2">
                <span>Xem Thêm</span>
                <div className="flex items-center border-[1px] border-[black] rounded-full">
                  <i className='bx bx-right-arrow-alt text-[20px]'></i>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-[30px] font-bold text-[#171717] mt-[4rem] w-[100%] items-center">
          <span>Tim mạch là gì?</span>
          <div className="bg-[#35a4ffa1] w-[100px] h-[2px] rounded-lg"></div>
          <span className="text-[16px] text-center font-medium mt-[1.5rem] px-[6rem]">Tim mạch là một nhánh của y học, liên quan đến chẩn đoán và điều trị các rối loạn của tim và hệ thống mạch máu, bao gồm dị tật tim bẩm sinh, bệnh mạch vành, suy tim, bệnh van tim và rối loạn nhịp tim.</span>
        </div>
        <div className="flex flex-col gap-2 text-[30px] font-bold text-[#171717] mt-[4rem] w-[100%] items-center">
          <span>Các bệnh lý tim mạch chúng tôi điều trị</span>
          <div className="bg-[#35a4ffa1] w-[100px] h-[2px] rounded-lg"></div>
          <div className="mt-[1.5rem] grid grid-cols-5 w-[95%] gap-3">
            {sicks.map((sick, index) => (
              <div key={index} className={`flex flex-col items-center gap-3 px-6 justify-center w-full bg-[white] h-[140px] rounded-2xl shadow-xl shadow-[#35a4ff2a]`}>
                <div className="w-[50px] aspect-square flex items-center justify-center rounded-full bg-[white] shadow-xl shadow-[#35a4ff2a]">
                  <img src={sick.image} width={'35px'} />
                </div>
                <span className="text-[16px] text-center">{sick.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
