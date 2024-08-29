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

const FormCreateBaiViet = ({ visible, hidden }) => {
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
            return res;
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
            hidden()
        });
    };
    return (
        <div style={{ width: visible ? '40%' : 0, height: visible ? '80%' : 0, transition: '0.5s' }} className="bg-[white] z-50 rounded-xl overflow-hidden shadow-2xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
            <div className="p-4 flex flex-col gap-2 items-center">
                <span className="text-lg font-bold">
                    ĐẶT CÂU HỎI VỚI BÁC SĨ
                </span>
                <input
                    type="text"
                    id="title"
                    name="title"
                    className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tiêu đề..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select
                    id="title"
                    name="title"
                    className="focus:outline-0 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={sick}
                    onChange={(e) => setSick(e.target.value)}
                >
                    <option value="">Chọn chuyên mục...</option>
                    {chuyenKhoa.dsKhoa.map((item, index) => (
                        <option key={index} value={item}>
                            {item}
                        </option>
                    ))}
                </select>
                <textarea
                    id="content"
                    name="content"
                    className="border p-2 w-[100%] rounded focus:outline-0"
                    rows="4"
                    required
                    style={{ height: "105px" }}
                    placeholder="Nội dung câu hỏi (vd: Mỗi khi sử dụng hóa chất lòng bàn tay tôi bị đỏ và mọc mụn nước. Nhờ bác sĩ tư vấn cho tôi nên sử dụng thuốc gì?)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <div className="w-[100%] flex items-center gap-3">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        style={{ display: "none" }} // Ẩn thẻ input
                    />
                    <img
                        src="/picker-image.png"
                        className="bg-white p-1 rounded-lg shadow-md w-[15%] cursor-pointer"
                        onClick={handleImageClick}
                    />
                    {images.map((image, index) => (
                        <div key={index} className="relative">
                            <img
                                src={image}
                                alt={`Uploaded ${index}`}
                                className="w-[60px] aspect-square rounded-lg"
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
                <span className="text-gray-400 w-full">
                    * Câu trả lời của bạn sẽ được hiển thị công khai
                </span>
                <div className="flex flex-col gap-4 w-full">
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
        </div >
    );
};
export default FormCreateBaiViet;
