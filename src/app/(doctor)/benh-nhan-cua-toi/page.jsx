"use client";
import Navbar from '@/components/navbar'
import React, { useState, useEffect, useContext } from 'react'
import StatusChart from '@/components/chart/StatusChart'
import SexChart from '@/components/chart/SexChart'
import FormBenhNhanDetail from "@/components/benh-nhan-theo-doi/FormBenhNhanDetail"
import { api, TypeHTTP } from '@/utils/api'
import { userContext } from '@/context/UserContext'
const BenhNhanCuaToi = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
     const { userData } = useContext(userContext);
    const [logBooks, setLogBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLogBook, setSelectedLogBook] = useState();
    
     useEffect(() => {
        if (userData.user) {
            setLoading(true)
            api({ type: TypeHTTP.GET, path: `/healthLogBooks/findByDoctor/${userData.user._id}`, sendToken: true })
                .then(logBooks => {
                    setLogBooks(logBooks)
                    setLoading(false)
                })
        }
    }, [userData.user])
    const formDetail = (logBook) => {
        setSelectedLogBook(logBook);
        setIsFormVisible(true);
        
    };
    const handleCloseForm = () => {
        setIsFormVisible(false); // Thay đổi trạng thái để ẩn form
    };
    const dataHealth = (data, type) => {
        if((type === "BLOODPRESSURE")) {
            const filteredDisMon = data.disMon?.filter(item => item.vitalSign?.bloodPressure !== "");
            const bloodPressure = filteredDisMon.length > 0 ? filteredDisMon[filteredDisMon.length - 1].vitalSign?.bloodPressure : 'N/A';
            return bloodPressure;
        } else if((type === "TEMPERATURE")) {
            const filteredDisMon = data.disMon?.filter(item => item.vitalSign?.temperature !== 0);
            const temperature = filteredDisMon.length > 0 ? filteredDisMon[filteredDisMon.length - 1].vitalSign?.temperature : 'N/A';
            return temperature;
        } else if((type === "BMI")) {
           const filteredWeight = data.disMon?.filter(item => item.vitalSign?.weight !== 0);
            const filteredHeight = data.disMon?.filter(item => item.vitalSign?.height !== 0);

            if (filteredWeight.length > 0 && filteredHeight.length > 0) {
                const weight = filteredWeight[filteredWeight.length - 1].vitalSign?.weight;
                const height = filteredHeight[filteredHeight.length - 1].vitalSign?.height / 100; // Convert height from cm to meters
                const bmi = weight / (height * height);
                return bmi.toFixed(2); // Return BMI rounded to 2 decimal places
            } else {
                return 'N/A';
            }
        } else {
            const filteredDisMon = data.disMon?.filter(item => item.vitalSign?.heartRate !== 0);
            const heartRate = filteredDisMon.length > 0 ? filteredDisMon[filteredDisMon.length - 1].vitalSign?.heartRate : 'N/A';
            return heartRate;
        } 
    }
    return (
        <div className="w-full h-screen flex flex-col pt-[60px] px-[5%] background-public">
            <Navbar />
            <div className='w-full mt-[2rem]'>
                <div className="flex justify-center">
                    <span className="font-bold text-[25px]">
                        Bệnh nhân của tôi
                    </span>
                </div>
                <div className="flex flex-row w-full items-center">
                    <div className="flex flex-col justify-center items-center w-[50%]">
                        <span className="font-bold text-[20px]">
                            Thống kê trạng thái sức khỏe bệnh nhân
                        </span>
                        <div className="flex items-center justify-center w-full">
                            <StatusChart />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-[50%]">
                        <span className="font-bold text-[20px]">
                            Thống kê giới tính bệnh nhân
                        </span>
                        <div className="flex items-center justify-center w-full">
                            <SexChart />
                        </div>
                    </div>
                </div>
                <div className='w-full max-h-[500px] mt-4 overflow-y-auto relative'>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="w-[5%] py-3 text-center">
                                    #
                                </th>
                                <th scope="col" className="w-[15%] py-3">
                                    Họ tên
                                </th>
                                <th scope="col" className="w-[10%] py-3">
                                    Huyết áp
                                </th>
                                <th scope="col" className="w-[10%] py-3">
                                    Nhiệt độ cơ thể
                                </th>
                                <th scope="col" className="w-[10%] py-3">
                                    BMI trung bình
                                </th>
                                <th scope="col" className="w-[10%] py-3">
                                    Nhịp tim
                                </th>
                                <th scope="col" className="w-[10%] py-3">
                                    Ghi Chú
                                </th>
                                <th scope="col" className="w-[15%] py-3">
                                    Triệu chứng
                                </th>
                                <th scope="col" className="w-[15%] py-3">
                                    Trạng thái sức khỏe
                                </th>
                            </tr>
                        </thead>
                        <tbody className=' w-[full] bg-black font-medium'>
                            {!loading &&
                            logBooks.map((logBook, index) => {
                                return (
                                    <tr key={index} className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700" onClick={() => formDetail(logBook)}>
                                        <td className=' py-2 text-center text-white'>{index + 1}</td>
                                        <td className=' py-2 text-white'>{logBook.patient?.fullName}</td>
                                        <td className=' py-2 text-white'>{dataHealth(logBook, "BLOODPRESSURE")}</td>
                                        <td className=' py-2 text-white'>{dataHealth(logBook, "TEMPERATURE")} °C</td>
                                        <td className=' py-2 text-white'>{dataHealth(logBook, "BMI")}</td>
                                        <td className=' py-2 text-white'>{dataHealth(logBook, "HEARTRATE")} bpm</td>
                                        <td className=' py-2 text-white'>Không có</td>
                                        <td className=' py-2 text-white'>Ho, sốt</td>
                                        <td className=' py-2 text-white'>Tốt</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    {loading && (
                        <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
                            <svg
                                aria-hidden="true"
                                className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                        </div>
                    )}
                    {isFormVisible && (
                        <FormBenhNhanDetail logBook={selectedLogBook} onClose={handleCloseForm} />
                    )}
                </div>
            </div>
        </div>
    )
}

export default BenhNhanCuaToi