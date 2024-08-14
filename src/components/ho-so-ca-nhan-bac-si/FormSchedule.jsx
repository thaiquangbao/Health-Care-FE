import { appointmentContext } from '@/context/AppointmentContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { compare2Date, compareDate1GetterThanDate2, convertDateToDayMonthYearObject, formatVietnameseDate, generateTimes } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormSchedule = ({ visible, hidden, day }) => {
    const [currentStep, setCurrentStep] = useState(1)
    let times = generateTimes('08:00', '20:00', 30);
    const [doctorRecord, setDoctorRecord] = useState()
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const { userHandler } = useContext(userContext)

    useEffect(() => {
        setDoctorRecord(appointmentData.doctorRecord)
    }, [visible])

    const checkSchedule = (time) => {
        for (let i = 0; i < doctorRecord?.schedules.length; i++) {
            const scheduleItem = doctorRecord?.schedules[i]
            const date = scheduleItem.date
            if (date.month === day.month && date.year === day.year && date.day === day.day) {
                for (let j = 0; j < scheduleItem.times.length; j++) {
                    const timeItem = scheduleItem.times[j]
                    if (timeItem.time === time) {
                        if (timeItem.status !== '') {
                            return 2
                        } else
                            return 1
                    }
                }
            }
        }
        return 0
    }

    const handleTime = (time1, booked) => {
        let record = JSON.parse(JSON.stringify(doctorRecord))
        let currentDay = appointmentData.currentDay
        const schedule = record.schedules.filter(item => (item.date.month === currentDay.month && item.date.day === currentDay.day && item.date.year === currentDay.year))[0]
        if (schedule) {
            if (schedule.times.map(item => item.time).includes(time1)) {
                // remove
                if (booked === false) {
                    schedule.times = schedule.times.filter(item => item.time !== time1)
                    setDoctorRecord(record)
                } else {
                    userHandler.notify(notifyType.WARNING, 'Bạn không thể hủy giờ hẹn đã được bệnh nhân đặt')
                }
            } else {
                // add
                schedule.times.push(
                    {
                        time: time1,
                        status: '',
                        price: 0
                    }
                )
                setDoctorRecord(record)
            }
        } else {
            // add
            setDoctorRecord({
                ...record, schedules: [
                    ...record.schedules,
                    {
                        date: currentDay,
                        times: [
                            {
                                time: time1,
                                status: '',
                                price: 0
                            }
                        ]
                    }
                ]
            })
        }
    }

    const handleUpdate = () => {
        const body = {
            ...doctorRecord, doctor: appointmentData.doctorRecord.doctor.id
        }
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', body, sendToken: false })
            .then(res => {
                appointmentHandler.setDoctorRecord({ ...res, doctor: appointmentData.doctorRecord.doctor })
                hidden()
            })
    }

    return (
        <div style={visible ? { height: 'auto', width: '60%', transition: '0.3s' } : { height: 0, width: 0, transition: '0.3s' }} className='z-[45] w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex px-8 py-4 flex-col'>
                    <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                    <span className='text-[17px] font-medium text-[#1c1c1c]'>{formatVietnameseDate(day)}</span>
                    <span className='text-[15px] mt-4 font-medium'>Giờ Hẹn</span>
                    <div className='grid grid-cols-8 gap-2 mt-2'>
                        {times.map((time, index) => {
                            if (compare2Date(convertDateToDayMonthYearObject(new Date().toISOString()), day)) {
                                if (new Date().getHours() + 2 >= Number(time.split(':')[0])) {
                                    // return <div key={index} className={`px-4 flex item-center justify-center py-2 transition-all border-[1px] border-[#999] text-[13px] font-medium bg-[#b7b7b7] rounded-md`}>{time}</div>
                                } else {
                                    return <button key={index} onClick={() => handleTime(time, checkSchedule(time) === 2 ? true : false)} style={{ backgroundColor: checkSchedule(time) === 0 ? 'white' : checkSchedule(time) === 1 ? '#eaeded' : '#ffffee' }} className={`px-4 py-2 transition-all cursor-pointer border-[1px] border-[#999] text-[13px] font-medium bg-[white] rounded-md`}>{time}</button>
                                }
                            } else {
                                return <button key={index} onClick={() => handleTime(time, checkSchedule(time) === 2 ? true : false)} style={{ backgroundColor: checkSchedule(time) === 0 ? 'white' : checkSchedule(time) === 1 ? '#eaeded' : '#ffffee' }} className={`px-4 py-2 transition-all cursor-pointer border-[1px] border-[#999] text-[13px] font-medium bg-[white] rounded-md`}>{time}</button>
                            }
                        })}
                    </div>
                    <div className='flex w-full justify-end mt-3'>
                        <button onClick={() => handleUpdate()} className='text-[white] bg-[blue] w-[200px] py-2 rounded-md font-medium text-[14px]'>Cập Nhật</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormSchedule