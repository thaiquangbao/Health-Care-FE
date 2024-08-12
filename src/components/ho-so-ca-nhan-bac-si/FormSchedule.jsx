import { appointmentContext } from '@/context/AppointmentContext'
import { formatVietnameseDate, generateTimes } from '@/utils/date'
import React, { useContext, useState } from 'react'

const FormSchedule = ({ visible, hidden, day }) => {

    const [currentStep, setCurrentStep] = useState(1)
    let times = generateTimes('06:00', '21:00', 30);
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)

    const handleButtonClick = (index) => {
        setIndexTimes(prev =>
            prev.includes(index)
                ? prev.filter(item => item !== index)
                : [...prev, index]
        );
    };

    const checkSchedule = (time) => {
        for (let i = 0; i < appointmentData.doctorRecord?.schedules.length; i++) {
            const scheduleItem = appointmentData.doctorRecord?.schedules[i]
            const date = scheduleItem.date
            if (date.month === day.month && date.year === day.year && date.day === day.day) {
                for (let j = 0; j < scheduleItem.times.length; j++) {
                    const timeItem = scheduleItem.times[j]
                    if (timeItem.time === time) {
                        return true
                    }
                }
            }
        }
        return false
    }

    const findTime = (time) => {
        for (let i = 0; i < appointmentData.doctorRecord?.schedules.length; i++) {
            const scheduleItem = appointmentData.doctorRecord?.schedules[i]
            const date = scheduleItem.date
            if (date.month === day.month && date.year === day.year && date.day === day.day) {
                for (let j = 0; j < scheduleItem.times.length; j++) {
                    const timeItem = scheduleItem.times[j]
                    console.log(timeItem, time)
                    if (timeItem.time === time) {
                        return {
                            date: scheduleItem.date,
                            time: timeItem
                        }
                    }
                }
            }
        }
    }

    return (
        <div style={visible ? { height: 'auto', width: '60%', transition: '0.3s' } : { height: 0, width: 0, transition: '0.3s' }} className='z-[45] w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex px-8 py-4 flex-col'>
                    <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                    <span className='text-[17px] font-medium text-[#1c1c1c]'>{formatVietnameseDate(day)}</span>
                    <span className='text-[15px] mt-4 font-medium'>Giờ Hẹn</span>
                    <div className='grid grid-cols-8 gap-2 mt-2'>
                        {times.map((time, index) => (
                            <button key={index} onClick={() => {
                                if (findTime(time)) {
                                    hidden();
                                    setTimeout(() => {
                                        appointmentHandler.showFormDetailTimeForHaveSchedule(findTime(time))
                                    }, 500);
                                } else {
                                    hidden();
                                    setTimeout(() => {
                                        appointmentHandler.showFormDetailTime({ time, status: '', price: '' })
                                    }, 500);
                                }
                            }} style={{ backgroundColor: checkSchedule(time) ? '#eaeded' : 'white' }} className={`px-4 py-2 transition-all cursor-pointer border-[1px] border-[#999] text-[13px] font-medium bg-[white] rounded-md`}>{time}</button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormSchedule