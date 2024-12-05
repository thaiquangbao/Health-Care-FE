'use client'
import Navbar from '@/components/navbar'
import { appointmentContext } from '@/context/AppointmentContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatMoney, removeDiacritics, sicks } from '@/utils/other'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const BenhLy = () => {

    const param = useParams()
    const { benhly } = param
    const [sick, setSick] = useState()
    const [priceList, setPriceList] = useState()
    const router = useRouter()
    const pathname = usePathname()
    const [doctorRecords, setDoctorRecords] = useState([])
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const tongQuat = {
        title: 'Khám Tổng Quát Tim Mạch',
        description: 'Dù cho bệnh trái gió trở trời, hay nhiễm khuẩn thì các Bác sĩ giàu kinh nghiệm của Jio Health luôn sẵn lòng khám bệnh ngay tại phòng khám, giúp bạn phục hồi nhanh chóng.',
    }

    useEffect(() => {
        api({ type: TypeHTTP.GET, path: '/doctorRecords/getAll', sendToken: false })
            .then(res => {
                // appointmentHandler.setDoctorRecords(res)
                setDoctorRecords(res)
            })
    }, [benhly])

    useEffect(() => {
        api({ path: '/sicks/get-all', sendToken: false, type: TypeHTTP.GET })
            .then(res => {
                appointmentHandler.setSicks(res)
            })
    }, [])

    useEffect(() => {
        const sickFound = appointmentData.sicks.filter(item => removeDiacritics(item.title).toLowerCase().split(' ').join('-') === benhly)[0]
        setSick(sickFound)
        api({ path: '/price-lists/getAll', sendToken: false, type: TypeHTTP.GET })
            .then(res => {
                setPriceList(res.filter(item => item.type === 'Online')[0])
            })
    }, [benhly, appointmentData.sicks])

    function scrollToTarget() {
        const element = document.getElementById('target');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col pb-[3%] pt-[60px] background-public">
            <Navbar />
            <div className="flex z-0 relative text-[30px] font-bold text-[#171717] w-[100%] items-center">
                <img className='opacity-0' src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/general-care-bg.svg' width={'100%'} />
                <img className='absolute z-[3]' src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/cardiology-person.png?v=1' />
                <img className='absolute z-[4]' src='https://cdn.jiohealth.com/jio-website/home-page/jio-website-v2.2/cardiology-circle.svg?v=1' />
                <div className='absolute w-[40%] z-[5] flex flex-col gap-1 top-[50%] translate-y-[-50%] left-12'>
                    <h2 className="text-transparent text-[35px] bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-red-500">
                        {pathname.includes('kham-tong-quat') ? tongQuat.title : sick?.title}
                    </h2>
                    <span></span>
                    <p className='text-[17px] font-medium text-[#404040]'>{pathname.includes('kham-tong-quat') ? tongQuat.description : sick?.description}</p>
                    <div className='w-[90%] mt-2 rounded-lg flex justify-between'>
                        <button onClick={() => scrollToTarget()} style={{ background: 'linear-gradient(to right, #11998e, #38ef7d)' }} className='text-[16px] scale-[0.95] rounded-3xl px-6 py-3 cursor-pointer text-[white]'>Đặt Khám Ngay</button>
                    </div>
                </div>
            </div>
            <div className="flex mt-[4rem] flex-col z-0 relative text-[25px] font-bold text-[#171717] w-[100%] items-center">
                <span>Đội Ngũ Bác Sĩ</span>
            </div>
            <div id='target'></div>
            <div className='w-full px-[5%] mt-[2rem] grid grid-cols-4 gap-5 pb-[2rem]'>
                {doctorRecords.map((item, index) => (
                    <div key={index} className='bg-[white] pt-[1rem] overflow-hidden rounded-lg shadow-lg justify-center items-center flex flex-col'>
                        <div style={{ backgroundImage: `url(${item?.doctor?.image})`, backgroundSize: 'cover' }} className='px-[1rem] w-[70%] aspect-square rounded-full'></div>
                        <span className='px-[1rem] font-medium mt-[1rem]'>BS {item?.doctor?.fullName}</span>
                        <div className='px-[1rem] flex items-center gap-[1rem] mt-[0.5rem] font-medium'>
                            <div className='flex items-center gap-1'>
                                <i className='bx bxs-calendar-check text-[18px] text-[#5050ff]' ></i>
                                <span className='text-[14px]'>{item?.examination_call}</span>
                            </div>
                            <div className='flex items-center gap-1'>
                                <i className='bx bxs-star text-[18px] text-[#5050ff]' ></i>
                                <span className='text-[14px]'>{item?.assessment.toFixed(1)}</span>
                            </div>
                        </div>
                        <span className='px-[1rem] mt-[1rem] py-1 rounded-md text-[14px] bg-[#e0eff6]'>Chuyên {item?.doctor.specialize}</span>
                        <button onClick={() => {
                            appointmentHandler.setDoctorRecord(item)
                            appointmentHandler.setPriceList(priceList)
                            setTimeout(() => {
                                appointmentHandler.showFormBooking(pathname.includes('kham-tong-quat') ? tongQuat.title : sick?.title)
                            }, 500);
                        }} className='mt-[1rem] flex items-center justify-center gap-1 text-[white] bg-[#5050ff] font-medium text-[15px] w-full'>
                            <i className='bx bxs-calendar text-[23px] py-3' ></i>
                            <span>Đặt Khám</span>
                        </button>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default BenhLy