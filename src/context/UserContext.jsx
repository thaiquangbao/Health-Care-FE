'use client'
import { createContext, useEffect, useRef, useState } from "react";
import { notifyType } from "./GlobalContext";
import Notification from "@/components/notification";

export const userContext = createContext()

const UserProvider = ({ children }) => {

    const [user, setUser] = useState()
    const [info, setInfo] = useState({ status: notifyType.NONE, message: '' })

    const notify = (status, message) => setInfo({ status, message })

    useEffect(() => {
        if (info.status !== notifyType.NONE) {
            if (info.status !== notifyType.LOADING) {
                setTimeout(() => {
                    setInfo({ status: notifyType.NONE, message: '' })
                }, 3000);
            }
        }
    }, [info.status])

    const data = {
        user
    }
    const handler = {
        setUser,
        notify,
    }

    return (
        <userContext.Provider value={{ userData: data, userHandler: handler }}>
            <Notification status={info.status} message={info.message} setInfomation={setInfo} />
            {children}
        </userContext.Provider >
    )
}

export default UserProvider
