import { appointmentContext } from "@/context/AppointmentContext";
import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import {
  convertDateToDayMonthYearTimeObject,
  convertDateToDayMonthYearVietNam,
} from "@/utils/date";
import { formatMoney, returnNumber } from "@/utils/other";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
const PhieuTheoDoi = ({ type, setType, typeStatus }) => {
  const { userData } = useContext(userContext);
  const [logBooks, setLogBooks] = useState([]);
  const { globalHandler } = useContext(globalContext);
  const [loading, setLoading] = useState(false);
  const typeTime = {
    1: "Tất cả",
    2: "Hôm Nay",
    3: "Ngày Mai",
    4: "Tuần Này",
    5: "Tháng Này",
    6: "Tháng Sau",
  };

  useEffect(() => {
    if (userData.user) {
      setLoading(true);
      if (type === "1") {
        api({
          path: `/healthLogBooks/findByDoctor/${userData.user?._id}`,
          type: TypeHTTP.GET,
          sendToken: true,
        }).then((logBooks) => {
          setLoading(false)
          if (typeStatus === '1') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else if (type === "2") {
        const date = convertDateToDayMonthYearTimeObject(
          new Date().toISOString()
        );
        api({
          path: "/healthLogBooks/findByDay",
          type: TypeHTTP.POST,
          sendToken: true,
          body: {
            doctor: userData.user._id,
            date,
          },
        }).then((logBooks) => {
          setLoading(false)
          if (typeStatus === '1') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else if (type === "3") {
        const date = convertDateToDayMonthYearTimeObject(
          new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
        );
        api({
          path: "/healthLogBooks/findByNextDay",
          type: TypeHTTP.POST,
          sendToken: true,
          body: {
            doctor: userData.user._id,
            date,
          },
        }).then((logBooks) => {
          setLoading(false)
          if (typeStatus === '1') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      } else {
        api({
          path: `/healthLogBooks/findBy${type === "4" ? "Week" : type === "5" ? "Month" : "NextMonth"
            }`,
          type: TypeHTTP.POST,
          sendToken: true,
          body: {
            doctor: userData.user._id,
          },
        }).then((logBooks) => {
          setLoading(false)
          if (typeStatus === '1') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'QUEUE').reverse())
          }
          else if (typeStatus === '2') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'ACCEPTED').reverse())
          }
          else if (typeStatus === '3') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'REJECTED').reverse())
          }
          else if (typeStatus === '4') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'COMPLETED').reverse())
          }
          else if (typeStatus === '5') {
            setLogBooks(logBooks.filter(item => item.status.status_type === 'CANCELED').reverse())
          }
        });
      }
    }
  }, [type, userData.user, typeStatus]);

  const handleAcceptLogBook = (logBook) => {
    if (userData.user?.email === "" || userData.user?.email === null) {
      globalHandler.notify(
        notifyType.WARNING,
        "Bác sĩ cần cập nhật email để chấp nhận phiếu đăng ký"
      );
      return;
    }
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác");
    const body = {
      _id: logBook._id,
      dateStop: logBook.priceList.type === '3 Tháng' ?
        convertDateToDayMonthYearTimeObject(new Date(`${logBook.date.year}-${logBook.date.month}-${logBook.date.day}`).setDate(new Date(`${logBook.date.year}-${logBook.date.month}-${logBook.date.day}`).getDate() + 91))
        :
        logBook.priceList.type === '6 Tháng' ?
          convertDateToDayMonthYearTimeObject(new Date(`${logBook.date.year}-${logBook.date.month}-${logBook.date.day}`).setDate(new Date(`${logBook.date.year}-${logBook.date.month}-${logBook.date.day}`).getDate() + 183))
          :
          convertDateToDayMonthYearTimeObject(new Date(`${logBook.date.year}-${logBook.date.month}-${logBook.date.day}`).setDate(new Date(`${logBook.date.year}-${logBook.date.month}-${logBook.date.day}`).getDate() + 365))
    }
    api({
      path: "/healthLogBooks/accepted",
      sendToken: true,
      type: TypeHTTP.POST,
      body,
    })
      .then((logBookAccepted) => {
        setLogBooks((prev) =>
          prev.map((item) => {
            if (item._id === logBookAccepted._id) {
              return logBookAccepted;
            }
            return item;
          })
        );
        globalHandler.notify(notifyType.SUCCESS, "Đã chấp nhận phiếu đăng ký");
      })
      .catch((err) => {
        globalHandler.notify(notifyType.WARNING, err.message);
      });
  };

  const handleRejectLogBook = (logBook) => {
    globalHandler.notify(notifyType.LOADING, "Đang thực hiện thao tác");
    api({
      path: "/healthLogBooks/rejected",
      sendToken: true,
      type: TypeHTTP.POST,
      body: { _id: logBook._id },
    })
      .then((logBookRejected) => {
        setLogBooks((prev) =>
          prev.map((item) => {
            if (item._id === logBookRejected._id) {
              return logBookRejected;
            }
            return item;
          })
        );
        globalHandler.notify(notifyType.SUCCESS, "Đã từ chối phiếu đăng ký");
      })
      .catch((err) => {
        globalHandler.notify(notifyType.WARNING, err.message);
      });
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mt-2">
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
              {returnNumber(logBooks.length)}
            </span>
          </div>
          <span className="font-medium text-[15px]">Tất cả phiếu đăng ký</span>
        </div>
        <div
          className="h-[120px] gap-2 justify-center p-4 text-[white] rounded-lg flex flex-col"
          style={{
            backgroundImage: "url(/Flare.jpg)",
            backgroundSize: "cover",
          }}
        >
          <div className="flex items-end gap-2">
            <i className="text-[40px] bx bx-calendar-check"></i>
            <span className="text-[25px] font-semibold">
              {returnNumber(
                logBooks.filter((item) => item.status === "ACCEPTED").length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Phiếu đăng ký đã chấp nhận
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
              {returnNumber(
                logBooks.filter((item) => item.status === "QUEUE").length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Phiếu đăng ký đang chờ
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
            <i className="text-[40px] bx bx-error"></i>
            <span className="text-[25px] font-semibold">
              {returnNumber(
                logBooks.filter((item) => item.status === "REJECTED").length
              )}
            </span>
          </div>
          <span className="font-medium text-[15px]">
            Phiếu đăng ký đã từ chối
          </span>
        </div>
      </div>
      <div className="w-full max-h-[500px] mt-4 overflow-y-auto relative">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="sticky top-0 left-0 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-[5%] py-3 text-center">
                #
              </th>
              <th scope="col" className="w-[15%] py-3">
                Bệnh Nhân
              </th>
              <th scope="col" className="w-[20%] py-3">
                Trạng Thái
              </th>
              <th scope="col" className="w-[23%] py-3">
                Thời Gian
              </th>
              <th scope="col" className="w-[20%] py-3">
                Loại Phiếu
              </th>
              <th scope="col" className="w-[17%] py-3 text-center">
                Các Chức Năng
              </th>
            </tr>
          </thead>
          <tbody className=" w-[full] bg-black font-medium">
            {!loading &&
              logBooks.map((logBook, index) => (
                <tr
                  key={index}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                >
                  <td scope="row" className="px-6 py-4 text-center font-medium">
                    {index + 1}
                  </td>
                  <td className="py-4 text-[15px]">
                    {logBook.patient.fullName}
                  </td>
                  <td
                    style={{
                      color:
                        logBook.status.status_type === "QUEUE"
                          ? "black"
                          : logBook.status.status_type === "ACCEPTED"
                            ? "green"
                            : logBook?.status.status_type === "COMPLETED"
                              ? "blue"
                              : "red",
                    }}
                    className="py-4"
                  >
                    {logBook.status.message}
                  </td>
                  <td className="py-4">
                    {`${convertDateToDayMonthYearVietNam(logBook.date)}`}
                  </td>
                  <td className="py-4">
                    {formatMoney(logBook.priceList.price)}đ/
                    {logBook.priceList.type}
                  </td>
                  <td className="py-4 flex gap-2 items-center justify-center">
                    {logBook.status.status_type === "TRANSFER" && (
                      <>
                        <button
                          onClick={() => handleAcceptLogBook(logBook)}
                          className="hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                        >
                          Chấp Nhận
                        </button>
                      </>
                    )}
                    {logBook.status.status_type === "QUEUE" && (
                      <>
                        <button
                          onClick={() => handleAcceptLogBook(logBook)}
                          className="hover:scale-[1.05] transition-all bg-[green] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                        >
                          Chấp Nhận
                        </button>
                        <button
                          onClick={() => handleRejectLogBook(logBook)}
                          className="hover:scale-[1.05] transition-all bg-[red] text-[white] text-[13px] font-medium px-2 rounded-md py-1"
                        >
                          Từ Chối
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {!loading && logBooks.length === 0 && (
          <div className="w-full flex items-center justify-center my-10 text-[18px] font-medium">
            Không có phiếu theo dõi sức khỏe được đăng ký trong {typeTime[type]}
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

export default PhieuTheoDoi;
