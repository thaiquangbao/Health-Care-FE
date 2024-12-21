'use client'
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Meet = () => {
    const router = useRouter()
    const param = useParams();
    const searchParams = useSearchParams();
    const { id, type } = param;
    const accessToken = searchParams.get('accesstoken');
    const refreshToken = searchParams.get('refreshtoken');

    useEffect(() => {
        if (accessToken && refreshToken) {
            globalThis.localStorage.setItem('accessToken', accessToken)
            globalThis.localStorage.setItem('refreshToken', refreshToken)
            router.push(`/zego/${id}/${type}`)
        }
    }, [accessToken, refreshToken])

    return (
        <div className='h-screen w-screen'>
        </div>
    )
}

export default Meet