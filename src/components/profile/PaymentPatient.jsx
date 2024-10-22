import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { dsKhoa } from "@/utils/chuyenKhoa";
import { formatMoney } from "@/utils/other";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import { connectToGoogle } from "../firebase/firebase";
import Input from "../input";
import Select from "../select";
const PaymentPatient = ({ user, setUser }) => {
  const { userData, userHandler } = useContext(userContext);
  const { globalHandler } = useContext(globalContext);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    api({
      sendToken: true,
      type: TypeHTTP.POST,
      path: `/payments/find-by-patient`,
      body: { patient_id: user._id },
    }).then((res) => {
      setPayments(res);
    });
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col">
        <span className="font-semibold text-[20px]">
          Lịch sử thanh toán
        </span>
      </div>
      <div className="w-full max-h-[500px] mt-4 overflow-y-auto relative">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="w-[5%] py-3 text-center"
              >
                #
              </th>
              <th scope="col" className="w-[15%] py-3">
                Thụ Hưởng
              </th>

              <th scope="col" className="w-[12%] py-3">
                Dịch Vụ
              </th>
              <th scope="col" className="w-[15%] py-3">
                Thời Gian
              </th>
              <th scope="col" className="w-[12%] py-3">
                Số Tiền
              </th>
              <th
                scope="col"
                className="w-[25%] py-3 text-center"
              >
                Mô Tả
              </th>
              <th
                scope="col"
                className="w-[15%] py-3 text-center"
              >
                Trạng Thái
              </th>
            </tr>
          </thead>
          <tbody className=" w-[full] bg-black font-medium">
            {payments.map((payment, index) => (
              <tr
                key={index}
                className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td
                  scope="row"
                  className="px-6 py-4 text-center font-medium"
                >
                  {index + 1}
                </td>
                <td className="py-4 text-[13px]">
                  {payment.beneficiaryAccount?.bankName}
                  {
                    payment.beneficiaryAccount
                      ?.accountNumber
                  }
                  -{payment.beneficiaryAccount?.accountName}
                </td>
                <td className="py-4 text-[13px]">
                  {payment.namePayment === "APPOINTMENT"
                    ? "Tư vấn trực tuyến"
                    : payment.namePayment ===
                      "APPOINTMENTHOME"
                    ? "Tư vấn sức khỏe tại nhà"
                    : "Theo dõi sức khỏe"}
                </td>
                <td className="py-4 text-[13px]">
                  {payment.date?.time}-{payment.date?.day}/
                  {payment.date?.month}/{payment.date?.year}
                </td>
                <td className="py-4 text-[13px]">
                  {formatMoney(payment.price)} đ
                </td>
                <td className="py-4 text-[13px]">
                  {payment.description}
                </td>
                <td
                  className="py-4 text-[13px] text-center "
                  style={{
                    color:
                      payment.status_payment?.type ===
                        "SUCCESS" && "green",
                  }}
                >
                  {payment.status_payment?.type ===
                    "SUCCESS" &&
                    payment.status_payment?.messages}
                </td>
              </tr>
            ))}

            {/* {sortByAppointmentDate(appointments).map((appointment, index) => (
                                <tr key={index} className="odd:bg-white cursor-pointer hover:bg-[#eee] transition-all odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                                    <td  scope="row" className="px-6 py-4 text-center font-medium">
                                        {index + 1}
                                    </td>
                                    <td  className="py-4 text-[15px]">
                                        BS. {doctorRecords.filter(item => item._id === appointment.doctor_record_id)[0]?.doctor?.fullName}
                                    </td>
                                    <td  style={{ color: appointment.status === 'QUEUE' ? 'black' : appointment.status === 'ACCEPTED' ? 'green' : appointment.status === "COMPLETED" ? 'blue' : "red" }} className="py-4">
                                        {appointment.status_message}
                                    </td>
                                    <td  className="py-4">
                                        {`${convertDateToDayMonthYearVietNam(appointment.appointment_date)}`}
                                    </td>
                                    <td  className="py-4">
                                        {appointment.note}
                                    </td>
                                    <td className="py-4 flex gap-2 items-center justify-center">
                                        {!['CANCELED', 'ACCEPTED', 'REJECTED', 'COMPLETED'].includes(appointment.status) && (
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
  );
};

export default PaymentPatient;
