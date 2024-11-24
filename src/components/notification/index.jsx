
import { notifyType } from '@/context/GlobalContext'
import React, { useEffect, useState } from 'react'

const Notification = ({ status, message, setInfomation }) => {

    const [info, setInfo] = useState({ status: 'none', message: '' })
    useEffect(() => {
        setInfo({ status, message })
    }, [status])

    return (
        <div style={{ right: info.status === 'none' ? '-500px' : '8px', transition: '0.3s', backgroundColor: (info.status === notifyType.SUCCESS || info.status === notifyType.HEALTH) ? 'white' : info.status === notifyType.FAIL ? 'red' : info.status === notifyType.LOADING ? 'white' : 'yellow', color: info.status === notifyType.SUCCESS ? 'black' : info.status === notifyType.FAIL ? 'white' : info.status === notifyType.LOADING ? 'black' : '#6b6b6b' }} className='items-center px-3 flex w-[270px] shadow-xl z-50 rounded-md min-h-[70px] fixed top-4'>
            {info.status === notifyType.HEALTH ?
                <i className='fa-solid fa-notes-medical text-[green] text-[40px]'></i>
                :
                info.status === notifyType.SUCCESS ?
                    <i className='bx bx-check-circle text-[green] text-[40px]'></i>
                    :
                    info.status === notifyType.FAIL ?
                        <i className='bx bx-bug-alt text-[40px] text-[white]' ></i>
                        :
                        info.status === notifyType.LOADING ?
                            <div role="status">
                                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                            </div>
                            :
                            <i className='bx bx-info-circle text-[40px] text-[#6b6b6b]' ></i>

            }
            <div className='flex flex-col justify-center ml-3'>
                <span className='text-[14px] font-semibold'>{info.status === notifyType.HEALTH ? 'Thông Tin Sức Khỏe' : info.status === notifyType.SUCCESS ? 'Thành Công' : info.status === notifyType.FAIL ? 'Thất Bại' : info.status === notifyType.WARNING ? 'Cảnh báo' : 'Đang Tải'}</span>
                <span className='text-[12px]'>{info.message}</span>
            </div>
            <i style={{ color: (info.status === notifyType.SUCCESS || info.status === notifyType.LOADING || info.status === notifyType.HEALTH) ? '#999' : info.status === notifyType.WARNING ? '#6b6b6b' : 'white' }} onClick={() => setInfo({ status: 'none', message: '' })} className='bx bx-x absolute top-1 right-1 text-[21px] cursor-pointer' ></i>
        </div>
    )
}

export default Notification