import { appointmentContext } from '@/context/AppointmentContext';
import { globalContext, notifyType } from '@/context/GlobalContext';
import { utilsContext } from '@/context/UtilsContext';
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam, editNumber } from "@/utils/date";
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
const FormRecordPatientHome = ({ medicalRecord, type, setType, setTemporary, doctorRecord1, appointmentHome1, setReload }) => {
  const { appointmentData, appointmentHandler } = useContext(
    appointmentContext
  );
  const [appointmentHome, setAppointmentHome] = useState()
  const [doctorRecord, setDoctorRecord] = useState();
  const [medical, setMedical] = useState([]);
  const [nameMedical, setNameMedical] = useState("");
  const [quantity, setQuantity] = useState(0);
  const { utilsHandler } = useContext(utilsContext);
  const [unitOfCalculation, setUnitOfCalculation] = useState("");

  const [diagnosisDisease, setDiagnosisDisease] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [note, setNote] = useState("");
  const [reAppointmentDate, setReAppointmentDate] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [bloodPressure, setBloodPressure] = useState("");
  const [healthRate, setHealthRate] = useState(0);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (medicalRecord) {
      setMedical(medicalRecord.medical)
      setDiagnosisDisease(medicalRecord.diagnosisDisease)
      setSymptoms(medicalRecord.symptoms)
      setNote(medicalRecord.note)
      setReAppointmentDate(`${medicalRecord.reExaminationDate.year}-${editNumber(medicalRecord.reExaminationDate.month)}-${editNumber(medicalRecord.reExaminationDate.day)}`)
      setTemperature(medicalRecord.temperature)
      setBloodPressure(medicalRecord.bloodPressure)
      setHealthRate(medicalRecord.healthRate)
      setWeight(medicalRecord.weight)
      setHeight(medicalRecord.height)
    }
  }, [medicalRecord])

  // them phan thuoc
  const [medicalData, setMedicalData] = useState([])
  const [medicalFilter, setMedicalFilter] = useState([])
  const [selectedMedical, setSelectedMedical] = useState()
  const [custom, setCustom] = useState(false)
  useEffect(() => {
    axios.post('https://prod.jiohealth.com:8443/jio-search/v1/search/retail/products-advance?offset=0&limit=315&sortName=PRICE&isDescending=false&categories=82&token=b161dc46-207d-11ee-aa37-02b973dc30b0&userID=1')
      .then(res => {
        setMedicalData(res.data.data.products)
      })
  }, [])
  useEffect(() => {
    setSelectedMedical()
  }, [type])
  useEffect(() => {
    if (nameMedical !== '') {
      const filter = medicalData.filter(item => item.title.toLowerCase().trim().includes(nameMedical.toLowerCase().trim()))
      setMedicalFilter(filter)
    }
  }, [nameMedical])

  // -----------------------------------------------

  useEffect(() => {
    setDoctorRecord(doctorRecord1)
    setAppointmentHome(appointmentHome1)

  }, [doctorRecord1, appointmentHome1, type]);

  // Xử lý
  // Thêm thuốc
  function checkIntegerString(value) {
    if (value === '') {
      return false
    }
    const parsedValue = Number(value);
    if (
      !isNaN(parsedValue) &&
      Number.isInteger(parsedValue)
    ) {
      return true;
    } else {
      return false;
    }
  }
  const addMedical = () => {
    if (nameMedical === '') {
      utilsHandler.notify(
        notifyType.WARNING,
        "Vui lòng chọn thuốc"
      );
      return
    }
    if (quantity === '') {
      utilsHandler.notify(
        notifyType.WARNING,
        "Vui lòng nhập số lượng thuốc"
      );
      return
    }
    if (!checkIntegerString(quantity)) {
      utilsHandler.notify(
        notifyType.WARNING,
        "Số lượng thuốc không hợp lệ"
      );
      return
    }
    const newMedical = {
      medicalName: nameMedical,
      quantity: Number(quantity),
      unitOfCalculation: unitOfCalculation,
    };
    setMedical([...medical, newMedical]);
    setSelectedMedical()
    setNameMedical('')
    setUnitOfCalculation('Đơn vị tính')
    setQuantity('')
    setCustom(false)
  };

  useEffect(() => {
    // Clear input fields after adding a new medical
    setNameMedical("");
    setQuantity("");
    setUnitOfCalculation("Đơn vị tính");
    setCustom(false)
  }, [medical]);

  const updateMedicalRecord = () => {
    setTemporary(true)

    // ham de huy
    const reject = () => {
      setTemporary(false)
    }

    // ham de update hay lam cai gi do khi dong y
    const accept = () => {
      let splitDate = reAppointmentDate
        ? reAppointmentDate.split("-")
        : [];
      // chổ này cần check xem có nhập đủ thông tin không
      if (symptoms === "") {
        utilsHandler.notify(notifyType.WARNING, "Chưa nhập triệu chứng")
        setTemporary(false)
        return
      }
      if (diagnosisDisease === "") {
        utilsHandler.notify(notifyType.WARNING, "Chưa nhập chẩn đoán bệnh")
        setTemporary(false)
        return
      }
      if (note === "") {
        utilsHandler.notify(notifyType.WARNING, "Chưa nhập ghi chú")
        setTemporary(false)
        return
      }
      if (medical.length === 0) {
        utilsHandler.notify(notifyType.WARNING, "Chưa nhập đơn thuốc")
        setTemporary(false)
        return
      }
      const body = {
        patient: appointmentHome?.patient?._id,
        doctor: doctorRecord?.doctor?._id,
        diagnosisDisease: diagnosisDisease,
        symptoms: symptoms,
        note: note,
        reExaminationDate: {
          day: splitDate[2] || "",
          month: splitDate[1] || "",
          year: splitDate[0] || "",
        },
        temperature: temperature,
        bloodPressure: bloodPressure,
        healthRate: healthRate,
        weight: weight,
        height: height,
        medical: medical,
        appointment: appointmentHome?._id,
        date: appointmentHome?.appointment_date,
      };
      utilsHandler.notify(notifyType.LOADING, "Đang lưu hồ sơ bệnh nhân")
      setTemporary(false);
      api({
        path: "/medicalRecords/save",
        type: TypeHTTP.POST,
        sendToken: false,
        body,
      }).then(async (medicalRecord) => {
        await api({
          path: `/medicalRecords/send-mail/${medicalRecord._id}`,
          type: TypeHTTP.POST,
          sendToken: false,
        })
          .then(res => {
            // thông báo thành công
            setReload(prev => !prev)
            utilsHandler.notify(notifyType.SUCCESS, "Đã lưu hồ sơ bệnh nhân")
            setType(0)
          })
      });
    }

    utilsHandler.showSure({
      message: 'Cập nhật hồ sơ bệnh nhân sẽ không thể sửa đổi. Bác sĩ chắc chắn chứ?',
      functionalAccept: accept,
      functionalReject: reject
    })
  };

  return (
    <div className="px-[2rem] min-w-[100%] h-full py-[1rem] flex flex-col gap-2">
      <div className='flex items-center'>
        <i onClick={() => setType(0)} className='bx bx-chevron-left text-[30px] cursor-pointer text-[#565656]'></i>
        <span className="font-semibold">Hồ Sơ Bệnh Án</span>
      </div>
      <div className="flex items-center justify-between py-1 px-2 w-full">
        <div className="flex items-center gap-4 ">
          <div
            className="w-[50px] aspect-square rounded-full shadow-xl"
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${appointmentHome?.patient?.image})`,
            }}
          ></div>
          <div className="flex flex-col">
            <span className="font-medium">
              {appointmentHome?.patient?.fullName}
            </span>
            <span className="text-[14px]">
              {appointmentHome?.patient?.phone}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* <div
              className="w-[50px] aspect-square rounded-full shadow-xl"
              style={{
                backgroundSize: "cover",
                backgroundImage: `url(${doctorRecord?.doctor?.image})`,
              }}
            ></div> */}
          <div className="flex flex-col text-[14px]">
            <span className="text-[14px] font-semibold">
              Khám Bệnh Tại Nhà
            </span>

            <span className="self-end">
              {/* {convertDateToDayMonthYearVietNam(
                    date
                  )} */}
            </span>

          </div>
        </div>
      </div>
      <span>
        <span className="font-semibold px-2">
          Triệu Chứng:
        </span>{" "}
        <input
          disabled={medicalRecord ? true : false}
          className="text-[14px] w-[500px] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
          onChange={(e) => setSymptoms(e.target.value)}
          value={symptoms}
        />
      </span>
      <div className="grid grid-cols-3 h-auto gap-[0.25rem]">
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2">
            Huyết áp:
          </span>
          <input
            disabled={medicalRecord ? true : false}
            className="text-[14px] w-[80px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) =>
              setBloodPressure(e.target.value)
            }
            value={bloodPressure}
          />
          mmHg
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2">
            Nhịp tim:
          </span>
          <input
            disabled={medicalRecord ? true : false}
            className="text-[14px] w-[80px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) => setHealthRate(e.target.value)}
            value={healthRate}
          />
          bpm
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2">
            Cân nặng:
          </span>
          <input
            disabled={medicalRecord ? true : false}
            className="text-[14px] w-[80px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) => setWeight(e.target.value)}
            value={weight}
          />
          kg
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2">
            Chiều cao:
          </span>
          <input
            disabled={medicalRecord ? true : false}
            className="text-[14px] w-[80px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) => setHeight(e.target.value)}
            value={height}
          />
          cm
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2">
            Nhiệt độ:
          </span>
          <input
            disabled={medicalRecord ? true : false}
            className="text-[14px] w-[80px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) =>
              setTemperature(e.target.value)
            }
            value={temperature}
          />
          ℃
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold px-2">
            Tái khám:
          </span>
          <input
            disabled={medicalRecord ? true : false}
            type="date"
            className="text-[14px] w-[150px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) =>
              setReAppointmentDate(e.target.value)
            }
            value={reAppointmentDate}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] px-2">
        <textarea
          disabled={medicalRecord ? true : false}
          placeholder="Chuẩn đoán bệnh"
          className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
          onChange={(e) =>
            setDiagnosisDisease(e.target.value)
          }
          value={diagnosisDisease}
        ></textarea>
        <textarea
          disabled={medicalRecord ? true : false}
          placeholder="Lời dặn bác sĩ"
          className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
          onChange={(e) => setNote(e.target.value)}
          value={note}
        ></textarea>
      </div>
      <span className="font-semibold px-2">
        Đơn Thuốc
      </span>
      <div className="grid grid-cols-2 h-auto gap-x-[0.25rem] px-2">
        {!medicalRecord && (
          <div className="text-[14px] w-[100%] focus:outline-0 rounded-lg px-4 relative">
            {/*them phan thuoc*/}
            <div style={{ height: (nameMedical !== '' && !selectedMedical) ? '120px' : 0, transition: '0.5s', padding: (nameMedical !== '' && !selectedMedical) ? '10px 0' : 0 }} className=" overflow-y-auto absolute top-[40px] flex flex-col gap-2 left-4 w-[90%] rounded-md bg-[white] shadow-lg">
              <div onClick={() => {
                setSelectedMedical({ title: nameMedical })
                setCustom(true)
              }} className="w-full px-3 flex items-center gap-2 h-[50px] py-2 transition-all cursor-pointer hover:bg-[#e9e9e9]">
                <img src={'https://cdn-icons-png.flaticon.com/512/8694/8694747.png'} className="h-[30px]" />
                <span className="w-[80%] text-[12px]">{nameMedical}</span>
              </div>
              {medicalFilter.map((medical, index) =>
                <div onClick={() => {
                  setSelectedMedical(medical)
                  setNameMedical(medical.title)
                  setUnitOfCalculation(medical.packaging)
                }} className="w-full px-3 flex items-start gap-2 h-[50px] py-2 transition-all cursor-pointer hover:bg-[#e9e9e9]" key={index}>
                  <img src={medical.images[0].images[0].url} className="h-[30px]" />
                  <span className="w-[80%] text-[12px]">{medical.title}</span>
                </div>
              )}
            </div>
            <input
              placeholder="Tên thuốc"
              className="text-[14px] w-[100%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) => setNameMedical(e.target.value)}
              value={nameMedical}
            />
            <div className="flex items-center justify-between">
              {custom === false ? (
                <input
                  placeholder="Đơn vị tính"
                  readOnly
                  className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                  value={unitOfCalculation}
                />
              ) : (
                <select
                  className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                  value={unitOfCalculation}
                  onChange={(e) => setUnitOfCalculation(e.target.value)}
                >
                  <option>Đơn vị tính</option>
                  <option>Viên</option>
                  <option>Vỉ</option>
                  <option>Hộp</option>
                  <option>Ống</option>
                  <option>Gói</option>
                  <option>Chai/Lọ</option>
                  <option>Tuýp</option>
                </select>
              )}
              <input
                placeholder="Số lượng"
                className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) => setQuantity(e.target.value)}
                value={quantity}
              />
            </div>
            {!appointmentData.medicalRecord && (
              <div className="flex items-center gap-2">
                <button
                  className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] flex justify-center items-center w-[30%] text-[white] mt-2 h-[37px] rounded-lg"
                  onClick={() => addMedical()}
                >
                  Thêm
                </button>
                {selectedMedical && (
                  <button
                    className="hover:scale-[1.05] transition-all text-[14px] bg-[red] flex justify-center items-center w-[45%] text-[white] mt-2 h-[37px] rounded-lg"
                    onClick={() => {
                      setSelectedMedical()
                      setNameMedical('')
                      setUnitOfCalculation('Đơn vị tính')
                      setQuantity('')
                      setCustom(false)
                    }}
                  >
                    Hủy thuốc đang chọn
                  </button>
                )}
              </div>
            )}
            {/*-----------them phan thuoc*/}
          </div>
        )}
        <div className="w-full max-h-[140px] overflow-y-auto relative">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="w-[10%] py-2 text-center">
                  #
                </th>
                <th scope="col" className="w-[50%] py-2 text-center">
                  Tên Thuốc
                </th>
                <th scope="col" className="w-[10%] py-2">
                  SL
                </th>
                <th scope="col" className="w-[15%] py-2">
                  Đơn vị
                </th>
                {!medicalRecord && (
                  <th scope="col" className="w-[15%] py-2">
                    Thao Tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody className=" w-[full] bg-black font-medium">
              {medical.map((medical, index) => (
                <tr
                  key={index}
                  className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="px-6 py-2 text-center font-medium"
                  >
                    {index + 1}
                  </td>
                  <td className="py-2 text-[15px] text-center">
                    {medical.medicalName}
                  </td>
                  <td className="py-2">{medical.quantity}</td>
                  <td className="py-2">{medical.unitOfCalculation}</td>
                  {!medicalRecord && (
                    <td className="py-2 flex justify-center">
                      <button
                        className="hover:scale-[1.05] transition-all text-[14px] bg-[red] flex justify-center items-center w-[55px] text-[white] mt-2 h-[37px] rounded-lg"
                        onClick={() => {
                          setMedical(prev => prev.filter(item => item.medicalName !== medical.medicalName))
                        }}
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="full flex justify-end">
        {!medicalRecord && (
          <button
            onClick={() => updateMedicalRecord()}
            className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[15px] font-medium px-4 rounded-md py-2"
          >
            Cập Nhật Hồ Sơ
          </button>
        )}
      </div>


    </div>
  );
}

export default FormRecordPatientHome