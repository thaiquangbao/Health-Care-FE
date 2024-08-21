"use client";
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
  useRef,
  useState,
} from "react";
const chuyenKhoa = require("@/utils/chuyenKhoa");

const ThemCongDong = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sick, setSick] = useState("");
  const { globalHandler } = useContext(globalContext);
  const router = useRouter();
  const { userData } = useContext(userContext);
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);

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

  const submit = async () => {
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
      patient: userData.user._id,
      title: title,
      content: content,
      category: sick,
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
      path: `/qas/save`,
      body: data,
      sendToken: true,
    }).then((res) => {
      globalHandler.notify(
        notifyType.SUCCESS,
        "Đăng tải câu hỏi thành công !!!"
      );
      router.push("/cong-dong");
    });
  };
  return (
    <div className="flex gap-4 p-4">
      {/* Phần nhập tiêu đề và nội dung */}

      <div className="w-[100%] flex gap-4 justify-center items-center">
        <div className="bg-white p-10 rounded-lg shadow-md h-screen">
          <div className="mb-3">
            <p className="text-2xl font-bold">
              ĐẶT CÂU HỎI VỚI BÁC SĨ
            </p>
          </div>
          <div className="mb-6 flex flex-col">
            <div className="w-[100%] mb-4">
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Tiêu đề..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-[100%] mb-4">
              <select
                id="title"
                name="title"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={title}
                onChange={(e) => setSick(e.target.value)}
              >
                <option value="">Chọn chuyên mục...</option>
                {chuyenKhoa.dsKhoa.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <textarea
                id="content"
                name="content"
                className="border p-2 rounded focus:outline-0"
                rows="4"
                required
                style={{ height: "145px" }}
                placeholder="Nội dung câu hỏi (vd: Mỗi khi sử dụng hóa chất lòng bàn tay tôi bị đỏ và mọc mụn nước. Nhờ bác sĩ tư vấn cho tôi nên sử dụng thuốc gì?)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col gap-4 items-start mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }} // Ẩn thẻ input
              />
              <img
                src="/picker-image.png"
                className="bg-white p-1 rounded-lg shadow-md w-[30%] cursor-pointer"
                onClick={handleImageClick}
              />
            </div>
            <div className="flex flex-row gap-4 items-start mb-5">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Uploaded ${index}`}
                    className="w-[100px] h-[100px] rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-4 items-start ">
              <p className="text-gray-400">
                * Câu trả lời của bạn sẽ được hiển thị công
                khai
              </p>
            </div>
            <div className="flex flex-col gap-4 ">
              <button
                style={{
                  background:
                    "linear-gradient(to right, #11998e, #38ef7d)",
                }}
                onClick={() => submit()}
                className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676]"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ThemCongDong;
