import { appointmentContext } from '@/context/AppointmentContext'
import { authContext } from '@/context/AuthContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'

const FormSignUpAppointment = ({ visible, hidden }) => {

    const [currentStep, setCurrentStep] = useState(1)

    return (
        <div style={visible ? { height: 'auto', width: '70%', transition: '0.3s' } : { height: 0, width: 0, transition: '0.3s' }} className='z-50 w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex'>
                    <div className='min-w-[100%] h-full px-[2rem] py-[1.5rem] flex justify-center'>
                        <div className='w-full h-full px-[2rem] py-[1.5rem] flex justify-center'>
                            <img src='/sign.png' width={'40%'} />
                            <div className='w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-3'>
                                <h2 className='text-[20px] font-medium mb-1'>Đăng Nhập Tài Khoản</h2>
                                <input placeholder='Số Điện Thoại (+84)' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                <input placeholder='Mật Khẩu' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                <Link className='text-[13px] font-medium' href={''}>Quên Mật Khẩu</Link>
                                <button className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] h-[37px] rounded-lg'>Đăng Nhập</button>
                                {/* <span className='text-[14px]'>Hoặc</span>
                            <button className='hover:scale-[1.05] shadow transition-all text-[14px] bg-[#e9e9e9] flex items-center gap-2 w-[270px] px-[3rem] h-[37px] rounded-lg'><i className='bx bxl-google text-[25px] text-[#545454]' ></i>Tiếp Tục Với Google</button> */}
                            </div>
                        </div>
                        <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                    </div>
                    <div className='min-w-[100%] h-full px-[2rem] py-[1.5rem] flex justify-center'>
                        <div className='w-full h-full px-[2rem] py-[1.5rem] flex justify-center'>
                            <img src='/sign.png' width={'40%'} />
                            <div className='w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-3'>
                                <h2 className='text-[20px] font-medium mb-1'>Đăng Nhập Tài Khoản</h2>
                                <input placeholder='Số Điện Thoại (+84)' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                <input type='password' placeholder='Mật Khẩu' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                <Link className='text-[13px] font-medium' href={''}>Quên Mật Khẩu</Link>
                                <button className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] h-[37px] rounded-lg'>Đăng Nhập</button>
                                {/* <span className='text-[14px]'>Hoặc</span>
                            <button className='hover:scale-[1.05] shadow transition-all text-[14px] bg-[#e9e9e9] flex items-center gap-2 w-[270px] px-[3rem] h-[37px] rounded-lg'><i className='bx bxl-google text-[25px] text-[#545454]' ></i>Tiếp Tục Với Google</button> */}
                            </div>
                        </div>
                        <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormSignUpAppointment