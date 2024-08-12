import { appointmentContext } from '@/context/AppointmentContext'
import { api, TypeHTTP } from '@/utils/api'
import { formatVietnameseDate, generateTimes } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormDetailTimeForHaveSchedule = ({ visible, hidden, schedule }) => {

    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const [price, setPrice] = useState()

    useEffect(() => {
        if (schedule) {
            setPrice(schedule.time.price)
        }
    }, [schedule])

    const handleUpdateSchedule = () => {
        let doctorRecord = appointmentData.doctorRecord
        doctorRecord.schedules.forEach(item => {
            if (item.date.month === schedule.date.month && item.date.year === schedule.date.year && item.date.day === schedule.date.day) {
                const time = item.times.filter(time => time.time === schedule.time.time)[0]
                time.price = price
            }
        })
        const body = {
            ...doctorRecord, doctor: appointmentData.doctorRecord.doctor.id
        }
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', body, sendToken: true })
            .then(res => {
                appointmentHandler.setDoctorRecord({ ...res, doctor: appointmentData.doctorRecord.doctor })
                hidden()
                appointmentHandler.showFormSchedule(schedule.date)
            })
    }

    const deleteTimeSchedule = () => {
        let doctorRecord = appointmentData.doctorRecord
        doctorRecord.schedules.forEach(item => {
            if (item.date.month === schedule.date.month && item.date.year === schedule.date.year && item.date.day === schedule.date.day) {
                item.times = item.times.filter(time => {
                    return time.time !== schedule.time.time
                })
            }
        })
        const body = {
            ...doctorRecord, doctor: appointmentData.doctorRecord.doctor.id
        }
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', body, sendToken: true })
            .then(res => {
                appointmentHandler.setDoctorRecord({ ...res, doctor: appointmentData.doctorRecord.doctor })
                hidden()
                appointmentHandler.showFormSchedule(schedule.date)
            })
    }

    return (
        <div style={visible ? { height: 'auto', width: '60%', transition: '0.3s' } : { height: 0, width: 0, transition: '0.3s' }} className='z-[45] w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s' }} className='w-[100%] flex px-8 py-4 flex-col'>
                    <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                    <span className='text-[17px] font-medium text-[#1c1c1c]'>{`${formatVietnameseDate(schedule.date)} (${schedule.time?.time})`}</span>
                    <span className='text-[15px] mt-4 font-medium'>Giá Tiền</span>
                    <input value={price} onChange={e => setPrice(e.target.value)} placeholder='Giá Tiền' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                    <div className='flex gap-3'>
                        <button onClick={() => handleUpdateSchedule()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[220px] mt-4 text-[white] h-[37px] rounded-lg'>Cập Nhật Giờ Hẹn</button>
                        <button onClick={() => deleteTimeSchedule()} className='hover:scale-[1.05] transition-all text-[14px] bg-[#ff3737] px-[3rem] w-[180px] mt-4 text-[white] h-[37px] rounded-lg'>Hủy Giờ Hẹn</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormDetailTimeForHaveSchedule