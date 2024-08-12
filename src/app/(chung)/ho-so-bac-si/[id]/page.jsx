'use client'

import Navbar from '@/components/navbar'
import React, { useContext, useEffect, useState } from 'react'
import { Select, SelectItem } from "@nextui-org/select";
import { useParams, useRouter } from 'next/navigation';
import { appointmentContext } from '@/context/AppointmentContext';
import { api, TypeHTTP } from '@/utils/api';
import { compare2Date, compareDates, convertDateToDayMonthYear, convertDateToDayMonthYearObject, convertObjectToDate } from '@/utils/date';
import { formatMoney, formatTime, formatTimeAndFind } from '@/utils/other';
import { userContext } from '@/context/UserContext';
import { globalContext, notifyType } from '@/context/GlobalContext';
import { bookingContext } from '@/context/BookingContext';
import Calendar from '../../../../components/Calendar';
import Footer from '@/components/footer';

const HoSoBacSi = () => {
    const param = useParams()
    const { id } = param
    const [doctorRecord, setDoctorRecord] = useState()
    const { appointmentHandler } = useContext(appointmentContext)

    useEffect(() => {
        api({ type: TypeHTTP.GET, path: `/doctorRecords/getById/${id}`, sendToken: false })
            .then(res => {
                appointmentHandler.setDoctorRecord(res)
                setDoctorRecord(res)
            })
    }, [id])

    return (
        <>
            <div className="w-full min-h-screen flex flex-col pb-[2rem]">
                <Navbar />
                <div className="flex z-0 overflow-hidden relative text-[30px] pt-[7rem] font-bold text-[#171717] w-[100%] items-center">
                    <img className='z-[5]' src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg' width={'100%'} />
                    <img className='absolute z-[3]' src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/images/doctor-profile/dr-profile-banner-dt-4.svg' />
                    <img className='absolute z-[4] right-[10%] top-[-2%]' width={'30%'} src={doctorRecord?.doctor?.image} />
                    <div className='absolute z-[6] w-[35%] flex flex-col items-start gap-1 top-[40%] translate-y-[-50%] left-12'>
                        <h2 className="text-transparent text-[35px] bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-red-500">
                            BS. {doctorRecord?.doctor.fullName}
                        </h2>
                        <span></span>
                        <p className='text-[17px] font-medium text-[#404040]'>{doctorRecord?.description}</p>
                        <button onClick={() => appointmentHandler.showFormBooking()} style={{ background: 'linear-gradient(to right, #11998e, #38ef7d)' }} className='text-[16px] rounded-3xl px-6 py-3 cursor-pointer mt-[1rem] text-[white]'>Đặt Khám Ngay</button>
                    </div>
                </div>
                <div className=" z-0 pt-[15rem] overflow-hidden relative justify-center mt-[2rem] text-[#171717] w-[100%] items-center">
                    <img className='z-[5]' src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg' width={'100%'} />
                    <div className='z-[0] top-0 left-0 absolute flex pb-[4rem] px-[4rem] flex-wrap gap-[3rem] justify-center items-center'>
                        <div className='flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center'>
                            <div className='flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]'>
                                <img width={'35px'} src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/specialties-icon.svg' />
                            </div>
                            <span className='text-[22px] font-semibold'>Chuyên Khoa</span>
                            <span className='font-medium'>{doctorRecord?.doctor.specialize}</span>
                        </div>
                        <div className='flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center'>
                            <div className='flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]'>
                                <img width={'35px'} src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/school-icon.svg?v=1' />
                            </div>
                            <span className='text-[22px] font-semibold'>Nơi đào tạo</span>
                            <span className='font-medium'>{doctorRecord?.trainingPlace}</span>
                        </div>
                        <div className='flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center'>
                            <div className='flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]'>
                                <img width={'35px'} src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/degree-icon.svg?v=1' />
                            </div>
                            <span className='text-[22px] font-semibold'>Bằng Cấp</span>
                            <span className='font-medium'>{doctorRecord?.certificate.join(', ')}</span>
                        </div>
                        <div className='flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center'>
                            <div className='flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]'>
                                <img width={'35px'} src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/languages-icon.svg?v=1' />
                            </div>
                            <span className='text-[22px] font-semibold'>Ngôn Ngữ</span>
                            <span className='font-medium'>{doctorRecord?.language.join('/')}</span>
                        </div>
                        <div className='flex gap-2 border-[1px] border-[#4646ff1b] flex-col bg-[white] shadow-2xl shadow-[#4646ff4d] rounded-2xl w-[300px] h-[230px] items-center justify-center'>
                            <div className='flex items-center justify-center bg-[white] p-4 rounded-full shadow-lg shadow-[#4646ff5f]'>
                                <img width={'35px'} src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/assets/icons/location.svg?v=1' />
                            </div>
                            <span className='text-[22px] font-semibold'>Khu vực</span>
                            <span className='font-medium'>{doctorRecord?.area}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col z-0 overflow-hidden relative text-[30px] px-[5%] text-[#171717] w-[100%] items-start">
                    <span className='font-bold'>Học vấn và kinh nghiệm</span>
                    <div className='flex flex-col gap-3 mt-2'>
                        {doctorRecord?.experience_work.split('\n').map((item, index) => (
                            <span key={index} className='text-[15px]'>{item}</span>
                        ))}
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}

export default HoSoBacSi