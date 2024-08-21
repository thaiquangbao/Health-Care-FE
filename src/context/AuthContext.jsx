'use client'
import FormSignIn from '@/components/auth/FormSignIn'
import FormSignUp from '@/components/auth/FormSignUp'
import Loading from '@/components/loading'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { userContext } from './UserContext'
import Wrapper from '@/components/wrapper'

export const authContext = createContext()

const AuthContext = ({ children }) => {

    const [visibleSignUp, setVisibleSignUp] = useState(false)
    const [visibleSignIn, setVisibleSignIn] = useState(false)
    const [visibleWrapper, setVisibleWrapper] = useState(false)
    const [visibleFormCreateBaiViet, setVisibleFormCreateBaiViet] = useState(false)
    const [visibleMore, setVisibleMore] = useState(false)
    const [visibleMedicalRecord, setVisibleMedicalRecord] = useState(false)
    const wrapperRef = useRef()
    const [loading, setLoading] = useState(true)
    const { userData } = useContext(userContext)

    const handleWaitTime = () => {
        if (!globalThis.localStorage.getItem('refreshToken'))
            return 1000
        else {
            // while (!userData.user) { }
            return 2000
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, handleWaitTime());
    }, [])

    const showWrapper = () => {
        wrapperRef.current.style.display = 'block'
        document.querySelector('body').style.overflow = 'hidden'
        setTimeout(() => {
            wrapperRef.current.style.opacity = 1
        }, 100);
    }

    const hiddenWrapper = () => {
        wrapperRef.current.style.opacity = 0
        document.querySelector('body').style.overflow = 'auto'
        setTimeout(() => {
            wrapperRef.current.style.display = 'none'
        }, 500);
    }

    const showSignUp = () => {
        showWrapper()
        setVisibleSignUp(true)
    }

    const hiddenSignUp = () => {
        hiddenWrapper()
        setVisibleSignUp(false)
    }

    const showSignIn = () => {
        showWrapper()
        setVisibleSignIn(true)
    }

    const hiddenSignIn = () => {
        hiddenWrapper()
        setVisibleSignIn(false)
    }

    const showFormCreateBaiViet = () => {
        showWrapper()
        setVisibleFormCreateBaiViet(true)
    }

    const hiddenFormCreateBaiViet = () => {
        hiddenWrapper()
        setVisibleFormCreateBaiViet(false)
    }

    const showMedicalRecord = () => {
        showWrapper()
        setVisibleMedicalRecord(true)
    }

    const hiddenMedicalRecord = () => {
        hiddenWrapper()
        setVisibleMedicalRecord(false)
    }

    const hidden = () => {
        hiddenWrapper();
        hiddenSignUp();
        hiddenSignIn();
        setVisibleMore(false)
        setVisibleFormCreateBaiViet(false)
        setVisibleMedicalRecord(false)
    }

    const data = {
        visibleMore,
        visibleFormCreateBaiViet,
        visibleMedicalRecord
    }

    const handler = {
        showSignUp,
        hiddenSignUp,
        showSignIn,
        hiddenSignIn,
        showWrapper,
        hiddenWrapper,
        setVisibleMore,
        hiddenFormCreateBaiViet,
        showFormCreateBaiViet,
        hiddenMedicalRecord,
        showMedicalRecord
    }

    return (
        <authContext.Provider value={{ authData: data, authHandler: handler }}>
            <div className='z-40'>
                <Wrapper wrapperRef={wrapperRef} onClick={hidden} />
                <FormSignUp visible={visibleSignUp} hidden={hiddenSignUp} />
                <FormSignIn visible={visibleSignIn} hidden={hiddenSignIn} />
                {children}
            </div>
            {loading && <Loading />}
        </authContext.Provider>
    )
}

export default AuthContext