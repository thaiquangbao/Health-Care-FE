'use client'
import { authContext } from '@/context/AuthContext'
import React, { useContext, useEffect, useState } from 'react'
import FormMessageArea from './FormMessageArea'
import { usePathname } from 'next/navigation'
// import { io } from 'socket.io-client'
// const socket = io.connect(baseURL)
const MessageIcon = ({ rooms }) => {
    const [roomStatus, setRoomStatus] = useState();
    const pathname = usePathname()
    // bat socket o day
    const { authHandler, authData } = useContext(authContext)
    useEffect(() => {

        if (authData.currentRoom) {
            authHandler.showWrapper()
        } else {
            authHandler.hiddenWrapper()
        }
    }, [authData.currentRoom])

    return (
        <div style={{ bottom: '70px', right: '14px' }} className="flex flex-col fixed w-[50px] gap-2 z-[45]">
            {!pathname.includes('go') && (<>
                {rooms.filter(room => room.status === "ACTIVE").map((room, index) => (
                    <div onClick={() => authHandler.setCurrentRoom(room)} style={{ backgroundImage: `url(${room.doctor.image})` }} key={index} className="w-[50px] aspect-square rounded-full bg-cover cursor-pointer"></div>
                ))}
                <FormMessageArea room={authData.currentRoom} setCurrentRoom={authHandler.setCurrentRoom} />
            </>)}
        </div>
    )
}


export default MessageIcon