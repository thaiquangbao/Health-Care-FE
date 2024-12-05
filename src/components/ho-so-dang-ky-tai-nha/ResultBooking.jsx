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

    const handleGoBack = () => {
        router.push('/bac-si-noi-bat')
        globalHandler.reload()
    }

    const handleGoManage = () => {
        router.push('/cuoc-hen-cua-ban')
        globalHandler.reload()
    }


    return (
        <>
            <div className='w-[70%] flex justify-between items-center mt-2'>
                <div className='flex flex-col gap-2 w-[60%]'>
                    <span className='text-[15px] font-space font-semibold'>Thanh Toán Thành Công</span>
                    <span className='text-[14px] font-space'>Cảm ơn bạn đã hoản tất thủ tục đăng ký khám tại nhà với bác sĩ {bookingHomeData.booking?.doctor?.fullName}, hãy chờ bác sĩ chấp nhận cuộc hẹn và khám đúng giờ</span>
                    <div className='relative w-[100%] gap-2 rounded-md flex mt-1'>
                        <button onClick={() => handleGoManage()} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[35px] rounded-lg'>Quản lý cuộc hẹn khám</button>
                        <button onClick={() => handleGoBack()} className='hover:scale-[1.05] transition-all text-[14px] font-medium] px-[1.5rem] text-[#1dcbb6] font-semibold border-[2px] border-[#1dcbb6] h-[35px] rounded-lg'>Trở về trang chủ</button>
                    </div>
                </div>
                <img src='/payment-successfully.png' className='w-[40%]' />
            </div>
        </>
    )
}

export default ResultBooking