import { appointmentContext } from '@/context/AppointmentContext';
import { bookingContext } from '@/context/BookingContext';
import { notifyType } from '@/context/GlobalContext';
import { userContext } from '@/context/UserContext';
import { utilsContext } from '@/context/UtilsContext';
import { api, TypeHTTP } from '@/utils/api';
import { compare2Date, compare2DateTime, convertDateInputToObject, convertDateToDayMonthYearVietNam, generateTimes } from '@/utils/date';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

const Form = ({ visible, hidden }) => {
    const [currentStep, setCurrentStep] = useState(1)
    let times = generateTimes('08:00', '20:00', 60);
    const [date, setDate] = useState()
    const [time, setTime] = useState()
    const [des, setDes] = useState()
    const [doctorRecords, setDoctorRecords] = useState([])
    const [filterDoctorRecords, setFilterDoctorRecords] = useState([])
    const [priceList, setPriceList] = useState()
    const { utilsHandler } = useContext(utilsContext)
    const { userData } = useContext(userContext)
    const { bookingHandler } = useContext(bookingContext)
    const { appointmentHandler } = useContext(appointmentContext)
    const router = useRouter()

    useEffect(() => {
        api({
            type: TypeHTTP.GET,
            path: "/doctorRecords/getAll",
            sendToken: false,
        }).then((res) => {
            setDoctorRecords(res);
        });
        api({
            path: "/price-lists/getAll",
            sendToken: false,
            type: TypeHTTP.GET,
        }).then((res) => {
            setPriceList(
                res.filter((item) => item.type === "Online")[0]
            );
        });
    }, []);

    const checkInput = () => {
        if (!date)
            return false
        if (!time)
            return false
        if (!des)
            return false
        return true
    }

    const refresh = () => {
        setDate()
        setDes()
        setTime()
        setCurrentStep(1)
    }

    const handleSearching = () => {
        const filter = doctorRecords.filter(item => item.schedules.length > 0).filter(item => item.schedules.filter(item1 => compare2Date(item1.date, convertDateInputToObject(date))).filter(item1 => item1.times.filter(item2 => item2.status === '').map(item2 => item2.time).includes(time)).length > 0)
        if (filter.length > 0) {
            setFilterDoctorRecords(filter)
            setCurrentStep(2)
        } else {
            utilsHandler.notify(notifyType.WARNING, 'Không có bác sĩ nào phù hợp với lịch hẹn của bạn')
        }
    }

    const handleCreateAppointment = (dr) => {
        api({ type: TypeHTTP.GET, path: '/appointments/getAll', sendToken: false })
            .then(res => {
                const result = res.filter(item => item.patient._id === userData.user._id).filter(item => item.appointment_date.day === convertDateInputToObject(date).day && item.appointment_date.month === convertDateInputToObject(date).month && item.appointment_date.year === convertDateInputToObject(date).year && item.appointment_date.time === time)[0]
                if (result) {
                    utilsHandler.notify(notifyType.WARNING, 'Bạn không thể đăng ký giờ hẹn này, do đã trùng với lịch hẹn khác')
                } else {
                    const body = {
                        doctor_record_id: dr._id,
                        patient: userData.user ? userData.user._id : null,
                        appointment_date: { ...convertDateInputToObject(date), time },
                        status: "QUEUE",
                        note: "",
                        status_message: 'Đang chờ bác sĩ xác nhận',
                        priceList: priceList,
                        sick: des
                    }
                    bookingHandler.setBooking(body)
                    bookingHandler.setDoctorRecord(dr)
                    appointmentHandler.setDoctorRecord(dr)
                    refresh()
                    hidden()
                    router.push('/ho-so-dang-ky')
                }
            })
    }

    return (
        <div style={visible ? { height: '400px', width: '800px', transition: '0.3s', backgroundImage: 'url(/bg.png)', backgroundSize: 'cover', overflow: 'hidden' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <>
                    <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex'>
                        <div className='min-w-[100%] flex flex-col gap-4 px-4 pt-9'>
                            <span className='font-space font-bold text-[20px]'>Tìm Kiếm Thông Minh</span>
                            <div className='border-[1px] px-4 py-2 border-[#eaeaea] flex flex-col rounded-lg h-[100px] w-full '>
                                <span className='font-space font-semibold text-[15px]'>Thông tin của bạn muốn hẹn với bác sĩ</span>
                                <div className='flex items-center justify-evenly mt-2'>
                                    <input value={date} onChange={e => setDate(e.target.value)} type='date' placeholder='Ngày Sinh' className='text-[13px] mt-1 w-[45%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                    <select onChange={(e) => setTime(e.target.value)} type='text' className='text-[13px] mt-1 w-[45%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' >
                                        <option value={null}>Chọn Giờ Hẹn</option>
                                        {times.map((time, index) => (
                                            <option key={index} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='border-[1px] px-4 py-2 border-[#eaeaea] flex flex-col rounded-lg h-[150px] w-full '>
                                <span className='font-space font-semibold text-[15px]'>Mô tả triệu chứng bệnh của bạn</span>
                                <div className='flex items-center px-6 justify-evenly mt-2'>
                                    <textarea value={des} onChange={e => setDes(e.target.value)} className='border-[1px] focus:outline-none px-2 py-1 h-[100px] border-[#d7d7d7] rounded-lg w-full' />
                                </div>
                            </div>
                        </div>
                        <div className='min-w-[100%] flex flex-col gap-4 px-4 pt-9'>
                            <span className='font-space font-bold text-[20px]'>Các Bác Sĩ Được Đề Xuất ({(date && time) && convertDateToDayMonthYearVietNam({ ...convertDateInputToObject(date), time })})</span>
                            <div className='px-2 py-2 grid grid-cols-4 gap-5 rounded-lg h-[300px] overflow-auto w-full '>
                                {filterDoctorRecords.map((item, index) => (
                                    <div
                                        onClick={() => handleCreateAppointment(item)}
                                        key={index}
                                        className="bg-[white] cursor-pointer h-[220px] shadow-xl shadow-[#35a4ff2a] pt-[5px] overflow-hidden rounded-lg justify-center items-center flex flex-col"
                                    >
                                        <div
                                            style={{
                                                backgroundImage: `url(${item?.doctor?.image})`,
                                                backgroundSize: "cover",
                                            }}
                                            className="px-[1rem] w-[60%] aspect-square rounded-full"
                                        ></div>
                                        <span className="px-[1rem] font-space text-[15px] font-medium mt-[0.5rem]">
                                            BS {item?.doctor?.fullName}
                                        </span>
                                        <div className="px-[1rem] flex items-center scale-[0.9] gap-[1rem] mt-[0.5rem] font-medium">
                                            <div className="flex items-center gap-1">
                                                <i className="bx bxs-calendar-check text-[18px] text-[#5050ff]"></i>
                                                <span className="text-[14px]">
                                                    {item?.examination_call}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <i className="bx bxs-star text-[18px] text-[#5050ff]"></i>
                                                <span className="text-[14px]">
                                                    {item?.assessment}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="px-[1rem] mt-[0.25rem] py-1 rounded-md text-[12px] bg-[#e0eff6]">
                                            Chuyên {item?.doctor.specialize}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <button onClick={() => handleSearching()} style={{ right: (!checkInput() || currentStep !== 1) ? '-120%' : '4px', background: 'linear-gradient(to right, #11998e, #38ef7d)' }} className='text-[white] z-[50] shadow-[#767676] absolute bottom-2 text-[16px] shadow-md rounded-xl px-6 py-2 transition-all cursor-pointer font-semibold'>Tìm Kiếm</button>
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>
    )
}

export default Form