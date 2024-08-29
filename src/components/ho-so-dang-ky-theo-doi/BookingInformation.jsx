
import { bookingServiceContext } from '@/context/BookingServiceContext'
import { userContext } from '@/context/UserContext'
import { convertDateToDayMonthYear, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import React, { useContext, useRef, useState } from 'react'

const BookingInformation = () => {

    const { bookingServiceData, bookingServiceHandler } = useContext(bookingServiceContext)


    return (
        <>
            <div className='border-[#cfcfcf] px-4 py-2 w-[70%] gap-3 rounded-md border-[1px] mt-7 flex items-center'>
                {bookingServiceData.bookingServiceRecord ? (
                    <>
                        <img src={bookingServiceData.bookingServiceRecord ? bookingServiceData.bookingServiceRecord.patient.image : 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0'} className='rounded-full w-[50px]' />
                        <div className='flex flex-col text-[14px]'>
                            <span>Bệnh Nhân</span>
                            <span className='font-medium'>{bookingServiceData.bookingServiceRecord.patient.fullName}</span>
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col w-full text-[14px] py-2'>
                        <span className='font-semibold text-[16px]'>Thông Tin Bệnh Nhân</span>
                        <div className='grid gap-1 grid-cols-2 w-[100%] items-center content-center'>
                            <input onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, fullName: e.target.value } })} placeholder='Họ Và Tên' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, phone: e.target.value } })} placeholder='Số Điện Thoại' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, email: e.target.value } })} placeholder='Email' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input type='date' onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, dateOfBirth: e.target.value } })} placeholder='Ngày Sinh' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <select onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, sex: Boolean(e.target.value) } })} className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-3'>
                                <option value={null}>Giới Tính</option>
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                            <input onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, cccd: e.target.value } })} placeholder='Căn Cước Công Dân' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input onChange={e => bookingHandler.setBooking({ ...bookingData.booking, patient: { ...bookingData.booking.patient, address: e.target.value } })} placeholder='Địa Chỉ' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                        </div>
                    </div>
                )}
            </div>
            <div className='border-[#cfcfcf] relative py-1 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='pt-2 px-4 gap-3 flex items-start pb-6'>
                    <img src={bookingServiceData.bookingServiceRecord.doctor.image} className='rounded-full w-[50px]' />
                    <div className='flex flex-col items-start gap-1 text-[14px]'>
                        <span className='font-medium'>Dịch Vụ Theo Dõi Sức Khỏe với BS {bookingServiceData.bookingServiceRecord.doctor.fullName}</span>
                        <span className='px-[0.5rem] py-1 rounded-md text-[13px] bg-[#e0eff6]'>{bookingServiceData.bookingServiceRecord.doctor.specialize}</span>
                        <span className='font-medium mt-1'>BS {bookingServiceData.bookingServiceRecord.doctor.fullName}</span>
                    </div>
                    <span className='absolute top-[60px] text-[14px] right-2 font-medium text-[blue]'>{formatMoney(bookingServiceData.bookingServiceRecord.priceList.price)} đ/{bookingServiceData.bookingServiceRecord.priceList.type} </span>
                </div>
            </div>

            <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex justify-end items-center'>
                <button onClick={() => bookingServiceHandler.setCurrentStep(2)} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default BookingInformation
