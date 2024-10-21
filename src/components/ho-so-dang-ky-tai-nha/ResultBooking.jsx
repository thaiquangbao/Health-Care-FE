import { appointmentContext } from '@/context/AppointmentContext'
import { bookingContext } from '@/context/BookingContext'
import { bookingHomeContext } from '@/context/BookingHomeContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYear, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

const ResultBooking = () => {
    const { bookingHomeData, bookingHomeHandler } = useContext(bookingHomeContext)
    const { userData } = useContext(userContext)
    const { globalHandler } = useContext(globalContext)
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const router = useRouter()

    const handleSubmit = () => {
        if (userData.user) {
            // const body = {
            //     _id: bookingHomeData.booking._id,
            //     processAppointment: 2,
            //     status: {
            //         status_type: "ACCEPTED",
            //         message: "Bệnh nhân đã thanh toán",
            //     },
            // }
            // globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
            // api({ path: '/appointmentHomes/payment', body, sendToken: true, type: TypeHTTP.POST })
            //     .then((res => {
            //         globalHandler.notify(notifyType.SUCCESS, 'Đã thanh toán thành công')
            //         globalHandler.reload()
            //     }))
            globalHandler.notify(notifyType.SUCCESS, 'Đã thanh toán thành công')
            globalHandler.reload()
        }

    }

    return (
        <>
            <div className='border-[#cfcfcf] overflow-hidden relative w-[70%] gap-2 mt-6 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex gap-3 py-2 mt-1 border-[#cfcfcf] border-b-[1px] items-center px-4 w-full text-[13px] font-medium'>
                    <span className='text-[14px]'>Trạng Thái Thanh Toán</span>
                </div>
                <div className='grid grid-cols-2'>
                    Thanh Toán Thành Công
                </div>
            </div>
            <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex flex-col items-end'>
                <button onClick={() => handleSubmit()} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Hoàn Tất</button>
            </div>
        </>
    )
}

export default ResultBooking