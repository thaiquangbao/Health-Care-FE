import { authContext } from "@/context/AuthContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { auth } from "../firebase/firebase";
const FormAssessment = () => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };
  return (
    <div
      style={{
        height: "450px",
        width: "40%",
        transition: "0.3s",
        backgroundImage: "url(/bg-form.jpg)",
        backgroundSize: "cover",
      }}
      className="z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div
        style={{
          transition: "0.5s",
        }}
        className="w-[100%] flex overflow-auto h-[100%]"
      >
        <div className="min-w-[100%] px-[2.5rem] py-[1.5rem] flex justify-center">
          <div className="w-full h-full px-[0.25rem] flex flex-col gap-1">
            <h2 className="text-xl font-bold mb-4">
              Bạn hãy đánh giá cho bác sĩ
            </h2>
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`w-8 h-8 cursor-pointer ${
                    star <= rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="comments" className="mb-1">
                  Nội dung đánh giá:
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  className="border p-2 rounded"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                style={{
                  background:
                    "linear-gradient(to right, #11998e, #38ef7d)",
                }}
                className="text-[white] z-[50] shadow-[#767676] absolute bottom-2 text-[16px] shadow-md rounded-xl px-6 py-2 transition-all cursor-pointer font-semibold"
              >
                Đánh giá
              </button>
            </form>
          </div>
        </div>
      </div>

      <button>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </div>
  );
};
export default FormAssessment;
