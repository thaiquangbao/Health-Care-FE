'use client'
import React, { useEffect, useRef, useState } from 'react'

const Processing = ({ width, height, process, total }) => {

    const [processing, setProcessing] = useState(0)
    const processingRef = useRef()

    useEffect(() => {
        if (processingRef.current) {
            const widthTotal = processingRef.current.offsetWidth
            const percent = process / total
            setProcessing(widthTotal * percent)
        }
    }, [process, total])

    return (
        <div ref={processingRef} style={{ width, height }} className='bg-[#e7e7e7] rounded-xl'>
            <div style={{ height, width: processing + 'px' }} className='bg-[#1dcbb6] transition-all rounded-xl'></div>
        </div>
    )
}

export default Processing