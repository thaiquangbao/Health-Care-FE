'use client'
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authContext } from "./AuthContext";
import UpdateHealthForm from "@/components/theo-doi-suc-khoe/patient/UpdateHealthForm";

export const healthContext = createContext()

const HealthProvider = ({ children }) => {

    const { authHandler } = useContext(authContext)
    const [logBook, setLogBook] = useState()

    const showUpdateHealthForm = (logBook) => {
        authHandler.showWrapper()
        setLogBook(logBook)
    }

    const hiddenUpdateHealthForm = () => {
        authHandler.hiddenWrapper()
        setLogBook()
    }

    const data = {

    }
    const handler = {
        showUpdateHealthForm,
        hiddenUpdateHealthForm
    }

    return (
        <healthContext.Provider value={{ healthData: data, healthHandler: handler }}>
            <UpdateHealthForm logBook={logBook} hidden={hiddenUpdateHealthForm} />
            {children}
        </healthContext.Provider >
    )
}

export default HealthProvider
