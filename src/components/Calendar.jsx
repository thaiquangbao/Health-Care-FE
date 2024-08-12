'use client'
import { convertDateToDay, convertDateToDayMonth } from '@/utils/date';
import { eachDayOfInterval, endOfMonth, setMonth, setYear, startOfMonth, subMonths } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react'

const Calendar = ({ check, visible, setVisible, currentDate, setCurrentDate, scale }) => {
    const [numberOfMonth, setNumberOfMonth] = useState(new Date().getMonth())
    const [numberOfYear, setNumberOfYear] = useState(new Date().getFullYear())
    const [days, setDays] = useState([])
    const [hoveredIndex, setHoveredIndex] = useState(null);
    // const monthStart = useMemo(() => startOfMonth(new Date()), []);
    // const monthEnd = useMemo(() => endOfMonth(new Date()), []);
    // const time = useMemo(() => setYear(setMonth(new Date(), numberOfMonth), numberOfYear), []); // 8 because months are 0-indexed (0 = January, 8 = September)
    // const monthStart = useMemo(() => startOfMonth(time), [time]);
    // const monthEnd = useMemo(() => endOfMonth(time), [time]);

    useEffect(() => {
        const time = setYear(setMonth(new Date(), numberOfMonth), numberOfYear); // 8 because months are 0-indexed (0 = January, 8 = September)
        const monthStart = startOfMonth(time);
        const monthEnd = endOfMonth(time);
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
        if (remain !== 0) {
            for (let i = remain; i < 7; i++) {
                formatDays.push('')
            }
        }
        setDays(formatDays)
    }, [numberOfYear, numberOfMonth])

    const handlePrev = () => {
        if (numberOfMonth === 0) {
            setNumberOfMonth(11)
            setNumberOfYear(prev => prev - 1)
        } else {
            setNumberOfMonth(prev => prev - 1)
        }
    }

    const handleNext = () => {
        if (numberOfMonth === 11) {
            setNumberOfMonth(0)
            setNumberOfYear(prev => prev + 1)
        } else {
            setNumberOfMonth(prev => prev + 1)
        }
    }



    return (
        <div style={{ height: visible ? 'auto' : 0, transition: '0.5s', scale }} className='z-50 bg-[white] transition-all overflow-hidden absolute top-0 left-[-120px] w-[400px] shadow-2xl rounded-lg'>
            <div className='px-4 pt-2 pb-4 flex flex-col gap-2'>
                <div className='w-full py-3 border-b-[1px] border-[#c9c9c9] flex justify-between items-center'>
                    <i onClick={() => handlePrev()} className='text-[25px] text-[#999] cursor-pointer bx bxs-chevron-left'></i>
                    <span className='text-[18px] font-semibold'>Tháng {numberOfMonth + 1}, {numberOfYear}</span>
                    <i onClick={() => handleNext()} className='text-[25px] text-[#999] cursor-pointer bx bxs-chevron-right'></i>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='grid grid-cols-7'>
                        <div className='text-center font-semibold'>Mon</div>
                        <div className='text-center font-semibold'>Tue</div>
                        <div className='text-center font-semibold'>Wed</div>
                        <div className='text-center font-semibold'>Thu</div>
                        <div className='text-center font-semibold'>Fri</div>
                        <div className='text-center font-semibold'>Sat</div>
                        <div className='text-center font-semibold'>Sun</div>
                    </div>
                    <div className='grid grid-cols-7 gap-3'>
                        {days.map((day, index) => (
                            <button onClick={() => {
                                setCurrentDate({ day: Number(convertDateToDay(day)), month: numberOfMonth + 1, year: numberOfYear })
                                setVisible(false)
                            }} onMouseEnter={() => setHoveredIndex((day + '') !== '' ? index : null)}
                                onMouseLeave={() => setHoveredIndex(null)} key={index} style={{ backgroundColor: hoveredIndex === index ? '#4ca5ff' : 'transparent', }} className='aspect-square transition-all rounded-full p-2 flex items-center justify-center font-medium text-[15px]'>
                                {(day + '') !== '' && (
                                    <span>{convertDateToDay(day)}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Calendar