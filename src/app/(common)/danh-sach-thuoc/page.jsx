"use client";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { appointmentContext } from "@/context/AppointmentContext";
import { api, TypeHTTP } from "@/utils/api";
import { formatMoney, removeDiacritics } from "@/utils/other";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

const DanhSachThuoc = () => {
  const { appointmentData, appointmentHandler } = useContext(appointmentContext);
  const [medicals, setMedicals] = useState([])
  const [filterMedicine, setFilterMedicine] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  // api thuốc của jiohealth
  useEffect(() => {
    axios.post('https://prod.jiohealth.com:8443/jio-search/v1/search/retail/products-advance?offset=0&limit=315&sortName=PRICE&isDescending=false&categories=82&token=b161dc46-207d-11ee-aa37-02b973dc30b0&userID=1')
      .then(res => {
        setMedicals(res.data.data.products)
        setFilterMedicine(res.data.data.products)
      })
  }, []);
  const handleFindMedicine = (e) => { // sửa ở đây
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.trim() === "") {
      const filtered = medicals.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
     
      setFilterMedicine(filtered);
    } else {
      const filtered = medicals.filter((item) =>
        item.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setFilterMedicine(filtered);
    }
  };
  return (
    <>
      <div className="w-full min-h-screen pt-[60px] pb-4 flex flex-col background-public">
        <Navbar />
        <div className="flex relative flex-col gap-2 text-[30px] font-bold text-[#171717] w-[100%] items-center">
          <img src="/banner.png" width={"100%"} />
          <div className="flex-col gap-3 text-[white] absolute w-[50%] flex items-start justify-center top-[50%] translate-y-[-50%] left-[5%]">
            <span className="text-[40px]">
              Bạn thấy không khỏe? Hãy để HealthHaven chăm sóc cho bạn!
            </span>
            <span className="text-[18px] font-medium">
              Khám phá danh mục thuốc đa dạng của chúng tôi, từ các loại thuốc phổ biến dành cho
              tim mạch đến các loại chuyên biệt hỗ trợ điều trị lâu dài –
              tất cả đều được chọn lọc kỹ lưỡng để chăm sóc sức khỏe tốt nhất cho bạn và gia đình.
            </span>
          </div>
          {/* <img className='absolute right-6s' src='/logo.png' width={'150px'} /> */}
        </div>
        <div className="flex px-[5%] flex-col gap-2 text-[30px] font-bold text-[#171717] mt-[4rem] w-[100%] items-center">
          <span>Danh sách thuốc trong HealthHaven</span>
          <div className="bg-[#35a4ffa1] w-[100px] h-[2px] rounded-lg"></div>
          <div className="w-[60%] relative mt-[1rem]">
            <input
              value={searchTerm}
              placeholder="Tìm thuốc..."
              className="text-[14px] h-[50px] w-[100%] focus:outline-0 border-[1px] pl-[3rem] pr-[1rem] border-[#dadada] rounded-3xl"
              onChange={handleFindMedicine}
            />
            <i className="bx bx-search absolute top-[50%] translate-y-[-50%] text-[23px] text-[#999] left-4"></i>
          </div>
          <div className="mt-[1.5rem] grid grid-cols-4 w-[95%] gap-3">
            {filterMedicine.map((medical, index) => (
              <div
                key={index}
                className={`flex cursor-pointer flex-col items-center gap-3 px-6 justify-start w-full bg-[white] h-[200px] rounded-2xl shadow-xl shadow-[#35a4ff2a]`}
              >
                <div className="w-[100px] h-[100px] aspect-square flex items-center justify-center">
                  <img src={medical.images[0].images[0].url} width={"100px"} />
                </div>
                <span className="text-[15px] text-center">{medical.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DanhSachThuoc;
