import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import React, { useContext, useEffect, useRef, useState } from 'react'

const ChatBot = () => {

    const { userData } = useContext(userContext)
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState([{ sender: 'chatbot', message: 'Chào bạn, tôi có thể giúp gì cho bạn trong lĩnh vực y khoa?' }])
    const [message, setMessage] = useState('')
    const [previous, setPrevious] = useState('')
    const messageRef = useRef()

    useEffect(() => {
        if (userData.user && userData.user?.processSignup === 3) {
            setMessages([{ sender: 'chatbot', message: `Chào ${userData.user.fullName.split(' ')[userData.user.fullName.split(' ').length - 1]}, tôi có thể giúp gì cho bạn trong lĩnh vực y khoa về bệnh tim mạch?` }])
        }
    }, [userData.user])

    useEffect(() => {
        if (userData.user && userData.user?.processSignup === 3) {
            if (open) {
                document.querySelector('.form').classList.add('shadow-2xl')
            } else {
                document.querySelector('.form').classList.remove('shadow-2xl')
            }
        }
    }, [open])

    useEffect(() => {
        setTimeout(() => {
            messageRef.current?.scrollTo({
                top: messageRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }, 500);
    }, [messages])

    const handleSendMessage = () => {
        const content = message
        setMessage('')
        setMessages([...messages, { sender: 'me', message: content }, { sender: 'chatbot', message: 'Đang trả lời câu hỏi của bạn', type: 'notify' }])
        api({ type: TypeHTTP.POST, sendToken: false, path: `/chats/ask`, body: { content: content, previous } })
            .then(res => {
                setMessages([...messages, { sender: 'me', message: content }, { sender: 'chatbot', message: res }])
                setPrevious(prev => prev + content + ' : ' + res)
            })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage()
        }
    };

    if (userData.user) {
        return (
            <div style={open ? { backgroundColor: '#FFFDFD', width: '400px', height: '500px', transition: '0.5s', } : { width: '60px', height: '60px', transition: '0.5s' }} className='form rounded-md overflow-hidden fixed z-[45] bottom-3 right-3'>
                {open ?
                    <div className='flex flex-col'>
                        <button onClick={() => setOpen(false)}><i className='bx bx-x text-[27px] text-[#999] absolute top-1 right-1'></i></button>
                        <div className='w-full h-[60px] flex items-center gap-1 px-2 border-[#eeeeee] border-b-[1px]'>
                            <img src='/doctor-chatbot.png' width={'50px'} />
                            <div className='flex flex-col'>
                                <span className='text-[14px] font-semibold'>HealthHaven ChatBot</span>
                                <div className='flex items-center gap-2'>
                                    <div className='bg-[green] rounded-full w-[10px] h-[10px]' />
                                    <span className='text-[12px]'>Hoạt động 24/7</span>
                                </div>
                            </div>
                        </div>
                        <div ref={messageRef} className='w-full h-[385px] flex flex-col gap-4 px-2 py-2 overflow-y-auto'>
                            {messages.map((item, index) => (
                                <div style={{ justifyContent: item.sender === 'me' ? 'right' : 'left' }} className='w-full text-[14px] flex items-start' key={index}>
                                    {item.sender !== 'me' && <img src='/doctor-chatbot.png' width={'35px'} />}
                                    {item.type ?
                                        <div className='text-[13px] translate-y-2'>
                                            {item.message}
                                        </div>
                                        :
                                        <div className='max-w-[70%] bg-[#eaeaea] rounded-md p-2 flex items-start'>
                                            {item.message}
                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                        <div className='w-full h-[60px] flex px-1 gap-1 items-center'>
                            <input onKeyDown={handleKeyDown} value={message} onChange={e => setMessage(e.target.value)} placeholder='Nhập câu hỏi của bạn' className='text-[13px] w-full border-[#ddd] border-[1px] rounded-md h-[35px] focus:outline-0 px-2' />
                            <button onClick={() => handleSendMessage()} className='text-[14px] bg-[blue] text-[white] px-3 h-[35px] rounded-md'>Gửi</button>
                        </div>
                    </div>
                    :
                    <>
                        <img onClick={() => setOpen(true)} src={'/chatbot.png'} className='w-[60px] cursor-pointer' />
                    </>
                }
            </div >
        )
    }
}

export default ChatBot