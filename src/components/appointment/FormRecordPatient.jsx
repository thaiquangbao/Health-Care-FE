import { appointmentContext } from "@/context/AppointmentContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { api, TypeHTTP } from "@/utils/api";
import { convertDateToDayMonthYearVietNam } from "@/utils/date";
import { set } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import Input from "../input";
import axios from "axios";

const FormRecordPatient = ({ hidden, visible, setVisibleStatusUpdated }) => {
  const { appointmentData, appointmentHandler } =
    useContext(appointmentContext);
  const [doctorRecord, setDoctorRecord] = useState();
  const [medical, setMedical] = useState([]);
  const [nameMedical, setNameMedical] = useState("");
  const [quantity, setQuantity] = useState(0);
  const { globalHandler } = useContext(globalContext);
  const [unitOfCalculation, setUnitOfCalculation] = useState("");
  const [diagnosisDisease, setDiagnosisDisease] = useState("");
  const [note, setNote] = useState("");
  // const [reAppointmentDay, setReAppointmentDay] = useState(0);
  // const [reAppointmentMonth, setReAppointmentMonth] = useState(0);
  // const [reAppointmentYear, setReAppointmentYear] = useState(0);
  const [reAppointmentDate, setReAppointmentDate] = useState("");
  useEffect(() => {
    if (appointmentData.medicalRecord) {
      setMedical(appointmentData.medicalRecord.medical);
    }
  }, [appointmentData.medicalRecord]);

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
    if (!visible) {
      setSelectedMedical()
    }
  }, [visible])
  useEffect(() => {
    if (nameMedical !== '') {
      const filter = medicalData.filter(item => item.title.toLowerCase().trim().includes(nameMedical.toLowerCase().trim()))
      setMedicalFilter(filter)
    }
  }, [nameMedical])

  // -----------------------------------------------

  useEffect(() => {
    if (appointmentData.currentAppointment) {
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/doctorRecords/get-one/${appointmentData.currentAppointment?.doctor_record_id}`,
      }).then((record) => {
        setDoctorRecord(record);
        api({
          path: "/medicalRecords/check-appointment",
          type: TypeHTTP.POST,
          sendToken: false,
          body: {
            appointment: appointmentData.currentAppointment?._id,
          },
        }).then((res) => {
          if (res === 0) {
            const body = {
              patient: appointmentData.currentAppointment?.patient?._id,
              doctor: record.doctor._id,
              appointment: appointmentData.currentAppointment?._id,
              medical: [],
              healthRate: appointmentData.currentAppointment?.healthRate,
              weight: appointmentData.currentAppointment?.weight,
              bloodPressure: appointmentData.currentAppointment?.bloodPressure,
              images: appointmentData.currentAppointment?.images,
              temperature: appointmentData.currentAppointment?.temperature,
              height: appointmentData.currentAppointment?.height,
            };
            api({
              path: "/medicalRecords/save",
              type: TypeHTTP.POST,
              sendToken: false,
              body,
            }).then((medicalRecord) =>
              appointmentHandler.setMedicalRecord(medicalRecord)
            );
          } else {
            api({
              path: "/medicalRecords/getAll",
              type: TypeHTTP.GET,
              sendToken: false,
            }).then((medicalRecords) => {
              appointmentHandler.setMedicalRecord(
                medicalRecords.filter(
                  (item) =>
                    item.appointment === appointmentData.currentAppointment?._id
                )[0]
              );
            });
          }
        });
      });
    }
  }, [appointmentData.currentAppointment?._id, visible]);

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
    let splitDate = reAppointmentDate ? reAppointmentDate.split("-") : [];
    api({
      path: "/medicalRecords/update",
      type: TypeHTTP.POST,
      sendToken: false,
      body: {
        _id: appointmentData.medicalRecord._id,
        diagnosisDisease: appointmentData.medicalRecord.diagnosisDisease,
        note: appointmentData.medicalRecord?.note,
        medical: medical,
        symptoms: appointmentData.currentAppointment?.note,
        date: appointmentData.currentAppointment?.appointment_date,
        reExaminationDate: {
          day: splitDate[2] || "",
          month: splitDate[1] || "",
          year: splitDate[0] || "",
        },
      },
    }).then((res) => {
      appointmentHandler.setMedicalRecord(res);
      globalHandler.notify(
        notifyType.SUCCESS,
        "Cập nhật hồ sơ sức khỏe thành công !!!"
      );
      setVisibleStatusUpdated(true);
      hidden();
    });
  };
  return (
    <section
      style={
        visible
          ? {
            height: "95%",
            width: "80%",
            transition: "0.3s",
            backgroundSize: "cover",
            overflow: "auto",
            backgroundImage: "url(/bg.png)",
          }
          : {
            height: 0,
            width: 0,
            transition: "0.3s",
            overflow: "hidden",
          }
      }
      className="z-[41] shadow-xl w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      {appointmentData.currentAppointment && (
        <div className="px-[2rem] py-[1.5rem] w-full flex flex-col">
          <span className="font-semibold">Hồ Sơ Bệnh Án</span>
          <div className="flex items-center justify-between py-4 px-2 w-full">
            <div className="flex items-center gap-4 ">
              <div
                className="w-[60px] aspect-square rounded-full shadow-xl"
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${appointmentData.medicalRecord?.patient?.image})`,
                }}
              ></div>
              <div className="flex flex-col">
                <span className="font-medium">
                  {appointmentData.medicalRecord?.patient?.fullName}
                </span>
                <span className="text-[14px]">
                  {appointmentData.medicalRecord?.patient?.phone}
                </span>
              </div>
            </div>
            <div className="flex flex-col text-[14px]">
              <span className="text-[14px] font-semibold">
                {appointmentData.currentAppointment?.sick}
              </span>
              <span>
                {convertDateToDayMonthYearVietNam(
                  appointmentData.currentAppointment?.appointment_date
                )}
              </span>
            </div>
          </div>
          <span>
            <span className="font-semibold px-2">Triệu Chứng:</span>{" "}
            {appointmentData.currentAppointment?.note}
          </span>
          <div className="grid grid-cols-3 h-auto gap-x-[0.5rem] mt-[0.5rem]">
            <div>
              <span className="font-semibold px-2 mt-[1rem]">Huyết áp:</span>
              {appointmentData.medicalRecord?.bloodPressure === ""
                ? "Không"
                : appointmentData.medicalRecord?.bloodPressure + " mmHg"}
            </div>
            <div>
              <span className="font-semibold px-2 mt-[1rem]">Nhịp tim:</span>
              {appointmentData.medicalRecord?.healthRate === 0
                ? "Không"
                : appointmentData.medicalRecord?.healthRate + " nhịp/phút"}
            </div>
            <div>
              <span className="font-semibold px-2 mt-[1rem]">Cân nặng:</span>
              {appointmentData.medicalRecord?.weight === 0
                ? "Không"
                : appointmentData.medicalRecord?.weight + " kg"}
            </div>
            <div>
              <span className="font-semibold px-2 mt-[1rem]">Chiều cao:</span>
              {appointmentData.medicalRecord?.height === 0
                ? "Không"
                : appointmentData.medicalRecord?.height + " cm"}
            </div>
            <div>
              <span className="font-semibold px-2 mt-[1rem]">Nhiệt độ:</span>
              {appointmentData.medicalRecord?.temperature === 0
                ? "Không"
                : appointmentData.medicalRecord?.temperature + " °C"}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold px-2">Tái khám:</span>
              <input
                type="date"
                className="text-[14px] w-[150px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) => setReAppointmentDate(e.target.value)}
                value={reAppointmentDate}
              />
            </div>
          </div>
          <div className="flex px-2 py-2 gap-[2rem]">
            <span className="font-semibold mt-[1rem]">Hình ảnh mô tả:</span>
            <div className="flex items-center gap-5 text-[13px]">
              {appointmentData.medicalRecord?.images?.map((image, index) => (
                <div
                  key={index}
                  style={{ backgroundImage: `url(${image})` }}
                  className="h-[50px] bg-cover aspect-video"
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] mt-[1rem] px-2">
            <textarea
              placeholder="Chuẩn đoán bệnh"
              className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) =>
                appointmentHandler.setMedicalRecord({
                  ...appointmentData.medicalRecord,
                  diagnosisDisease: e.target.value,
                })
              }
              value={appointmentData.medicalRecord?.diagnosisDisease}
            ></textarea>
            <textarea
              placeholder="Lời dặn bác sĩ"
              className="text-[14px] w-[100%] h-[90px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              onChange={(e) =>
                appointmentHandler.setMedicalRecord({
                  ...appointmentData.medicalRecord,
                  note: e.target.value,
                })
              }
              value={appointmentData.medicalRecord?.note}
            ></textarea>
          </div>
          <span className="font-semibold px-2 mt-[1rem]">Đơn Thuốc</span>
          <div className="grid grid-cols-2 h-auto gap-x-[0.5rem] px-2 mt-1">
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
              <div className="flex items-center gap-2">
                <button
                  className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] flex justify-center items-center w-[30%] text-[white] mt-2 h-[37px] rounded-lg"
                  onClick={() => addMedical()}
                >
                  Thêm
                </button>
                <button
                  className="hover:scale-[1.05] transition-all text-[14px] bg-[red] flex justify-center items-center w-[45%] text-[white] mt-2 h-[37px] rounded-lg"
                  onClick={() => {
                    setSelectedMedical()
                    setNameMedical('')
                    setUnitOfCalculation('Đơn vị tính')
                    setQuantity('')
                  }}
                >
                  Hủy thuốc đang chọn
                </button>
              </div>
              {/*-----------them phan thuoc*/}
            </div>
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
                    <th scope="col" className="w-[15%] py-2">
                      Thao Tác
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
                      <td className="py-2">{medical.quantity}</td>
                      <td className="py-2">{medical.unitOfCalculation}</td>
                      <td className="py-2">
                        <button
                          className="hover:scale-[1.05] transition-all text-[14px] bg-[red] flex justify-center items-center w-[55px] text-[white] mt-2 h-[37px] rounded-lg"
                          onClick={() => {
                            setMedical(prev => prev.filter(item => item.medicalName !== medical.medicalName))
                          }}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* <span className="font-semibold px-2 mt-[1rem]">Ngày tái khám</span>
          <div className="w-full flex mt-3 px-2"> */}
          {/* <div className="w-[50%] flex items-center justify-between">
              
              <input
                placeholder="Ngày (DD)"
                className="text-[14px] w-[30%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) => setReAppointmentDay(e.target.value)}
                value={reAppointmentDay}
              />
              <input
                placeholder="Tháng (MM)"
                className="text-[14px] w-[30%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) => setReAppointmentMonth(e.target.value)}
                value={reAppointmentMonth}
              />
              
              <input
                placeholder="Năm (YYYY)"
                className="text-[14px] w-[30%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) => setReAppointmentYear(e.target.value)}
                value={reAppointmentYear}
              />
            </div> */}
          <div className="flex justify-end mt-2">
            <button
              onClick={() => updateMedicalRecord()}
              className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[15px] font-medium px-4 rounded-md py-2"
            >
              Cập Nhật Hồ Sơ
            </button>
          </div>
        </div>
        // </div>
      )}
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </section>
  );
};

export default FormRecordPatient;

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
