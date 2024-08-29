import { userContext } from '@/context/UserContext'
import React, { useContext } from 'react'

const MessageArea = ({ messageRef, wrapperRef, messages, currentUser, currentRoom, height }) => {

    const { userData } = useContext(userContext)

    return (
        <div ref={wrapperRef} style={{ height }} className='w-full flex flex-col overflow-auto px-[2rem] py-[1rem]'>
            <div ref={messageRef} className='flex flex-col w-full gap-2'>
                {messages && messages.map((message, index) => {
                    if (message.author === 'SYSTEM') {
                        return <div key={index} className='w-full flex items-center justify-center'>
                            <span className='text-[14px] py-2 px-4 rounded-2xl bg-[#f5f5f5]'>{message.content}</span>
                        </div>
                    } else {
                        if (message.author === currentUser) {
                            if (message.type === 'TEXT') {
                                return <div key={index} className='w-full flex items-center justify-end'>
                                    <div className='flex gap-2 items-start'>
                                        <div className='flex flex-col w-full px-3 py-1 bg-[#eee] rounded-2xl'>
                                            <span className='text-[15px]'>{message.content}</span>
                                            <span className='text-[12px]'>{message.time.time}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            else if (message.type === 'IMAGE') {
                                return <div key={index} className='w-full flex items-center justify-end'>
                                    <div className='flex gap-2 items-center'>
                                        <div className='flex flex-col w-auto px-3 py-1 bg-[#eee] rounded-2xl'>
                                            <img src={message.content} width={'400px'} className='rounded-lg my-2' />
                                            <span className='text-[12px]'>{message.time.time}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            else {
                                return <div key={index} className='w-full flex items-center justify-end'>
                                    <div className='flex gap-2 items-start'>
                                        <div className='flex flex-col w-full px-3 py-2 gap-2 bg-[#eee] rounded-2xl'>
                                            <div className='text-[15px] flex gap-4'>
                                                <div className='flex items-center gap-1'>
                                                    <img src='/heartbeat.png' width={'30px'} />
                                                    <span className='font-bold'>120 bpm</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <img src='/bloodpressure.png' width={'30px'} />
                                                    <span className='font-bold'>120 mmHg</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <img src='/tempurature.png' width={'30px'} />
                                                    <span className='font-bold'>36 °C</span>
                                                </div>
                                            </div>
                                            <span className='text-[15px]'>Tôi mới vừa luyện tập xong ấy mà</span>
                                            <span className='text-[12px]'>5:09 AM</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        } else {
                            if (message.type === 'TEXT') {
                                return <div key={index} className='w-full flex items-center justify-start'>
                                    <div className='flex w-[60%] items-center gap-2'>
                                        <div style={{ backgroundImage: `url(${currentUser === 'PATIENT' ? currentRoom?.doctor?.image : currentRoom?.patient?.image})` }} className='bg-cover w-[60px] aspect-square rounded-full' />
                                        <div className='flex flex-col w-auto px-3 py-1 bg-[#eee] rounded-2xl'>
                                            <span className='text-[15px]'>{message.content}</span>
                                            <span className='text-[12px]'>{message.time.time}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            else if (message.type === 'IMAGE') {
                                return <div key={index} className='w-full flex items-center justify-start'>
                                    <div className='flex items-center gap-2'>
                                        <div style={{ backgroundImage: `url(${currentUser === 'PATIENT' ? currentRoom?.doctor?.image : currentRoom?.patient?.image})` }} className='bg-cover w-[60px] aspect-square rounded-full' />
                                        <div className='flex flex-col w-auto px-3 py-1 bg-[#eee] rounded-2xl'>
                                            <img src={message.content} width={'400px'} className='rounded-lg my-2' />
                                            <span className='text-[12px]'>{message.time.time}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                            else {
                                return <div key={index} className='w-full flex items-center justify-start'>
                                    <div className='flex w-[60%] items-center gap-2'>
                                        <div style={{ backgroundImage: `url(${currentUser === 'PATIENT' ? currentRoom?.doctor?.image : currentRoom?.patient?.image})` }} className='bg-cover w-[60px] aspect-square rounded-full' />
                                        <div className='flex flex-col w-auto px-3 py-2 gap-2 bg-[#eee] rounded-2xl'>
                                            <div className='text-[15px] flex gap-4'>
                                                <div className='flex items-center gap-1'>
                                                    <img src='/heartbeat.png' width={'30px'} />
                                                    <span className='font-bold'>120 bpm</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <img src='/bloodpressure.png' width={'30px'} />
                                                    <span className='font-bold'>120 mmHg</span>
                                                </div>
                                                <div className='flex items-center gap-1'>
                                                    <img src='/tempurature.png' width={'30px'} />
                                                    <span className='font-bold'>36 °C</span>
                                                </div>
                                            </div>
                                            <span className='text-[15px]'>Tôi mới vừa luyện tập xong ấy mà</span>
                                            <span className='text-[12px]'>5:09 AM</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        }
                    }
                })}
            </div>
        </div>
    )
}

export default MessageArea