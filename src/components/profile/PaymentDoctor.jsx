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
const PaymentDoctor = ({ user, setUser }) => {
  const { userData, userHandler } = useContext(userContext);
  const { globalHandler } = useContext(globalContext);
  const [payments, setPayments] = useState([]);
  useEffect(() => {
    api({
      sendToken: true,
      type: TypeHTTP.POST,
      path: `/payments/find-by-doctor`,
      body: { doctor_id: user?._id },
    }).then((res) => {
      console.log(
        res.filter((item) => item.namePayment === "PAYBACK")
      );

      setPayments(
        res.filter((item) => item.namePayment === "PAYBACK")
      );
    });
  }, [user]);

  return (
    <div className="w-full min-h-screen">
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-col">
        <span className="font-semibold text-[18px]">
          Nhận tiền
        </span>
        <div className="grid grid-cols-3 h-auto gap-x-[1rem] gap-y-[1rem] mt-[1rem] px-[2rem]">
          <Input
            name={"Tên Ngân Hàng"}
            onChange={(e) =>
              setUser({
                ...user,
                bank: {
                  ...user.bank,
                  bankName: e.target.value,
                },
              })
            }
            value={user?.bank?.bankName}
          />
          <Input
            name={"Tên Chủ Tài Khoản"}
            onChange={(e) =>
              setUser({
                ...user,
                bank: {
                  ...user.bank,
                  accountName: e.target.value,
                },
              })
            }
            value={user?.bank?.accountName}
          />
          <Input
            name={"Số Tài Khoản"}
            onChange={(e) =>
              setUser({
                ...user,
                bank: {
                  ...user.bank,
                  accountNumber: e.target.value,
                },
              })
            }
            value={user?.bank?.accountNumber}
          />
        </div>
      </div>
      <div className="w-full max-h-[500px] mt-2 overflow-y-auto relative">
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
                Thụ hưởng
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
                  {payment?.beneficiaryAccount?.bankName ===
                  ""
                    ? "Đang xử lý"
                    : `${payment.beneficiaryAccount?.bankName}
                      ${payment.beneficiaryAccount?.accountNumber} -
                      ${payment.beneficiaryAccount?.accountName}`}
                </td>
                <td className="py-4 text-[13px]">
                  Nhận tiền
                </td>
                <td className="py-4 text-[13px]">
                  {payment.dateTake?.day === 0 &&
                  payment.dateTake?.month === 0
                    ? "Chưa xác định"
                    : `${payment.dateTake?.time}-
                  ${payment.dateTake?.day}/
                  ${payment.dateTake?.month}/${payment.dateTake?.year}`}
                </td>
                <td className="py-4 text-[13px]">
                  {formatMoney(payment.price)} đ
                </td>
                <td
                  className="py-4 text-[13px]"
                  style={{
                    textAlign: payment.descriptionTake
                      ? ""
                      : "center",
                  }}
                >
                  {payment.descriptionTake
                    ? payment.descriptionTake
                    : "Chưa xác định"}
                </td>
                <td
                  className="py-4 text-[13px] text-center "
                  style={{
                    color:
                      payment.status_take_money.type ===
                      "PENDING"
                        ? "black"
                        : payment.status_take_money.type ===
                          "ACCEPT"
                        ? "green"
                        : payment.status_take_money.type ===
                          "REJECTED"
                        ? "red"
                        : "blue",
                  }}
                >
                  {payment.status_take_money.messages}
                </td>
              </tr>
            ))}
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

export default PaymentDoctor;
