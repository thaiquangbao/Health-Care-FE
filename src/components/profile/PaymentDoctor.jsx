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
      setPayments(res);
    });
  }, [user]);
  const calculatorMoney = (data) => {
    let result = 0;
    data
      .filter(
        (item) => item.status_take_money?.type === "WAITING"
      )
      .map((item) => {
        if (item.namePayment === "APPOINTMENT") {
          result += 140000;
        } else if (item.namePayment === "APPOINTMENTHOME") {
          result += 280000;
        } else {
          if (item.price === 2300000) {
            result += 1610000;
          } else if (item.price === 4000000) {
            result += 2800000;
          } else {
            result += 945000;
          }
        }
      });
    if (result === 0) return 0;
    return formatMoney(result);
  };
  const sumMoney = () => {
    let result = 0;
    payments.map((item) => {
      if (item.namePayment === "APPOINTMENT") {
        result += 140000;
      } else if (item.namePayment === "APPOINTMENTHOME") {
        result += 280000;
      } else {
        if (item.price === 2300000) {
          result += 1610000;
        } else if (item.price === 4000000) {
          result += 2800000;
        } else {
          result += 945000;
        }
      }
    });
    if (result === 0) return 0;
    return formatMoney(result);
  };
  const takedMoney = () => {
    let result = 0;
    payments
      .filter(
        (item) => item.status_take_money?.type === "SUCCESS"
      )
      .map((item) => {
        if (item.namePayment === "APPOINTMENT") {
          result += 140000;
        } else if (item.namePayment === "APPOINTMENTHOME") {
          result += 280000;
        } else {
          if (item.price === 2300000) {
            result += 1610000;
          } else if (item.price === 4000000) {
            result += 2800000;
          } else {
            result += 945000;
          }
        }
      });
    if (result === 0) return 0;
    return formatMoney(result);
  };
  const processingMoney = () => {
    let result = 0;
    payments
      .filter(
        (item) =>
          item.status_take_money?.type === "PROCESSING"
      )
      .map((item) => {
        if (item.namePayment === "APPOINTMENT") {
          result += 140000;
        } else if (item.namePayment === "APPOINTMENTHOME") {
          result += 280000;
        } else {
          if (item.price === 2300000) {
            result += 1610000;
          } else if (item.price === 4000000) {
            result += 2800000;
          } else {
            result += 945000;
          }
        }
      });
    if (result === 0) return 0;
    return formatMoney(result);
  };
  const receiveMoney = () => { };
  return (
    <div className="w-full min-h-screen">
      <div className="px-[2rem] py-[1.5rem] w-full flex flex-row justify-between">
        <span className="font-semibold text-[18px]">
          Nhận tiền
        </span>
        <div className="flex flex-row gap-3">
          <div
            className="px-5 py-1 gap-6 flex flex-row shadow-lg text-center focus:outline-0 rounded-md font-medium "
            style={{
              backgroundImage: "url(/bg.png)",
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
            }}
          >
            <div className="flex flex-row">
              <i className="text-[25px] bx bx-dollar-circle"></i>
              <span className="font-semibold text-[18px]">
                {calculatorMoney(payments)} đ
              </span>
            </div>
            <div
              className="px-2 py-1 text-[14px] shadow-lg text-center focus:outline-0 rounded-md font-medium cursor-pointer transition-transform transform hover:scale-105"
              style={{
                background: "#28f677",
                boxShadow:
                  "0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
              }}
            >
              <span>Nhận</span>
            </div>
          </div>

          <select
            onChange={(e) => setType(e.target.value)}
            className="px-4 py-2 text-[15px] shadow-lg focus:outline-0 rounded-md font-medium"
          >
            <option value={1}>Tất cả</option>
            <option value={2}>Tuần này</option>
            <option value={3}>Tháng Này</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/EndlessRiver.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-calendar-check"></i>
            <span className="text-[25px] font-semibold">
              {sumMoney()} đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Tổng doanh thu
          </span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Quepal.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[30px] translate-y-[-5px] fa-regular fa-hourglass"></i>
            <span className="text-[25px] font-semibold">
              {processingMoney()} đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Đang chờ nhận
          </span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/SinCityRed.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-line-chart"></i>
            <span className="text-[25px] font-semibold">
              {calculatorMoney(payments)} đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Đã Duyệt
          </span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Flare.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-dollar-circle"></i>
            <span className="text-[25px] font-semibold">
              {takedMoney()} đ
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Đã nhận
          </span>
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
                Người chuyển
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
            {payments
              .filter(
                (item) =>
                  item.status_take_money?.type === "SUCCESS"
              )
              .map((payment, index) => (
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
                    -
                    {
                      payment.beneficiaryAccount
                        ?.accountName
                    }
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
                        "WAITING" && "black",
                    }}
                  >
                    {payment.status_take_money.type ===
                      "WAITING" &&
                      payment.status_take_money.messages}
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
