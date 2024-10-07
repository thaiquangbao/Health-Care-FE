'use client'
import React, { createContext, useEffect, useState } from 'react'
import { notifyType } from './GlobalContext';
import Notification from '@/components/notification';
import Sure from '@/components/Sure';

export const utilsContext = createContext();

const UtilsProvider = ({ children }) => {

    const [visibleSure, setVisibleSure] = useState(false)
    const [functionalAccept, setFunctionalAccept] = useState()
    const [functionalReject, setFunctionalReject] = useState()
    const [message, setMessage] = useState('')

    const [info, setInfo] = useState({
        status: notifyType.NONE,
        message: "",
    });

    const showSure = ({ message, functionalAccept, functionalReject }) => {
        setVisibleSure(true)
        setMessage(message)
        setFunctionalAccept(() => functionalAccept);
        setFunctionalReject(() => functionalReject);
    }

    const hiddenSure = () => {
        setVisibleSure(false)
        setMessage('')
        setFunctionalAccept()
        setFunctionalReject()
    }

    useEffect(() => {
        if (info.status !== notifyType.NONE) {
            if (info.status !== notifyType.LOADING) {
                setTimeout(() => {
                    setInfo({ status: notifyType.NONE, message: "" });
                }, 3000);
            }
        }
    }, [info.status]);

    const notify = (status, message) =>
        setInfo({ status, message });

    const data = {};
    const handler = {
        notify,
        showSure, hiddenSure
    };

    return (
        <utilsContext.Provider value={{ utilsHandler: handler, utilsData: data }}>
            <Notification
                status={info.status}
                message={info.message}
                setInfomation={setInfo}
            />
            <Sure visible={visibleSure} hidden={hiddenSure} functionalAccept={functionalAccept} functionalReject={functionalReject} message={message} />
            {children}
        </utilsContext.Provider>
    )
}

export default UtilsProvider