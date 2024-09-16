'use client'
import Navbar from '@/components/navbar';
import { appointmentContext } from '@/context/AppointmentContext';
import { globalContext, notifyType } from '@/context/GlobalContext';
import { userContext } from '@/context/UserContext';
import { api, TypeHTTP } from '@/utils/api';
import { changeDate, compareDate1GetterThanDate2, compareDateIsHaveInSchedule, convertDateToDayMonth, convertDateToDayMonthYearObject, convertObjectToDate, formatDateISOByVietNam } from '@/utils/date';
import { Select, SelectItem } from "@nextui-org/select";
import { eachDayOfInterval, endOfMonth, format, isSameMonth, isToday, startOfMonth } from 'date-fns';
import React, { useContext, useEffect, useMemo, useState } from 'react';

const HoSoBacSi = () => {
    const [days, setDays] = useState([])
    const monthStart = useMemo(() => startOfMonth(new Date()), []);
    const monthEnd = useMemo(() => endOfMonth(new Date()), []);
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const { globalHandler } = useContext(globalContext)
    const { userData } = useContext(userContext)
    useEffect(() => {
        const formatDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
        if (formatDays[0].toString().includes('Tue'))
            for (let i = 0; i <= 0; i++)
                formatDays.unshift('')
        else if (formatDays[0].toString().includes('Wed'))
            for (let i = 0; i <= 1; i++)
                formatDays.unshift('')
        else if (formatDays[0].toString().includes('Thu'))
            for (let i = 0; i <= 2; i++)
                formatDays.unshift('')
        else if (formatDays[0].toString().includes('Fri'))
            for (let i = 0; i <= 3; i++)
                formatDays.unshift('')
        else if (formatDays[0].toString().includes('Sat'))
            for (let i = 0; i <= 4; i++)
                formatDays.unshift('')
        else if (formatDays[0].toString().includes('Sun'))
            for (let i = 0; i <= 5; i++)
                formatDays.unshift('')
        const remain = formatDays.length % 7
        for (let i = remain; i < 7; i++) {
            formatDays.push('')
        }
        setDays(formatDays)
    }, [monthStart, monthEnd])

    const handleUpdateRecord = () => {
        const body = {
            ...appointmentData.doctorRecord, doctor: appointmentData.doctorRecord.doctor.id
        }
        globalHandler.notify(notifyType.LOADING, "Đang Cập Nhật Thông Tin")
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Cập Nhật Thông Tin Thành Công")
                appointmentHandler.setDoctorRecord({ ...res, doctor: appointmentData.doctorRecord.doctor })
            })
    }

    return (
        <div className="w-full pb-4 flex flex-col pt-[60px] px-[5%] background-public">
            <Navbar />
            <div className='flex flex-col gap-4 items-center px-[2rem] mt-4'>
                <div className='flex justify-normal gap-10 bg-[white] rounded-md p-3 w-[80%]'>
                    {/* <img className='rounded-full' src={appointmentData.doctorRecord?.doctor?.image} width={'20%'} /> */}
                    <div style={{ backgroundImage: `url(${appointmentData.doctorRecord?.doctor?.image})`, backgroundSize: 'cover' }} className='rounded-full w-[20%] aspect-square' />
                    <div className='flex flex-col items-start justify-center gap-2 w-[50%]'>
                        <span className='text-[18px] text-[#1c1c1c] font-medium'>BS. {appointmentData.doctorRecord?.doctor?.fullName}</span>
                        {/* <span className='font-medium text-[15px] text-[#252525]'>150.000đ</span> */}
                        <span className='px-4 py-1 bg-[#e0e0e0] text-[14px] text-[#2e2e2e] font-medium rounded-md'>{appointmentData.doctorRecord?.doctor?.specialize}</span>
                    </div>
                    <div className='flex flex-col items-start justify-center gap-2'>
                        <div className='flex items-center gap-2'>
                            <i className='bx bxs-calendar-check text-[22px] text-[#5050ff]' ></i>
                            <span className='text-[14px]'>Lượt Gọi Khám: {appointmentData.doctorRecord?.examination_call}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <i className='bx bxs-calendar-check text-[22px] text-[#5050ff]' ></i>
                            <span className='text-[14px]'>Lượt Tư Vấn: {appointmentData.doctorRecord?.consultation}</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <i className='bx bxs-star text-[22px] text-[#5050ff93]' ></i>
                            <span className='text-[14px]'>Đánh Giá: {appointmentData.doctorRecord?.assessment}</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-3 bg-[white] rounded-md px-6 py-4 w-[80%]'>
                    <span className='text-[17px] font-semibold'>Lịch Khám Bệnh</span>
                    <div className='grid grid-cols-7 w-full border border-[rgb(217,217,217)] rounded-lg overflow-hidden'>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Thứ Hai
                        </div>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Thứ Ba
                        </div>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Thứ Tư
                        </div>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Thứ Năm
                        </div>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Thứ Sáu
                        </div>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Thứ Bảy
                        </div>
                        <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                            Chủ Nhật
                        </div>
                        {days.map((day, index) => (
                            <div key={index} className='border-[1px] border-[rgb(217,217,217)] flex items-center justify-center font-medium text-[15px]'>
                                {(day + '') !== '' && (
                                    <>
                                        {compareDate1GetterThanDate2(convertDateToDayMonthYearObject(day + ''), convertDateToDayMonthYearObject(new Date().toISOString())) ? (
                                            <button style={{ backgroundColor: compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules) === 0 ? 'white' : '#ffffee' }} onClick={() => {userData.user?.email === null ? globalHandler.notify(notifyType.WARNING, "Bác sĩ hãy cập nhật địa chỉ email trước khi đăng k1y lịch khám !!!") : appointmentHandler.showFormSchedule(convertDateToDayMonthYearObject(day + ''))}} 
                                            className='hover:bg-[#e5e5e5] transition-all h-[90px] w-full py-4 items-center gap-1 flex flex-col'>
                                                <span>{convertDateToDayMonth(day + '')}</span>
                                                {compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules) !== 0 && (
                                                    <span>{`(${compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules)}) Cuộc Hẹn`}</span>
                                                )}
                                            </button>
                                        ) : (
                                            <button className='bg-[#eaeded] transition-all h-[90px] w-full py-4 items-center gap-1 flex flex-col'>
                                                <span>{convertDateToDayMonth(day + '')}</span>
                                                {compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules) !== 0 && (
                                                    <span>{`(${compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules)}) Cuộc Hẹn`}</span>
                                                )}
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className='flex flex-col gap-3 bg-[white] rounded-md px-6 py-4 w-[80%]'>
                    <span className='text-[15px] font-semibold'>Thông Tin Chi Tiết</span>
                    <div className='grid grid-cols-2 gap-3'>
                        <input value={appointmentData.doctorRecord?.area} onChange={e => appointmentHandler.setDoctorRecord({ ...appointmentData.doctorRecord, area: e.target.value })} placeholder='Nơi Làm Việc' className='text-[14px] w-full mt-1 h-[38px] bg-[white] border-[1px] border-[#d7d7d7] focus:outline-0 rounded-lg px-4' />
                        <input value={appointmentData.doctorRecord?.certificate + ''} onChange={e => appointmentHandler.setDoctorRecord({ ...appointmentData.doctorRecord, certificate: [e.target.value] })} placeholder='Bằng Cấp' className='text-[14px] w-full mt-1 h-[38px] bg-[white] border-[1px] border-[#d7d7d7] focus:outline-0 rounded-lg px-4' />
                        <input value={appointmentData.doctorRecord?.language + ''} onChange={e => appointmentHandler.setDoctorRecord({ ...appointmentData.doctorRecord, language: [e.target.value] })} placeholder='Ngôn Ngữ' className='text-[14px] w-full mt-1 h-[38px] bg-[white] border-[1px] border-[#d7d7d7] focus:outline-0 rounded-lg px-4' />
                        <input value={appointmentData.doctorRecord?.trainingPlace} onChange={e => appointmentHandler.setDoctorRecord({ ...appointmentData.doctorRecord, trainingPlace: e.target.value })} placeholder='Nơi Đào Tạo' className='text-[14px] w-full mt-1 h-[38px] bg-[white] border-[1px] border-[#d7d7d7] focus:outline-0 rounded-lg px-4' />
                    </div>
                    <textarea value={appointmentData.doctorRecord?.description} onChange={e => appointmentHandler.setDoctorRecord({ ...appointmentData.doctorRecord, description: e.target.value })} placeholder='Mô Tả Thêm' className='border-[1px] h-[200px] focus:outline-none px-5 text-[14px] py-2 border-[#e1e1e1] rounded-md'></textarea >
                </div>
                <div className='flex flex-col gap-3 bg-[white] rounded-md px-6 py-4 w-[80%]'>
                    <span className='text-[15px] font-semibold'>Kinh Nghiệm Làm Việc</span>
                    <textarea value={appointmentData.doctorRecord?.experience_work} onChange={e => appointmentHandler.setDoctorRecord({ ...appointmentData.doctorRecord, experience_work: e.target.value })} className='border-[1px] h-[200px] focus:outline-none px-5 text-[14px] py-2 border-[#e1e1e1] rounded-md'></textarea>
                </div>
                <div className='flex justify-end gap-3 rounded-md w-[80%]'>
                    <button onClick={() => handleUpdateRecord()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] h-[37px] rounded-lg'>Cập Nhật Hồ Sơ</button>
                </div>
            </div>
        </div >
    )
}

export default HoSoBacSi