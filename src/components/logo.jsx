import Link from 'next/link'
import React from 'react'

const Logo = ({ color = '#229bff', scale = 1 }) => {
    return (
        <Link href={"/"}><div style={{ scale }} className='text-[22px] font-bold flex items-center gap-1'>
            <img src='/logo.png' width={'50px'} />
            <span style={{ color }}>HealthHaven</span>
        </div></Link>
    )
}

export default Logo