import { bookingHomeContext } from '@/context/BookingHomeContext'
import { convertDateToDayMonthYearVietNam } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

const PaymentNotification = ({ data, hidden }) => {

    const { bookingHomeHandler } = useContext(bookingHomeContext)
    const router = useRouter()

    return (
        <div className='z-[41] flex bg-[white] overflow-hidden rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' style={{ transition: '0.5s', width: data.length > 0 ? 800 : 0, height: data.length > 0 ? 'auto' : 0 }}>
            <div style={{ transition: '0.5s' }} className='flex-col px-[1.5rem] py-[1rem] flex w-[100%]'>
                <span className='text-[20px] font-bold'>Bác sĩ đã chấp nhận lịch hẹn khám tại nhà</span>
                <span>Bạn hãy thanh toán để xác nhận cuộc hẹn</span>
                <div className='w-full flex flex-col gap-2 mt-[1rem]'>
                    {data.map((home, index) => (
                        <div onClick={() => {
                            bookingHomeHandler.setBooking(home)
                            router.push('/ho-so-dang-ky-tai-nha')
                            hidden()
                        }} key={index} className='flex transition-all bg-[white] hover:bg-[#efefef] justify-between p-2 border-[1px] border-[#d2d2d2] cursor-pointer rounded-lg'>
                            <div className='flex flex-col'>
                                <span>{convertDateToDayMonthYearVietNam(home.appointment_date)}</span>
                                <span>Hẹn khám tại nhà</span>
                            </div>
                            <div>
                                <span></span>
                                <span className='text-[14px]'>Tổng tiền: {formatMoney(home.price_list.price)} đ</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={() => hidden()}>
                <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
            </button>
        </div>
    )
}

export default PaymentNotification