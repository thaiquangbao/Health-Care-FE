'use client'

import BookingInformation from '@/components/ho-so-dang-ky-tai-nha/BookingInformation'
import ChoosePayment from '@/components/ho-so-dang-ky-tai-nha/ChoosePayment'
import ResultBooking from '@/components/ho-so-dang-ky-tai-nha/ResultBooking'
import Navbar from '@/components/navbar'
import Processing from '@/components/Processing'
import { bookingHomeContext } from '@/context/BookingHomeContext'
import { api, TypeHTTP } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const HoSoDangKyTaiNha = () => {

    const { bookingHomeData, bookingHomeHandler } = useContext(bookingHomeContext)
    const router = useRouter()

    useEffect(() => {
        if (bookingHomeData.booking) {

        } else {
            router.push('/bac-si-noi-bat')
        }
    }, [bookingHomeData.booking])

    useEffect(() => {
        if (bookingHomeData.booking) {
            console.log(bookingHomeData.booking)
            api({ type: TypeHTTP.GET, path: '/doctorRecords/getAll', sendToken: false })
                .then(res => {
                    res.forEach(item => {
                        if (item._id + '' === bookingHomeData.booking.doctor_record_id) {
                            bookingHomeHandler.setDoctorRecord(item)
                        }
                    })
                })
        }
    }, [bookingHomeData.booking])

    return (
        <div className="w-full min-h-screen pb-4 flex flex-col pt-[60px] px-[5%] background-public">
            <Navbar />
            <div className='flex flex-col gap-2 items-center mt-6 px-[6rem]'>
                <div className='border-[#cbcbcb] flex items-center justify-center pb-2 border-b-[1px] w-full'>
                    <span className='font-medium text-[17px]'>Thông Tin Đặt Khám</span>
                </div>
                <div className='flex mt-4 flex-col gap-2 w-[70%]'>
                    <div className='flex justify-between'>
                        <span className='text-[14px]'>Thông tin đặt khám</span>
                        <span className='text-[14px]'>Phương thức thanh toán</span>
                        <span className='text-[14px]'>Hoàn thành đặt khám</span>
                    </div>
                    <Processing height={'5px'} width={'100%'} total={2} process={bookingHomeData.currentStep - 1} />
                </div>
                {bookingHomeData.booking && (
                    <>
                        {bookingHomeData.currentStep === 1 ?
                            (<BookingInformation />)
                            :
                            bookingHomeData.currentStep === 2 ?
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

export default HoSoDangKyTaiNha