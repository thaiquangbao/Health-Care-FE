import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import NhietDo from "@/components/benh-nhan-theo-doi/Nhiet-do";
import HuyetAp from "@/components/benh-nhan-theo-doi/Huyet-ap";
import BMI from "@/components/benh-nhan-theo-doi/Chi-so-BMI";
import NhipTim from "@/components/benh-nhan-theo-doi/Nhip-tim";
import { api, TypeHTTP } from "@/utils/api";
import FormChuyenBacSi from "@/components/chuyen-bac-si/FormChuyenBacSi";
const FormBenhNhanDetail = ({ logBook, onClose }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [transferDoctor, setTransferDoctor] = useState();
  const formChuyenBacSi = (data) => {
        
        setTransferDoctor(data);
        setIsFormVisible(true);
        // onClose();
  };
   const handleVisibleForm = () => {
        setIsFormVisible(false); // Thay đổi trạng thái để ẩn form
    };
  return (
    <section
      style={{
            height: "90%",
            width: "95%",
            transition: "0.3s",
            backgroundSize: "cover",
            overflow: "auto",
            backgroundImage: "url(/bg.png)",
        }}
        className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
        <div className="px-[2rem] py-[1.5rem] w-full flex flex-col">
          <span className="font-semibold text-[30px]">
            Thông tin cá nhân
          </span>
          <div className="flex flex-row gap-2 w-full">
            <div className="flex flex-col gap-1 w-[35%]">
              <div className="flex flex-col py-4">
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Họ và tên:
                  </label>
                  <span className="px-2 py-2">{logBook?.patient?.fullName}</span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Ngày sinh:
                  </label>
                  <span className="px-2 py-2">{logBook?.patient?.dateOfBirth}</span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Giới tính:
                  </label>
                  <span className="px-2 py-2">{logBook?.patient?.sex === true ? "Nam" : "Nữ" }</span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Số điện thoại:
                  </label>
                  <span className="px-2 py-2">{logBook?.patient?.phone}</span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Email:
                  </label>
                  <span className="px-2 py-2">{logBook?.patient?.email}</span>
                </div>
                 <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Ghi chú:
                  </label>
                  <span className="px-2 py-2">Đau thắt ngực</span>
                </div>
                <div className="flex items-center">
                  <label className="text-[#5e5e5e] text-[15px]">
                    Ngày tái khám:
                  </label>
                  <span className="px-2 py-2">(10:30) 10-04-2002</span>
                </div>
              </div>
              <div className="flex flex-col py-4 gap-4 w-[80%]">
                <button className="py-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 text-white" onClick={() => formChuyenBacSi(logBook)}>Chuyển bác sĩ</button>
                <button className="py-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white">Dừng điều trị</button>
                <button className="py-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 text-white">Xem hồ sơ bệnh án</button>
                <button className="py-2 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 text-white">Nhắc nhở bệnh nhân</button>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-[75%]">
              <div className="flex flex-row gap-4 p-2 h-[50%]">
                  <div className="w-[50%]">
                    <div className="flex justify-center">
                      <span className="font-bold">Nhiệt độ cơ thể</span>
                    </div>
                    <NhietDo logBook={logBook}/>
                  </div>
                  <div className="w-[50%]">
                     <div className="flex justify-center">
                      <span className="font-bold">Huyết áp</span>
                    </div>
                    <HuyetAp logBook={logBook}/>
                  </div>
              </div>
              <div className="flex flex-row gap-4 p-2 h-[50%]">
                  <div className="w-[50%]">
                     <div className="flex justify-center">
                      <span className="font-bold">Chỉ số BMI</span>
                    </div>
                    <BMI logBook={logBook}/>
                  </div>
                  <div className="w-[50%]">
                     <div className="flex justify-center">
                      <span className="font-bold">Nhịp tim</span>
                    </div>
                    <NhipTim logBook={logBook}/>
                  </div>
              </div>
            </div>
          </div>
        </div>
        {isFormVisible && <FormChuyenBacSi data={transferDoctor} visible={handleVisibleForm} />}
        <button onClick={onClose}>
          <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
        </button>
    </section>
    )
}
export default FormBenhNhanDetail;