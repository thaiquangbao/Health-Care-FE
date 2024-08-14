'use client'

import BookingInformation from '@/components/ho-so-dang-ky/BookingInformation'
import ChoosePayment from '@/components/ho-so-dang-ky/ChoosePayment'
import ResultBooking from '@/components/ho-so-dang-ky/ResultBooking'
import Navbar from '@/components/navbar'
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
        <div className="w-full min-h-screen pb-4 flex flex-col pt-[1%] px-[5%] background-public">
            <Navbar />
            {bookingData.booking && (
                <>
                    {bookingData.currentStep === 1 ?
                        (<BookingInformation />)
                        :
                        bookingData.currentStep === 2 ?
                            (<ChoosePayment />)
                            :
                            (<ResultBooking />)
                    }
                </>
            )}
        </div >
    )
}

export default HoSoDangKy