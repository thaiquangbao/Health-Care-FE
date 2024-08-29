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
import FormRecordPatient from '@/components/appointment/FormRecordPatient'
import FormDetailAppointment from '@/components/appointment/FormDetailAppointment'
import FormSignUpHealth from '@/components/ho-so-ca-nhan-bac-si/FormSignUpHealth'

export const appointmentContext = createContext()

const AppointmentProvider = ({ children }) => {

    const [visibleWrapper, setVisibleWrapper] = useState(false)
    const [visibleFormSchedule, setVisibleFormSchedule] = useState(false)
    const [visibleFormDetailTimeForHaveSchedule, setVisibleFormDetailTimeForHaveSchedule] = useState(false)
    const [visibleFormDetailTime, setVisibleFormDetailTime] = useState(false)
    const [visibleSignUpAppointment, setVisibleSignUpAppointment] = useState(false)
    const [visibleFormBooking, setVisibleFormBooking] = useState(false)
    const [visibleFormRecordPatient, setVisibleFormRecordPatient] = useState(false)
    const [dataFormDetailAppointment, setDataFormDetailAppointment] = useState()
    const [currentAppointment, setCurrentAppointment] = useState()
    const [medicalRecord, setMedicalRecord] = useState();
    const [currentDay, setCurrentDay] = useState()
    const [detailTime, setDetailTime] = useState()
    const [doctorRecord, setDoctorRecord] = useState()
    const [sicks, setSicks] = useState([])
    const [priceList, setPriceList] = useState()
    const [schedule, setSchedule] = useState()
    const { userData } = useContext(userContext)
    const [sick, setSick] = useState('')
    const [displayConnect, setDisplayConnect] = useState(false)
    const wrapperRef = useRef()
    const [doctorRecordBooking, setDoctorRecordBooking] = useState()

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
        hiddenFormRecordPatient()
        hiddenFormDetailAppointment()
        hiddenFormSignUpHealth()
    }

    const showFormBooking = (sick) => {
        setSick(sick)
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

    const showFormRecordPatient = (detail) => {
        showWrapper()
        setVisibleFormRecordPatient(true)
    }

    const hiddenFormRecordPatient = () => {
        hiddenWrapper()
        setVisibleFormRecordPatient(false)
    }
    const showFormSignUpHealth = (dr) => {
        showWrapper()
        setDoctorRecordBooking(dr)
    }

    const hiddenFormSignUpHealth = () => {
        hiddenWrapper()
        setDoctorRecordBooking()
    }

    const showFormDetailAppointment = (appointment, display) => {
        showWrapper()
        setDisplayConnect(display)
        setDataFormDetailAppointment(appointment)
    }

    const hiddenFormDetailAppointment = () => {
        hiddenWrapper()
        setDisplayConnect(false)
        setDataFormDetailAppointment()
    }

    const data = {
        detailTime,
        doctorRecord,
        sicks,
        priceList,
        currentDay,
        currentAppointment,
        medicalRecord
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
        showFormRecordPatient,
        hiddenFormRecordPatient,
        setSicks,
        setPriceList,
        setCurrentAppointment,
        showFormDetailAppointment,
        hiddenFormDetailAppointment,
        setMedicalRecord,
        showFormSignUpHealth
    }

    return (
        <appointmentContext.Provider value={{ appointmentData: data, appointmentHandler: handler }}>
            <Wrapper wrapperRef={wrapperRef} onClick={hidden} />
            <FormSchedule visible={visibleFormSchedule} hidden={hidden} day={currentDay} />
            <FormDetailTime day={currentDay} visible={visibleFormDetailTime} hidden={hidden} detailTime={detailTime} />
            <FormDetailTimeForHaveSchedule visible={visibleFormDetailTimeForHaveSchedule} hidden={hidden} schedule={schedule} />
            <FormSignUpAppointment hidden={hidden} visible={visibleSignUpAppointment} />
            <FormBooking hidden={hidden} visible={visibleFormBooking} sick={sick} />
            <FormDetailAppointment display={displayConnect} hidden={hidden} data={dataFormDetailAppointment} />
            <FormSignUpHealth doctorRecord={doctorRecordBooking} hidden={hidden} />
            {/* <FormRecordPatient hidden={hidden} visible={visibleFormRecordPatient} /> */}
            {children}
        </appointmentContext.Provider>
    )
}

export default AppointmentProvider