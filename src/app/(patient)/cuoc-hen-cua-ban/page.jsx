'use client'
import Navbar from '@/components/navbar'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { compare2Date, convertDateToDayMonthYearObject, convertDateToDayMonthYearVietNam, isWithinTenMinutes, sortByAppointmentDate } from '@/utils/date'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'

const CuocHenCuaBan = () => {

    const { userData } = useContext(userContext)
    const { globalHandler } = useContext(globalContext)
    const [appointments, setAppointments] = useState([])
    const [doctorRecords, setDoctorRecords] = useState([])
    const [type, setType] = useState('1')
    const [time, setTime] = useState(new Date().getHours() + ':' + new Date().getMinutes())
    const intervalRef = useRef()
    const [displayConnect, setDisplayConnect] = useState(false)
    const router = useRouter()

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTime(new Date().getHours() + ':' + new Date().getMinutes())
        }, 60000);
    }, [])

    useEffect(() => {
        if (appointments.length > 0) {
            const theFirstAppointment = sortByAppointmentDate(appointments)[0]
            if (compare2Date(convertDateToDayMonthYearObject(new Date().toISOString()), theFirstAppointment.appointment_date)) {
                if (isWithinTenMinutes(theFirstAppointment.appointment_date.time, time)) {
                    setDisplayConnect(true)
                }
            }
        }
    }, [appointments, time])

    useEffect(() => {
        if (userData.user) {
            api({ type: TypeHTTP.GET, path: '/appointments/getAll', sendToken: false })
                .then(res => {
                    setAppointments(res.filter(item => item.patient._id === userData.user._id).reverse())
                })
            api({ type: TypeHTTP.GET, path: '/doctorRecords/getAll', sendToken: false })
                .then(res => {
                    setDoctorRecords(res)
                })
        }
    }, [userData.user])

    const handleCancelAppointment = (appointment) => {
        const body = {
            _id: appointment._id,
            status: 'CANCELED',
            status_message: 'Bệnh nhân đã hủy cuộc hẹn'
        }
        globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
        api({ sendToken: true, path: '/appointments/doctor-reject', type: TypeHTTP.POST, body: body })
            .then(res => {
                let record = JSON.parse(JSON.stringify(doctorRecords.filter(item => item._id === appointment.doctor_record_id)[0]))
                let schedule = record.schedules.filter(item => item.date.day === appointment.appointment_date.day && item.date.month === appointment.appointment_date.month && item.date.year === appointment.appointment_date.year)[0]
                let time = schedule.times.filter(item => item.time === appointment.appointment_date.time)[0]
                time.status = ''
                api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
                    .then(res1 => {
                        setAppointments(prev => prev.map(item => {
                            if (item._id === res._id) {
                                return res
                            }
                            return item
                        }))
                        globalHandler.notify(notifyType.SUCCESS, 'Đã hủy cuộc hẹn')
                    })
            })
    }

    return (
        <div className="w-full min-h-screen flex flex-col pt-[1%] px-[5%] background-public">
            <Navbar />
            <div className='w-full mt-4 flex flex-col gap-1 px-16 text-[#2a2a2a]'>
                <div className='my-2 flex justify-between items-end'>
                    <div className=''>
                        <h2 className='text-[23px] font-semibold flex items-end gap-3'>Chào {userData.user?.fullName} <img src='/hand.png' width={'30px'} /></h2>
                        <span className='font-medium text-[16px]'>Tư vấn với các bác sĩ để nhận lời khuyên tốt nhất</span>
                    </div>
                    {/* <select onChange={(e) => setType(e.target.value)} className='px-4 py-2 text-[14px] shadow-lg focus:outline-0 rounded-md font-medium'>
                        <option value={1}>Hôm Nay</option>
                        <option value={2}>Ngày Mai</option>
                        <option value={3}>Tuần Này</option>
                        <option value={4}>Tháng Này</option>
                        <option value={5}>Tháng Sau</option>
                    </select> */}
                </div>
                <div className='w-full max-h-[500px] mt-4 overflow-y-auto relative'>
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="w-[5%] py-3 text-center">
                                    #
                                </th>
                                <th scope="col" className="w-[15%] py-3">
                                    Bác Sĩ
                                </th>
                                <th scope="col" className="w-[20%] py-3">
                                    Trạng Thái
                                </th>
                                <th scope="col" className="w-[23%] py-3">
                                    Thời Gian Cuộc Hẹn
                                </th>
                                <th scope="col" className="w-[20%] py-3">
                                    Ghi Chú Của Bạn
                                </th>
                                <th scope="col" className="w-[17%] py-3 text-center">
                                    Các Chức Năng
                                </th>
                            </tr>
                        </thead>
                        <tbody className=' w-[full] bg-black font-medium'>
                            {sortByAppointmentDate(appointments).map((appointment, index) => (
                                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-4 text-center font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="py-4 text-[15px]">
                                        BS. {doctorRecords.filter(item => item._id === appointment.doctor_record_id)[0].doctor.fullName}
                                    </td>
                                    <td style={{ color: appointment.status === 'QUEUE' ? 'black' : appointment.status === 'ACCEPTED' ? 'green' : 'red' }} className="py-4">
                                        {appointment.status_message}
                                    </td>
                                    <td className="py-4">
                                        {`${convertDateToDayMonthYearVietNam(appointment.appointment_date)}`}
                                    </td>
                                    <td className="py-4">
                                        {appointment.note}
                                    </td>
                                    <td className="py-4 flex gap-2 items-center justify-center">
                                        {!['CANCELED', 'ACCEPTED', 'REJECTED'].includes(appointment.status) && (
                                            <button onClick={() => handleCancelAppointment(appointment)} className='hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Hủy Cuộc Hẹn</button>
                                        )}
                                        {(index === 0 && displayConnect === true && appointment.status === 'ACCEPTED') && (
                                            <Link href={`http://127.0.0.1:3000/zero/${appointment._id}`}>
                                                <button className='hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Tham Gia Cuộc Hẹn</button>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* {appointments.length === 0 && (
                        <div className='w-full flex items-center justify-center my-10 text-[18px] font-medium'>
                            Không có cuộc hẹn khám trong hôm nay
                        </div>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default CuocHenCuaBan