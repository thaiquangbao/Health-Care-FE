"use client";
import Navbar from "@/components/navbar";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});
const chuyenKhoa = require("@/utils/chuyenKhoa");
const ThemCamNang = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sick, setSick] = useState("");
  const { globalHandler } = useContext(globalContext);
  const router = useRouter();
  const { userData } = useContext(userContext);
  const submit = async (data) => {

    const today = new Date();
    const vietnamTime = new Date(
      today.getTime() + 7 * 60 * 60 * 1000
    );
    const dataDoctor = {
      title: title,
      content: content,
      category: sick,
      author: {
        _id: data.user._id,
        fullName: data.user.fullName,
        image: data.user.image,
      },
      date: {
        day: vietnamTime.getDate(),
        month: vietnamTime.getMonth() + 1,
        year: vietnamTime.getFullYear(),
      },
    };
    api({
      type: TypeHTTP.POST,
      path: "/forums/save",
      body: dataDoctor,
      sendToken: false,
    }).then((res) => {
      globalHandler.notify(
        notifyType.SUCCESS,
        "Đăng tải cẩm nang thành công !!!"
      );
      router.push("/cam-nang");
      // console.log(res);
    });
  };

  const quillModules = {
    toolbar: [
      [{ font: [] }, { size: [] }],
      ["bold", "italic", "underline", "strike"],
      [
        { color: ["red", "black"] },
        { background: ["brown"] },
      ],
      [{ script: "sub" }, { script: "super" }],
      [
        { header: "1" },
        { header: "2" },
        "blockquote",
        "code-block",
      ],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ direction: "rtl" }, { align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };
  const quillFormats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];
  return (
    <div className="w-full min-h-screen pb-4 flex flex-col pt-[60px] px-[5%] background-public">
      <Navbar />
      <div className="flex flex-col gap-4 p-4">
        <div className="text-right">
          <button
            style={{
              background:
                "linear-gradient(to right, #11998e, #38ef7d)",
            }}
            onClick={() => submit(userData)}
            className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676] w-[15%]"
          >
            Đăng cẩm nang
          </button>
        </div>
        <div className="flex flex-row">
          {/* Phần nhập tiêu đề và nội dung */}

          <div className="w-[50%] flex flex-col gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md h-screen">
              <div className="mb-6 flex flex-row">
                <div className="w-[60%] mr-4">
                  <label
                    htmlFor="title"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Tiêu Đề...
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your title here..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="w-[40%]">
                  <label
                    htmlFor="title"
                    className="block text-lg font-medium text-gray-700"
                  >
                    Chuyên mục...
                  </label>
                  <select
                    id="title"
                    name="title"
                    className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={sick}
                    onChange={(e) => setSick(e.target.value)}
                  >
                    <option value="">
                      Chọn chuyên mục...
                    </option>
                    {chuyenKhoa.dsKhoa.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label
                htmlFor="content"
                className="block text-lg font-medium text-gray-700"
              >
                Content
              </label>

              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Enter your content here..."
                style={{ width: "100%", height: "70%" }} // Thay đổi chiều cao theo ý muốn
              />
            </div>
          </div>

          {/* Phần hiển thị nội dung */}
          <div className="w-[40%] flex flex-col gap-4 p-4 border-l h-screen">
            <h2 className="text-lg font-medium text-gray-700">
              Preview
            </h2>
            <div className="overflow-auto h-[100%]">
              <div className="font-bold text-[30px]">
                {title}
              </div>
              <div
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default ThemCamNang;
