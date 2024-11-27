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
                                                {message.vitals.height !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/height.png' width={'30px'} />
                                                        <span className='font-bold'>{((message.vitals.height / 100) + '').split('.')[0] + 'm' + ((message.vitals.height / 100) + '').split('.')[1]}</span>
                                                    </div>
                                                )}
                                                {message.vitals.weight !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/weight.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.weight} kg</span>
                                                    </div>
                                                )}
                                                {(message.vitals.weight !== 0 && message.vitals.height !== 0) && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/bmi.png' width={'30px'} />
                                                        <span className='font-bold'>{(message.vitals.weight / ((message.vitals.height / 100) * (message.vitals.height / 100))).toFixed(2)}</span>
                                                    </div>
                                                )}
                                                {message.vitals.temperature !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/tempurature.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.temperature}°C</span>
                                                    </div>
                                                )}
                                                {message.vitals.bloodPressure !== '' && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/bloodpressure.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.bloodPressure} mmHg</span>
                                                    </div>
                                                )}
                                                {message.vitals.heartRate !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/heartbeat.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.heartRate}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className='text-[15px]'>{!message.content ? 'Tôi vừa cập nhật thông tin sức khỏe' : message.content}</span>
                                            <span className='text-[12px]'>{message.time.time}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        } else {
                            if (message.type === 'TEXT') {
                                return <div key={index} className='w-full flex items-center justify-start'>
                                    <div className='flex w-[60%] items-center gap-2'>
                                        <div style={{ backgroundImage: `url(${currentUser === 'PATIENT' ? currentRoom?.doctor?.image : currentRoom?.patient?.image})` }} className='bg-cover w-[40px] aspect-square rounded-full' />
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
                                        <div style={{ backgroundImage: `url(${currentUser === 'PATIENT' ? currentRoom?.doctor?.image : currentRoom?.patient?.image})` }} className='bg-cover w-[40px] aspect-square rounded-full' />
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
                                        <div style={{ backgroundImage: `url(${currentUser === 'PATIENT' ? currentRoom?.doctor?.image : currentRoom?.patient?.image})` }} className='bg-cover w-[40px] aspect-square rounded-full' />
                                        <div className='flex flex-col w-auto px-3 py-2 gap-2 bg-[#eee] rounded-2xl'>
                                            <div className='text-[15px] flex gap-4'>
                                                {message.vitals.height !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/height.png' width={'30px'} />
                                                        <span className='font-bold'>{((message.vitals.height / 100) + '').split('.')[0] + 'm' + ((message.vitals.height / 100) + '').split('.')[1]}</span>
                                                    </div>
                                                )}
                                                {message.vitals.weight !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/weight.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.weight} kg</span>
                                                    </div>
                                                )}
                                                {(message.vitals.weight !== 0 && message.vitals.height !== 0) && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/bmi.png' width={'30px'} />
                                                        <span className='font-bold'>{(message.vitals.weight / ((message.vitals.height / 100) * (message.vitals.height / 100))).toFixed(2)}</span>
                                                    </div>
                                                )}
                                                {message.vitals.temperature !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/tempurature.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.temperature}°C</span>
                                                    </div>
                                                )}
                                                {message.vitals.bloodPressure !== '' && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/bloodpressure.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.bloodPressure} mmHg</span>
                                                    </div>
                                                )}
                                                {message.vitals.heartRate !== 0 && (
                                                    <div className='flex items-center gap-1'>
                                                        <img src='/heartbeat.png' width={'30px'} />
                                                        <span className='font-bold'>{message.vitals.heartRate}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <span className='text-[15px]'>{!message.content ? 'Tôi vừa cập nhật thông tin sức khỏe' : message.content}</span>
                                            <span className='text-[12px]'>{message.time.time}</span>
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