"use client";
import Navbar from '@/components/navbar'
import React from 'react'
import DonutChart from '@/components/Chart/DonutChart'
const BenhNhanCuaToi = () => {
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
                            <DonutChart />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-[50%]">
                        <span className="font-bold text-[20px]">
                            Thống kê trạng thái sức khỏe bệnh nhân
                        </span>
                        <div className="flex items-center justify-center w-full">
                            <DonutChart />
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
                            <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                <td className=' py-2 text-center text-white'>1</td>
                                <td className=' py-2 text-white'>Nguyễn Văn A</td>
                                <td className=' py-2 text-white'>120/80</td>
                                <td className=' py-2 text-white'>36.5°C</td>
                                <td className=' py-2 text-white'>22.5</td>
                                <td className=' py-2 text-white'>75 bpm</td>
                                <td className=' py-2 text-white'>Không có</td>
                                <td className=' py-2 text-white'>Ho, sốt</td>
                                <td className=' py-2 text-white'>Tốt</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BenhNhanCuaToi