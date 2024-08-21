"use client";
import { auth } from "@/components/firebase/firebase";
// import { userContext } from "@/context/UserContext";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { api, TypeHTTP } from "@/utils/api";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const CamNangDetail = () => {
  const [forum, setForum] = useState({});
  const param = useParams();
  const { id } = param;
  useEffect(() => {
    api({
      path: `/forums/get-one/${id}`,
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setForum(res);
    });
  }, [id]);
  return (
    <>
      <div className="w-full flex flex-col pb-[2rem] pt-[3rem]">
        <Navbar />

        <div className="min-h-screen flex flex-col z-0 overflow-hidden relative text-[#171717] w-[65%] px-[5%] items-center mx-auto bg-slate-100 rounded-md">
          <h1 className="font-bold text-[36px] leading-tight mt-6">
            {forum.title}
          </h1>
          <div
            className="text-[18px] text-gray-700 forum-content mb-4"
            dangerouslySetInnerHTML={{
              __html: forum.content,
            }}
          />
          <div className="p-2 rounded w-[100%] mt-2 mb-6">
            <div className="flex items-center gap-4">
              <img
                src={forum.author?.image}
                alt="Avatar"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-[20px] font-bold">
                  {forum.author?.fullName}
                </h3>
                <span>Chuyên mục: {forum.category}</span>
              </div>
              <div className="flex items-start text-gray-500 text-[14px] mt-8">
                <span className="ml-4">
                  Ngày đăng: {forum.date?.day}/
                  {forum.date?.month}/{forum.date?.year}
                </span>
                <span className="ml-4">
                  <i className="fas fa-eye mr-1"></i>
                  {forum.views} Lượt xem
                </span>
                <span className="ml-4">
                  <i className="fas fa-heart mr-1"></i>
                  {forum.like} Lượt thích
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CamNangDetail;
