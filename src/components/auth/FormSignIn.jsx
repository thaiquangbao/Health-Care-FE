import { appointmentContext } from '@/context/AppointmentContext'
import { authContext } from '@/context/AuthContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { auth } from '../firebase/firebase'
import { formatPhoneByFireBase } from '@/utils/phone'

const FormSignIn = ({ visible, hidden }) => {

    const [info, setInfo] = useState({
        userName: '',
        passWord: ''
    })
    const [phone, setPhone] = useState('')
    const { globalHandler } = useContext(globalContext)
    const { authHandler } = useContext(authContext)
    const { userHandler } = useContext(userContext)
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const [currentStep, setCurrentStep] = useState(1)
    const [verification, setVerification] = useState()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const recaptchaRef = useRef(null);
    const [otp, setOtp] = useState('')
    const router = useRouter()

    const handleCheckAuth = () => {
        if (!/^0[0-9]{9}$/.test(phone)) {
            globalHandler.notify(notifyType.WARNING, "Số điện thoại không hợp lệ") // sửa ở đây
            return
        }
        api({ path: '/auth/check-auth', type: TypeHTTP.POST, body: { phone } })
            .then(res => {
                setCurrentStep(3)
            }).catch(error => {
                globalHandler.notify(notifyType.WARNING, "Số điện thoại không tồn tại")
            })
    }
    const handleSubmitChangePassword = () => {
        if (password.length < 6) {
            globalHandler.notify(notifyType.WARNING, "Mật khẩu phải lớn hơn 6 ký tự")
            return
        }
        if (password !== confirmPassword) {
            globalHandler.notify(notifyType.WARNING, "Mật khẩu xác nhận phải trùng khớp với mật khẩu")
            return
        }

        api({ path: '/auth/take-password/patient', type: TypeHTTP.POST, body: { phone, newPassWord: password } })
            .then(res => {
                globalHandler.notify(notifyType.SUCCESS, "Đổi mật khẩu thành công")
                setCurrentStep(1)
            })
    }
    const handleSignIn = () => {
        if (!/^0[0-9]{9}$/.test(info.userName)) {
            globalHandler.notify(notifyType.WARNING, "Số điện thoại không hợp lệ")
            return
        }
        if (info.passWord.length < 6) {
            globalHandler.notify(notifyType.WARNING, "Mật khẩu phải lớn hơn 6 ký tự")
            return
        }
        globalHandler.notify(notifyType.LOADING, "Đang Xác Thực Thông Tin")
        api({ sendToken: false, type: TypeHTTP.POST, path: '/auth/login', body: { userName: info.userName, passWord: info.passWord } })
            .then(res => {
                if (res.data?.processSignup === 3) {
                    if (res.data?.role === 'ADMIN') {
                        globalHandler.notify(notifyType.FAIL, "Vui Lòng đăng nhập bằng tài khoản người dùng")
                    } else {
                        userHandler.setUser(res.data)
                        globalThis.localStorage.setItem('accessToken', res.token.accessToken)
                        globalThis.localStorage.setItem('refreshToken', res.token.refreshToken)
                        globalHandler.notify(notifyType.SUCCESS, "Đăng Nhập Thành Công")
                        hidden()
                        if (res.data.role === 'DOCTOR') {
                            api({ path: `/doctorRecords/getById/${res.data._id}`, type: TypeHTTP.GET, sendToken: false })
                                .then(record => {
                                    appointmentHandler.setDoctorRecord(record)
                                    router.push('/phieu-dang-ky')
                                })
                        }
                    }
                } else {
                    userHandler.setUser(res.data)
                    globalHandler.notify(notifyType.WARNING, "Bạn cần hoàn tất thông tin đăng ký")
                    hidden()
                    setTimeout(() => {
                        authHandler.showSignUp()
                    }, 500);
                }
            })
            .catch(error => {
                globalHandler.notify(notifyType.FAIL, error.message)
            })
    }

    useEffect(() => {
        if (phone !== '' && currentStep === 3) {
            setTimeout(() => {
                const recaptchaContainer = recaptchaRef.current;
                if (recaptchaContainer) {
                    const recaptcha = new RecaptchaVerifier(auth, recaptchaContainer, {
                        'size': 'invisible',
                        'callback': (response) => {
                            console.log(response)
                            console.log('reCAPTCHA solved');
                        },
                        'expired-callback': () => {
                            console.log('reCAPTCHA expired');
                        }
                    });
                    signInWithPhoneNumber(auth, formatPhoneByFireBase(phone), recaptcha)
                        .then(confirmation => {
                            setVerification(confirmation);
                        })
                        .catch(error => {
                            console.error('Error during phone number sign-in:', error);
                        });
                }
            }, 100); // delay 100ms
        }
    }, [info.phone, currentStep]);

    const handleSubmitOTPWithPhoneNumber = () => {
        if (otp === '') {
            globalHandler.notify(notifyType.WARNING, "Vui lòng nhập mã xác minh")
            return
        }
        globalHandler.notify(notifyType.LOADING, 'Đang xác thực tài khoản')
        verification.confirm(otp)
            .then(data => {
                globalHandler.notify(notifyType.SUCCESS, 'Xác Thực Tài Khoản Thành Công')
                setCurrentStep(4)
            })
            .catch(() => {
                globalHandler.notify(notifyType.FAIL, 'Mã xác minh không đúng')
            })
    }

    return (
        <div style={visible ? { height: 'auto', width: '70%', transition: '0.3s' } : { height: 0, width: 0, transition: '0.3s' }} className='z-50 w-[70%] min-h-[100px] overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex'>
                    <div className='min-w-[100%] h-full px-[2rem] py-[1.5rem] flex justify-center'>
                        <div className='w-full h-full px-[2rem] py-[1.5rem] flex justify-center'>
                            <img src='/sign.png' width={'40%'} />
                            <div className='w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-3'>
                                <h2 className='text-[20px] font-medium mb-1'>Đăng Nhập Tài Khoản</h2>
                                <input value={info.userName} onChange={e => setInfo({ ...info, userName: e.target.value })} placeholder='Số Điện Thoại (+84)' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                <input type='password' value={info.passWord} onChange={e => setInfo({ ...info, passWord: e.target.value })} placeholder='Mật Khẩu' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                                <span className='text-[13px] font-medium cursor-pointer' onClick={() => setCurrentStep(2)}>Quên Mật Khẩu</span>
                                <button onClick={() => handleSignIn()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] h-[37px] rounded-lg'>Đăng Nhập</button>
                                {/* <span className='text-[14px]'>Hoặc</span>
                            <button className='hover:scale-[1.05] shadow transition-all text-[14px] bg-[#e9e9e9] flex items-center gap-2 w-[270px] px-[3rem] h-[37px] rounded-lg'><i className='bx bxl-google text-[25px] text-[#545454]' ></i>Tiếp Tục Với Google</button> */}
                            </div>
                        </div>
                        <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                        {currentStep !== 1 && (
                            <button className='absolute left-2 top-2 flex items-center gap-1' onClick={() => setCurrentStep(prev => prev - 1)}>
                                <i className='bx bx-chevron-left text-[30px] text-[#5e5e5e]'></i>
                                <span className='text-[14px]'>Quay Về</span>
                            </button>
                        )}
                    </div>
                    <div className='min-w-[100%] h-full px-[2rem] py-[1.5rem] flex justify-center'>
                        <img src='/sign.png' width={'40%'} />
                        <div className='w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-1'>
                            <h2 className='text-[20px] font-medium '>Xác minh số điện thoại của bạn</h2>
                            <span className='text-[13px]'>Vui lòng nhập số điện thoại của bạn bên dưới</span>
                            <input onChange={e => setPhone(e.target.value)} value={phone} placeholder='Số Điện Thoại' className='text-[14px] mt-2 w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <button onClick={() => handleCheckAuth()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] mt-2 h-[37px] rounded-lg'>Xác Thực Tài Khoản</button>
                        </div>
                    </div>
                    <div className='min-w-[100%] h-full px-[2rem] py-[1.5rem] flex justify-center'>
                        <img src='/sign.png' width={'40%'} />
                        <div className='w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-1'>
                            <h2 className='text-[20px] font-medium '>Xác Thực Tài Khoản Trước Khi Thay Đổi Mật Khẩu</h2>
                            <span className='text-[13px]'>Một mã xác minh đã được gửi đến số điện thoại {info.phone}. Vui lòng nhập mã xác minh bên dưới</span>
                            <div id='recaptcha' ref={recaptchaRef}></div>
                            <input onChange={e => setOtp(e.target.value)} value={otp} placeholder='Mã Xác Thực' className='text-[14px] mt-2 w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <button onClick={() => handleSubmitOTPWithPhoneNumber()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] mt-2 h-[37px] rounded-lg'>Xác Thực Tài Khoản</button>
                        </div>
                    </div>
                    <div className='min-w-[100%] h-full px-[2rem] py-[1.5rem] flex justify-center'>
                        <img src='/sign.png' width={'40%'} />
                        <div className='w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-2'>
                            <h2 className='text-[20px] font-medium '>Thay Đổi Mật Khẩu Của Bạn</h2>
                            <span className='text-[13px]'>Hãy bổ sung mật khẩu mới và xác nhận mật khẩu mới</span>
                            <input type='password' onChange={e => setPassword(e.target.value)} value={password} placeholder='Mật Khẩu Mới' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <input type='password' onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder='Xác Nhận Mật Khẩu Mới' className='text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <button onClick={() => handleSubmitChangePassword()} className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] h-[37px] rounded-lg'>Thay Đổi Mật Khẩu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FormSignIn