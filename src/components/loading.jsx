import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import { infinity } from 'ldrs'

const Loading = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            infinity.register()
            setIsMounted(true)
        }
    }, [])

    return (
        <div className="flex flex-col gap-[1rem] justify-center items-center w-full fixed top-0 left-0 h-screen z-50 pt-[1%] px-[5%] background-public">
            {isMounted && (
                <l-infinity
                    size="100"
                    stroke="5"
                    stroke-length={"0.25"}
                    bg-opacity={"0.1"}
                    speed="1.3"
                    color="#1dcbb6" />
            )}
        </div>
    )
}

export default Loading