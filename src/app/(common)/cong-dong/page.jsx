"use client";
import FormCreateBaiViet from "@/components/cong-dong/FormCreateBaiViet";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { authContext } from "@/context/AuthContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const CongDong = () => {
  const { authHandler, authData } = useContext(authContext);
  const { userData } = useContext(userContext);
  const [qas, setQAs] = useState([]);
  const [visibleFormCreate, setVisibleFormCreate] =
    useState(false);
  const router = useRouter();
  const [filterQA, setFilterQA] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    api({
      path: "/qas/get-all",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setQAs(res);
      setFilterQA(res)
    });
  }, []);
  const clickItem = (id) => {
    router.push(`/chi-tiet-cau-hoi/${id}`);
  };
  const handleFindQA = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue.trim() === "") {
      const filtered = qas.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
     
      setFilterQA(filtered);
    } else {
      const filtered = qas.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setFilterQA(filtered);
    }
  } // sửa ở đây
  useEffect(() => {
    if (userData.user?.role === "USER") {
      setVisibleFormCreate(true);
    } else {
      setVisibleFormCreate(false);
    }
  }, [userData.user]);
  const handleTurnOnFormCreate = () => {
    if (userData.user) {
      authHandler.showFormCreateBaiViet();
    } else {
      authHandler.showSignIn();
    }
  };

  return (
    <>
      <div className="w-full pt-[60px] flex flex-col pb-[2rem]">
        <Navbar />
        <div className="min-h-screen flex mt-[2rem] flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
          <div className="flex justify-between items-center w-full">
            <span className="font-bold">
              Hỏi đáp miễn phí với Bác sĩ
            </span>
            {visibleFormCreate && (
              <button
                style={{
                  background:
                    "linear-gradient(to right, #11998e, #38ef7d)",
                }}
                onClick={() => handleTurnOnFormCreate()}
                className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676] w-[15%]"
              >
                Đặt câu hỏi
              </button>
            )}
          </div>
          <div className="w-full relative mt-[1rem]">
            <input
              value={searchTerm}
              placeholder="Tìm cuộc thảo luận..."
              className="text-[14px] h-[50px] w-[100%] focus:outline-0 border-[1px] pl-[3rem] pr-[1rem] border-[#dadada] rounded-3xl"
              onChange={handleFindQA}
            />
            <i className="bx bx-search absolute top-[50%] translate-y-[-50%] text-[23px] text-[#999] left-4"></i>
          </div>
          <div className="flex flex-col gap-4 mt-2 w-[100%]">
            {filterQA.map((qa, index) => {
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
                        {qa.like.length} Lượt thích
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
      <FormCreateBaiViet
        visible={authData.visibleFormCreateBaiViet}
        hidden={authHandler.hiddenFormCreateBaiViet}
      />
    </>
  );
};
export default CongDong;
