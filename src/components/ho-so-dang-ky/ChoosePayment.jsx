import { appointmentContext } from '@/context/AppointmentContext'
import { bookingContext } from '@/context/BookingContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, baseURL, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYear, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect } from 'react'
import { io } from 'socket.io-client'
const socket = io.connect(baseURL)
const ChoosePayment = () => {
    const { bookingData, bookingHandler } = useContext(bookingContext)
    const { globalHandler } = useContext(globalContext)
    const { userData } = useContext(userContext)
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const router = useRouter()
    const qrUrl = `https://qr.sepay.vn/img?bank=MBBank&acc=0834885704&template=compact&amount=200000&des=MaKH${userData.user?._id}`
    const handleSubmit = () => {
      if (userData.user) {
          globalHandler.notify(notifyType.LOADING, "Đang Đăng Ký Lịch Hẹn")
          const formData = new FormData()
          bookingData.images.forEach(item => {
              formData.append('files', item.file)
          })
          api({ type: TypeHTTP.POST, sendToken: false, body: formData, path: '/upload-image/save' })
              .then(listImage => {
                  api({ type: TypeHTTP.POST, sendToken: true, path: '/appointments/save', body: { ...bookingData.booking, price_list: bookingData.booking.priceList._id, images: listImage } })
                      .then(res => {
                          let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord))
                          let schedule = record.schedules.filter(item => item.date.day === res.appointment_date.day && item.date.month === res.appointment_date.month && item.date.year === res.appointment_date.year)[0]
                          let time = schedule.times.filter(item => item.time === res.appointment_date.time)[0]
                          time.status = 'Queue'
                          api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
                              .then(res => {
                                  bookingHandler.setDoctorRecord()
                                  appointmentHandler.setDoctorRecord()
                                  globalHandler.notify(notifyType.SUCCESS, "Đăng Ký Lịch Hẹn Thành Công")
                                  bookingHandler.setCurrentStep(3)
                                  // router.push('/bac-si-noi-bat')
                                  // globalHandler.reload()
                              })
                      })
              })
      } else {
          globalHandler.notify(notifyType.LOADING, "Đang Đăng Ký Lịch Hẹn")
          api({ type: TypeHTTP.POST, sendToken: false, path: '/appointments/save/customer', body: { ...bookingData.booking, price_list: bookingData.booking.priceList._id } })
              .then(res => {
                  let record = JSON.parse(JSON.stringify(appointmentData.doctorRecord))
                  let schedule = record.schedules.filter(item => item.date.day === res.appointment_date.day && item.date.month === res.appointment_date.month && item.date.year === res.appointment_date.year)[0]
                  let time = schedule.times.filter(item => item.time === res.appointment_date.time)[0]
                  time.status = 'Queue'
                  api({ type: TypeHTTP.POST, path: '/doctorRecords/update', sendToken: false, body: record })
                      .then(res => {
                          bookingHandler.setDoctorRecord()
                          appointmentHandler.setDoctorRecord()
                          globalHandler.notify(notifyType.SUCCESS, "Đăng Ký Lịch Hẹn Thành Công")
                          bookingHandler.setCurrentStep(3)
                          // globalHandler.reload()

                      })
              })
      }
  }
    useEffect(() => {
      socket.on(`payment-appointment-online${userData.user?._id}`, (data) => {
          if(data){
            handleSubmit() 
          }
          
      })
      return () => {
          socket.off(`payment-appointment-online${userData.user?._id}`);
      }
  }, [userData.user?._id])
    return (
        <>
            <div className='border-[#cfcfcf] overflow-hidden relative w-[60%] gap-2 mt-6 rounded-md border-[1px] flex flex-col items-center'>
                <div className='flex gap-3 py-2 mt-1 items-center px-4 w-full text-[13px] font-medium'>
                    <span className='text-[14px]'>Thanh Toán Qua Mã QR</span>
                </div>
                
                    <div className='flex flex-col gap-2 p-3 text-[14px] items-center border-[#cfcfcf] border-[1px]'>
                        <img className='w-[50%]' src={qrUrl}/>
                        <div className='flex flex-col items-center'>
                            <span className='rounded-md text-[12px]'>Tên chủ TK: THAI ANH THU</span>
                            <span className='font-medium'>Số TK: 0834885704 </span>
                            <span className='rounded-md text-[12px]'>Sử dụng app Momo hoặc app Ngân hàng để thanh toán </span>
                        </div>
                    </div>
                   
                
            </div>
            <div className='border-[#cfcfcf] relative py-1 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex gap-3 py-2 items-center px-4 w-full border-[#cfcfcf] border-b-[1px] text-[13px] font-medium'>
                    <span className='text-[14px]'>Giờ Hẹn:</span>
                    <span className='px-2 py-1 bg-[blue] text-[white] rounded-md'>{bookingData.booking?.appointment_date.time}</span>
                    <span className='px-2 py-1 bg-[#46e199] text-[white] rounded-md'>{convertDateToDayMonthYear(bookingData.booking?.appointment_date)}</span>
                </div>
                <div className='pt-2 px-4 gap-3 flex items-start pb-6'>
                    <img src={bookingData.doctorRecord?.doctor.image} className='rounded-full w-[60px]' />
                    <div className='flex flex-col items-start gap-1 text-[14px]'>
                        <span className='font-medium'>Khám bệnh trực tuyến với BS {bookingData.doctorRecord?.doctor.fullName}</span>
                        <span className='mt-3 px-[0.5rem] py-1 rounded-md text-[13px] bg-[#e0eff6]'>Chuyên Khoa {bookingData.doctorRecord?.doctor.specialize}</span>
                        <span className='font-medium mt-1'>BS {bookingData.doctorRecord?.doctor.fullName}</span>
                    </div>
                    <span className='absolute top-[60px] text-[14px] right-2 font-medium text-[blue]'>{formatMoney(bookingData.booking?.priceList.price)} đ</span>
                </div>
            </div>
            <div className='border-[#cfcfcf] relative py-3 px-5 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex justify-between w-full text-[14px] font-medium'>
                    <span className=''>Giá dịch vụ</span>
                    <span>{formatMoney(bookingData.booking?.priceList.price)} đ</span>
                </div>
                <div className='flex justify-between w-full text-[14px] font-medium'>
                    <span className='text-[15px]'>Tổng Thanh Toán</span>
                    <span className='text-[red] text-[16px]'>{formatMoney(bookingData.booking?.priceList.price)} đ</span>
                </div>
            </div>
            {/* <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex flex-col items-end'>
                <button onClick={() => } className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Bước Tiếp Theo</button>
            </div> */}
        </>
    )
}

export default ChoosePayment