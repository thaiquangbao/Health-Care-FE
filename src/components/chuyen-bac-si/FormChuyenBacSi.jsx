import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { api, TypeHTTP } from "@/utils/api";
import { userContext } from '@/context/UserContext'
const FormChuyenBacSi = ({ data, visible, doctorRecords }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [dsDoctors, setDsDoctors] = useState([]);
  useEffect(() => {
    if (data.doctor) {
       api({ path: "/doctorRecords/getAll", type: TypeHTTP.GET, sendToken:false })
      .then((res) => {
        const filteredResults = res.filter((item) => {
          return item.doctor?._id !== data.doctor._id;
        });
        console.log(filteredResults);
        
        setDsDoctors(filteredResults)
        // setDoctorRecords(res.filter((item) => {
        //   item.doctor?._id !== userData.user._id;
        // }));
      });

    }
   
  },[data.doctor]);

  return (
    <section
      style={{
            height: "90%",
            width: "85%",
            transition: "0.3s",
            backgroundSize: "cover",
            overflow: "auto",
            backgroundImage: "url(/bg.png)",
        }}
        className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
        <div className="px-[2rem] py-[1.5rem] w-full flex flex-col text-center">
          <span className="font-semibold text-[30px]">
            Danh sách bác sĩ
          </span>
        </div>
        <div className="flex flex-col gap-4 mt-2 w-full justify-center items-center">
          <div className="p-4 rounded w-[80%]"> 
            {dsDoctors.map((item, index) => {
              return (
                  <div key={index} className="p-4 rounded w-[100%] flex flex-row shadow-l border hover:shadow-xl">
                    <div className="items-center w-[20%]">
                        <div
                          className="w-[100px] aspect-square rounded-full shadow-xl"
                          style={{
                            backgroundSize: "cover",
                            backgroundImage: `url(${item.doctor?.image})`,
                          }}
                        ></div>
                    </div>
                    <div className="flex flex-col gap-2 w-[60%]">
                      <span className="font-semibold text-[20px]">
                        {item.doctor?.fullName}
                        
                      </span>
                      <p className="text-[15px]">
                        Khoa:{" "}
                        {item.doctor?.specialize}
                      </p>
                      <p className="text-[15px]">
                        Khu vực:{" "}
                        {item.area}
                      </p>
                       <p className="text-[15px]">
                        Số điện thoại:{" "}
                        {item.doctor?.phone}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-[20%]">
                      <button
                        style={{
                          background:
                            "linear-gradient(to right, #11998e, #38ef7d)",
                        }}
                        className="bg-blue-500 text-white p-2 rounded mt-2 cursor-pointer font-semibold text-[16px] shadow-md shadow-[#767676]"
                      >
                        Chuyển bác sĩ
                      </button>
                    </div>
                  </div>   
              )
            })}
          </div>
        </div>
         <button onClick={visible}>
          <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
        </button>
    </section>
    )
}
export default FormChuyenBacSi;