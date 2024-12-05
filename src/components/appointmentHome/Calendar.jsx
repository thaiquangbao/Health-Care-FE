import React, { useContext, useEffect, useMemo, useState } from 'react'
import { eachDayOfInterval, endOfMonth, format, isSameMonth, isToday, startOfMonth } from 'date-fns';
import { changeDate, compareDate1GetterThanDate2, compareDateIsHaveInSchedule, convertDateToDayMonth, convertDateToDayMonthYearObject, convertObjectToDate, formatDateISOByVietNam } from '@/utils/date';
import { appointmentContext } from '@/context/AppointmentContext';
import Schedule from './Schedule';
import { userContext } from '@/context/UserContext';
const Calendar = ({ data, hidden }) => {
    const { appointmentData } = useContext(appointmentContext)
    const [day, setDay] = useState()
    const [days, setDays] = useState([])
    const [currentStep, setCurrentStep] = useState(1)
    const { userData } = useContext(userContext)
    const [monthStart, setMonthStart] = useState()
    const [monthEnd, setMonthEnd] = useState()
    const [currentMonth, setCurrentMonth] = useState({
        month: 0,
        year: 0,
    });

    useEffect(() => {
        const currentDate = new Date();
        setCurrentMonth({
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        })
    }, [])

    useEffect(() => {
        if (currentMonth.month && currentMonth.year) {
            const { month, year } = currentMonth;
            const date = new Date(year, month - 1); // Chuyển đổi về dạng Date
            setMonthStart(startOfMonth(date))
            setMonthEnd(endOfMonth(date))
        }
    }, [currentMonth])

    useEffect(() => {
        if (monthStart && monthEnd) {
            const formatDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
            if (formatDays[0].toString().includes('Tue'))
                for (let i = 0; i <= 0; i++)
                    formatDays.unshift('')
            else if (formatDays[0].toString().includes('Wed'))
                for (let i = 0; i <= 1; i++)
                    formatDays.unshift('')
            else if (formatDays[0].toString().includes('Thu'))
                for (let i = 0; i <= 2; i++)
                    formatDays.unshift('')
            else if (formatDays[0].toString().includes('Fri'))
                for (let i = 0; i <= 3; i++)
                    formatDays.unshift('')
            else if (formatDays[0].toString().includes('Sat'))
                for (let i = 0; i <= 4; i++)
                    formatDays.unshift('')
            else if (formatDays[0].toString().includes('Sun'))
                for (let i = 0; i <= 5; i++)
                    formatDays.unshift('')
            const remain = formatDays.length % 7
            for (let i = remain; i < 7; i++) {
                formatDays.push('')
            }
            setDays(formatDays)
        }
    }, [monthStart, monthEnd])

    const handleNextMonth = () => {
        setCurrentMonth((prev) => {
            let nextMonth = prev.month + 1;
            let nextYear = prev.year;
            if (nextMonth > 12) {
                nextMonth = 1;
                nextYear += 1;
            }
            return { month: nextMonth, year: nextYear };
        });
    }

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => {
            let prevMonth = prev.month - 1;
            let prevYear = prev.year;

            if (prevMonth < 1) {
                prevMonth = 12;
                prevYear -= 1;
            }

            return { month: prevMonth, year: prevYear };
        });
    };

    return (
        <div className='z-[41] flex bg-[white] overflow-y-auto py-2 rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]' style={{ transition: '0.5s', width: data ? 'auto' : 0, height: data ? '90%' : 0 }}>
            <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='flex w-[100%]'>
                <div className='flex flex-col gap-3 bg-[white] rounded-md px-6 py-4 min-w-[100%]'>
                    <span className='text-[17px] font-semibold'>Lịch Khám Bệnh</span>
                    <div className='w-[100%] flex items-center justify-center gap-1'>
                        <i onClick={() => handlePrevMonth()} className='bx bx-chevron-left cursor-pointer text-[35px] text-[#999]'></i>
                        <div className='w-[95%] grid grid-cols-7 border border-[rgb(217,217,217)] rounded-lg overflow-hidden'>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Thứ Hai
                            </div>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Thứ Ba
                            </div>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Thứ Tư
                            </div>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Thứ Năm
                            </div>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Thứ Sáu
                            </div>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Thứ Bảy
                            </div>
                            <div className='border bg-[#0000ffc5] text-[white] border-[rgb(217,217,217)] py-3 flex items-center justify-center font-semibold text-[15px]'>
                                Chủ Nhật
                            </div>
                            {days.map((day, index) => (
                                <div key={index} className='border-[1px] border-[rgb(217,217,217)] flex items-center justify-center font-medium text-[15px]'>
                                    {(day + '') !== '' && (
                                        <>
                                            {compareDate1GetterThanDate2(convertDateToDayMonthYearObject(day + ''), convertDateToDayMonthYearObject(new Date().toISOString())) ? (
                                                <button style={{ backgroundColor: compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules) === 0 ? 'white' : '#ffffee' }} onClick={() => {
                                                    if (userData.user?.email === null) {
                                                        globalHandler.notify(notifyType.WARNING, "Bác sĩ hãy cập nhật địa chỉ email trước khi đăng ký lịch khám !!!")
                                                    } else {
                                                        setCurrentStep(2)
                                                        setDay(day)
                                                    }
                                                }}
                                                    className='hover:bg-[#e5e5e5] text-[14px] transition-all h-[80px] w-full py-4 items-center gap-1 flex flex-col'>
                                                    <span>{convertDateToDayMonth(day + '')}</span>
                                                    {compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules) !== 0 && (
                                                        <span>{`(${compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules)}) Cuộc Hẹn`}</span>
                                                    )}
                                                </button>
                                            ) : (
                                                <button className='bg-[#eaeded] text-[14px] transition-all h-[80px] w-full py-4 items-center gap-1 flex flex-col'>
                                                    <span>{convertDateToDayMonth(day + '')}</span>
                                                    {compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules) !== 0 && (
                                                        <span>{`(${compareDateIsHaveInSchedule(convertDateToDayMonthYearObject(day + ''), appointmentData.doctorRecord?.schedules)}) Cuộc Hẹn`}</span>
                                                    )}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <i onClick={() => handleNextMonth()} className='bx bx-chevron-right cursor-pointer text-[35px] text-[#999]'></i>
                    </div>
                </div>
                <Schedule hidden={hidden} data={data} day={convertDateToDayMonthYearObject(day + '')} setCurrentStep={setCurrentStep} />
            </div>
            <button onClick={() => hidden()}>
                <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
            </button>
        </div>
    )
}

export default Calendar