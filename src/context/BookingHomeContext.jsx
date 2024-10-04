'use client'
import { createContext, useEffect, useRef, useState } from "react";

export const bookingHomeContext = createContext()

const BookingHomeProvider = ({ children }) => {

    const [booking, setBooking] = useState()
    const [doctorRecord, setDoctorRecord] = useState()
    const [currentStep, setCurrentStep] = useState(1)
    const [images, setImages] = useState([])

    const data = {
        booking,
        doctorRecord,
        currentStep,
        images
    }
    const handler = {
        setBooking,
        setDoctorRecord,
        setCurrentStep,
        setImages
    }

    return (
        <bookingHomeContext.Provider value={{ bookingHomeData: data, bookingHomeHandler: handler }}>
            {children}
        </bookingHomeContext.Provider >
    )
}

export default BookingHomeProvider
