'use client'
import { createContext, useEffect, useRef, useState } from "react";

export const bookingServiceContext = createContext()

const BookingServiceProvider = ({ children }) => {

    const [bookingServiceRecord, setBookingServiceRecord] = useState()
    const [currentStep, setCurrentStep] = useState(1)

    const data = {
        bookingServiceRecord,
        currentStep,
    }
    const handler = {
        setBookingServiceRecord,
        setCurrentStep
    }

    return (
        <bookingServiceContext.Provider value={{ bookingServiceData: data, bookingServiceHandler: handler }}>
            {children}
        </bookingServiceContext.Provider >
    )
}

export default BookingServiceProvider
