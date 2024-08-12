import React, { useContext, useEffect, useState } from 'react'
import Input from '../input'
import Select from '../select'
import { userContext } from '@/context/UserContext'
import { dsKhoa } from '@/utils/chuyenKhoa'
import { connectToGoogle } from '../firebase/firebase'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { api, TypeHTTP } from '@/utils/api'

const Password = ({ user, setUser }) => {
    const { userData, userHandler } = useContext(userContext)
    const { globalHandler } = useContext(globalContext)
    const [info, setInfo] = useState({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    })

    const handleUpdatePassword = () => {
        if (info.oldPassword.length < 6) {
            globalHandler.notify(notifyType.WARNING, "Mật khẩu cũ phải lớn hơn 6 ký tự")
            return
        }
        if (info.newPassword.length < 6) {
            globalHandler.notify(notifyType.WARNING, "Mật khẩu mới phải lớn hơn 6 ký tự")
            return
        }
        if (info.newPassword !== info.confirmNewPassword) {
            globalHandler.notify(notifyType.WARNING, "Mật khẩu mới xác nhận phải trùng khớp với mật khẩu mới")
            return
        }
        globalHandler.notify(notifyType.LOADING, 'Đang Cập Nhật Mật Khẩu')
        api({ sendToken: true, path: `/auth/update-password/${userData.user?.role === 'DOCTOR' ? 'doctor' : 'patient'}/${userData.user?._id}`, type: TypeHTTP.PUT, body: { newPassWord: info.newPassword, oldPassWord: info.oldPassword } })
            .then(res => {
                userHandler.setUser(res)
                globalHandler.notify(notifyType.SUCCESS, 'Cập Nhật Mật Khẩu Thành Công')
                globalHandler.reload()
            })
            .catch(error => {
                globalHandler.notify(notifyType.FAIL, error.message)
            })
    }


    return (
        <div className='w-full min-h-screen'>
            <div className='w-full grid grid-cols-2 h-auto gap-x-[4rem] gap-y-[1.25rem] mt-[1rem] px-[4rem]'>
                {/* <Input name={''} onChange={e => setUser({ ...user, fullName: e.target.value })} value={user?.fullName} /> */}
                <Input type='password' name={'Mật Khẩu Cũ'} onChange={e => setInfo({ ...info, oldPassword: e.target.value })} />
                <Input type='password' name={'Mật Khẩu Mới'} onChange={e => setInfo({ ...info, newPassword: e.target.value })} />
                <div></div>
                <Input type='password' name={'Xác Nhận Mật Khẩu Mới'} onChange={e => setInfo({ ...info, confirmNewPassword: e.target.value })} />
                <div></div>
                <button onClick={() => handleUpdatePassword()} className='text-[white] hover:scale-[1.05] shadow transition-all text-[14px] bg-[#3838f0] flex items-center gap-2 justify-center w-[230px] px-[3rem] h-[37px] rounded-lg'>Cập Nhật Mật Khẩu</button>
            </div>
        </div>
    )
}

export default Password