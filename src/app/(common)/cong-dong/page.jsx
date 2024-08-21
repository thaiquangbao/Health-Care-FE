"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { api, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const CongDong = () => {
  const [qas, setQAs] = useState([]);
  const router = useRouter();
  useEffect(() => {
    api({
      path: "/qas/get-all",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setQAs(res);
    });
  }, []);
  const clickItem = (id) => {
    api({
      path: `/qas/update-view/${id}`,
      sendToken: false,
      type: TypeHTTP.POST,
    }).then((res) => {
      router.push(`/cong-dong-detail/${id}`);
    });
  };
  return (
    <>
      <div className="w-full flex flex-col pb-[2rem]">
        <Navbar />
        <div className="min-h-screen flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
          <span className="font-bold">
            Hỏi đáp miễn phí với Bác sĩ
          </span>
          <div className="flex flex-col gap-4 mt-2 w-[100%]">
            {qas.map((qa, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 cursor-pointer rounded w-[100%] mt-4 border-b"
                  onClick={() => clickItem(qa._id)}
                >
                  <div className="flex flex-col justify-between w-[100%]">
                    <div className="flex flex-row w-[100%]">
                      <span className="text-[15px]">
                        {qa.patient.sex === true
                          ? "Nam"
                          : "Nữ"}
                        , {qa.patient.dateOfBirth}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[20px] font-bold mb-2 text-blue-600">
                        {qa.title}
                      </h3>
                      <div className="text-[18px] text-gray-700">
                        {qa.content}
                      </div>
                    </div>
                    <div className="flex items-center  text-[15px] mt-5">
                      <span className="font-bold bg-blue-200 text-blue-600 rounded px-2 py-1">
                        {qa.category}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 text-[14px] mt-5">
                      <span>
                        <i className="fas fa-clock mr-1"></i>
                        {qa.date.day}/{qa.date.month}/
                        {qa.date.year}
                      </span>
                      <span className="ml-4">
                        <i className="fas fa-eye mr-1"></i>
                        {qa.views} Lượt xem
                      </span>
                      <span className="ml-4">
                        <i className="fas fa-heart mr-1"></i>
                        {qa.like} Lượt thích
                      </span>
                      <span className="ml-4">
                        <i className="fas fa-comment mr-1"></i>
                        {qa.comment} Trả lời
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CongDong;
