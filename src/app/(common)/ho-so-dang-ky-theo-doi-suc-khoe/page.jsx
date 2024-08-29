'use client'
import BookingInformation from '@/components/ho-so-dang-ky-theo-doi/BookingInformation'
import ChoosePayment from '@/components/ho-so-dang-ky-theo-doi/ChoosePayment'
import ResultBooking from '@/components/ho-so-dang-ky-theo-doi/ResultBooking'
import Navbar from '@/components/navbar'
import Processing from '@/components/Processing'
import { bookingServiceContext } from '@/context/BookingServiceContext'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const HoSoDangKyTheoDoi = () => {

    const { bookingServiceData, bookingServiceHandler } = useContext(bookingServiceContext)
    const router = useRouter()

    useEffect(() => {
        if (!bookingServiceData.bookingServiceRecord) {
            router.push('/bac-si-noi-bat')
        }
    }, [bookingServiceData.bookingServiceRecord])

    return (
        <div className="w-full min-h-screen pb-4 flex flex-col pt-[60px] px-[5%] background-public">
            <Navbar />
            <div className='flex flex-col gap-2 items-center mt-6 px-[6rem]'>
                <div className='border-[#cbcbcb] flex items-center justify-center pb-2 border-b-[1px] w-full'>
                    <span className='font-medium text-[17px]'>Thông Tin Đăng Ký Dịch Vụ Theo Dõi Sức Khỏe</span>
                </div>
                <div className='flex mt-4 flex-col gap-2 w-[70%]'>
                    <div className='flex justify-between'>
                        <span className='text-[14px]'>Thông tin dịch vụ</span>
                        <span className='text-[14px]'>Phương thức thanh toán</span>
                        <span className='text-[14px]'>Hoàn thành thanh toán</span>
                    </div>
                    <Processing height={'5px'} width={'100%'} total={2} process={bookingServiceData.currentStep - 1} />
                </div>
                {bookingServiceData.bookingServiceRecord && (
                    <>
                        {bookingServiceData.currentStep === 1 ?
                            (<BookingInformation />)
                            :
                            bookingServiceData.currentStep === 2 ?
                                (<ChoosePayment />)
                                :
                                (<ResultBooking />)
                        }
                    </>
                )}
            </div>
        </div >
    )
}

export default HoSoDangKyTheoDoi