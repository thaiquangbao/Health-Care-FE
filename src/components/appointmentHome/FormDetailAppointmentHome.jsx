import { userContext } from "@/context/UserContext";
import { api, deploy, TypeHTTP } from "@/utils/api";
import {
  calculateDetailedTimeDifference,
  convertDateToDayMonthYearTimeObject,
} from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import FormRecordPatientHome from "./FormRecordPatientHome";

const FormDetailAppointmentHome = ({
  hidden,
  data,
  display,
}) => {
  const router = useRouter();
  const [doctorRecord, setDoctorRecord] = useState();
  const { userData } = useContext(userContext);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [type, setType] = useState(0)
  const wrapperRef = useRef()
  const formRef = useRef()
  const [temporary, setTemporary] = useState(false)

  useEffect(() => {
    if (wrapperRef.current && formRef.current) {
      wrapperRef.current.style.marginLeft = `-${formRef.current.offsetWidth * type}px`
    }
  }, [type])

  useEffect(() => {
    if (data) {
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/doctorRecords/get-one/${data?.doctor_record_id}`,
      }).then((res) => setDoctorRecord(res));
      api({
        type: TypeHTTP.GET,
        sendToken: false,
        path: `/medicalRecords/findByPatient/${data?.patient?._id}`,
      }).then((res) => {
        setMedicalRecords(res)
      });
    }
  }, [data]);

  useEffect(() => {
    console.log(temporary)
  }, [temporary])

  return (
    <div
      ref={formRef}
      style={
        (data && temporary === false)
          ? {
            height: "95%",
            width: "80%",
            transition: "0.3s",
            backgroundSize: "cover",
            overflow: "hidden",
            backgroundImage: "url(/bg.png)",
          } : {
            height: 0,
            width: 0,
            transition: "0.3s",
            overflow: "hidden",
          }
      }
      className="flex items-center z-[41] min-h-[100px] bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <div ref={wrapperRef} style={{ transition: '0.5s' }} className='flex w-full h-full'>
        <div className="px-[2rem] min-w-[100%] h-full py-[1.5rem] flex flex-col gap-2">
          <span className="font-semibold">{`Thông Tin Chi Tiết Cuộc Hẹn (${data?.sick !== "" ? data?.sick : "Khám tại nhà"
            })`}</span>
          <div className="flex justify-between items-center px-4 mt-4">
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
                Thời gian hẹn: {data?.appointment_date?.time}{" "}
                ngày {data?.appointment_date?.day} tháng{" "}
                {data?.appointment_date?.month},{" "}
                {data?.appointment_date?.year}
              </span>
              <div className="flex items-center space-x-2 justify-end">
                <span
                  style={{
                    color:
                      data?.status.status_type === "ACCEPTED"
                        ? "green"
                        : data?.status.status_type === "QUEUE"
                          ? "#999"
                          : data?.status.status_type ===
                            "COMPLETED"
                            ? "blue"
                            : "red",
                  }}
                  className="font-medium text-[14px]"
                >
                  {data?.status.status_type === "ACCEPTED"
                    ? calculateDetailedTimeDifference(
                      convertDateToDayMonthYearTimeObject(
                        new Date().toISOString()
                      ),
                      data?.appointment_date
                    )
                    : data?.status?.message}
                </span>
                <div className="relative flex h-4 w-4">
                  <span
                    style={{
                      backgroundColor:
                        data?.status?.status_type ===
                          "ACCEPTED"
                          ? "green"
                          : data?.status?.status_type ===
                            "QUEUE"
                            ? "#999"
                            : data?.status?.status_type ===
                              "COMPLETED"
                              ? "blue"
                              : "red",
                    }}
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                  ></span>
                  <span
                    style={{
                      backgroundColor:
                        data?.status?.status_type ===
                          "ACCEPTED"
                          ? "green"
                          : data?.status?.status_type ===
                            "QUEUE"
                            ? "#999"
                            : data?.status?.status_type ===
                              "COMPLETED"
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
            <span>
              <span className="font-semibold">
                Triệu Chứng:
              </span>{" "}
              {data?.note}
            </span>
            <div className="flex flex-col gap-1">
              {!display && (
                <>
                  <button
                    onClick={() => {
                      setType(1)
                    }}
                    className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                  >
                    Hồ sơ bệnh nhân
                  </button>
                  <button
                    onClick={() => {
                      hidden();
                    }}
                    className="hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                  >
                    Xem vị trí của bệnh nhân
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex px-4 text-[14px] gap-[2rem]">
            <span className="font-semibold">
              Thiết bị có sẵn:{" "}
            </span>
            <div className="flex items-center gap-5 text-[13px]">
              <span>
                Nhiệt kế:{" "}
                {data?.equipment?.thermometer === false
                  ? "Không"
                  : "Có"}
              </span>
              <span>
                Thiết bị huyết áp:{" "}
                {data?.equipment?.bloodPressureMonitor ===
                  false
                  ? "Không"
                  : "Có"}
              </span>
              <span>
                Thiết bị nhịp tim:{" "}
                {data?.equipment?.heartRateMonitor === false
                  ? "Không"
                  : "Có"}
              </span>
              <span>
                Thiết bị đo đường huyết:{" "}
                {data?.equipment?.bloodGlucoseMonitor ===
                  false
                  ? "Không"
                  : "Có"}
              </span>
            </div>
          </div>
          {/* <div className="flex px-4 text-[14px] gap-[2rem]">
          <span className="font-semibold">Hình Ảnh: </span>
          <div className="flex items-center gap-5 text-[13px]">
            {data?.images?.map((image, index) => (
              <div key={index} style={{ backgroundImage: `url(${image})` }} className="h-[50px] bg-cover aspect-video" />
            ))}
          </div>
        </div> */}
          <div className="flex justify-between items-center px-4">
            <span className="text-[14px] font-bold">
              Lịch Sử khám
            </span>
          </div>
          <div className="w-full max-h-[500px] px-4 overflow-y-auto relative">
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
                {medicalRecords.map(
                  (medicalRecord, index) => (
                    <tr
                      // onClick={() =>
                      //   appointmentHandler.showFormDetailAppointment(
                      //     appointment
                      //   )
                      // }
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
                {/* {sortByAppointmentDate(appointments).map((appointment, index) => (
                                <tr onClick={() => appointmentHandler.showFormDetailAppointment(appointment)} key={index} className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td scope="row" className="px-6 py-2 text-center font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="py-2 text-[15px]">
                                        BS. {doctorRecords.filter(item => item._id === appointment.doctor_record_id)[0]?.doctor?.fullName}
                                    </td>
                                    <td style={{ color: appointment.status === 'QUEUE' ? 'black' : appointment.status === 'ACCEPTED' ? 'green' : 'red' }} className="py-2">
                                        {appointment.status_message}
                                    </td>
                                    <td className="py-2">
                                        {`${convertDateToDayMonthYearVietNam(appointment.appointment_date)}`}
                                    </td>
                                    <td className="py-4">
                                        {appointment.note}
                                    </td>
                                    <td className="py-4 flex gap-2 items-center justify-center">
                                        {!['CANCELED', 'ACCEPTED', 'REJECTED'].includes(appointment.status) && (
                                            <button onClick={() => handleCancelAppointment(appointment)} className='hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Hủy Cuộc Hẹn</button>
                                        )}
                                        {(displayConnect === appointment._id) && (
                                            <Link href={`http://127.0.0.1:3000/zero/${appointment._id}/${userData.user?.role === 'USER' ? 'patient' : 'doctor'}`}>
                                                <button className='hover:scale-[1.05] transition-all bg-[blue] text-[white] text-[13px] font-medium px-2 rounded-md py-1'>Tham Gia Cuộc Hẹn</button>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))} */}
              </tbody>
            </table>
            {/* {appointments.length === 0 && (
                        <div className='w-full flex items-center justify-center my-10 text-[18px] font-medium'>
                            Không có cuộc hẹn khám trong hôm nay
                        </div>
                    )} */}
          </div>
        </div>
        <FormRecordPatientHome setTemporary={setTemporary} type={type} setType={setType} doctorRecord1={doctorRecord} appointmentHome1={data} />
      </div>
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
    </div>
  );
};

export default FormDetailAppointmentHome;
