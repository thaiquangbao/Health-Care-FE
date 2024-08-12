import { appointmentContext } from '@/context/AppointmentContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYearObject, formatVietnameseDate, generateTimes } from '@/utils/date'
import React, { useContext, useEffect, useState } from 'react'

const FormDetailTime = ({ visible, hidden, detailTime, day }) => {

    const { appointmentHandler, appointmentData } = useContext(appointmentContext)

    const handleUpdateSchedule = () => {
        let currentDay = day
        let doctorRecord = appointmentData.doctorRecord
        let have = false
        doctorRecord.schedules.forEach(item => {
            if (item.date.month === currentDay.month && item.date.day === currentDay.day && item.date.year === currentDay.year) {
                item.times.push(
                    {
                        time: detailTime.time,
                        status: '',
                        price: Number(detailTime.price)
                    }
                )
                have = true
            }
        })
        if (have === false) {
            doctorRecord.schedules = [
                ...appointmentData.doctorRecord.schedules,
                {
                    date: currentDay,
                    times: [
                        {
                            time: detailTime.time,
                            status: '',
                            price: Number(detailTime.price)
                        }
                    ]
                }
            ]
        }
        // doctorRecord.schedules = []
        const body = {
            ...doctorRecord, doctor: appointmentData.doctorRecord.doctor.id
        }
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', body, sendToken: false })
            .then(res => {
                appointmentHandler.setDoctorRecord({ ...res, doctor: appointmentData.doctorRecord.doctor })
                hidden()
                setTimeout(() => {
                    appointmentHandler.showFormSchedule(day)
                }, 500)
            })
    }

    return (
        <div style={visible ? { height: 'auto', width: '60%', transition: '0.3s' } : { height: 0, width: 0, transition: '0.3s' }} className='z-[45] w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s' }} className='w-[100%] flex px-8 py-4 flex-col'>
                    <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                    <span className='text-[17px] font-medium text-[#1c1c1c]'>{formatVietnameseDate(day) + ` (${detailTime.time})`}</span>
                    <span className='text-[15px] mt-4 font-medium'>Giá Tiền</span>
                    <input value={appointmentData.detailTime.price} onChange={e => appointmentHandler.setDetailTime({ ...appointmentData.detailTime, price: e.target.value })} placeholder='Giá Tiền' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                    <button onClick={() => handleUpdateSchedule()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[250px] mt-4 text-[white] h-[37px] rounded-lg'>Xác Nhận</button>
                </div>
            )}
        </div>
    )
}

export default FormDetailTime
