import { userContext } from '@/context/UserContext'
import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageArea from '../cuoc-tro-chuyen/MessageArea'
import { api, baseURL, TypeHTTP } from '@/utils/api'
import { io } from 'socket.io-client'
import { convertDateToDayMonthYearTimeObject } from '@/utils/date'
import { healthContext } from '@/context/HealthContext'
const socket = io.connect(baseURL)

const FormMessageArea = ({ room, setCurrentRoom }) => {

    const imageRef = useRef()
    const messageRef = useRef()
    const wrapperRef = useRef()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState()
    const { userData } = useContext(userContext)
    const { healthHandler } = useContext(healthContext)

    useEffect(() => {
        if (room) {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/messages/get-messages-rooms/${room._id}` })
                .then(messages => {
                    setMessages(messages[0])
                })
        } else {
            setMessages([])
            setMessage('')
        }
    }, [room])

    const handleSentMessage = () => {
        const newMessage = {
            content: message,
            time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
            author: userData.user?.role === 'USER' ? 'PATIENT' : 'DOCTOR',
            type: 'TEXT'
        }
        const newMessages = JSON.parse(JSON.stringify(messages))
        newMessages.messages.push(newMessage)
        api({ sendToken: true, type: TypeHTTP.POST, path: '/messages/update', body: newMessages })
        setMessage('')
    }

    useEffect(() => {
        socket.on(`message.update${room?._id}`, (messages) => {
            setMessages(messages)
        })
        return () => {
            socket.off(`message.update${room?._id}`);
        }
    }, [socket, room?._id])


    useEffect(() => {
        wrapperRef.current?.scrollTo({
            top: messageRef.current?.offsetHeight,
            behavior: 'smooth'
        });
    }, [messageRef.current?.offsetHeight, messages?.messages])

    const handleSendImage = (e) => {
        const file = e.target.files[0];
        const formData = new FormData()
        formData.append("files", file);
        api({ type: TypeHTTP.POST, path: "/upload-image/save", body: formData, sendToken: false })
            .then(res => {
                const newMessage = {
                    content: res[0],
                    time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
                    author: userData.user?.role === 'USER' ? 'PATIENT' : 'DOCTOR',
                    type: 'IMAGE'
                }
                const newMessages = JSON.parse(JSON.stringify(messages))
                newMessages.messages.push(newMessage)
                api({ sendToken: true, type: TypeHTTP.POST, path: '/messages/update', body: newMessages })
                setMessage('')
            })
    }

    const handleShowHealthForm = () => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/healthLogBooks/findByPatient/${userData.user._id}` })
            .then(logBooks => {
                const logBook = logBooks.filter(item => item.doctor._id === room.doctor._id && item.status.status_type === 'ACCEPTED')[0];
                healthHandler.setTemporaryData(room)
                setCurrentRoom()
                setTimeout(() => {
                    healthHandler.showUpdateHealthForm(logBook)
                }, 700)
            })
    }

    const handleKeyDown = async (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            handleSentMessage()
        }
    };

    return (
        <section style={{
            bottom: room ? '50%' : '12px',
            right: room ? '50%' : '20px',
            transform: room ? 'translate(50%, 50%)' : 'translate(0%, 0%)',
            height: room ? '95%' : 0,
            width: room ? '87%' : 0,
            transition: '0.5s'
        }}
            className='fixed z-[44] bg-[white] rounded-xl overflow-hidden'
        >
            <button onClick={() => setCurrentRoom()}>
                <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
            </button>
            <div className='w-full h-full relative flex flex-col items-center'>
                {room && (
                    <>
                        <input type='file' onChange={e => handleSendImage(e)} ref={imageRef} className='hidden' />
                        <div className='flex w-[100%] h-[11%] px-[1.5rem] justify-between border-b-[1px] border-[#dedede]'>
                            <div className='flex gap-3 items-center'>
                                <div style={{ backgroundImage: `url(${userData.user?.role === 'USER' ? room.doctor.image : room.patient.image})` }} className='w-[40px] h-[40px] rounded-full bg-cover bg-start' />
                                <div className='flex flex-col'>
                                    <span className='text-[16px] font-semibold'>{userData.user?.role === 'USER' ? 'BS. ' + room.doctor.fullName : room.patient.fullName}</span>
                                    <div className='flex items-center gap-2'>
                                        <div className="bg-[#00bf00] h-[12px] w-[12px] rounded-full"></div>
                                        <span className='text-[13px] font-semibold'>Trực Tuyến</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-4'>
                                {userData.user?.role === 'USER' && (
                                    <button onClick={() => handleShowHealthForm()} className="text-[white] bg-[#1dcbb6] px-3 py-2 text-[14px] rounded-lg hover:scale-[1.05] transition-all">
                                        Cập nhật sức khỏe
                                    </button>
                                )}
                            </div>
                        </div>
                        <MessageArea height={'75%'} currentRoom={room} wrapperRef={wrapperRef} messageRef={messageRef} messages={messages?.messages} currentUser={userData.user?.role === "USER" ? 'PATIENT' : 'DOCTOR'} />
                        <div className='relative h-[8%] w-[70%]'>
                            <input onKeyDown={handleKeyDown} onChange={e => setMessage(e.target.value)} value={message} placeholder='Nhập tin nhắn' className='h-full w-full border-[1px] pl-[1.5rem] pr-[5rem] text-[#353535] focus:outline-0 border-[#d6d6d6] rounded-3xl' />
                            <div className='w-[90px] text-[25px] text-[#999] gap-1 h-full absolute right-0 flex items-center justify-center top-[50%] translate-y-[-50%]'>
                                <i onClick={() => imageRef.current.click()} className='bx bx-image cursor-pointer' ></i>
                                <i onClick={() => handleSentMessage()} className='bx bx-send cursor-pointer' ></i>
                            </div>
                        </div>
                    </>
                )}
            </div>

        </section>
    )
}

export default FormMessageArea