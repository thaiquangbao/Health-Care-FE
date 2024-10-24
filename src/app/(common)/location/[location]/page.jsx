'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Location = () => {

    const { location } = useParams()
    const [lon, setLon] = useState(0)
    const [lat, setLat] = useState(0)
    useEffect(() => {
        if (location) {
            setLon(Number(location.split('-')[0]))
            setLat(Number(location.split('-')[1]))
        }
    }, [location])

    return (
        <div className='h-screen w-screen'>
            <iframe
                src={`https://www.google.com/maps?q=${lat},${lon}&z=15&output=embed`}
                width={'100%'}
                height="100%"
                style={{ border: 0, borderRadius: '10px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
        </div>
    )
}

export default Location