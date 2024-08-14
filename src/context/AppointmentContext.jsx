'use client'
import FormSignUpAppointment from '@/components/appointment/FormSignUpAppoiment'
import FormSignIn from '@/components/auth/FormSignIn'
import FormSignUp from '@/components/auth/FormSignUp'
import FormDetailTime from '@/components/ho-so-ca-nhan-bac-si/FormDetailTime'
import FormDetailTimeForHaveSchedule from '@/components/ho-so-ca-nhan-bac-si/FormDetailTimeForHaveSchedule'
import FormSchedule from '@/components/ho-so-ca-nhan-bac-si/FormSchedule'
import Wrapper from '@/components/wrapper'
import { set } from 'date-fns'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { userContext } from './UserContext'
import { api, TypeHTTP } from '@/utils/api'
import FormBooking from '@/components/appointment/FormBooking'

export const appointmentContext = createContext()

const AppointmentProvider = ({ children }) => {

    const [visibleWrapper, setVisibleWrapper] = useState(false)
    const [visibleFormSchedule, setVisibleFormSchedule] = useState(false)
    const [visibleFormDetailTimeForHaveSchedule, setVisibleFormDetailTimeForHaveSchedule] = useState(false)
    const [visibleFormDetailTime, setVisibleFormDetailTime] = useState(false)
    const [visibleSignUpAppointment, setVisibleSignUpAppointment] = useState(false)
    const [visibleFormBooking, setVisibleFormBooking] = useState(false)
    const [currentDay, setCurrentDay] = useState()
    const [detailTime, setDetailTime] = useState()
    const [doctorRecord, setDoctorRecord] = useState()
    const [sicks, setSicks] = useState([])
    const [priceList, setPriceList] = useState()
    const [schedule, setSchedule] = useState()
    const { userData } = useContext(userContext)
    const wrapperRef = useRef()

    useEffect(() => {
        if (userData.user) {
            api({ path: `/doctorRecords/getById/${userData.user._id}`, type: TypeHTTP.GET, sendToken: false })
                .then(record => {
                    setDoctorRecord(record)
                })
        }
    }, [userData.user])

    const showWrapper = () => {
        wrapperRef.current.style.display = 'block'
        document.querySelector('body').style.overflow = 'hidden'
        setTimeout(() => {
            wrapperRef.current.style.opacity = 1
        }, 100);
    }

    const hiddenWrapper = () => {
        wrapperRef.current.style.opacity = 0
        document.querySelector('body').style.overflow = 'auto'
        setTimeout(() => {
            wrapperRef.current.style.display = 'none'
        }, 500);
    }

    const hidden = () => {
        hiddenWrapper();
        hiddenFormSchedule();
        hiddenFormDetailTime();
        hiddenFormDetailTimeForHaveSchedule()
        hiddenFormSignUpAppointment()
        hiddenFormBooking()
    }

    const showFormBooking = () => {
        setVisibleFormBooking(true)
        showWrapper()
    }

    const hiddenFormBooking = () => {
        setVisibleFormBooking(false)
        hiddenWrapper()
    }

    const showFormSignUpAppointment = () => {
        showWrapper()
        setVisibleSignUpAppointment(true)
    }

    const hiddenFormSignUpAppointment = () => {
        hiddenWrapper()
        setVisibleSignUpAppointment(false)
    }

    const showFormSchedule = (day) => {
        setCurrentDay(day)
        showWrapper()
        setVisibleFormSchedule(true)
    }

    const hiddenFormSchedule = () => {
        hiddenWrapper()
        setVisibleFormSchedule(false)
    }

    const showFormDetailTime = (detail) => {
        setDetailTime(detail)
        showWrapper()
        setVisibleFormDetailTime(true)
    }

    const hiddenFormDetailTime = () => {
        hiddenWrapper()
        setVisibleFormDetailTime(false)
    }

    const showFormDetailTimeForHaveSchedule = (schedule) => {
        setSchedule(schedule)
        showWrapper()
        setVisibleFormDetailTimeForHaveSchedule(true)
    }

    const hiddenFormDetailTimeForHaveSchedule = () => {
        hiddenWrapper()
        setVisibleFormDetailTimeForHaveSchedule(false)
    }

    const data = {
        detailTime,
        doctorRecord,
        sicks,
        priceList,
        currentDay
    }

    const handler = {
        showFormSchedule,
        hiddenFormSchedule,
        showFormDetailTime,
        hiddenFormDetailTime,
        showFormDetailTimeForHaveSchedule,
        hiddenFormDetailTimeForHaveSchedule,
        setCurrentDay,
        setDetailTime,
        setDoctorRecord,
        showFormSignUpAppointment,
        hiddenFormSignUpAppointment,
        showFormBooking,
        hiddenFormBooking,
        setSicks,
        setPriceList
    }

    return (
        <appointmentContext.Provider value={{ appointmentData: data, appointmentHandler: handler }}>
            <Wrapper wrapperRef={wrapperRef} onClick={hidden} />
            <FormSchedule visible={visibleFormSchedule} hidden={hidden} day={currentDay} />
            <FormDetailTime day={currentDay} visible={visibleFormDetailTime} hidden={hidden} detailTime={detailTime} />
            <FormDetailTimeForHaveSchedule visible={visibleFormDetailTimeForHaveSchedule} hidden={hidden} schedule={schedule} />
            <FormSignUpAppointment hidden={hidden} visible={visibleSignUpAppointment} />
            <FormBooking hidden={hidden} visible={visibleFormBooking} />
            {children}
        </appointmentContext.Provider>
    )
}

export default AppointmentProvider