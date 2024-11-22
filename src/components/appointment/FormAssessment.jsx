"use client";
import { appointmentContext } from "@/context/AppointmentContext";
import { authContext } from "@/context/AuthContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { api, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "@/context/UserContext";
const FormAssessment = ({ visible, hidden }) => {
  const { globalHandler } = useContext(globalContext);
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [name, setName] = useState("");
  const { userData } = useContext(userContext);
  const router = useRouter();
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);
  useEffect(() => {
    if (appointmentData.currentAppointment) {
      api({
        type: TypeHTTP.GET,
        path: `/doctorRecords/get-one/${appointmentData.currentAppointment?.doctor_record_id}`,
        sendToken: false,
      }).then((res) => {
        setName(res.doctor.fullName);
      });
    }
  }, [appointmentData.currentAppointment]);
  const handleRating = (rate) => {
    setRating(rate);
  };
  const submit = () => {
    const data = {
      doctor_record_id: appointmentData.currentAppointment?.doctor_record_id,
      assessment_list: {
        star: rating,
        content: comments,
        fullName: appointmentData.currentAppointment?.patient.fullName,
        image: appointmentData.currentAppointment?.patient.image,
        date: {
          day: appointmentData.currentAppointment?.appointment_date?.day,
          month: appointmentData.currentAppointment?.appointment_date?.month,
          year: appointmentData.currentAppointment?.appointment_date?.year,
        },
      },
    };
    api({
      type: TypeHTTP.POST,
      path: `/assessments/save`,
      body: data,
      sendToken: false,
    }).then((res) => {
      globalHandler.notify(
        notifyType.SUCCESS,
        "Đánh giá thành công, Cảm ơn bạn đã đánh giá!!!"
      );
      if (userData.user?.role === "CUSTOMER") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      localStorage.removeItem("appointmentData");
      window.location.href = "/cuoc-hen-cua-ban";
    });
  };

  return (
    <div
      style={{
        height: visible ? "450px" : 0,
        width: visible ? "40%" : 0,
        transition: "0.3s",
        backgroundSize: "cover",
        background:
          "linear-gradient(to bottom, rgb(255, 255, 255), rgba(255, 255, 255, 0.5))",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
      className="z-50 w-[300px] min-h-[100px] bg-[white] overflow-hidden rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
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
              Bạn hãy đánh giá cho bác sĩ {name}
            </h2>
            <div className="flex mb-4 justify-center items-center space-x-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  onClick={() => handleRating(star)}
                  className={`w-12 h-12 cursor-pointer ${
                    star <= rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.957z" />
                </svg>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label htmlFor="comments" className="mb-1">
                  Nội dung đánh giá:
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  className="border p-2 rounded focus:outline-0"
                  rows="4"
                  required
                  style={{ height: "145px" }}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                ></textarea>
              </div>
              <button
                style={{
                  background: "linear-gradient(to right, #11998e, #38ef7d)",
                }}
                onClick={() => submit()}
                className="bg-blue-500 text-white p-2 rounded mt-4 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676]"
              >
                Đánh giá
              </button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </div>
  );
};
export default FormAssessment;
