
import { bookingServiceContext } from '@/context/BookingServiceContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { api, TypeHTTP } from '@/utils/api'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

const ResultBooking = () => {

    const { bookingServiceData, bookingServiceHandler } = useContext(bookingServiceContext)
    const { globalHandler } = useContext(globalContext)
    const router = useRouter()

    const handleSubmit = () => {
        api({ type: TypeHTTP.POST, path: '/healthLogBooks/save', sendToken: true, body: bookingServiceData.bookingServiceRecord })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Đăng Ký Lịch Hẹn Thành Công")
                router.push('/bac-si-noi-bat')
                globalHandler.reload()
            })
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
