import { bookingServiceContext } from '@/context/BookingServiceContext'
import { userContext } from '@/context/UserContext'
import { convertDateToDayMonthYearTimeObject } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'

const FormSignUpHealth = ({ doctorRecord, hidden }) => {

    const [serviceIndex, setServiceIndex] = useState(0)
    const { bookingServiceData, bookingServiceHandler } = useContext(bookingServiceContext)
    const { userData } = useContext(userContext)
    const router = useRouter()
    const priceLists = [
        {
            type: '3 Tháng',
            price: 1350000
        },
        {
            type: '6 Tháng',
            price: 2300000
        },
        {
            type: '12 Tháng',
            price: 4000000
        }
    ]

    const handleSignUpService = () => {
        if (doctorRecord && userData?.user?.role === 'USER') {
            const body = {
                doctor: {
                    fullName: doctorRecord.doctor.fullName,
                    phone: doctorRecord.doctor.phone,
                    image: doctorRecord.doctor.image,
                    _id: doctorRecord.doctor._id,
                    specialize: doctorRecord.doctor.specialize,
                    email: doctorRecord.doctor.email
                },
                patient: {
                    fullName: userData.user.fullName,
                    phone: userData.user.phone,
                    image: userData.user.image,
                    _id: userData.user._id,
                    dateOfBirth: userData.user.dateOfBirth,
                    sex: userData.user.sex,
                    email: userData.user.email
                },
                priceList: priceLists[serviceIndex - 1],
                status: {
                    status_type: 'QUEUE',
                    message: 'Đang chờ bác sĩ xác nhận'
                },
                date: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
                disMon: [],
                reExaminationDates: []
            }
            bookingServiceHandler.setBookingServiceRecord(body)
            hidden()
            router.push('/ho-so-dang-ky-theo-doi-suc-khoe')
        }
    }

    return (
        <div style={{
            width: doctorRecord ? '70%' : '0',
            height: doctorRecord ? '80%' : '0',
            transition: '0.5s',
            // backgroundImage: `url(https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/prime-plans-bg.svg)`
        }}
            className='bg-cover bg-[white] rounded-xl background-public z-[45] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-[start] overflow-hidden'
        >
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
            {doctorRecord && (
                <div className='flex flex-col w-full h-full p-[2rem] gap-[1rem]'>
                    <div className='grid grid-cols-3 gap-[1rem]'>
                        {priceLists.map((priceList, index) => (
                            <button
                                key={index}
                                onClick={() => setServiceIndex(index + 1)}
                                style={{
                                    background: serviceIndex === index + 1 ? 'linear-gradient(to right, #33007d, #7d01b0' : `white`,
                                }} className='bg-[white] flex flex-col shadow-2xl py-[1rem] items-center cursor-pointer hover:scale-[1.05] transition-all rounded-xl gap-1'>
                                <span
                                    style={{ color: serviceIndex === index + 1 ? 'white' : '#2e0079' }}
                                    className='text-[#2e0079] font-bold text-[20px]'>{priceList.type}</span>
                                <span
                                    style={{ background: serviceIndex === index + 1 ? 'linear-gradient(to right, #f17780, #d93aaf' : 'linear-gradient(to right, #1b2fd6, #9996f6' }}
                                    className='text-[white] font-semibold text-[14px] px-3 py-2 rounded-2xl'
                                >
                                    {formatMoney(priceList.price)} VNĐ
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className='flex flex-col bg-[#33007d] relative rounded-2xl px-3 overflow-hidden'>
                        <div className='h-[50px] w-full bg-[#33007d] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                            <i className='bx bx-check text-[22px]'></i>
                            <span className='text-[14px] font-semibold'>Cập nhật thông tin chỉ số hô hấp mỗi ngày</span>
                        </div>
                        <div className='h-[50px] w-full bg-[#533094] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                            <i className='bx bx-check text-[22px]'></i>
                            <span className='text-[14px] font-semibold'>Liên lạc với bác sĩ thông qua cuộc trò chuyện, số điện thoại </span>
                        </div>
                        <div className='h-[50px] w-full bg-[#33007d] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                            <i className='bx bx-check text-[22px]'></i>
                            <span className='text-[14px] font-semibold'>Cuộc hẹn khám miễn phí</span>
                        </div>
                        <div className='h-[50px] w-full bg-[#533094] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                            <i className='bx bx-check text-[22px]'></i>
                            <span className='text-[14px] font-semibold'>Cập nhật các hình ảnh và triệu chứng mô tả</span>
                        </div>
                        <div className='h-[50px] w-full bg-[#33007d] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                            <i className='bx bx-check text-[22px]'></i>
                            <span className='text-[14px] font-semibold'>Nhận được cảnh báo sức khỏe thông minh</span>
                        </div>
                        <div className='absolute h-full flex flex-col right-[-5px] bg-[white] w-[40%] top-0 rounded-xl overflow-hidden'>
                            <div className='h-[50px] w-full bg-[white] flex items-center justify-center px-3 text-[white]'>
                                <div className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[#33007d]'>
                                    <i className='bx bx-check text-[25px]'></i>
                                </div>
                            </div>
                            <div className='h-[50px] w-full bg-[#f2f3ff] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                <div className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[#33007d]'>
                                    <i className='bx bx-check text-[25px]'></i>
                                </div>
                            </div>
                            <div className='h-[50px] w-full bg-[white] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                <div className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[#33007d]'>
                                    <i className='bx bx-check text-[25px]'></i>
                                </div>
                            </div>
                            <div className='h-[50px] w-full bg-[#f2f3ff] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                <div className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[#33007d]'>
                                    <i className='bx bx-check text-[25px]'></i>
                                </div>
                            </div>
                            <div className='h-[50px] w-full bg-[white] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                <div className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[#33007d]'>
                                    <i className='bx bx-check text-[25px]'></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex justify-end'>
                        <button
                            onClick={() => handleSignUpService()}
                            style={{
                                background: "linear-gradient(to right, #33007d, #533094)",
                                transform: serviceIndex !== 0 ? 'translateX(0)' : 'translateX(150%)'
                            }}
                            className="text-[16px] scale-[0.95] hover:scale-[1] transition-all flex items-center rounded-3xl px-4 gap-1 py-3 cursor-pointer text-[white]"
                        >
                            Đăng Ký Theo Dõi
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormSignUpHealth
