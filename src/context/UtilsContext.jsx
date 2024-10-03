'use client'
import React, { createContext, useEffect, useState } from 'react'
import { notifyType } from './GlobalContext';
import Notification from '@/components/notification';

export const utilsContext = createContext();

const UtilsProvider = ({ children }) => {
    const [info, setInfo] = useState({
        status: notifyType.NONE,
        message: "",
    });

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
    };

    return (
        <utilsContext.Provider value={{ utilsHandler: handler, utilsData: data }}>
            <Notification
                status={info.status}
                message={info.message}
                setInfomation={setInfo}
            />
            {children}
        </utilsContext.Provider>
    )
}

export default UtilsProvider