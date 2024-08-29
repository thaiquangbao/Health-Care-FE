'use client'
import { createContext, useEffect, useRef, useState } from "react";

export const bookingContext = createContext()

const BookingProvider = ({ children }) => {

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
        <bookingContext.Provider value={{ bookingData: data, bookingHandler: handler }}>
            {children}
        </bookingContext.Provider >
    )
}

export default BookingProvider
