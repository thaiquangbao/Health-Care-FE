"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { appointmentContext } from "@/context/AppointmentContext";
import { bookingContext } from "@/context/BookingContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  compare2Date,
  compareDates,
  convertDateToDayMonthYear,
  convertDateToDayMonthYearObject,
  convertObjectToDate,
} from "@/utils/date";
import {
  formatMoney,
  formatTime,
  formatTimeAndFind,
} from "@/utils/other";
import { Select, SelectItem } from "@nextui-org/select";
import { useParams, useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import Calendar from "../../../../components/Calendar";

const HoSoBacSi = () => {
  const param = useParams();
  const { id } = param;
  const [doctorRecord, setDoctorRecord] = useState();
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);
  const [priceList, setPriceList] = useState(0);
  const [assessments, setAssessments] = useState([]);
  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      path: `/doctorRecords/getById/${id}`,
      sendToken: false,
    }).then((res) => {
      appointmentHandler.setDoctorRecord(res);
      setDoctorRecord(res);
    });
  }, [id]);

  useEffect(() => {
    api({
      path: "/price-lists/getAll",
      sendToken: false,
      type: TypeHTTP.GET,
    }).then((res) => {
      setPriceList(
        res.filter((item) => item.type === "Online")[0]
      );
    });
  }, [appointmentData.sicks]);
  useEffect(() => {
    // get assessments
    if (doctorRecord) {
      console.log(doctorRecord._id);
      api({
        type: TypeHTTP.GET,
        path: `/assessments/getByDoctorRecord/${doctorRecord._id}`,
        sendToken: false,
      }).then((res) => {
        setAssessments(res);
      });
    }
  }, [doctorRecord]);
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-6 h-6 ${
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
    );
  };
  return (
    <>
      <div className="w-full min-h-screen flex flex-col pb-[2rem]">
        <Navbar />
        <div className="flex z-0 overflow-hidden relative text-[30px] pt-[7rem] font-bold text-[#171717] w-[100%] items-center">
          <img
            className="z-[5]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg"
            width={"100%"}
          />
          <img
            className="absolute z-[3]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/images/doctor-profile/dr-profile-banner-dt-4.svg"
          />
          <img
            className="absolute z-[4] right-[10%] top-[-2%]"
            width={"30%"}
            src={doctorRecord?.doctor?.image}
          />
          <div className="absolute z-[6] w-[35%] flex flex-col items-start gap-1 top-[40%] translate-y-[-50%] left-12">
            <h2 className="text-transparent text-[35px] bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-red-500">
              BS. {doctorRecord?.doctor.fullName}
            </h2>
            <span></span>
            <p className="text-[17px] font-medium text-[#404040]">
              {doctorRecord?.description}
            </p>
            <div className="bg-[white] shadow-xl w-[90%] mt-2 px-3 py-2 rounded-lg flex justify-between">
              <div className="flex flex-col text-[#333333]">
                <span className="text-[14px]">
                  GIÁ TƯ VẤN TRỰC TUYẾN
                </span>
                <span className="text-[19px]">
                  {formatMoney(priceList?.price)}
                </span>
              </div>
              <div>
                <button
                  onClick={() =>
                    appointmentHandler.showFormBooking()
                  }
                  style={{
                    background:
                      "linear-gradient(to right, #11998e, #38ef7d)",
                  }}
                  className="text-[16px] scale-[0.95] rounded-3xl px-6 py-3 cursor-pointer text-[white]"
                >
                  Đặt Khám Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=" z-0 pt-[15rem] overflow-hidden relative justify-center mt-[2rem] text-[#171717] w-[100%] items-center">
          <img
            className="z-[5]"
            src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg"
            width={"100%"}
          />
          <div className="z-[0] top-0 left-0 absolute flex pb-[4rem] px-[4rem] flex-wrap gap-[3rem] justify-center items-center">
            <div className="flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center">
              <div className="flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]">
                <img
                  width={"35px"}
                  src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/specialties-icon.svg"
                />
              </div>
              <span className="text-[22px] font-semibold">
                Chuyên Khoa
              </span>
              <span className="font-medium">
                {doctorRecord?.doctor.specialize}
              </span>
            </div>
            <div className="flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center">
              <div className="flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]">
                <img
                  width={"35px"}
                  src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/school-icon.svg?v=1"
                />
              </div>
              <span className="text-[22px] font-semibold">
                Nơi đào tạo
              </span>
              <span className="font-medium">
                {doctorRecord?.trainingPlace}
              </span>
            </div>
            <div className="flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center">
              <div className="flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]">
                <img
                  width={"35px"}
                  src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/degree-icon.svg?v=1"
                />
              </div>
              <span className="text-[22px] font-semibold">
                Bằng Cấp
              </span>
              <span className="font-medium">
                {doctorRecord?.certificate.join(", ")}
              </span>
            </div>
            <div className="flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center">
              <div className="flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]">
                <img
                  width={"35px"}
                  src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/languages-icon.svg?v=1"
                />
              </div>
              <span className="text-[22px] font-semibold">
                Ngôn Ngữ
              </span>
              <span className="font-medium">
                {doctorRecord?.language.join("/")}
              </span>
            </div>
            <div className="flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center">
              <div className="flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]">
                <img
                  width={"35px"}
                  src="https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/location.svg?v=1"
                />
              </div>
              <span className="text-[22px] font-semibold">
                Khu vực
              </span>
              <span className="font-medium">
                {doctorRecord?.area}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
          <span className="font-bold">
            Học vấn và kinh nghiệm
          </span>
          <div className="flex flex-col gap-3 mt-2">
            {doctorRecord?.experience_work
              .split("\n")
              .map((item, index) => (
                <span key={index} className="text-[15px]">
                  {item}
                </span>
              ))}
          </div>
        </div>
        {/* Đánh giá từ người bệnh */}
        <div className="flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
          <span className="font-bold">
            Đánh giá từ người bệnh ({assessments.length})
          </span>
          <div className="flex flex-col gap-3 mt-2 w-[100%]">
            {assessments.map((assessment, index) => (
              <div
                key={index}
                className="border p-4 rounded shadow w-[100%]"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={assessment.assessment_list.image}
                    alt="Avatar"
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-[20px] font-bold">
                      {assessment.assessment_list.fullName}
                    </h3>
                    <p className="text-[16px] flex items-center">
                      Đánh giá:{" "}
                      <span className="flex ml-2">
                        {renderStars(
                          assessment.assessment_list.star
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[16px]">
                  {assessment.assessment_list.content}
                </p>
                <p className="mt-2 text-[14px] text-gray-500">
                  Ngày:{" "}
                  {assessment.assessment_list.date.day}/
                  {assessment.assessment_list.date.month}/
                  {assessment.assessment_list.date.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HoSoBacSi;
