'use client'
import Navbar from '@/components/navbar'
import { appointmentContext } from '@/context/AppointmentContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYearObject, convertDateToDayMonthYearVietNam } from '@/utils/date'
import { returnNumber } from '@/utils/other'
import React, { useContext, useEffect, useState } from 'react'

const Appointment = () => {

  const { userData } = useContext(userContext)
  const [type, setType] = useState('Hôm Nay')
  const [appointments, setAppointments] = useState([])
  const { appointmentData } = useContext(appointmentContext)
  const { globalHandler } = useContext(globalContext)

  useEffect(() => {
    if (appointmentData.doctorRecord) {
      const body = {
        doctor_record_id: appointmentData.doctorRecord._id,
        time: {
          ...convertDateToDayMonthYearObject(new Date().toISOString())
          // day: 31,
          // month: 7,
          // year: 2024
        }
      }
      console.log(body)
      api({ type: TypeHTTP.POST, path: '/appointments/findByDate', body, sendToken: false })
        .then(res => {
          console.log(res)
          setAppointments(res)
        })
    }
  }, [type, appointmentData.doctorRecord])

  const handleAcceptAppointment = (id) => {
    const body = {
      _id: id,
      status: 'ACCEPTED',
      status_message: 'Đã chấp nhận'
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
    api({ sendToken: true, path: '/appointments/doctor-accept', type: TypeHTTP.POST, body: body })
      .then(res => {
        setAppointments(prev => prev.map(item => {
          if (item._id === res._id) {
            return res
          }
          return item
        }))
        globalHandler.notify(notifyType.SUCCESS, 'Đã chấp nhận cuộc hẹn')
      })
  }

  const handleCancelAppointment = (id) => {
    const body = {
      _id: id,
      note: 'Ca mỗ đột suất'
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
    api({ sendToken: true, path: '/appointments/doctor-cancel', type: TypeHTTP.POST, body: body })
      .then(res => {
        setAppointments(prev => prev.filter(item => item._id !== id))
        globalHandler.notify(notifyType.SUCCESS, 'Đã hủy cuộc hẹn')
      })
  }

  const handleRejectAppointment = (id) => {
    const body = {
      _id: id,
      status: 'REJECTED',
      status_message: 'Đã từ chối'
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
    api({ sendToken: true, path: '/appointments/doctor-reject', type: TypeHTTP.POST, body: body })
      .then(res => {
        setAppointments(prev => prev.map(item => {
          if (item._id === res._id) {
            return res
          }
          return item
        }))
        globalHandler.notify(notifyType.SUCCESS, 'Đã từ chối cuộc hẹn')
      })
  }

  return (
    <div className="w-full min-h-screen flex flex-col pt-[1%] px-[5%] background-public">
      <Navbar />
      <div className='w-full mt-4 flex flex-col gap-1 px-16 text-[#2a2a2a]'>
        <div className='my-2 flex justify-between items-end'>
          <div className=''>
            <h2 className='text-[23px] font-semibold flex items-end gap-3'>Chào Mừng Bác Sĩ {userData.user?.fullName.split(' ')[userData.user?.fullName.split(' ').length - 1]} <img src='/hand.png' width={'30px'} /></h2>
            <span className='font-medium text-[16px]'>Bắt đầu ngày mới với những cuộc hẹn mới.</span>
          </div>
          <select onChange={(e) => setType(e.target.value)} className='px-4 py-2 focus:outline-0 rounded-md font-medium'>
            <option>Hôm Nay</option>
            <option>Ngày Mai</option>
          </select>
        </div>
        <div className='grid grid-cols-4 gap-4 mt-2'>
          <div className='h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col' style={{ backgroundImage: 'url(/EndlessRiver.jpg)', backgroundSize: 'cover' }}>
            <div className='flex items-end gap-2'>
              <i className='text-[40px] bx bx-calendar-check'></i>
              <span className='text-[25px] font-semibold'>{returnNumber(appointments.length)}</span>
            </div>
            <span className='font-medium text-[15px]'>Tất cả cuộc hẹn</span>
          </div>
          <div className='h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col' style={{ backgroundImage: 'url(/Flare.jpg)', backgroundSize: 'cover' }}>
            <div className='flex items-end gap-2'>
              <i className='text-[40px] bx bx-calendar-check'></i>
              <span className='text-[25px] font-semibold'>{returnNumber(appointments.filter(item => item.status === 'ACCEPTED').length)}</span>
            </div>
            <span className='font-medium text-[15px]'>Cuộc hẹn đã chấp nhận</span>
          </div>
          <div className='h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col' style={{ backgroundImage: 'url(/Quepal.jpg)', backgroundSize: 'cover' }}>
            <div className='flex items-end gap-2'>
              <i className='text-[30px] translate-y-[-5px] fa-regular fa-hourglass'></i>
              <span className='text-[25px] font-semibold'>{returnNumber(appointments.filter(item => item.status === 'QUEUE').length)}</span>
            </div>
            <span className='font-medium text-[15px]'>Cuộc hẹn đang chờ</span>
          </div>
          <div className='h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col' style={{ backgroundImage: 'url(/SinCityRed.jpg)', backgroundSize: 'cover' }}>
            <div className='flex items-end gap-2'>
              <i className='text-[40px] bx bx-error'></i>
              <span className='text-[25px] font-semibold'>{returnNumber(appointments.filter(item => item.status === 'REJECTED').length)}</span>
            </div>
            <span className='font-medium text-[15px]'>Cuộc hẹn đã từ chối</span>
          </div>
        </div>
        <div className='w-full max-h-[500px] mt-4 overflow-y-auto relative'>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-[5%] py-3 text-center">
                  #
                </th>
                <th scope="col" className="w-[15%] py-3">
                  Bệnh Nhân
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Trạng Thái
                </th>
                <th scope="col" className="w-[23%] py-3">
                  Thời Gian Cuộc Hẹn
                </th>
                <th scope="col" className="w-[20%] py-3">
                  Ghi Chú
                </th>
                <th scope="col" className="w-[17%] py-3 text-center">
                  Các Chức Năng
                </th>
              </tr>
            </thead>
            <tbody className=' w-[full] bg-black font-medium'>
              {appointments.map((appointment, index) => (
                <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  <td scope="row" className="px-6 py-4 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 text-[15px]">
                    {appointment.patient.fullName}
                  </td>
                  <td style={{ color: appointment.status === 'QUEUE' ? 'black' : appointment.status === 'ACCEPTED' ? 'green' : 'red' }} className="py-4">
                    {appointment.status_message}
                  </td>
                  <td className="py-4">
                    {`${convertDateToDayMonthYearVietNam(appointment.appointment_date)}`}
                  </td>
                  <td className="py-4">
                    {appointment.note}
                  </td>
                  <td className="py-4 flex gap-2 items-center justify-center">
                    {appointment.status === 'QUEUE' ? (
                      <>
                        <button onClick={() => handleAcceptAppointment(appointment._id)} className='hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Chấp Nhận</button>
                        <button onClick={() => handleRejectAppointment(appointment._id)} className='hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Từ Chối</button>
                      </>
                    )
                      :
                      appointment.status === 'ACCEPTED' && (<button onClick={() => handleCancelAppointment(appointment._id)} className='hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Hủy</button>)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {appointments.length === 0 && (
            <div className='w-full flex items-center justify-center my-10 text-[18px] font-medium'>
              Không có cuộc hẹn khám trong hôm nay
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointment