'use client'
import { createContext, useEffect, useRef, useState } from "react";

export const userContext = createContext()

const UserProvider = ({ children }) => {

    const [user, setUser] = useState()

    const data = {
        user
    }
    const handler = {
        setUser
    }

    return (
        <userContext.Provider value={{ userData: data, userHandler: handler }}>
            {children}
        </userContext.Provider >
    )
}

export default UserProvider
