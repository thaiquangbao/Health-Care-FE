import { appointmentContext } from '@/context/AppointmentContext'
import { api, TypeHTTP } from '@/utils/api'
import { convertDateToDayMonthYearVietNam } from '@/utils/date'
import { set } from 'date-fns'
import React, { useContext, useEffect, useState } from 'react'
import Input from '../input'

const FormRecordPatient = ({ hidden, visible }) => {
    const { appointmentData } = useContext(appointmentContext)
    const [doctorRecord, setDoctorRecord] = useState()
    const [medicalRecord, setMedicalRecord] = useState()

    useEffect(() => {
        if (appointmentData.currentAppointment) {
            api({ type: TypeHTTP.GET, sendToken: false, path: `/doctorRecords/get-one/${appointmentData.currentAppointment?.doctor_record_id}` })
                .then(record => {
                    setDoctorRecord(record)
                    api({
                        path: '/medicalRecords/check-medical', type: TypeHTTP.POST, sendToken: false, body: {
                            patient: appointmentData.currentAppointment?.patient?._id,
                            doctor: record.doctor._id
                        }
                    })
                        .then(res => {
                            if (res === false) {
                                const body = {
                                    patient: appointmentData.currentAppointment?.patient?._id,
                                    doctor: record.doctor._id,

                                    medicals: [],
                                }
                                api({ path: '/medicalRecords/save', type: TypeHTTP.POST, sendToken: false, body })
                                    .then(medicalRecord => setMedicalRecord(medicalRecord))
                            } else {
                                api({ path: '/medicalRecords/getAll', type: TypeHTTP.GET, sendToken: false })
                                    .then(medicalRecords => {
                                        setMedicalRecord(medicalRecords.filter(item => item.patient._id === appointmentData.currentAppointment?.patient?._id && item.doctor._id === record.doctor._id)[0])
                                    })
                            }
                        })
                })
        }
    }, [appointmentData.currentAppointment?.doctor_record_id, appointmentData.currentAppointment?.patient?._id, visible])

    return (
        <section style={visible ? { height: '90%', width: '65%', transition: '0.3s', backgroundSize: 'cover', overflow: 'hidden', backgroundImage: 'url(/bg.png)' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {appointmentData.currentAppointment && (
                <div className='px-[2rem] py-[1.5rem] w-full flex flex-col'>
                    <span className='font-semibold'>Hồ Sơ Bệnh Án</span>
                    <div className='flex items-center justify-between py-4 px-2 w-full'>
                        <div className='flex items-center gap-4 '>
                            <div className='w-[60px] aspect-square rounded-full shadow-xl' style={{ backgroundSize: 'cover', backgroundImage: `url(${medicalRecord?.patient?.image})` }}></div>
                            <div className='flex flex-col'>
                                <span className='font-medium'>{medicalRecord?.patient?.fullName}</span>
                                <span className='text-[14px]'>{medicalRecord?.patient?.phone}</span>
                            </div>
                        </div>
                        <div className='flex flex-col text-[14px]'>
                            <span className='text-[14px] font-semibold'>{appointmentData.currentAppointment?.sick}</span>
                            <span>{convertDateToDayMonthYearVietNam(appointmentData.currentAppointment?.appointment_date)}</span>
                        </div>
                    </div>
                    <span><span className='font-semibold px-2'>Triệu Chứng:</span> {appointmentData.currentAppointment?.note}</span>
                    <div className='grid grid-cols-2 h-auto gap-x-[0.5rem] mt-[1rem] px-2'>
                        <textarea placeholder='Chuẩn đoán bệnh' className='text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4'>

                        </textarea>
                        <textarea placeholder='Lời dặn bác sĩ' className='text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4'>

                        </textarea>
                    </div>
                    <span className='font-semibold px-2 mt-[1rem]'>Đơn Thuốc</span>
                    <div className='grid grid-cols-2 h-auto gap-x-[0.5rem] px-2 mt-1'>
                        <div className='text-[14px] w-[100%] focus:outline-0 rounded-lg px-4'>
                            <input placeholder='Tên thuốc' className='text-[14px] w-[100%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            <div className='flex items-center justify-between'>
                                <select className='text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' >
                                    <option>Đơn vị tính</option>
                                    <option>Viên</option>
                                    <option>Vỉ</option>
                                    <option>Hộp</option>
                                    <option>Ống</option>
                                    <option>Gói</option>
                                    <option>Chai/Lọ</option>
                                    <option>Tuýp</option>
                                </select>
                                <input placeholder='Số lượng' className='text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4' />
                            </div>
                            <button className='hover:scale-[1.05] transition-all text-[14px] bg-[blue] flex justify-center items-center w-[30%] text-[white] mt-2 h-[37px] rounded-lg'>Thêm</button>
                        </div>
                        {/* <textarea placeholder='Lời dặn bác sĩ' className='text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4'>

                        </textarea> */}
                        <div className='w-full max-h-[140px] overflow-y-auto relative'>
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="w-[5%] py-2 text-center">
                                            #
                                        </th>
                                        <th scope="col" className="w-[70%] py-2 text-center">
                                            Tên Thuốc
                                        </th>
                                        <th scope="col" className="w-[25%] py-2">
                                            Số Lượng
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className=' w-[full] bg-black font-medium'>
                                    <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-2 text-center font-medium">
                                            {1}
                                        </td>
                                        <td className="py-2 text-[15px] text-center">
                                            Paradon
                                        </td>
                                        <td className="py-2">
                                            10
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-2 text-center font-medium">
                                            {1}
                                        </td>
                                        <td className="py-2 text-[15px] text-center">
                                            Paradon
                                        </td>
                                        <td className="py-2">
                                            10
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-2 text-center font-medium">
                                            {1}
                                        </td>
                                        <td className="py-2 text-[15px] text-center">
                                            Paradon
                                        </td>
                                        <td className="py-2">
                                            10
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-2 text-center font-medium">
                                            {1}
                                        </td>
                                        <td className="py-2 text-[15px] text-center">
                                            Paradon
                                        </td>
                                        <td className="py-2">
                                            10
                                        </td>
                                    </tr>
                                    <tr className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td scope="row" className="px-6 py-2 text-center font-medium">
                                            {1}
                                        </td>
                                        <td className="py-2 text-[15px] text-center">
                                            Paradon
                                        </td>
                                        <td className="py-2">
                                            10
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='w-full flex justify-end mt-3 px-2'>
                        <button onClick={() => { }} className='hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[15px] font-medium px-4 rounded-md py-2'>Cập Nhật Hồ Sơ</button>
                    </div>
                </div>
            )}
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </section>
    )
}

export default FormRecordPatient


// const medicalRecord = {
//     patient: {
//         _id: ObjectID,
//         fullName: String,
//         dob: Date,
//         gender: Boolean,
//         phone: String,
//         email: String,
//         image: String
//     },
//     doctor: {
//         _id: ObjectID,
//         fullName: String,
//         phone: String,
//         email: String,
//         image: String
//     },
//     diagnosisDisease: String,
//     symptoms: String,
//     note: String,
//     medicals: [
//         {
//             medicalName: String,
//             quantity: Number,
//             unitOfCalculation: String
//         }
//     ],
//     date : {
//         day : Number,
//         month : Number,
//         year : Number,
//         time : String
//     }
// }