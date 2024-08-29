import { bookingContext } from '@/context/BookingContext'
import { userContext } from '@/context/UserContext'
import { convertDateToDayMonthYear, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import React, { useContext } from 'react'

const ChoosePayment = () => {
    const { bookingData, bookingHandler } = useContext(bookingContext)
    const { userData } = useContext(userContext)

    return (
        <>
            <div className='border-[#cfcfcf] overflow-hidden relative w-[70%] gap-2 mt-6 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex gap-3 py-2 mt-1 items-center px-4 w-full text-[13px] font-medium'>
                    <span className='text-[14px]'>Phương Thức Thanh Toán</span>
                </div>
                <div className='grid grid-cols-2'>
                    <div className='cursor-pointer flex gap-2 p-3 text-[14px] items-center border-[#cfcfcf] border-[1px]'>
                        <img className='w-[60px]' src='https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' />
                        <div className='flex flex-col'>
                            <span className='font-medium'>Thanh Toán Qua Ví MOMO</span>
                            <span className='rounded-md text-[12px]'>Sử dụng app Momo quét mã vạch hoặc nhập thông tin để thanh toán</span>
                        </div>
                    </div>
                    <div className='cursor-pointer flex gap-2 p-3 text-[14px] items-center border-[#cfcfcf] border-[1px]'>
                        <img className='w-[60px]' src='https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' />
                        <div className='flex flex-col'>
                            <span className='font-medium'>Thanh Toán Qua Ví MOMO</span>
                            <span className='rounded-md text-[12px]'>Sử dụng app Momo quét mã vạch hoặc nhập thông tin để thanh toán</span>
                        </div>
                    </div>
                    <div className='cursor-pointer flex gap-2 p-3 text-[14px] items-center border-[#cfcfcf] border-[1px]'>
                        <img className='w-[60px]' src='https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' />
                        <div className='flex flex-col'>
                            <span className='font-medium'>Thanh Toán Qua Ví MOMO</span>
                            <span className='rounded-md text-[12px]'>Sử dụng app Momo quét mã vạch hoặc nhập thông tin để thanh toán</span>
                        </div>
                    </div>
                    <div className='cursor-pointer flex gap-2 p-3 text-[14px] items-center border-[#cfcfcf] border-[1px]'>
                        <img className='w-[60px]' src='https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' />
                        <div className='flex flex-col'>
                            <span className='font-medium'>Thanh Toán Qua Ví MOMO</span>
                            <span className='rounded-md text-[12px]'>Sử dụng app Momo quét mã vạch hoặc nhập thông tin để thanh toán</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='border-[#cfcfcf] relative py-1 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex gap-3 py-2 items-center px-4 w-full border-[#cfcfcf] border-b-[1px] text-[13px] font-medium'>
                    <span className='text-[14px]'>Giờ Hẹn:</span>
                    <span className='px-2 py-1 bg-[blue] text-[white] rounded-md'>{bookingData.booking?.appointment_date.time}</span>
                    <span className='px-2 py-1 bg-[#46e199] text-[white] rounded-md'>{convertDateToDayMonthYear(bookingData.booking?.appointment_date)}</span>
                </div>
                <div className='pt-2 px-4 gap-3 flex items-start pb-6'>
                    <img src={bookingData.doctorRecord?.doctor.image} className='rounded-full w-[60px]' />
                    <div className='flex flex-col items-start gap-1 text-[14px]'>
                        <span className='font-medium'>Khám bệnh trực tuyến với BS {bookingData.doctorRecord?.doctor.fullName}</span>
                        <span className='mt-3 px-[0.5rem] py-1 rounded-md text-[13px] bg-[#e0eff6]'>Chuyên Khoa {bookingData.doctorRecord?.doctor.specialize}</span>
                        <span className='font-medium mt-1'>BS {bookingData.doctorRecord?.doctor.fullName}</span>
                    </div>
                    <span className='absolute top-[60px] text-[14px] right-2 font-medium text-[blue]'>{formatMoney(bookingData.booking?.priceList.price)} đ</span>
                </div>
            </div>
            <div className='border-[#cfcfcf] relative py-3 px-5 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex justify-between w-full text-[14px] font-medium'>
                    <span className=''>Giá dịch vụ</span>
                    <span>{formatMoney(bookingData.booking?.priceList.price)} đ</span>
                </div>
                <div className='flex justify-between w-full text-[14px] font-medium'>
                    <span className='text-[15px]'>Tổng Thanh Toán</span>
                    <span className='text-[red] text-[16px]'>{formatMoney(bookingData.booking?.priceList.price)} đ</span>
                </div>
            </div>
            <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex flex-col items-end'>
                <button onClick={() => bookingHandler.setCurrentStep(3)} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default ChoosePayment