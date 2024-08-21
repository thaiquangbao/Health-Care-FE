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
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const CamNang = () => {
  const [forums, setForums] = useState([]);
  const router = useRouter();

  useEffect(() => {
    api({
      path: "/forums/get-all",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setForums(res);
    });
  }, []);
  const extractFirstParagraphAndImage = (content) => {
    // Lấy đoạn nội dung đầu tiên
    const paragraphMatch = content.match(/<p>(.*?)<\/p>/);
    const firstParagraph = paragraphMatch
      ? paragraphMatch[1]
      : "";

    // Lấy URL của hình ảnh đầu tiên
    const imgMatch = content.match(/<img\s+src="([^"]+)"/);
    const firstImageUrl = imgMatch ? imgMatch[1] : "";

    return { firstParagraph, firstImageUrl };
  };
  const clickItem = (id) => {
    router.push(`/chi-tiet-cam-nang/${id}`);
  };
  return (
    <>
      <div className="w-full flex flex-col pb-[2rem]">
        <Navbar />
        <div className="min-h-screen flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
          <span className="font-bold mt-[2rem]">
            Cẩm nang sức khỏe
          </span>
          <div className="flex flex-col gap-4 mt-2 w-[100%]">
            {forums.map((forum, index) => {
              const { firstParagraph, firstImageUrl } =
                extractFirstParagraphAndImage(
                  forum.content
                );
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 cursor-pointer rounded w-[100%] mt-4 "
                  onClick={() => clickItem(forum._id)}
                >
                  <div
                    className="bg-cover w-[300px] h-[120px] rounded"
                    style={{
                      backgroundImage: `url(${firstImageUrl})`,
                    }}
                  ></div>
                  <div className="flex flex-col justify-between w-[100%]">
                    <div>
                      <h3 className="text-[20px] font-bold mb-2">
                        {forum.title}
                      </h3>
                      <div
                        className="text-[18px] text-gray-700"
                        dangerouslySetInnerHTML={{
                          __html: firstParagraph,
                        }}
                      />
                    </div>
                    <div className="flex items-center text-gray-500 text-[14px]">
                      <span>
                        {forum.date.day}/{forum.date.month}/
                        {forum.date.year}
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
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CamNang;
