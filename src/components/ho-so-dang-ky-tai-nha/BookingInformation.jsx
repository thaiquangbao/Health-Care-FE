import { bookingContext } from '@/context/BookingContext'
import { bookingHomeContext } from '@/context/BookingHomeContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { convertDateToDayMonthYear, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import React, { useContext, useEffect, useRef, useState } from 'react'

const BookingInformation = () => {
    const { globalHandler } = useContext(globalContext)
    const { bookingHomeData, bookingHomeHandler } = useContext(bookingHomeContext)
    const { userData } = useContext(userContext)
    const inputRef = useRef()

    function checkIntegerString(value) {
        const parsedValue = Number(value);
        if (!isNaN(parsedValue) && Number.isInteger(parsedValue)) {
            return true
        } else {
            return false
        }
    }

    const handleChangeImage = (e) => {
        const files = Array.from(e.target.files);
        const filesFormat = files.map(file => {
            const blobURL = URL.createObjectURL(file);
            return {
                url: blobURL,
                file
            }
        })
        e.target.value = ''
        bookingHomeHandler.setImages([...bookingHomeData.images, ...filesFormat])
    }

    const handleNextStep = () => {
        bookingHomeHandler.setCurrentStep(2)
    }

    return (
        <>
            <div className='border-[#cfcfcf] px-4 py-2 w-[70%] gap-3 rounded-md border-[1px] mt-7 flex items-center'>
                {userData.user ? ( 
                    <>
                        <img src={userData.user ? userData.user?.image : 'https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0'} className='rounded-full w-[50px]' />
                        <div className='flex flex-col text-[14px]'>
                            <span>Bệnh Nhân</span>
                            <span className='font-medium'>{userData.user?.fullName}</span>
                        </div>
                    </>
                ) : (
                    <div className='flex flex-col w-full text-[14px] py-2'>
                        <span className='font-semibold text-[16px]'>Thông Tin Bệnh Nhân</span>
                        <div className='grid gap-1 grid-cols-2 w-[100%] items-center content-center'>
                            <input onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, fullName: e.target.value } })} placeholder='Họ Và Tên' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, phone: e.target.value } })} placeholder='Số Điện Thoại' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, email: e.target.value } })} placeholder='Email' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input type='date' onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, dateOfBirth: e.target.value } })} placeholder='Ngày Sinh' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <select onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, sex: Boolean(e.target.value) } })} className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-3'>
                                <option value={null}>Giới Tính</option>
                                <option value={true}>Nam</option>
                                <option value={false}>Nữ</option>
                            </select>
                            <input onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, cccd: e.target.value } })} placeholder='Căn Cước Công Dân' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input onChange={e => bookingHandler.setBooking({ ...bookingHomeData.booking, patient: { ...bookingHomeData.booking.patient, address: e.target.value } })} placeholder='Địa Chỉ' className='w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                        </div>
                    </div>
                )}
            </div>
            <div className='border-[#cfcfcf] relative py-1 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex gap-3 py-2 items-center px-4 w-full border-[#cfcfcf] border-b-[1px] text-[13px] font-medium'>
                    <span className='text-[14px]'>Giờ Hẹn:</span>
                    <span className='px-2 py-1 bg-[blue] text-[white] rounded-md'>{bookingHomeData.booking?.appointment_date.time}</span>
                    <span className='px-2 py-1 bg-[#46e199] text-[white] rounded-md'>{convertDateToDayMonthYear(bookingHomeData.booking?.appointment_date)}</span>
                </div>
                <div className='pt-2 px-4 gap-3 flex items-start pb-6'>
                    <img src={bookingHomeData.booking?.doctor?.image} className='rounded-full w-[50px]' />
                    <div className='flex flex-col items-start gap-1 text-[14px]'>
                        <span className='font-medium'>Khám bệnh tại nhà với BS {bookingHomeData.booking?.doctor?.fullName}</span>
                        <span className='mt-3 px-[0.5rem] py-1 rounded-md text-[13px] bg-[#e0eff6]'>Chuyên Khoa {bookingHomeData.booking?.doctor?.specialize}</span>
                        <span className='font-medium mt-1'>BS {bookingHomeData.booking?.doctor?.fullName}</span>
                    </div> 
                    {/* sửa ở đây */}
                    <span className='absolute top-[60px] text-[14px] right-2 font-medium text-[blue]'>{formatMoney(bookingHomeData.booking?.price_list?.price)} đ</span> 
                </div>
            </div>
            <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex items-center'>
                <button onClick={() => handleNextStep()} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default BookingInformation