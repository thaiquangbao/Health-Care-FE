import { appointmentContext } from "@/context/AppointmentContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  compare2Date,
  compareTimeDate1GreaterThanDate2,
  convertDateToDayMonthYearObject,
  convertDateToDayMonthYearTimeObject,
  convertDateToDayMonthYearVietNam,
  isALargerThanBPlus60Minutes,
  isALargerWithin10Minutes,
  isALargerWithin60Minutes,
  sortByAppointmentDate,
} from "@/utils/date";
import { formatMoney, returnNumber } from "@/utils/other";
import { Chart } from "chart.js/auto";
import { set } from "date-fns";
import Link from "next/link";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const HenKhamTaiNha = () => {
  const { userData } = useContext(userContext);
  const [dsPayBack, setDsPayBack] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (userData.user) {
      setLoading(true);
      api({
        type: TypeHTTP.POST,
        path: "/payBacks/get-by-type",
        sendToken: true,
        body: {
          doctor_id: userData.user?._id,
          type: "APPOINTMENTHOME",
        },
      }).then((res) => {
        setDsPayBack(
          res.filter(
            (item) =>
              item.doctor?._id === userData.user?._id
          )
        );
        setLoading(false);
      });
    }
  }, [userData.user]);
  return (
    <>
      <div className="w-full max-h-[500px] mt-6 overflow-y-auto relative">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th
                scope="col"
                className="w-[5%] py-3 text-center"
              >
                #
              </th>
              <th scope="col" className="w-[25%] py-3">
                Dịch Vụ
              </th>
              <th scope="col" className="w-[25%] py-3">
                thời gian
              </th>
              <th scope="col" className="w-[25%] py-3">
                Số Tiền
              </th>
              <th scope="col" className="w-[25%] py-3">
                Trạng Thái
              </th>
            </tr>
          </thead>
          <tbody className=" w-[full] bg-black font-medium">
            {!loading &&
              dsPayBack.map((payback, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td
                    scope="row"
                    className="px-6 py-4 text-center font-medium"
                  >
                    {index + 1}
                  </td>
                  <td className="py-4 text-[15px]">
                    Tư vấn sức khỏe tại nhà
                  </td>
                  <td className="py-4">
                  {payback.date?.time}-{payback.date?.day}/{payback.date?.month}/{payback.date?.year}
                  </td>
                  <td className="py-4">
                    {formatMoney(payback.price)} đ
                  </td>
                  <td
                    className="py-4"
                    style={{
                      color:
                        payback.status?.type === "AVAILABLE"
                          ? "black"
                          : payback.status?.type ===
                            "REQUEST"
                          ? "#FFFF00"
                          : payback.status?.type ===
                            "ACCEPT"
                          ? "green"
                          : payback.status?.type ===
                            "REFUSE"
                          ? "red"
                          : "blue",
                    }}
                  >
                    {payback.status?.messages}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && dsPayBack.length === 0 && (
          <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
            Bác sĩ chưa có doanh thu nào
          </div>
        )}
        {loading && (
          <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[black]"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          </div>
        )}
      </div>
    </>
  );
};

export default HenKhamTaiNha;
