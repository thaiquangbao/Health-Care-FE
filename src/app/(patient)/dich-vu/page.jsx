import Navbar from '@/components/navbar'
import React from 'react'

const DichVuChuyenKhoa = () => {
    return (
        <div className="w-full h-screen flex flex-col pt-[1%] px-[5%] background-public">
            <Navbar />
            <div className='w-full mt-[2rem]'>
                <h1 className='font-semibold text-[18px]'>Chọn Dịch Vụ Đặt Hẹn</h1>
            </div>
        </div>
    )
}

export default DichVuChuyenKhoa