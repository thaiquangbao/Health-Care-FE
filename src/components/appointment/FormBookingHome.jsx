import { appointmentContext } from "@/context/AppointmentContext"
import { globalContext, notifyType } from "@/context/GlobalContext"
import { userContext } from "@/context/UserContext"
import { api, TypeHTTP } from "@/utils/api"
import { useContext, useState } from "react"


const FormBookingHome = ({ visible, hidden }) => {
    const { appointmentData } = useContext(appointmentContext)
    const { userData } = useContext(userContext)
    const [currentStep, setCurrentStep] = useState(1)
    const [note, setNote] = useState('')
    const [equipments, setEquipments] = useState({
        thermometer: false,
        bloodPressureMonitor: false,
        heartRateMonitor: false,
        bloodGlucoseMonitor: false
    })

    const handleCreateAppointment = () => {
        const body = {
            doctor_record_id: appointmentData.doctorRecordBookingHome._id,
            patient: userData.user ? userData.user._id : null,
            appointment_date: { day: 0, month: 0, year: 0, time: '' },
            status: {
                status_type: 'QUEUE',
                message: 'Đang chờ bác sĩ xác nhận'
            },
            note,
            price_list: appointmentData.priceList._id,
            equipment: equipments
        }
        api({ sendToken: true, type: TypeHTTP.POST, body, path: '/appointmentHomes/save' })
            .then(res => {
                // globalHandler.notify(notifyType.SUCCESS, 'Đặt Hẹn Thành Công, Chờ Bác Sĩ Phản Hồi')
                hidden()
            })
    }

    return (
        <div style={visible ? { maxHeight: '90%', height: 'auto', width: '85%', transition: '0.3s', backgroundSize: 'cover', overflow: 'hidden' } : { height: 0, width: 0, transition: '0.3s', overflow: 'hidden' }} className='z-50 w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'>
            {visible && (
                <div style={{ transition: '0.5s', marginLeft: `-${(currentStep - 1) * 100}%` }} className='w-[100%] flex overflow-auto h-[100%]'>
                    <div className='min-w-[100%] items-end gap-4 px-[2.5rem] py-[1rem] flex justify-center flex-col'>
                        <span className="w-full text-[20px] font-space font-bold">Đặt Khám Tại Nhà</span>
                        <div className='flex flex-col bg-[#33007d] w-[1000px] relative rounded-2xl px-3 overflow-hidden'>
                            <div className='h-[50px] w-full bg-[#33007d] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                                <i className='bx bx-check text-[22px]'></i>
                                <span className='text-[14px] font-semibold'>Bạn đã có nhiệt kế tại nhà?</span>
                            </div>
                            <div className='h-[50px] w-full bg-[#533094] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                                <i className='bx bx-check text-[22px]'></i>
                                <span className='text-[14px] font-semibold'>Bạn đã có may đo nhịp tim tại nhà?</span>
                            </div>
                            <div className='h-[50px] w-full bg-[#33007d] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                                <i className='bx bx-check text-[22px]'></i>
                                <span className='text-[14px] font-semibold'>Bạn đã có máy đo huyết áp tại nhà?</span>
                            </div>
                            <div className='h-[50px] w-full bg-[#533094] flex items-center gap-1 px-3 text-[white] rounded-xl'>
                                <i className='bx bx-check text-[22px]'></i>
                                <span className='text-[14px] font-semibold'>Bạn đã có máy đo đường huyết tại nhà</span>
                            </div>
                            <div className='absolute h-full flex flex-col right-[-5px] bg-[white] w-[40%] top-0 rounded-xl overflow-hidden'>
                                <div className='h-[50px] w-full bg-[white] flex items-center justify-center px-3 text-[white]'>
                                    <div onClick={() => setEquipments({ ...equipments, thermometer: !equipments.thermometer })} style={{ backgroundColor: equipments.thermometer ? '#33007d' : 'white' }} className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[white] border-[1px] border-[#999] cursor-pointer'>
                                        {equipments.thermometer && (<i className='bx bx-check text-[25px]'></i>)}
                                    </div>
                                </div>
                                <div className='h-[50px] w-full bg-[#f2f3ff] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                    <div onClick={() => setEquipments({ ...equipments, bloodPressureMonitor: !equipments.bloodPressureMonitor })} style={{ backgroundColor: equipments.bloodPressureMonitor ? '#33007d' : 'white' }} className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[white] border-[1px] border-[#999] cursor-pointer'>
                                        {equipments.bloodPressureMonitor && (<i className='bx bx-check text-[25px]'></i>)}
                                    </div>
                                </div>
                                <div className='h-[50px] w-full bg-[white] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                    <div onClick={() => setEquipments({ ...equipments, heartRateMonitor: !equipments.heartRateMonitor })} style={{ backgroundColor: equipments.heartRateMonitor ? '#33007d' : 'white' }} className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[white] border-[1px] border-[#999] cursor-pointer'>
                                        {equipments.heartRateMonitor && (<i className='bx bx-check text-[25px]'></i>)}
                                    </div>
                                </div>
                                <div className='h-[50px] w-full bg-[#f2f3ff] flex items-center justify-center text-center gap-1 px-3 text-[white]'>
                                    <div onClick={() => setEquipments({ ...equipments, bloodGlucoseMonitor: !equipments.bloodGlucoseMonitor })} style={{ backgroundColor: equipments.bloodGlucoseMonitor ? '#33007d' : 'white' }} className='h-[30px] flex items-center justify-center aspect-square rounded-full bg-[white] border-[1px] border-[#999] cursor-pointer'>
                                        {equipments.bloodGlucoseMonitor && (<i className='bx bx-check text-[25px]'></i>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Lời dặn với bác sĩ" className="w-full p-2 focus:outline-0 border-[1px] border-[#999] rounded-lg" />
                        <button onClick={() => handleCreateAppointment()} style={{ background: 'linear-gradient(to right, #11998e, #38ef7d)' }} className='text-[white] w-[200px] z-[50] shadow-[#767676] text-[16px] shadow-md rounded-xl px-6 py-2 transition-all cursor-pointer font-semibold'>Đặt Khám</button>
                    </div>
                </div>
            )}
            <button onClick={() => hidden()}><i className='bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]'></i></button>
        </div>
    )
}

export default FormBookingHome