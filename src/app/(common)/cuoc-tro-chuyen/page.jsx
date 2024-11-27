'use client'
import MessageArea from '@/components/cuoc-tro-chuyen/MessageArea'
import { auth } from '@/components/firebase/firebase'
import Navbar from '@/components/navbar'
import { healthContext } from '@/context/HealthContext'
import { userContext } from '@/context/UserContext'
import { api, baseURL, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYearTimeObject } from '@/utils/date'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
const socket = io.connect(baseURL)

const CuocTroChuyen = () => {

    const { userData } = useContext(userContext)
    const [rooms, setRooms] = useState([])
    const [currentRoom, setCurrentRoom] = useState()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState()
    const { healthHandler } = useContext(healthContext)
    const messageRef = useRef()
    const wrapperRef = useRef()
    const imageRef = useRef()
    const router = useRouter()

    useEffect(() => {
        if (!userData.user)
            router.push('/')
    }, [userData.user])

    useEffect(() => {
        if (userData.user && userData.user?.role === 'USER') {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/rooms/get-room-patient/${userData.user._id}` })
                .then(rooms => {
                    setRooms(rooms.filter(item => item.status === "ACTIVE"))
                })
        } else if (userData.user && userData.user?.role === 'DOCTOR') {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/rooms/get-room-doctor/${userData.user._id}` })
                .then(rooms => {
                    setRooms(rooms.filter(item => item.status === "ACTIVE"))
                })
        }
    }, [userData.user])

    useEffect(() => {
        if (currentRoom) {
            api({ type: TypeHTTP.GET, sendToken: true, path: `/messages/get-messages-rooms/${currentRoom._id}` })
                .then(messages => {
                    setMessages(messages[0])
                })
        }
    }, [currentRoom])

    const handleSentMessage = () => {
        if (message !== '') {
            const newMessage = {
                content: message,
                time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
                author: userData.user?.role === 'USER' ? 'PATIENT' : 'DOCTOR',
                type: 'TEXT'
            }
            const newMessages = JSON.parse(JSON.stringify(messages))
            newMessages.messages.push(newMessage)
            api({ sendToken: true, type: TypeHTTP.POST, path: '/messages/update', body: newMessages })

            const room = JSON.parse(JSON.stringify(currentRoom))
            room.lastMessage = {
                author: userData.user.role === 'USER' ? 'PATIENT' : 'DOCTOR',
                content: message,
                time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
            }
            api({ sendToken: true, type: TypeHTTP.POST, path: '/rooms/update', body: room })
            setMessage('')
        }
    }

    useEffect(() => {
        socket.on(`message.update${currentRoom?._id}`, (messages) => {
            setMessages(messages)
        })
        return () => {
            socket.off(`message.update${currentRoom?._id}`);
        }
    }, [socket, currentRoom?._id])

    useEffect(() => {
        socket.on(`room.update${currentRoom?._id}`, (room) => {
            setCurrentRoom(room)
            setRooms(prev => prev.map(item => {
                if (item._id === room._id) {
                    return room
                }
                return item
            }))
        })
        return () => {
            socket.off(`room.update${currentRoom?._id}`);
        }
    }, [socket, currentRoom?._id])

    useEffect(() => {
        wrapperRef.current?.scrollTo({
            top: messageRef.current?.offsetHeight,
            behavior: 'smooth'
        });
    }, [messageRef.current?.offsetHeight, messages?.messages])

    const handleShowHealthForm = () => {
        api({ type: TypeHTTP.GET, sendToken: true, path: `/healthLogBooks/findByPatient/${userData.user._id}` })
            .then(logBooks => {
                const logBook = logBooks.filter(item => item.doctor._id === currentRoom.doctor._id)[0]
                healthHandler.showUpdateHealthForm(logBook)
            })
    }

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


                const room = JSON.parse(JSON.stringify(currentRoom))
                room.lastMessage = {
                    author: userData.user.role === 'USER' ? 'PATIENT' : 'DOCTOR',
                    content: 'Đã gửi 1 hình ảnh',
                    time: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
                }
                api({ sendToken: true, type: TypeHTTP.POST, path: '/rooms/update', body: room })
                setMessage('')
            })
    }

    const handleKeyDown = async (event) => {
        if (event.code === 'Enter') {
            event.preventDefault();
            handleSentMessage()
        }
    };

    return (
        <div className="w-full overflow-hidden h-screen pt-[60px] flex flex-col">
            <Navbar />
            <div className='flex w-full h-screen items-center '>
                <div className='w-[23%] h-full flex flex-col px-[1rem] border-r-[1px] border-[#dedede]'>
                    <div className='w-full flex gap-3 h-[70px] items-center border-b-[1px] pb-1 border-[#dedede]'>
                        <div style={{ backgroundImage: `url(${userData.user?.image})` }} className='w-[45px] h-[45px] rounded-full bg-cover bg-start' />
                        <div className='flex flex-col'>
                            <span className='text-[16px] font-semibold'>{userData.user?.fullName}</span>
                            <div className='flex items-center gap-2'>
                                <div className="bg-[#00bf00] h-[12px] w-[12px] rounded-full"></div>
                                <span className='text-[13px] font-semibold'>Trực Tuyến</span>
                            </div>
                        </div>
                    </div>
                    <span className='text-[15px] font-bold mb-4 mt-4'>Cuộc Trò Chuyện ({rooms.length})</span>
                    <div className='flex flex-col h-[85%] overflow-auto'>
                        {rooms.map((room, index) => (
                            <div key={index} onClick={() => setCurrentRoom(room)} className='cursor-pointer w-full flex gap-3 transition-all rounded-lg py-[5px] px-2 hover:bg-[#f0f0f0]'>
                                <div style={{ backgroundImage: `url(${userData.user?.role === 'USER' ? room.doctor.image : room.patient.image})` }} className='w-[45px] h-[45px] rounded-full bg-cover bg-start' />
                                <div className='flex flex-col'>
                                    <span className='text-[14px] font-semibold'>{userData.user?.role === 'USER' ? room.doctor.fullName : room.patient.fullName}</span>
                                    <span className='text-[13px]'>
                                        {(userData.user?.role === 'USER' && room.lastMessage.author === 'PATIENT') && 'Bạn: '}
                                        {(userData.user?.role === 'USER' && room.lastMessage.author === 'DOCTOR') && 'Bác sĩ: '}
                                        {(userData.user?.role === 'DOCTOR' && room.lastMessage.author === 'PATIENT') && 'Bệnh nhân: '}
                                        {(userData.user?.role === 'DOCTOR' && room.lastMessage.author === 'DOCTOR') && 'Bạn: '}
                                        {room.lastMessage.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w-[77%] h-full relative flex flex-col items-center'>
                    {currentRoom && (
                        <>
                            <input type='file' onChange={e => handleSendImage(e)} ref={imageRef} className='hidden' />
                            <div className='flex w-[100%] h-[11%] px-[1.5rem] justify-between border-b-[1px] border-[#dedede]'>
                                <div className='flex gap-3 items-center'>
                                    <div style={{ backgroundImage: `url(${userData.user?.role === 'USER' ? currentRoom.doctor.image : currentRoom.patient.image})` }} className='w-[40px] h-[40px] rounded-full bg-cover bg-start' />
                                    <div className='flex flex-col'>
                                        <span className='text-[16px] font-semibold'>{userData.user?.role === 'USER' ? 'BS. ' + currentRoom.doctor.fullName : currentRoom.patient.fullName}</span>
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
                            <MessageArea height={'70%'} currentRoom={currentRoom} wrapperRef={wrapperRef} messageRef={messageRef} messages={messages?.messages} currentUser={userData.user?.role === "USER" ? 'PATIENT' : 'DOCTOR'} />
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
                <div className='w-[0%] h-full bg-[green]'>

                </div>
            </div>
        </div >
    )
}

export default CuocTroChuyen