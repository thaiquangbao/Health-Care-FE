
import { bookingServiceContext } from '@/context/BookingServiceContext'
import { formatMoney } from '@/utils/other'
import React, { useContext } from 'react'

const ChoosePayment = () => {
    const { bookingServiceData, bookingServiceHandler } = useContext(bookingServiceContext)

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
            <div className='border-[#cfcfcf] relative py-3 px-5 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex justify-between w-full text-[14px] font-medium'>
                    <span className=''>Giá dịch vụ</span>
                    <span>{formatMoney(bookingServiceData.bookingServiceRecord.priceList.price)} đ</span>
                </div>
                <div className='flex justify-between w-full text-[14px] font-medium'>
                    <span className='text-[15px]'>Tổng Thanh Toán</span>
                    <span className='text-[red] text-[16px]'>{formatMoney(bookingServiceData.bookingServiceRecord.priceList.price)} đ</span>
                </div>
            </div>
            <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex flex-col items-end'>
                <button onClick={() => bookingServiceHandler.setCurrentStep(3)} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Bước Tiếp Theo</button>
            </div>
        </>
    )
}

export default ChoosePayment