'use client'
import ChatBot from "@/components/chatbot/ChatBot";
import Notification from "@/components/notification";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { userContext } from "./UserContext";
import { appointmentContext } from "./AppointmentContext";
export const globalContext = createContext()

export const notifyType = {
    SUCCESS: 'success',
    FAIL: 'fail',
    WARNING: 'warning',
    LOADING: 'loading',
    NONE: 'none'
}

const GlobalProvider = ({ children }) => {

    const [info, setInfo] = useState({ status: notifyType.NONE, message: '' })
    const { userHandler, userData } = useContext(userContext)
    const pathname = usePathname()
    const router = useRouter();
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)

    const notify = (status, message) => setInfo({ status, message })

    const reload = () => {
        setTimeout(() => { globalThis.window.location.reload() }, 1000)
    }

    useEffect(() => {
        if (info.status !== notifyType.NONE) {
            if (info.status !== notifyType.LOADING) {
                setTimeout(() => {
                    setInfo({ status: notifyType.NONE, message: '' })
                }, 3000);
            }
        }
    }, [info.status])


    useEffect(() => {
        api({ type: TypeHTTP.GET, sendToken: true, path: '/auth/userByToken' })
            .then(user => {
                if (user.role === "ADMIN") {
                    notify(notifyType.FAIL, 'Tài khoản của bạn không đủ quyền để truy cập')
                    globalThis.localStorage.removeItem('accessToken')
                    globalThis.localStorage.removeItem('refreshToken')
                } else {
                    userHandler.setUser(user)
                }
            })
            .catch((error) => {
                globalThis.localStorage.removeItem('accessToken')
                globalThis.localStorage.removeItem('refreshToken')
                // notify(notifyType.FAIL, error.message)
            })
    }, [pathname])

    useEffect(() => {
        const pathnames = ['/ho-so']
        const doctorPathname = ['/cuoc-hen', '/ho-so-ca-nhan-bac-si']
        if (pathname !== '/') {
            if (userData.user) {
                if (userData.user.role === 'ADMIN') {
                    notify(notifyType.FAIL, "Vui Lòng đăng nhập bằng tài khoản User")
                    userHandler.setUser()
                    globalThis.localStorage.removeItem('accessToken')
                    globalThis.localStorage.removeItem('refreshToken')
                } else {
                    if (pathnames.includes(pathname)) {

                    } else {
                        if (userData.user?.role !== 'DOCTOR') {
                            if (doctorPathname.includes(pathname)) {
                                router.push('/')
                            }
                        } else {
                            if (!doctorPathname.includes(pathname)) {
                                router.push('/cuoc-hen')
                            }
                        }
                    }
                }
            } else {
                if (doctorPathname.includes(pathname) || pathnames.includes(pathname)) {
                    router.push('/')
                }
            }
        }
    }, [pathname, userData.user])


    const data = {}
    const handler = {
        notify,
        reload
    }

    return (
        <globalContext.Provider value={{ globalData: data, globalHandler: handler }}>
            <Notification status={info.status} message={info.message} setInfomation={setInfo} />
            <ChatBot />
            {children}
        </globalContext.Provider >
    )
}

export default GlobalProvider