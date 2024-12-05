import { bookingContext } from "@/context/BookingContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, baseURL, TypeHTTP } from "@/utils/api";
import {
  convertDateToDayMonthYear,
  convertDateToMinuteHour,
} from "@/utils/date";
import { formatMoney } from "@/utils/other";
import React, { useContext, useRef, useState } from "react";
const BookingInformation = ({ setCustomer }) => {
  const { globalHandler } = useContext(globalContext);
  const { bookingData, bookingHandler } =
    useContext(bookingContext);
  const { userData } = useContext(userContext);
  const inputRef = useRef();

  function checkIntegerString(value) {
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

  const handleChangeImage = (e) => {
    const files = Array.from(e.target.files);
    const filesFormat = files.map((file) => {
      const blobURL = URL.createObjectURL(file);
      return {
        url: blobURL,
        file,
      };
    });
    e.target.value = "";
    bookingHandler.setImages([
      ...bookingData.images,
      ...filesFormat,
    ]);
  };

  const handleNextStep = () => {
    if (!userData.user) {
      const name = bookingData.booking?.patient?.fullName.trim().replace(/\s+/g, ' ');
      if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*$/.test(name)) {
        globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ");
        return;
      }
      if (!/^0[0-9]{9}$/.test(bookingData.booking?.patient?.phone)) {
        globalHandler.notify(notifyType.WARNING, "Số điện thoại không hợp lệ");
        return;
      }
      if (!bookingData.booking?.patient?.email) {
        globalHandler.notify(notifyType.WARNING, "Email không hợp lệ");
        return;
      }
      if (
        !bookingData.booking?.patient?.dateOfBirth ||
        new Date().getFullYear() -
        new Date(bookingData.booking?.patient?.dateOfBirth).getFullYear() -
        (new Date().getMonth() < new Date(bookingData.booking?.patient?.dateOfBirth).getMonth() ||
          (new Date().getMonth() ===
            new Date(bookingData.booking?.patient?.dateOfBirth).getMonth() &&
            new Date().getDate() <
            new Date(bookingData.booking?.patient?.dateOfBirth).getDate())) <
        18
      ) {
        globalHandler.notify(notifyType.WARNING, "Phải trên 18 tuổi");
        return;
      }
      if (!bookingData.booking?.patient?.sex) {
        globalHandler.notify(notifyType.WARNING, "Vui lòng chọn giới tính");
        return;
      }
      if (!bookingData.booking?.patient?.sex) {
        globalHandler.notify(notifyType.WARNING, "Vui lòng chọn giới tính");
        return;
      }
      if (!/^[0-9]{9}$/.test(bookingData.booking?.patient?.cccd) && !/^[0-9]{12}$/.test(bookingData.booking?.patient?.cccd)) {
        globalHandler.notify(notifyType.WARNING, "Căn cước công dân phải chứa 9 hoặc 12 số");
        return;
      }
      if (!bookingData.booking?.patient?.address) {
        globalHandler.notify(notifyType.WARNING, "Địa chỉ không hợp lệ");
        return;
      }
      if (!bookingData.booking?.patient?.bank?.bankName || !/^[A-Za-z]+$/.test(bookingData.booking?.patient?.bank?.bankName)) {
        globalHandler.notify(notifyType.WARNING, "Tên ngân hàng không hợp lệ");
        return;
      }
      if (!/^[A-Z]+$/.test(bookingData.booking?.patient?.bank?.accountName)) {
        globalHandler.notify(notifyType.WARNING, "Tên tài khoản phải là chữ in hoa");
        return;
      }
      if (!/^[0-9]+$/.test(bookingData.booking?.patient?.bank?.accountNumber)) {
        globalHandler.notify(notifyType.WARNING, "Số tài khoản phải là ký tự số");
        return;
      }
    }
    if (
      bookingData.booking?.weight !== "" &&
      bookingData.booking.weight
    )
      if (
        !checkIntegerString(bookingData.booking?.weight)
      ) {
        globalHandler.notify(
          notifyType.WARNING,
          "Chỉ được nhập dữ liệu số cho cân nặng"
        );
        return;
      }
    if (
      bookingData.booking?.height !== "" &&
      bookingData.booking?.height
    )
      if (
        !checkIntegerString(bookingData.booking?.height)
      ) {
        globalHandler.notify(
          notifyType.WARNING,
          "Chỉ được nhập dữ liệu số cho chiều cao"
        );
        return;
      }
    if (
      bookingData.booking?.healthRate !== "" &&
      bookingData.booking?.healthRate
    )
      if (
        !checkIntegerString(bookingData.booking?.healthRate)
      ) {
        globalHandler.notify(
          notifyType.WARNING,
          "Chỉ được nhập dữ liệu số cho nhịp tim"
        );
        return;
      }
    if (
      bookingData.booking?.temperature !== "" &&
      bookingData.booking?.temperature
    )
      if (
        !checkIntegerString(
          bookingData.booking?.temperature
        )
      ) {
        globalHandler.notify(
          notifyType.WARNING,
          "Chỉ được nhập dữ liệu số cho nhiệt độ"
        );
        return;
      }
    if (
      bookingData.booking?.bloodPressure !== "" &&
      bookingData.booking?.bloodPressure
    )
      if (
        !checkIntegerString(
          bookingData.booking?.bloodPressure.split("/")[0]
        ) ||
        !checkIntegerString(
          bookingData.booking?.bloodPressure.split("/")[1]
        )
      ) {
        globalHandler.notify(
          notifyType.WARNING,
          "Chỉ được nhập dữ liệu số (tâm thu/tâm trương) cho huyết áp"
        );
        return;
      }
    if (userData.user) {
      bookingHandler.setCurrentStep(2);
    } else {
      api({
        body: bookingData.booking,
        type: TypeHTTP.POST,
        path: "/customers/save",
        sendToken: false,
      })
        .then((res) => {
          bookingHandler.setCurrentStep(2);
          setCustomer(res)
        })
        .catch((err) => {
          globalHandler.notify(
            notifyType.WARNING,
            err.message
          );
          return;
        });
    }
  };

  return (
    <>
      <div className="border-[#cfcfcf] px-4 py-2 w-[70%] gap-3 rounded-md border-[1px] mt-7 flex items-center">
        {userData.user ? (
          <>
            <img
              src={
                userData.user
                  ? userData.user?.image
                  : "https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0"
              }
              className="rounded-full w-[50px]"
            />
            <div className="flex flex-col text-[14px]">
              <span>Bệnh Nhân</span>
              <span className="font-medium">
                {userData.user?.fullName}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col w-full text-[14px] py-2">
            <span className="font-semibold text-[16px]">
              Thông Tin Bệnh Nhân
            </span>
            <div className="grid gap-1 grid-cols-2 w-[100%] items-center content-center">
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      fullName: e.target.value,
                    },
                  })
                }
                placeholder="Họ Và Tên"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      phone: e.target.value,
                    },
                  })
                }
                placeholder="Số Điện Thoại"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      email: e.target.value,
                    },
                  })
                }
                placeholder="Email"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                type="date"
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      dateOfBirth: e.target.value,
                    },
                  })
                }
                placeholder="Ngày Sinh"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <select
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      sex: Boolean(e.target.value),
                    },
                  })
                }
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-3"
              >
                <option value={null}>Giới Tính</option>
                <option value={true}>Nam</option>
                <option value={false}>Nữ</option>
              </select>
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      cccd: e.target.value,
                    },
                  })
                }
                placeholder="Căn Cước Công Dân"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking.patient,
                      address: e.target.value,
                    },
                  })
                }
                placeholder="Địa Chỉ"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking?.patient,
                      bank: {
                        ...bookingData.booking?.patient
                          ?.bank,
                        bankName: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Tên Ngân Hàng"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking?.patient,
                      bank: {
                        ...bookingData.booking?.patient
                          ?.bank,
                        accountName: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Tên Chủ Tài Khoản"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                onChange={(e) =>
                  bookingHandler.setBooking({
                    ...bookingData.booking,
                    patient: {
                      ...bookingData.booking?.patient,
                      bank: {
                        ...bookingData.booking?.patient
                          ?.bank,
                        accountNumber: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Số Tài Khoản"
                className="w-full text-[13px] mt-1 h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
            </div>
          </div>
        )}
      </div>
      <div className="border-[#cfcfcf] relative py-1 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start">
        <div className="flex gap-3 py-2 items-center px-4 w-full border-[#cfcfcf] border-b-[1px] text-[13px] font-medium">
          <span className="text-[14px]">Giờ Hẹn:</span>
          <span className="px-2 py-1 bg-[blue] text-[white] rounded-md">
            {bookingData.booking?.appointment_date.time}
          </span>
          <span className="px-2 py-1 bg-[#46e199] text-[white] rounded-md">
            {convertDateToDayMonthYear(
              bookingData.booking?.appointment_date
            )}
          </span>
        </div>
        <div className="pt-2 px-4 gap-3 flex items-start pb-6">
          <img
            src={bookingData.doctorRecord?.doctor.image}
            className="rounded-full w-[50px]"
          />
          <div className="flex flex-col items-start gap-1 text-[14px]">
            <span className="font-medium">
              Khám bệnh trực tuyến với BS{" "}
              {bookingData.doctorRecord?.doctor.fullName}
            </span>
            <span className="mt-3 px-[0.5rem] py-1 rounded-md text-[13px] bg-[#e0eff6]">
              Chuyên Khoa{" "}
              {bookingData.doctorRecord?.doctor.specialize}
            </span>
            <span className="font-medium mt-1">
              BS {bookingData.doctorRecord?.doctor.fullName}
            </span>
          </div>
          <span className="absolute top-[60px] text-[14px] right-2 font-medium text-[blue]">
            {formatMoney(
              bookingData.booking?.priceList.price
            )}{" "}
            đ
          </span>
        </div>
      </div>
      <div className="border-[#cfcfcf] px-5 relative py-3 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start">
        <span className="text-[14px] font-medium">
          Mô tả triệu chứng của bạn
        </span>
        <textarea
          value={bookingData.booking?.note}
          onChange={(e) =>
            bookingHandler.setBooking({
              ...bookingData.booking,
              note: e.target.value,
            })
          }
          placeholder="Mô tả triệu chứng"
          className="w-full bg-[#ffffff00] focus:outline-none text-[14px] h-[50px]"
        ></textarea>
      </div>
      <div className="border-[#cfcfcf] px-5 relative py-3 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start">
        <span className="text-[14px] font-medium">
          Chỉ số (nếu có)
        </span>
        <div className="w-full grid grid-cols-3 gap-3">
          <div className="flex gap-2 text-[14px]">
            <span className="">Cân nặng (kg):</span>
            <input
              value={bookingData.booking?.weight}
              onChange={(e) =>
                bookingHandler.setBooking({
                  ...bookingData.booking,
                  weight: e.target.value,
                })
              }
              className="w-[40px] text-center h-full border-b-[1px] border-[#999] focus:outline-0 bg-[#ffffff00]"
            />
          </div>
          <div className="flex gap-2 text-[14px]">
            <span className="">Chiều cao (cm):</span>
            <input
              value={bookingData.booking?.height}
              onChange={(e) =>
                bookingHandler.setBooking({
                  ...bookingData.booking,
                  height: e.target.value,
                })
              }
              className="w-[40px] text-center h-full border-b-[1px] border-[#999] focus:outline-0 bg-[#ffffff00]"
            />
          </div>
          <div className="flex gap-2 text-[14px]">
            <span className="">Huyết áp (mmHg):</span>
            <input
              value={bookingData.booking?.bloodPressure}
              onChange={(e) =>
                bookingHandler.setBooking({
                  ...bookingData.booking,
                  bloodPressure: e.target.value,
                })
              }
              className="w-[60px] text-center h-full border-b-[1px] border-[#999] focus:outline-0 bg-[#ffffff00]"
            />
          </div>
          <div className="flex gap-2 text-[14px]">
            <span className="">Nhịp tim (bpm):</span>
            <input
              value={bookingData.booking?.healthRate}
              onChange={(e) =>
                bookingHandler.setBooking({
                  ...bookingData.booking,
                  healthRate: e.target.value,
                })
              }
              className="w-[40px] text-center h-full border-b-[1px] border-[#999] focus:outline-0 bg-[#ffffff00]"
            />
          </div>
          <div className="flex gap-2 text-[14px]">
            <span className="">Nhiệt độ (°C):</span>
            <input
              value={bookingData.booking?.temperature}
              onChange={(e) =>
                bookingHandler.setBooking({
                  ...bookingData.booking,
                  temperature: e.target.value,
                })
              }
              className="w-[40px] text-center h-full border-b-[1px] border-[#999] focus:outline-0 bg-[#ffffff00]"
            />
          </div>
        </div>
      </div>
      <div className="border-[#cfcfcf] px-5 relative py-3 w-[70%] gap-2 mt-1 rounded-md border-[1px] flex flex-col items-start">
        <span className="text-[14px] font-medium">
          Đính kèm hình ảnh mô tả (nếu có)
        </span>
        <div className="h-[50px] w-full flex items-center gap-3">
          <input
            ref={inputRef}
            onChange={(e) => handleChangeImage(e)}
            type="file"
            className="hidden"
          />
          <button
            style={{
              backgroundImage: "url(/picker-image.png)",
            }}
            onClick={() => inputRef.current.click()}
            className="w-[40px] h-[40px] bg-cover rounded-xl"
          ></button>
          <div className="flex items-center gap-3">
            {bookingData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  key={index}
                  src={image.url}
                  width={"50px"}
                />
                <button
                  onClick={() =>
                    bookingHandler.setImages((prev) =>
                      prev.filter(
                        (item) => item.url !== image.url
                      )
                    )
                  }
                  className="bx bx-x absolute top-[-5px] text-[#999] right-[-10px]"
                ></button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative py-3 w-[70%] gap-2 mt-1 rounded-md flex items-center">
        <button
          onClick={() => handleNextStep()}
          className="hover:scale-[1.05] transition-all text-[14px] font-medium bg-[#1dcbb6] px-[1.5rem] text-[white] h-[32px] rounded-lg"
        >
          Bước Tiếp Theo
        </button>
      </div>
    </>
  );
};

export default BookingInformation;
