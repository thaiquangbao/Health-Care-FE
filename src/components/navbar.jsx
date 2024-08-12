'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import Logo from './logo'
import Link from 'next/link'
import { authContext } from '@/context/AuthContext'
import { userContext } from '@/context/UserContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { useRouter } from 'next/navigation'
import { appointmentContext } from '@/context/AppointmentContext'

const Navbar = () => {
    const { globalHandler } = useContext(globalContext)
    const [scrollY, setScrollY] = useState(0);
    const navbarRef = useRef()
    const [height, setHeight] = useState(0)
    const [visibleDatKham, setVisibleDatKham] = useState(false)
    const { authData, authHandler } = useContext(authContext)
    const { userData, userHandler } = useContext(userContext)
    const [user, setUser] = useState()
    const [visibleUserInfo, setVisibleUserInfo] = useState(false)
    const { appointmentHandler } = useContext(appointmentContext)
    const router = useRouter()

    const handleScroll = () => {
        setScrollY(globalThis.window.scrollY);
    };

    useEffect(() => {
        if (userData.user) {
            setUser(userData.user)
        }
    }, [userData.user])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleSignOut = () => {
        globalHandler.notify(notifyType.LOADING, "Đang Đăng Xuất")
        if (userData.user?.role === 'DOCTOR') {
            router.push('/')
        }
        setTimeout(() => {
            globalThis.localStorage.removeItem('accessToken')
            globalThis.localStorage.removeItem('refreshToken')
            globalHandler.notify(notifyType.SUCCESS, "Đăng Xuất Thành Công")
            userHandler.setUser(undefined)
            globalHandler.reload()
        }, 500)
    }

    useEffect(() => {
        if (authData.visibleMore) {
            authHandler.showWrapper()
        } else {
            authHandler.hiddenWrapper()
        }
    }, [authData.visibleMore])

    useEffect(() => {
        if (navbarRef.current) {
            setHeight(navbarRef.current.offsetHeight)
        }
    }, [navbarRef.current])

    return (
        <>
            <div ref={navbarRef} style={{ background: scrollY !== 0 ? 'white' : '0', transition: '0.5s' }} className="flex shadow-sm items-center justify-between w-screen fixed top-0 left-0 py-1 px-[2rem] z-[3] text-[14px] font-medium">
                <Logo />
                <div className="flex gap-2 text-[14px] items-center">
                    {/* {(userData.user && userData.user?.processSignup === 3) ?
                    <div className='flex items-center gap-3 relative'>
                        <span>{user?.fullName}</span>
                        <div onClick={() => setVisibleUserInfo(!visibleUserInfo)} style={{ backgroundImage: `url(${user?.image})`, backgroundSize: 'cover' }} className='rounded-full cursor-pointer h-[40px] w-[40px]' />
                        <div style={visibleUserInfo ? { height: 'auto', transition: '0.5s' } : { height: 0, transition: '0.5s' }} className='z-50 w-[200px] shadow-lg overflow-hidden absolute right-0 top-[45px] bg-[white] rounded-md '>
                            <div className='w-full flex py-1 flex-col px-2 items-start'>
                                <button className='w-full my-[5px]'><Link href={'/ho-so'}>Thông Tin Cá Nhân</Link></button>
                                <button onClick={() => handleSignOut()} className='w-full my-[5px]'>Đăng Xuất</button>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <Link href={'/bac-si-noi-bat'}><button className="text-[white] bg-[#1dcbb6] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">Đặt Lịch Khám</button></Link>
                        <Link href={'/bac-si-noi-bat'}><button className="text-[white] bg-[blue] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">Tải Ứng Dụng Ngay</button></Link>
                    </>
                } */}
                    <button onClick={() => authHandler.setVisibleMore(!authData.visibleMore)} className='flex items-center gap-2 mr-4'>
                        <span className='text-[15px] font-normal'>Trang Chủ</span>
                        <i className="text-[23px] text-[#585858] fa-solid fa-list"></i>
                    </button>
                    <Link href={'/bac-si-noi-bat'}><button className="text-[white] bg-[#1dcbb6] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">Đặt Lịch Khám</button></Link>
                    <Link href={'/bac-si-noi-bat'}><button className="text-[white] bg-[blue] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">Tải Ứng Dụng Ngay</button></Link>
                </div>
            </div>
            <div style={{ right: authData.visibleMore ? 0 : '-100%' }} className='z-[49] h-screen w-[300px] bg-[white] fixed top-0 transition-all'>
                <button onClick={() => authHandler.setVisibleMore(false)}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
                <ul className='flex flex-col gap-8 py-[3rem] px-[1.5rem]'>
                    {userData.user?.role !== 'DOCTOR' ? (
                        <>
                            {userData.user && (
                                <li onClick={() => {
                                    router.push('/ho-so')
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer items-center'>
                                    <img src={userData.user.image} className='rounded-full' width={'45px'} />
                                    <span className='text-[17px] font-semibold'>{userData.user.role === 'DOCTOR' && 'BS. '}{userData.user.fullName}</span>
                                </li>
                            )}
                            <li onClick={() => {
                                router.push('/')
                                authHandler.hiddenWrapper()
                                authHandler.setVisibleMore(false)
                            }} className='flex gap-3 cursor-pointer'>
                                <i className='bx text-[#567fea] bxs-home text-[23px]'></i>
                                <span className='text-[16px] font-medium'>Trang Chủ</span>
                            </li>
                            <li onClick={() => {
                                router.push('/cac-dich-vu')
                                authHandler.hiddenWrapper()
                                authHandler.setVisibleMore(false)
                            }} className='flex gap-3 cursor-pointer'>
                                <i className='bx text-[#ed4c4c] bxs-plus-circle text-[23px]'></i>
                                <span className='text-[16px] font-medium'>Các Dịch Vụ</span>
                            </li>
                            <li onClick={() => {
                                router.push('/bac-si-noi-bat')
                                authHandler.hiddenWrapper()
                                authHandler.setVisibleMore(false)
                            }} className='flex gap-3 cursor-pointer'>
                                <i className="text-[#4ce1c6] text-[23px] fa-solid fa-user-doctor"></i>
                                <span className='text-[16px] font-medium'>Đội Ngũ Bác Sĩ</span>
                            </li>
                            <li onClick={() => {
                                router.push('/')
                                authHandler.hiddenWrapper()
                                authHandler.setVisibleMore(false)
                            }} className='flex gap-3 cursor-pointer'>
                                <i className='text-[#fb3997] fa-solid fa-comment text-[23px]'></i>
                                <span className='text-[16px] font-medium'>Thảo Luận</span>
                            </li>
                            <li onClick={() => {
                                router.push('/')
                                authHandler.hiddenWrapper()
                                authHandler.setVisibleMore(false)
                            }} className='flex gap-3 cursor-pointer'>
                                <i className='text-[#ff7834] fa-solid fa-blog text-[23px]'></i>
                                <span className='text-[16px] font-medium'>Cẩm Nang</span>
                            </li>
                            {!userData.user && (
                                <li className='flex items-center gap-3 justify-center'>
                                    <button onClick={() => {
                                        authHandler.setVisibleMore(false)
                                        setTimeout(() => {
                                            authHandler.showSignUp()
                                        }, 700);
                                    }} className="text-[white] bg-[blue] w-[110px] py-2 rounded-xl hover:scale-[1.05] transition-all">Đăng Ký</button>
                                    <button onClick={() => {
                                        authHandler.setVisibleMore(false)
                                        setTimeout(() => {
                                            authHandler.showSignIn()
                                        }, 700);
                                    }} className="text-[white] bg-[#1dcbb6] w-[110px] py-2 rounded-xl hover:scale-[1.05] transition-all">Đăng Nhập</button>
                                </li>
                            )}
                        </>
                    )
                        :
                        (
                            <>
                                <li onClick={() => {
                                    router.push('/ho-so')
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer items-center'>
                                    <img src={userData.user.image} className='rounded-full' width={'45px'} />
                                    <span className='text-[17px] font-semibold'>{userData.user.role === 'DOCTOR' && 'BS. '}{userData.user.fullName}</span>
                                </li>
                                <li onClick={() => {
                                    router.push('/cac-cuoc-hen')
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer'>
                                    <i className='bx text-[#567fea] bxs-home text-[23px]'></i>
                                    <span className='text-[16px] font-medium'>Các Cuộc Hẹn</span>
                                </li>
                                <li onClick={() => {
                                    router.push('/ho-so-ca-nhan-bac-si')
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer'>
                                    <i className='bx text-[#ed4c4c] bxs-plus-circle text-[23px]'></i>
                                    <span className='text-[16px] font-medium'>Hồ Sơ Bác Sĩ</span>
                                </li>
                                <li onClick={() => {
                                    router.push('/')
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer'>
                                    <i className='text-[#fb3997] fa-solid fa-comment text-[23px]'></i>
                                    <span className='text-[16px] font-medium'>Thảo Luận</span>
                                </li>
                                <li onClick={() => {
                                    router.push('/')
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer'>
                                    <i className='text-[#ff7834] fa-solid fa-blog text-[23px]'></i>
                                    <span className='text-[16px] font-medium'>Cẩm Nang</span>
                                </li>
                                <li onClick={() => {
                                    handleSignOut()
                                    authHandler.hiddenWrapper()
                                    authHandler.setVisibleMore(false)
                                }} className='flex gap-3 cursor-pointer'>
                                    <i className='text-[#000000] fa-solid fa-right-from-bracket text-[23px]'></i>
                                    <span className='text-[16px] font-medium'>Đăng Xuất</span>
                                </li>
                            </>
                        )
                    }
                </ul>
            </div>
            <div style={{ height: height + 'px' }} className='w-full z-0'></div>
        </>
    )
}

export default Navbar