"use client";

import Navbar from "@/components/navbar";
import { authContext } from "@/context/AuthContext";
import { api, TypeHTTP } from "@/utils/api";
import { set } from "date-fns";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { dsKhoa } from "@/utils/chuyenKhoa";
import { shuffleArray } from "@/utils/other";
const BacSiNoiBat = () => {
  const [doctorRecords, setDoctorRecords] = useState([]);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [doctorSuggest, setDoctorSuggest] = useState([]);
  const { authData } = useContext(authContext);
  const [display, setDisplay] = useState(true);
  const [selectKhoa, setSelectKhoa] = useState("");
  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      path: "/doctorRecords/getAll",
      sendToken: false,
    }).then((res) => {
      setDoctorRecords(
        res.map((doctorRecord) => {
          const filter = authData.assessment.filter(
            (item) => item.doctor_record_id === doctorRecord._id
          );
          return {
            ...doctorRecord,
            assessment:
              filter.reduce(
                (total, item) => (total += item.assessment_list.star),
                0
              ) /
                filter.length ===
                NaN
                ? 0
                : filter.reduce(
                  (total, item) => (total += item.assessment_list.star),
                  0
                ) / filter.length,
          };
        })
      );
      setFilteredDoctors(
        res.map((doctorRecord) => {
          const filter = authData.assessment.filter(
            (item) => item.doctor_record_id === doctorRecord._id
          );
          return {
            ...doctorRecord,
            assessment:
              filter.reduce(
                (total, item) => (total += item.assessment_list.star),
                0
              ) /
                filter.length ===
                NaN
                ? 0
                : filter.reduce(
                  (total, item) => (total += item.assessment_list.star),
                  0
                ) / filter.length,
          };
        })
      );
      api({
        sendToken: false,
        type: TypeHTTP.GET,
        path: "/doctorSuggests/get-all",
      }).then((suggest) => {
        const filteredDoctors = res.filter((itemDoctor) => {
          return suggest.some(
            (item) => item.doctor_record_id === itemDoctor.doctor._id
          );
        });
        setDoctorSuggest(
          filteredDoctors.map((doctorRecord) => {
            const filter = authData.assessment.filter(
              (item) => item.doctor_record_id === doctorRecord._id
            );
            return {
              ...doctorRecord,
              assessment:
                filter.reduce(
                  (total, item) => (total += item.assessment_list.star),
                  0
                ) /
                  filter.length ===
                  NaN
                  ? 0
                  : filter.reduce(
                    (total, item) => (total += item.assessment_list.star),
                    0
                  ) / filter.length,
            };
          })
        );
        // setDoctorSuggest((prev) => prev filteredDoctors);
      });
      // setDoctorSuggest(res.);
    });
  }, [authData.assessment]);
  const handleFindDoctor = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      const filtered = doctorRecords.filter((item) =>
        item.doctor.fullName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setDisplay(true);
      setFilteredDoctors(filtered);
    } else {
      const filtered = doctorRecords.filter((item) =>
        item.doctor.fullName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setDisplay(false);
      setFilteredDoctors(filtered);
    }
  };
  const handleSelect = (e) => {
    const selectedKhoa = e.target.value;
    setSelectKhoa(selectedKhoa);

    if (selectedKhoa === "Tất Cả Chuyên Khoa") {
      setFilteredDoctors(doctorRecords);
      setDisplay(true);
    } else {
      const filtered = doctorRecords.filter((item) =>
        item.doctor.specialize
          .toLowerCase()
          .includes(selectedKhoa.toLowerCase())
      );
      setDisplay(false);
      setFilteredDoctors(filtered);
    }
  };
  return (
    <div className="w-full pt-[60px] min-h-screen flex flex-col px-[5%] background-public">
      <Navbar />
      <div className="w-full mt-[3rem] flex flex-col">
        <div className="w-full flex flex-col items-center gap-1">
          <h1 className="text-[#6262ff] text-[22px] font-medium">
            Đặt khám trước qua HealthHaven - Bác sĩ nổi bật
          </h1>
          <span>
            Để được tiếp đón ưu tiên viện hoặc được tư vấn với bác sĩ giỏi ngay
            tại nhà
          </span>
          <div className="w-[60%] relative mt-[1rem]">
            <input
              value={searchTerm}
              placeholder="Tìm Bác Sĩ..."
              className="text-[14px] h-[50px] w-[100%] focus:outline-0 border-[1px] pl-[3rem] pr-[1rem] border-[#dadada] rounded-3xl"
              onChange={handleFindDoctor}
            />
            <i className="bx bx-search absolute top-[50%] translate-y-[-50%] text-[23px] text-[#999] left-4"></i>
          </div>
        </div>
        <div className="w-full mt-[2rem] flex flex-col">
          <h2 className="font-semibold text-[17px]">Chọn Bác Sĩ</h2>
          <div className="flex justify-end gap-[2rem]">
            <div className="flex gap-3 items-center text-[14px]">
              <span className="font-medium text-[15px]">Chuyên Khoa</span>
              <select
                className="px-3 py-2 rounded-md focus:outline-none"
                onChange={(e) => handleSelect(e)}
              >
                <option>Tất Cả Chuyên Khoa</option>
                {dsKhoa.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 items-center text-[14px]">
              <span className="font-medium text-[15px]">Hình Thức Khám</span>
              <select className="px-3 py-2 rounded-md focus:outline-none">
                <option>Tất Cả</option>
                <option>Khám Online</option>
                <option>Khám Tại Nhà</option>
                <option>Đăng Ký Theo Dõi Sức Khỏe</option>
              </select>
            </div>
          </div>
        </div>
        {display && (
          <div className="flex flex-col">
            <h2 className="font-semibold text-[17px]">Đề Xuất</h2>
            <div className="w-full mt-[2rem] grid grid-cols-4 gap-5 pb-[2rem]">
              {doctorSuggest.map((item, index) => (
                <div
                  key={index}
                  className="bg-[white] shadow-xl shadow-[#35a4ff2a] pt-[1rem] overflow-hidden rounded-lg justify-center items-center flex flex-col"
                >
                  <div
                    style={{
                      backgroundImage: `url(${item?.doctor?.image})`,
                      backgroundSize: "cover",
                    }}
                    className="px-[1rem] w-[70%] aspect-square rounded-full"
                  ></div>
                  <span className="px-[1rem] font-medium mt-[1rem]">
                    BS {item?.doctor?.fullName}
                  </span>
                  <div className="px-[1rem] flex items-center gap-[1rem] mt-[0.5rem] font-medium">
                    <div className="flex items-center gap-1">
                      <i className="bx bxs-calendar-check text-[18px] text-[#5050ff] translate-y-[-1px]"></i>
                      <span className="text-[14px]">
                        {item?.examination_call}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <i className="bx bxs-star text-[18px] text-[#5050ff] translate-y-[-1px]"></i>
                      <span className="text-[14px]">
                        {item?.assessment + "" === "NaN"
                          ? 0
                          : item?.assessment.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <span className="px-[1rem] mt-[1rem] py-1 rounded-md text-[14px] bg-[#e0eff6]">
                    Chuyên khoa {item?.doctor.specialize}
                  </span>
                  <button
                    onClick={() =>
                      router.push(`/ho-so-bac-si/${item.doctor?._id}`)
                    }
                    className="mt-[1rem] py-3 flex items-center justify-center gap-1 text-[white] bg-[#5050ff] font-medium text-[15px] w-full"
                  >
                    {/* <i className='bx bxs-calendar text-[23px] py-3' ></i> */}
                    <span>Xem Hồ Sơ</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col">
          <h2 className="font-semibold text-[17px]">Tất Cả</h2>

          <div className="w-full mt-[2rem] grid grid-cols-4 gap-5 pb-[2rem]">
            {shuffleArray(filteredDoctors).map((item, index) => (
              <div
                key={index}
                className="bg-[white] shadow-xl shadow-[#35a4ff2a] pt-[1rem] overflow-hidden rounded-lg justify-center items-center flex flex-col"
              >
                <div
                  style={{
                    backgroundImage: `url(${item?.doctor?.image})`,
                    backgroundSize: "cover",
                  }}
                  className="px-[1rem] w-[70%] aspect-square rounded-full"
                ></div>
                <span className="px-[1rem] font-medium mt-[1rem]">
                  BS {item?.doctor?.fullName}
                </span>
                <div className="px-[1rem] flex items-center gap-[1rem] mt-[0.5rem] font-medium">
                  <div className="flex items-center gap-1">
                    <i className="bx bxs-calendar-check text-[18px] text-[#5050ff] translate-y-[-1px]"></i>
                    <span className="text-[14px]">
                      {item?.examination_call}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="bx bxs-star text-[18px] text-[#5050ff] translate-y-[-1px]"></i>
                    <span className="text-[14px]">
                      {item?.assessment + "" === "NaN"
                        ? 0
                        : item?.assessment.toFixed(1)}
                    </span>
                  </div>
                </div>
                <span className="px-[1rem] mt-[1rem] py-1 rounded-md text-[14px] bg-[#e0eff6]">
                  Chuyên khoa {item?.doctor.specialize}
                </span>
                <button
                  onClick={() =>
                    router.push(`/ho-so-bac-si/${item.doctor?._id}`)
                  }
                  className="mt-[1rem] py-3 flex items-center justify-center gap-1 text-[white] bg-[#5050ff] font-medium text-[15px] w-full"
                >
                  {/* <i className='bx bxs-calendar text-[23px] py-3' ></i> */}
                  <span>Xem Hồ Sơ</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacSiNoiBat;
