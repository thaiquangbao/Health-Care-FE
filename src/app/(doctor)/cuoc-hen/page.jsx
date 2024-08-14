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
  const [type, setType] = useState('1')
  const [appointments, setAppointments] = useState([])
  const { appointmentData } = useContext(appointmentContext)
  const { globalHandler } = useContext(globalContext)
  const [loading, setLoading] = useState(false)
  const typeTime = {
    '1': 'Hôm Nay',
    '2': 'Ngày Mai',
    '3': 'Tuần Này',
    '4': 'Tháng Này',
    '5': 'Tháng Sau'
  }

  useEffect(() => {
    if (appointmentData.doctorRecord) {
      if (type === '1' || type === '2') {
        setLoading(true)
        let date = new Date();
        date.setDate(date.getDate() + (Number(type) - 1));
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
          time: {
            ...convertDateToDayMonthYearObject(date.toISOString())
          }
        }
        api({ type: TypeHTTP.POST, path: '/appointments/findByDate', body, sendToken: false })
          .then(res => {
            setAppointments(res)
            setLoading(false)
          })
      } else if (type === '3') {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        }
        api({ type: TypeHTTP.POST, path: '/appointments/findByWeek', body, sendToken: false })
          .then(res => {
            setAppointments(res)
            setLoading(false)
          })
      } else if (type === '4') {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        }
        api({ type: TypeHTTP.POST, path: '/appointments/findByMonth', body, sendToken: false })
          .then(res => {
            setAppointments(res)
            setLoading(false)
          })
      } else if (type === '5') {
        const body = {
          doctor_record_id: appointmentData.doctorRecord._id,
        }
        api({ type: TypeHTTP.POST, path: '/appointments/findByNextMonth', body, sendToken: false })
          .then(res => {
            setAppointments(res)
            setLoading(false)
          })
      }

    }
  }, [type, appointmentData.doctorRecord])

  const handleAcceptAppointment = (appointment) => {
    const body = {
      _id: appointment._id,
      status: 'ACCEPTED',
      status_message: 'Đã chấp nhận'
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
    api({ sendToken: true, path: '/appointments/doctor-accept', type: TypeHTTP.POST, body: body })
      .then(res => {
        let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord))
        let schedule = record.schedules.filter(item => item.date.day === appointment.appointment_date.day && item.date.month === appointment.appointment_date.month && item.date.year === appointment.appointment_date.year)[0]
        let time = schedule.times.filter(item => item.time === appointment.appointment_date.time)[0]
        time.status = 'Booked'
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
          .then(res1 => {
            setAppointments(prev => prev.map(item => {
              if (item._id === res._id) {
                return res
              }
              return item
            }))
            globalHandler.notify(notifyType.SUCCESS, 'Đã chấp nhận cuộc hẹn')
          })
      })
  }

  const handleCancelAppointment = (appointment) => {
    const body = {
      _id: appointment._id,
      status: 'CANCELED',
      status_message: 'Bác sĩ đã hủy cuộc hẹn'
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
    api({ sendToken: true, path: '/appointments/doctor-reject', type: TypeHTTP.POST, body: body })
      .then(res => {
        let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord))
        let schedule = record.schedules.filter(item => item.date.day === appointment.appointment_date.day && item.date.month === appointment.appointment_date.month && item.date.year === appointment.appointment_date.year)[0]
        let time = schedule.times.filter(item => item.time === appointment.appointment_date.time)[0]
        time.status = ''
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
          .then(res1 => {
            setAppointments(prev => prev.map(item => {
              if (item._id === res._id) {
                return res
              }
              return item
            }))
            globalHandler.notify(notifyType.SUCCESS, 'Đã hủy cuộc hẹn')
          })
      })
  }

  const handleRejectAppointment = (appointment) => {
    const body = {
      _id: appointment._id,
      status: 'REJECTED',
      status_message: 'Đã từ chối'
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác")
    api({ sendToken: true, path: '/appointments/doctor-reject', type: TypeHTTP.POST, body: body })
      .then(res => {
        let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord))
        let schedule = record.schedules.filter(item => item.date.day === appointment.appointment_date.day && item.date.month === appointment.appointment_date.month && item.date.year === appointment.appointment_date.year)[0]
        let time = schedule.times.filter(item => item.time === appointment.appointment_date.time)[0]
        time.status = ''
        api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
          .then(res1 => {
            setAppointments(prev => prev.map(item => {
              if (item._id === res._id) {
                return res
              }
              return item
            }))
            globalHandler.notify(notifyType.SUCCESS, 'Đã từ chối cuộc hẹn')
          })
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
          <select onChange={(e) => setType(e.target.value)} className='px-4 py-2 shadow-lg focus:outline-0 rounded-md font-medium'>
            <option value={1}>Hôm Nay</option>
            <option value={2}>Ngày Mai</option>
            <option value={3}>Tuần Này</option>
            <option value={4}>Tháng Này</option>
            <option value={5}>Tháng Sau</option>
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
              {!loading && appointments.map((appointment, index) => (
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
                        <button onClick={() => handleAcceptAppointment(appointment)} className='hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Chấp Nhận</button>
                        <button onClick={() => handleRejectAppointment(appointment)} className='hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Từ Chối</button>
                      </>
                    )
                      :
                      appointment.status === 'ACCEPTED' && (<button onClick={() => handleCancelAppointment(appointment)} className='hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Hủy</button>)
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && appointments.length === 0 && (
            <div className='w-full flex items-center justify-center my-10 text-[18px] font-medium'>
              Không có cuộc hẹn khám trong {typeTime[type]}
            </div>
          )}
          {loading && (
            <div className='w-full flex items-center justify-center my-10 text-[18px] font-medium'>
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Appointment