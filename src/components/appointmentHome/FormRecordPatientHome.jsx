import { appointmentContext } from '@/context/AppointmentContext';
import { globalContext, notifyType } from '@/context/GlobalContext';
import { utilsContext } from '@/context/UtilsContext';
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam } from "@/utils/date";
import React, { useContext, useEffect, useState } from 'react';
const FormRecordPatientHome = ({ type, setType, setTemporary, doctorRecord1, appointmentHome1 }) => {
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
    const [heartRate, setHeartRate] = useState(0);
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    // const { globalHandler } = useContext(globalContext);
    useEffect(() => { 
        if (appointmentData.medicalRecord) {
            setMedical(appointmentData.medicalRecord.medical)
        }
    }, [appointmentData.medicalRecord])

    useEffect(() => {
        setDoctorRecord(doctorRecord1)
        setAppointmentHome(appointmentHome1)
        
    }, [doctorRecord1, appointmentHome1, type]);

    // Xử lý
    // Thêm thuốc
    const addMedical = () => {
        const newMedical = {
            medicalName: nameMedical,
            quantity: Number(quantity),
            unitOfCalculation: unitOfCalculation,
        };
        setMedical([...medical, newMedical]);
    };

    useEffect(() => {
        // Clear input fields after adding a new medical
        setNameMedical("");
        setQuantity("");
        setUnitOfCalculation("Đơn vị tính");
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
            // if (diagnosisDisease === "") {
            //   console.log("Chưa nhập chẩn đoán bệnh");
            // }
            // if (symptoms === "") {
            //   console.log("Chưa nhập triệu chứng");
            // }
            // if(note === ""){
            //   console.log("Chưa nhập ghi chú")
            // }
            // if(medical.length === 0){
            //   console.log("Chưa nhập đơn thuốc")
            // }
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
              heartRate: heartRate,
              weight: weight,
              height: height,
              medical: medical,
              appointment: appointmentHome?._id,
              date: appointmentHome?.appointment_date,
            };
            api({
              path: "/medicalRecords/save",
              type: TypeHTTP.POST,
              sendToken: false,
              body,
            }).then(async (medicalRecord) =>{
              await api({
                path: `/medicalRecords/send-mail/${medicalRecord._id}`,
                type: TypeHTTP.POST,
                sendToken: false,
              });
              // thông báo thành công
              setType(0) 
              setTemporary(false);
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
        <span className="font-semibold">Hồ Sơ Bệnh Án</span>
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
              className="text-[14px] w-[80px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) => setHeartRate(e.target.value)}
              value={heartRate}
            />
            bpm
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold px-2">
              Cân nặng:
            </span>
            <input
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
              type="date"
              className="text-[14px] w-[150px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) =>
                setReAppointmentDate(e.target.value)
              }
              value={reAppointmentDate}
            />
          </div>
        </div>
        {/* <div className="flex px-2">
          <span className="font-semibold">
            Hình ảnh mô tả:
          </span>
          <div className="flex items-center gap-5 text-[13px]">
            {appointmentData.medicalRecord?.images?.map(
              (image, index) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${image})`,
                  }}
                  className="h-[50px] bg-cover aspect-video"
                />
              )
            )}
          </div>
        </div> */}
        <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] px-2">
          <textarea
            placeholder="Chuẩn đoán bệnh"
            className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
            onChange={(e) =>
              setDiagnosisDisease(e.target.value)
            }
            value={diagnosisDisease}
          ></textarea>
          <textarea
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
          <div className="text-[14px] w-[100%] focus:outline-0 rounded-lg px-4">
            <input
              placeholder="Tên thuốc"
              className="text-[14px] w-[100%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) =>
                setNameMedical(e.target.value)
              }
              value={nameMedical}
            />
            <div className="flex items-center justify-between">
              <select
                className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                value={unitOfCalculation}
                onChange={(e) =>
                  setUnitOfCalculation(e.target.value)
                }
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
              <input
                placeholder="Số lượng"
                className="text-[14px] mt-2 w-[48%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                value={quantity}
              />
            </div>
            <button
              className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] flex justify-center items-center w-[30%] text-[white] mt-2 h-[37px] rounded-lg"
              onClick={() => addMedical()}
            >
              Thêm
            </button>
          </div>
          <div className="w-full max-h-[140px] overflow-y-auto relative">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th
                    scope="col"
                    className="w-[10%] py-2 text-center"
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className="w-[50%] py-2 text-center"
                  >
                    Tên Thuốc
                  </th>
                  <th scope="col" className="w-[20%] py-2">
                    Số Lượng
                  </th>
                  <th scope="col" className="w-[20%] py-2">
                    Đơn vị tính
                  </th>
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
                    <td className="py-2">
                      {medical.quantity}
                    </td>
                    <td className="py-2">
                      {medical.unitOfCalculation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="full flex justify-end">
          <button
            onClick={() => updateMedicalRecord()}
            className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[15px] font-medium px-4 rounded-md py-2"
          >
            Cập Nhật Hồ Sơ
          </button>
        </div>
      </div>
    );
}

export default FormRecordPatientHome