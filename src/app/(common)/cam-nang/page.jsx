"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const CamNang = () => {
  const [forums, setForums] = useState([]);
  const router = useRouter();
  const { userData } = useContext(userContext);
  const [filterForum, setFilterForum] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    api({
      path: "/forums/get-all",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setForums(res);
      setFilterForum(res)
    });
  }, []);
  const handleFindForum = (e) => { // sửa ở đây
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      const filtered = forums.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
     
      setFilterForum(filtered);
    } else {
      const filtered = forums.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setFilterForum(filtered);
    }
  };
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
  const handleTurnOnFormCreate = () => {
    router.push("/them-cam-nang");
  };
  return (
    <>
      <div className="w-full flex flex-col pt-[60px] pb-[2rem]">
        <Navbar />
        <div className="min-h-screen flex mt-[2rem] flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold mt-[2rem]">
              Cẩm nang sức khỏe
            </span>
            
            {userData.user &&
              userData.user?.role === "DOCTOR" && (
                <button
                  style={{
                    background:
                      "linear-gradient(to right, #11998e, #38ef7d)",
                  }}
                  onClick={handleTurnOnFormCreate}
                  className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676] w-[15%]"
                >
                  Thêm cẩm nang
                </button>
              )}
          </div>
          <div className="w-full relative mt-[1rem]">
            <input
              value={searchTerm}
              placeholder="Tìm cẩm nang..."
              className="text-[14px] h-[50px] w-[100%] focus:outline-0 border-[1px] pl-[3rem] pr-[1rem] border-[#dadada] rounded-3xl"
              onChange={handleFindForum}
            />
            <i className="bx bx-search absolute top-[50%] translate-y-[-50%] text-[23px] text-[#999] left-4"></i>
          </div>
          <div className="flex flex-col gap-4 mt-2 w-[100%]">
            {filterForum.map((forum, index) => {
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
                        {forum.like?.length} Lượt thích
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
