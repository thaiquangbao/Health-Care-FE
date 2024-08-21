"use client";
// import { userContext } from "@/context/UserContext";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { useParams, useRouter } from "next/navigation";
import React, {
  use,
  useContext,
  useEffect,
  useState,
} from "react";
const CongDongDetail = () => {
  const { userData } = useContext(userContext);
  const [qa, setQA] = useState({});
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const { id } = param;
  useEffect(() => {
    setLoading(true);
    api({
      path: `/qas/get-one/${id}`,
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setQA(res);
    });
    if (userData.user) {
      console.log(userData);
    }
  }, [id, userData]);

  useEffect(() => {
    api({
      path: `/qas/update-view/${id}`,
      sendToken: false,
      type: TypeHTTP.POST,
    })
  }, [id])

  // Hàm tính tuổi từ ngày sinh
  const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };
  return (
    <>
      <div className="w-full flex flex-col pb-[2rem]">
        <Navbar />
        <div className="min-h-screen flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-center">
          <div
            className="flex items-center gap-4 p-4 rounded w-[70%] mt-4 border-b"
          // onClick={() => clickItem(qa._id)}
          >
            <div className="flex flex-col justify-between w-[100%]">
              <div className="flex flex-row w-[100%]">
                <span className="text-[15px]">
                  {qa.patient?.sex === true ? "Nam" : "Nữ"},{" "}
                  {calculateAge(qa.patient?.dateOfBirth)}{" "}
                  tuổi
                </span>
              </div>
              <div>
                <h3 className="text-[20px] font-bold mb-2 text-blue-600">
                  {qa.title}
                </h3>
                <div className="text-[18px] text-gray-700">
                  {qa.content}
                </div>

                <div className="flex flex-row gap-4 items-start mb-5 mt-4">
                  {qa.image && qa.image.length > 0 ? (
                    qa.image.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image}
                          alt={`Uploaded ${index}`}
                          className="w-[80px] h-[80px] rounded-lg"
                        />
                      </div>
                    ))
                  ) : (
                    <p></p>
                  )}
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
                  {qa.date?.day}/{qa.date?.month}/
                  {qa.date?.year}
                </span>
                <span className="ml-4">
                  <i className="fas fa-eye mr-1"></i>
                  {qa.views} Lượt xem
                </span>
                <span className="ml-4">
                  <i className="fas fa-heart mr-1"></i>
                  {qa.like} Lượt thích
                </span>
                <span
                  className="ml-4"
                  style={{
                    cursor:
                      userData?.user &&
                        (userData.user?.role === "DOCTOR" ||
                          userData.user?._id ===
                          qa.patient?._id)
                        ? "pointer"
                        : "default",
                  }}
                >
                  <i className="fas fa-comment mr-1"></i>
                  {qa.comment} Trả lời
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
export default CongDongDetail;
