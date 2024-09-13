import { appointmentContext } from '@/context/AppointmentContext'
import { bookingContext } from '@/context/BookingContext'
import { globalContext, notifyType } from '@/context/GlobalContext'
import { userContext } from '@/context/UserContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYear, convertDateToMinuteHour } from '@/utils/date'
import { formatMoney } from '@/utils/other'
import { useRouter } from 'next/navigation'
import React, { useContext } from 'react'

const ResultBooking = () => {
    const { bookingData, bookingHandler } = useContext(bookingContext)
    const { userData } = useContext(userContext)
    const { globalHandler } = useContext(globalContext)
    const { appointmentHandler, appointmentData } = useContext(appointmentContext)
    const router = useRouter()

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
                                    router.push('/bac-si-noi-bat')
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
                            router.push('/bac-si-noi-bat')
                            globalHandler.reload()
                        })
                })
        }
    }

    return (
        <>
            <div className='border-[#cfcfcf] overflow-hidden relative w-[70%] gap-2 mt-6 rounded-md border-[1px] flex flex-col items-start'>
                <div className='flex gap-3 py-2 mt-1 border-[#cfcfcf] border-b-[1px] items-center px-4 w-full text-[13px] font-medium'>
                    <span className='text-[14px]'>Trạng Thái Thanh Toán</span>
                </div>
                <div className='grid grid-cols-2'>
                    Thanh Toán Thành Công
                </div>
            </div>
            <div className='relative py-3 w-[70%] gap-2 mt-1 rounded-md flex flex-col items-end'>
                <button onClick={() => handleSubmit()} className='hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg'>Hoàn Tất</button>
            </div>
        </>
    )
}

export default ResultBooking


// const medicalRecord = {
//     patient: {
//         _id: ObjectID,
//         fullName: String,
//         dob: Date,
//         gender: Boolean,
//         phone: String,
//         email: String
//     },
//     doctor: {
//         _id: ObjectID,
//         fullName: String,
//         phone: String,
//         email: String
//     },
//     totalDiagnosisDisease: [String](chuẩn đoán bệnh 'thường là lấy chuẩn đoán bênh mới nhất'),
//     totalSymptoms: [String](triệu chứng tổng, 'thường là lấy triệu chứng mới nhất'),
//     vitalSigns: [{
//         temperature: Number,
//         bloodPressure: Number,
//         heartRate: Number,
//         respiratoryRate: Number('hít thở bao nhiêu lần')
//     }],
//     medicalExaminationHistory: [{
//         diagnosisDisease: [String],
//         symptoms: [String],
//         date: {
//             day: Number,
//             month: Number,
//             year: Number,
//             time: String
//         },
//         note: String,
//         medical: [{
//             medicalName: String,
//             quantity: Number
//         }]
//     }],

//     reExaminationDate: {
//         day: Number,
//         month: Number,
//         year: Number,
//     }
// }