'use client'

import BookingInformation from '@/components/ho-so-dang-ky/BookingInformation'
import ChoosePayment from '@/components/ho-so-dang-ky/ChoosePayment'
import ResultBooking from '@/components/ho-so-dang-ky/ResultBooking'
import Navbar from '@/components/navbar'
import Processing from '@/components/Processing'
import { appointmentContext } from '@/context/AppointmentContext'
import { bookingContext } from '@/context/BookingContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYear, convertDateToDayMonthYearMinuteHour, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const HoSoDangKy = () => {

    const { bookingData, bookingHandler } = useContext(bookingContext)
    const router = useRouter()
    const [customer, setCustomer] = useState()

    useEffect(() => {
        if (bookingData.booking) {

        } else {
            router.push('/bac-si-noi-bat')
        }
    }, [bookingData.booking])

    useEffect(() => {
        if (bookingData.booking) {
            api({ type: TypeHTTP.GET, path: '/doctorRecords/getAll', sendToken: false })
                .then(res => {
                    res.forEach(item => {
                        if (item.doctor?.id + '' === bookingData.booking.doctor) {
                            bookingHandler.setDoctorRecord(item)
                        }
                    })
                })
        }
    }, [bookingData.booking])

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
                    <Processing height={'5px'} width={'100%'} total={2} process={bookingData.currentStep - 1} />
                </div>
                {bookingData.booking && (
                    <>
                        {bookingData.currentStep === 1 ?
                            (<BookingInformation setCustomer={setCustomer} />)
                            :
                            bookingData.currentStep === 2 ?
                                (<ChoosePayment customer={customer} />)
                                :
                                (<ResultBooking />)
                        }
                    </>
                )}
            </div>
        </div >
    )
}

export default HoSoDangKy