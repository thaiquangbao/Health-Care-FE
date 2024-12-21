import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { utilsContext } from "@/context/UtilsContext";
import { api, deploy, TypeHTTP } from "@/utils/api";
import {
  calculateDetailedTimeDifference,
  convertDateInputToObject,
  convertDateToDayMonthYearTimeObject,
  convertDateToDayMonthYearVietNam,
} from "@/utils/date";
import { returnNumber } from "@/utils/other";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";

const FormDetailAppointment = ({
  hidden,
  data,
  display,
}) => {
  const router = useRouter();
  const [doctorRecord, setDoctorRecord] = useState();
  const { userData } = useContext(userContext);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [medicalRecordsAll, setMedicalRecordsAll] = useState([]);

  // them phan thuoc
  const [screen, setScreen] = useState(0)
  const [medicalData, setMedicalData] = useState([])
  const [medicalFilter, setMedicalFilter] = useState([])
  const [selectedMedical, setSelectedMedical] = useState()
  const [custom, setCustom] = useState(false)
  const [nameMedical, setNameMedical] = useState("");
  const [unitOfCalculation, setUnitOfCalculation] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [medical, setMedical] = useState([]);
  const { utilsHandler } = useContext(utilsContext)
  const [reAppointmentDate, setReAppointmentDate] = useState("");
  const [currentMedicalRecord, setCurrentMedicalRecord] = useState()
  useEffect(() => {
    if (data) {
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/doctorRecords/get-one/${data?.doctor_record_id}`,
      }).then((res) => setDoctorRecord(res));
      api({ type: TypeHTTP.GET, sendToken: false, path: `/medicalRecords/get-appointment/${data._id}` })
        .then(res => {
          setMedicalRecords(res)
          setCurrentMedicalRecord(res[res.length - 1])
        })
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/medicalRecords/findByPatient/${data?.patient?._id}`,
      }).then((res) => {
        setMedicalRecordsAll(res.reverse());
      });
    }
  }, [data]);
  useEffect(() => {
    axios.post('https://prod.jiohealth.com:8443/jio-search/v1/search/retail/products-advance?offset=0&limit=315&sortName=PRICE&isDescending=false&categories=82&token=b161dc46-207d-11ee-aa37-02b973dc30b0&userID=1')
      .then(res => {
        setMedicalData(res.data.data.products)
      })
  }, [])
  useEffect(() => {
    if (!data) {
      setSelectedMedical()
      setReAppointmentDate('')
      setMedical([])
    }
  }, [data])

  useEffect(() => {
    if (nameMedical !== '') {
      const filter = medicalData.filter(item => item.title.toLowerCase().trim().includes(nameMedical.toLowerCase().trim()))
      setMedicalFilter(filter)
    }
  }, [nameMedical])
  useEffect(() => {
    if (currentMedicalRecord) {
      setMedical(currentMedicalRecord.medical)
      setReAppointmentDate(currentMedicalRecord.reExaminationDate.year + '-' + returnNumber(currentMedicalRecord.reExaminationDate.month) + '-' + returnNumber(currentMedicalRecord.reExaminationDate.day))
    }
  }, [currentMedicalRecord])

  const updateMedicalRecord = () => {
    let splitDate = reAppointmentDate ? reAppointmentDate.split("-") : [];
    const body = {
      patient: currentMedicalRecord.patient?._id,
      doctor: currentMedicalRecord.doctor?._id,
      appointment: data._id,
      diagnosisDisease: currentMedicalRecord.diagnosisDisease,
      note: currentMedicalRecord?.note,
      medical: medical,
      symptoms: currentMedicalRecord.symptoms,
      date: convertDateToDayMonthYearTimeObject(new Date().toISOString()),
      reExaminationDate: {
        day: splitDate[2].replace('null', '') || "",
        month: splitDate[1].replace('null', '') || "",
        year: splitDate[0].replace('null', '') || "",
      },
    }
    utilsHandler.notify(notifyType.LOADING, "Đang lưu hồ sơ bệnh nhân")
    api({
      path: "/medicalRecords/save",
      type: TypeHTTP.POST,
      sendToken: false,
      body
    }).then((medicalRecord) => {
      api({
        path: `/medicalRecords/send-mail/${medicalRecord._id}`,
        type: TypeHTTP.POST,
        sendToken: false,
      }).then(res => {
        setMedicalRecords([...medicalRecords, medicalRecord])
        setCurrentMedicalRecord(medicalRecord)
        utilsHandler.notify(
          notifyType.SUCCESS,
          "Cập nhật hồ sơ sức khỏe thành công !!!"
        );
      })
    });
  };
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
    if (medicalRecords.length > 0) {
      setCurrentMedicalRecord({ ...currentMedicalRecord, medical: [...currentMedicalRecord.medical, newMedical] })
    }
    setMedical([...medical, newMedical]);
    setSelectedMedical()
    setNameMedical('')
    setUnitOfCalculation('Đơn vị tính')
    setQuantity('')
    setCustom(false)
  };


  // -----------------------------------------------

  return (
    <div
      style={
        data
          ? {
            height: "90%",
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
      className="z-[41] flex w-[300px] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div style={{ marginLeft: `${screen * -100}%`, transition: '0.5s' }} className="flex w-[100%]">
        <div className="px-[2rem] py-[1.5rem] min-w-[100%] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{`Thông Tin Chi Tiết Cuộc Hẹn (${data?.sick})`}</span>
            <button onClick={() => setScreen(1)} className="text-[white] bg-[#1dcbb6] px-3 py-[5px] rounded-md hover:scale-[1.05] transition-all">
              Lịch sử cập nhật
            </button>
          </div>
          <div className="flex justify-between items-center px-4 mt-2">
            <div className="flex items-center gap-4">
              <div
                className="w-[60px] aspect-square shadow-xl rounded-full"
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${userData.user?.role !== "DOCTOR"
                    ? doctorRecord?.doctor?.image
                    : data?.patient?.image
                    })`,
                }}
              ></div>
              <div className="flex flex-col">
                <span className="font-semibold text-[15px]">
                  BS.{" "}
                  {userData.user?.role !== "DOCTOR"
                    ? doctorRecord?.doctor?.fullName
                    : data?.patient?.fullName}
                </span>
                <span className="text-[14px]">
                  {userData.user?.role !== "DOCTOR"
                    ? doctorRecord?.doctor?.phone
                    : data?.patient?.phone}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[14px]">
                Thời gian hẹn: {data?.appointment_date.time}{" "}
                ngày {data?.appointment_date.day} tháng{" "}
                {data?.appointment_date.month},{" "}
                {data?.appointment_date.year}
              </span>
              <div className="flex items-center space-x-2 justify-end">
                <span
                  style={{
                    color:
                      data?.status === "ACCEPTED"
                        ? "green"
                        : data?.status === "QUEUE"
                          ? "#999"
                          : data?.status === "COMPLETED"
                            ? "blue"
                            : "red",
                  }}
                  className="font-medium text-[14px]"
                >
                  {data?.status === "ACCEPTED"
                    ? calculateDetailedTimeDifference(
                      convertDateToDayMonthYearTimeObject(
                        new Date().toISOString()
                      ),
                      data?.appointment_date
                    )
                    : data?.status_message}
                </span>
                <div className="relative flex h-4 w-4">
                  <span
                    style={{
                      backgroundColor:
                        data?.status === "ACCEPTED"
                          ? "green"
                          : data?.status === "QUEUE"
                            ? "#999"
                            : data?.status === "COMPLETED"
                              ? "blue"
                              : "red",
                    }}
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  ></span>
                  <span
                    style={{
                      backgroundColor:
                        data?.status === "ACCEPTED"
                          ? "green"
                          : data?.status === "QUEUE"
                            ? "#999"
                            : data?.status === "COMPLETED"
                              ? "blue"
                              : "red",
                    }}
                    className="relative inline-flex h-4 w-4 rounded-full"
                  ></span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center px-4 text-[14px] mt-2">
            {data?.status === 'COMPLETED' ? (
              <span className="flex items-center gap-2 w-full">
                <span className="font-semibold">
                  Triệu Chứng:
                </span>
                <input
                  placeholder="Triệu Chứng"
                  className="text-[14px] w-[45%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                  onChange={(e) => setCurrentMedicalRecord({ ...currentMedicalRecord, symptoms: e.target.value })}
                  value={currentMedicalRecord?.symptoms}
                />
              </span>
            ) : (
              <span className="flex items-center gap-2 w-full">
                <span className="font-semibold">
                  Triệu Chứng:
                </span>
                <span>{data?.note}</span>
              </span>
            )}
            {display && (
              <button
                onClick={() => {
                  hidden();
                  globalThis.window.location.href = `${deploy}/zero/${data?._id
                    }/${userData.user?.role === "USER"
                      ? "patient"
                      : "doctor"
                    }`;
                }}
                className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[13px] font-medium px-2 w-[180px] rounded-md py-1"
              >
                Tham Gia Cuộc Hẹn
              </button>
            )}
          </div>
          <div className="flex px-4 text-[14px] gap-[2rem]">
            <span className="font-semibold">Thông Số: </span>
            <div className="flex items-center gap-5 text-[13px]">
              <span>
                Cân Nặng:{" "}
                {data?.weight === 0 ? "Không" : data?.weight + ' kg'}
              </span>
              <span>
                Chiều cao:{" "}
                {data?.height === 0 ? "Không" : data?.height + ' cm'} {/* sửa ở đây */}
              </span>
              <span>
                Nhịp Tim:{" "}
                {data?.healthRate === 0
                  ? "Không"
                  : data?.healthRate + ' nhịp/phút'}
              </span>
              <span>
                Huyết Áp:{" "}
                {data?.bloodPressure === ""
                  ? "Không"
                  : data?.bloodPressure + ' mmHg'}
              </span>
              <span>
                Nhiệt độ:{" "}
                {data?.temperature === 0
                  ? "Không"
                  : data?.temperature + ' °C'}
              </span>
            </div>
          </div>
          {(data?.images && data?.images?.length > 0) && (
            <div className="flex px-4 text-[14px] gap-[2rem]">
              <span className="font-semibold">Hình Ảnh: </span>
              <div className="flex items-center gap-5 text-[13px]">
                {data?.images?.map((image, index) => (
                  <div
                    key={index}
                    style={{ backgroundImage: `url(${image})` }}
                    className="h-[50px] bg-cover aspect-video"
                  />
                ))}
              </div>
            </div>
          )}
          {data?.status === 'COMPLETED' && (<>
            <div className="flex items-center">
              <span className="flex items-center gap-2 w-full ml-4">
                <span className="font-semibold text-[14px] w-[80px]">
                  Chuẩn đoán:
                </span>
                <input
                  placeholder="Chuẩn đoán"
                  className="text-[14px] w-[45%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                  onChange={(e) => setCurrentMedicalRecord({ ...currentMedicalRecord, diagnosisDisease: e.target.value })}
                  value={currentMedicalRecord?.diagnosisDisease}
                />
              </span>
              <div className="flex items-center">
                <span className="font-semibold px-2 w-[100px]">Tái khám:</span>
                <input
                  type="date"
                  className="text-[14px] w-[150px] h-[30px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                  onChange={(e) => setReAppointmentDate(e.target.value)}
                  value={reAppointmentDate}
                />
              </div>
            </div>
            <span className="flex items-start gap-2 w-full ml-4">
              <span className="font-semibold text-[14px] w-[80px]">
                Nhắc nhở:
              </span>
              <textarea
                placeholder="Nhắc nhở"
                className="text-[14px] w-[70%] h-[80px] py-2 bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                onChange={(e) => setCurrentMedicalRecord({ ...currentMedicalRecord, note: e.target.value })}
                value={currentMedicalRecord?.note}
              />
            </span>
            <span className="font-semibold px-2">Đơn Thuốc</span>
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
                  {selectedMedical && (
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
                  )}
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
            <div className="flex justify-end my-2">
              <button
                onClick={() => updateMedicalRecord()}
                className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[15px] font-medium px-4 rounded-md py-2"
              >
                Cập Nhật Hồ Sơ
              </button>
            </div>
          </>)}
          {data?.status !== 'COMPLETED' && (
            <>
              <div className="flex justify-between items-center px-4">
                <span className="text-[14px] font-bold">
                  Lịch Sử khám
                </span>
              </div>
              <div className="h-[250px] w-full overflow-y-auto">
                <div className="w-full px-4 relative">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="text-center">
                        <th
                          scope="col"
                          className="w-[5%] py-3 text-center"
                        >
                          #
                        </th>
                        <th scope="col" className="w-[15%] py-3">
                          Bác Sĩ
                        </th>
                        <th scope="col" className="w-[20%] py-3">
                          Triệu Chứng:
                        </th>
                        <th scope="col" className="w-[20%] py-3">
                          Chẩn đoán
                        </th>
                        <th scope="col" className="w-[15%] py-3">
                          Thời Gian Cuộc Hẹn
                        </th>

                        <th
                          scope="col"
                          className="w-[15%] py-3 text-center"
                        >
                          Ghi chú
                        </th>
                        <th scope="col" className="w-[15%] py-3">
                          Thuốc
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" w-[full] bg-black font-medium">
                      {medicalRecordsAll.map(
                        (medicalRecord, index) => (
                          <tr
                            key={index}
                            className="odd:bg-white cursor-pointer hover:bg-[#eee] text-[13px] text-center transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 "
                          >
                            <td
                              scope="row"
                              className="px-6 py-2 text-center font-medium"
                            >
                              {index + 1}
                            </td>
                            <td className="py-2">
                              BS. {medicalRecord.doctor?.fullName}
                            </td>
                            <td className="py-2">
                              {medicalRecord.symptoms}
                            </td>
                            <td className="py-2">
                              {medicalRecord.diagnosisDisease}
                            </td>
                            <td className="py-2">
                              Ngày: {medicalRecord.date?.day}-{" "}
                              {medicalRecord.date?.month}-{" "}
                              {medicalRecord.date?.year}
                            </td>
                            <td className="py-2">
                              {medicalRecord.note}
                            </td>
                            <td className="py-2">
                              {medicalRecord.medical
                                .map(
                                  (medicine) => medicine.medicalName
                                )
                                .join(", ")}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="px-[2rem] py-[1.5rem] min-w-[100%] flex flex-col gap-2">
          <div className="flex flex-col items-start gap-2">
            <button onClick={() => setScreen(0)} className="flex items-center gap-1">
              <i className='bx bx-chevron-left text-[30px]'></i>
              <span>Trở về</span>
            </button>
            <span className="text-[20px] font-semibold">Lịch Sử Cập Nhật</span>
          </div>
          {screen === 1 && (<>
            <div className="grid grid-cols-4 gap-2">
              {JSON.parse(JSON.stringify(medicalRecords)).reverse().map((item, index) => (
                <button onClick={() => {
                  setCurrentMedicalRecord(item)
                  setScreen(0)
                }} key={index} className="text-[white] items-center bg-[#1dcbb6] px-3 py-[5px] rounded-md hover:scale-[1.05] flex flex-col gap-1 transition-all">
                  <span>{convertDateToDayMonthYearVietNam(item.date).split('(')[0]}</span>
                  <span>{convertDateToDayMonthYearVietNam(item.date).split('(')[1].replace(')', '')}</span>
                </button>
              ))}
            </div>
          </>)}
        </div>
        <button onClick={() => {
          hidden()
          setScreen(0)
        }}>
          <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
        </button>
      </div>
    </div>
  );
};

export default FormDetailAppointment;
