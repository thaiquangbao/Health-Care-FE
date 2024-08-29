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
import { set } from "date-fns";
import { useParams, useRouter } from "next/navigation";
import React, {
  use,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
const CongDongDetail = () => {
  const { userData } = useContext(userContext);
  const [qa, setQA] = useState({});
  const param = useParams();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const { globalHandler } = useContext(globalContext);
  const { id } = param;
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    setLoading(true);
    api({
      path: `/qas/get-one/${id}`,
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setQA(res);
      setLikes(res.like);
    });
  }, [id, userData]);

  useEffect(() => {
    api({
      path: `/qas/update-view/${id}`,
      sendToken: false,
      type: TypeHTTP.POST,
    });
    api({
      path: `/comments/get-by-qa/${id}`,
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setComments(res);
    });
  }, [id]);

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
  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const imagesArray = filesArray.map((file) => {
        return URL.createObjectURL(file);
      });
      setImages((prevImages) => [
        ...prevImages,
        ...imagesArray,
      ]);
    }
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleRemoveImage = (index) => {
    setImages((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
  };
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("files", file);
    try {
      const res = await api({
        type: TypeHTTP.POST,
        path: "/upload-image/save",
        body: formData,
        sendToken: false,
      });
      return res; // Giả sử API trả về URL của hình ảnh trong thuộc tính `url`
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };
  const handleSendComment = async () => {
    const today = new Date();
    const vietnamTime = new Date(
      today.getTime() + 7 * 60 * 60 * 1000
    );
    const date = {
      day: vietnamTime.getDate(),
      month: vietnamTime.getMonth() + 1,
      year: vietnamTime.getFullYear(),
    };
    const data = {
      author: userData.user._id,
      text: text,
      qa: qa._id,
      date: date,
    };
    if (images && images.length > 0) {
      const uploadedImgUrls = await Promise.all(
        images.map(async (src) => {
          const file = await fetch(src).then((res) =>
            res.blob()
          );
          return await uploadImage(file);
        })
      );
      const flatUploadedImgUrls = uploadedImgUrls.flat();
      data.image = flatUploadedImgUrls;
    }
    api({
      type: TypeHTTP.POST,
      path: `/comments/save`,
      body: data,
      sendToken: true,
    }).then((res) => {
      api({
        type: TypeHTTP.POST,
        path: `/qas/update-comment/${id}`,
        sendToken: false,
      }).then((cm) => {
        globalHandler.notify(
          notifyType.SUCCESS,
          "Đăng tải câu hỏi thành công !!!"
        );
        setText("");
        setComments([...comments, res]);
      });
    });
  };
  const addLike = () => {
    api({
      path: `/qas/update-like`,
      sendToken: false,
      type: TypeHTTP.POST,
      body: { _id: id, patient: userData?.user?._id },
    }).then((res) => {
      setLikes((pre) => [userData.user?._id, ...pre]);
    });
  };
  return (
    <>
      <div className="w-full pt-[60px] flex flex-col pb-[2rem]">
        <Navbar />
        <div className="min-h-screen flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-center">
          <div
            className="flex flex-col items-center gap-4 p-4 rounded w-[70%] mt-4"
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
              <div className="flex items-center text-[15px] mt-5">
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
                <span
                  className="ml-4"
                  style={{
                    cursor:
                      userData?.user &&
                        !likes?.includes(userData?.user?._id)
                        ? "pointer"
                        : "default",
                  }}
                >
                  <i
                    className="fas fa-heart mr-1"
                    style={{
                      color: likes?.includes(
                        userData?.user?._id
                      )
                        ? "red"
                        : "",
                    }}
                    onClick={() => {
                      if (
                        userData?.user &&
                        !likes?.includes(
                          userData?.user?._id
                        )
                      ) {
                        addLike();
                      }
                    }}
                  ></i>
                  {likes?.length} Lượt thích
                </span>
                <span className="ml-4">
                  <i className="fas fa-comment mr-1"></i>
                  {qa.comment} Trả lời
                </span>
              </div>
            </div>
          </div>
          {userData?.user &&
            (userData.user?.role === "DOCTOR" ||
              userData.user?._id === qa.patient?._id) && (
              <div className="w-[70%] py-[0.5rem] mt-[0.5rem] flex items-start gap-1">
                <div
                  style={{
                    backgroundImage: `url(${userData.user?.image})`,
                  }}
                  className="mr-2 w-[45px] h-[45px] bg-cover rounded-full"
                />
                <div className="flex flex-col gap-1 w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleImageChange}
                    className="hidden"
                    style={{ display: "none" }}
                    accept="image/*"
                  />
                  <div className="flex items-end gap-2 w-full">
                    <input
                      className="border-b-[1px] w-full border-[#d6d6d6] text-[14px] focus:outline-0 px-1 py-1"
                      placeholder="Thêm bình luận"
                      onChange={(e) =>
                        setText(e.target.value)
                      }
                      value={text}
                    />
                    <button onClick={handleImageClick}>
                      <i className="bx bx-image-alt text-[#999] text-[25px]"></i>
                    </button>
                    <button
                      onClick={() => handleSendComment()}
                    >
                      <i className="bx bx-send text-[#999] text-[25px]"></i>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Uploaded ${index}`}
                          className="w-[60px] aspect-square rounded-lg"
                        />
                        <button
                          onClick={() =>
                            handleRemoveImage(index)
                          }
                          className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          <div className=" w-[70%] mt-[1rem]">
            {comments.map((comment, index) => (
              <div
                key={index}
                className="flex items-start gap-3 mt-4 mb-8"
              >
                <div
                  style={{
                    backgroundImage: `url(${comment.author?.image})`,
                  }}
                  className="w-[55px] aspect-square bg-cover rounded-full"
                />
                <div className="flex flex-col items-start">
                  <span className="text-[14px] font-semibold">
                    {comment.author?.fullName}
                  </span>
                  {/* Nếu là Bác sĩ thì thêm BS. ở phía trước */}
                  <span className="text-[14px]">
                    {comment.text}
                  </span>
                  <div>
                    {comment.image?.map(
                      (item, imgIndex) => (
                        <img
                          key={imgIndex}
                          src={item}
                          className="h-[100px] rounded-xl mt-1"
                        />
                      )
                    )}
                  </div>
                  <span className="text-[14px] mt-3 text-[13px]">
                    <i className="fas fa-clock mr-1"></i>
                    {comment.date?.day}/
                    {comment.date?.month}/
                    {comment.date?.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default CongDongDetail;
