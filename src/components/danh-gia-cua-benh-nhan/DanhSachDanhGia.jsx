import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { healthContext } from "@/context/HealthContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearTimeObject } from "@/utils/date";
import { useParams, useRouter } from "next/navigation";
const DanhSachDanhGia = ({ hidden }) => {
  const [assessments, setAssessments] = useState([]);
  const { healthHandler } = useContext(healthContext);
  const { globalHandler } = useContext(globalContext);
  const [doctorRecord, setDoctorRecord] = useState();
  const { userData } = useContext(userContext);
  const router = useRouter();
  useEffect(() => {
    if (userData.user) {
      api({
        type: TypeHTTP.GET,
        path: `/doctorRecords/getById/${userData.user?._id}`,
        sendToken: false,
      }).then((res) => {
        setDoctorRecord(res);
      });
    }
  }, [userData.user]);
  useEffect(() => {
    if (doctorRecord) {
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
      <div className="flex gap-2">
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
    <section
      style={{
        height: "90%",
        width: "70%",
        transition: "0.3s",
        backgroundSize: "cover",
        overflow: "auto",
        backgroundImage: "url(/bg.png)",
      }}
      className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col text-center">
        <span className="font-semibold text-[30px]">
          Đánh giá từ người bệnh ({assessments.length})
        </span>
      </div>
      <div className="flex flex-col gap-4 mt-2 w-full justify-center items-center">
        <div className="p-4 rounded w-[90%]">
          {assessments
            .slice()
            .reverse()
            .map((assessment, index) => (
              <div
                key={index}
                className="p-4 rounded w-[100%] flex flex-row shadow-l border hover:shadow-x"
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
                    <p className="text-[16px] flex items-center mt-3">
                      Đánh giá:{" "}
                      <span className="flex ml-2">
                        {renderStars(
                          // dòng 77
                          assessment.assessment_list.star
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="p-4 flex flex-row w-[full]">
                  <div className="ml-4">
                    <p className="mt-2 text-[18px]  text-start font-semibold text-gray-800">
                      {assessment.assessment_list.content}
                    </p>
                  </div>

                  <div className="flex mt-2 ml-4">
                    <p className="text-[16px] text-gray-500 text-start">
                      Ngày:{" "}
                      {assessment.assessment_list.date.day}/
                      {
                        assessment.assessment_list.date
                          .month
                      }
                      /
                      {assessment.assessment_list.date.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </section>
  );
};
export default DanhSachDanhGia;
