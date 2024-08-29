'use client'
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { authContext } from "./AuthContext";
import UpdateHealthForm from "@/components/theo-doi-suc-khoe/patient/UpdateHealthForm";
import MessageIcon from "@/components/shortcut/MessageIcon";
import { userContext } from "./UserContext";
import { api, TypeHTTP } from "@/utils/api";
import LineChart from "@/components/chart/LineChart";
import { usePathname } from "next/navigation";

export const healthContext = createContext()

const HealthProvider = ({ children }) => {

    const { authHandler } = useContext(authContext)
    const { userData } = useContext(userContext)
    const [logBook, setLogBook] = useState()
    const [rooms, setRooms] = useState([])
    const [temporaryData, setTemporaryData] = useState()
    const pathname = usePathname()

    useEffect(() => {
        if (userData.user && userData.user?.role === 'USER') {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/rooms/get-room-patient/${userData.user._id}` })
                .then(rooms => {
                    setRooms(rooms)
                })
        }
    }, [userData.user])

    useEffect(() => {
        if (temporaryData && !logBook) {
            setTimeout(() => {
                authHandler.setCurrentRoom(temporaryData)
                setTemporaryData()
            }, 500);
        }
    }, [logBook])

    const showUpdateHealthForm = (logBook) => {
        authHandler.showWrapper()
        setLogBook(logBook)
    }

    const hiddenUpdateHealthForm = () => {
        authHandler.hiddenWrapper()
        setLogBook()
    }

    const data = {
        temporaryData
    }
    const handler = {
        showUpdateHealthForm,
        hiddenUpdateHealthForm,
        setTemporaryData
    }

    return (
        <healthContext.Provider value={{ healthData: data, healthHandler: handler }}>
            {pathname !== '/cuoc-tro-chuyen' && (
                <MessageIcon rooms={rooms} />
            )}
            <LineChart logBook={logBook} setLogBook={setLogBook} hidden={hiddenUpdateHealthForm} />
            {children}
        </healthContext.Provider >
    )
}

export default HealthProvider
