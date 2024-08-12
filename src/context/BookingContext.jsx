'use client'
import { createContext, useEffect, useRef, useState } from "react";

export const bookingContext = createContext()

const BookingProvider = ({ children }) => {

    const [booking, setBooking] = useState()
    const [doctorRecord, setDoctorRecord] = useState()
    const [currentStep, setCurrentStep] = useState(1)

    const data = {
        booking,
        doctorRecord,
        currentStep
    }
    const handler = {
        setBooking,
        setDoctorRecord,
        setCurrentStep
    }

    return (
        <bookingContext.Provider value={{ bookingData: data, bookingHandler: handler }}>
            {children}
        </bookingContext.Provider >
    )
}

export default BookingProvider
