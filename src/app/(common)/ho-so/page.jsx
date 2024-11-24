"use client";
import Navbar from "@/components/navbar";
import Password from "@/components/profile/Password";
import PaymentDoctor from "@/components/profile/PaymentDoctor";
import PaymentPatient from "@/components/profile/PaymentPatient";
import UserInformation from "@/components/profile/UserInformation";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const HoSo = () => {
  const listRef = useRef();
  const { userData, userHandler } = useContext(userContext);
  const [choose, setChoose] = useState(1);
  const { globalHandler } = useContext(globalContext);
  const [user, setUser] = useState();
  const imgRef = useRef();
  const [visibleUpdate, setVisibleUpdate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userData.user) router.push("/");
  }, [userData.user]);

  useEffect(() => {
    setUser(userData.user);
  }, [userData.user]);

  useEffect(() => {
    if (userData.user !== user) {
      setVisibleUpdate(true);
    } else {
      setVisibleUpdate(false);
    }
  }, [userData.user, user]);

  useEffect(() => {
    const width1 =
      document.querySelector(`.item-1`).offsetWidth;
    const width2 =
      document.querySelector(`.item-2`).offsetWidth;
    const width3 =
      document.querySelector(`.item-3`).offsetWidth;
    let width = 0;
    let remainWidth = 0;
    if (choose === 1) {
      width = width1;
      remainWidth = 0;
    } else if (choose === 2) {
      width = width2;
      remainWidth = width1 + 16;
    } else if (choose === 3) {
      width = width3;
      remainWidth = width1 + width2 + 32;
    }
    const list = document.querySelector(".choose");
    list.style.width = width + "px";
    list.style.marginLeft = remainWidth + "px";
  }, [choose]);

  const handleUpdateUser = () => {
    if (choose === 1) {
      const name = user?.fullName.trim().replace(/\s+/g, ' ');
      if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*$/.test(name)) {
        globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ");
        return;
      }
      if (
        !user?.dateOfBirth ||
        new Date().getFullYear() -
        new Date(user?.dateOfBirth).getFullYear() -
        (new Date().getMonth() < new Date(user?.dateOfBirth).getMonth() ||
          (new Date().getMonth() ===
            new Date(user?.dateOfBirth).getMonth() &&
            new Date().getDate() <
            new Date(user?.dateOfBirth).getDate())) <
        18
      ) {
        globalHandler.notify(notifyType.WARNING, "Phải trên 18 tuổi");
        return;
      }
      if (user?.sex !== true && user?.sex !== false) {
        globalHandler.notify(notifyType.WARNING, "Vui lòng chọn giới tính");
        return;
      }
      if (!/^[0-9]{9}$/.test(user?.cccd) && !/^[0-9]{12}$/.test(user?.cccd)) {
        globalHandler.notify(notifyType.WARNING, "Căn cước công dân phải chứa 9 hoặc 12 số");
        return;
      }
      if (user?.address === '') {
        globalHandler.notify(notifyType.WARNING, "Vui lòng nhập địa chỉ");
        return;
      }

      globalHandler.notify(
        notifyType.LOADING,
        "Đang Cập Nhật Thông Tin"
      );
    } else {
      if (!/^[A-Za-z]+$/.test(user?.bank?.bankName)) {
        globalHandler.notify(notifyType.WARNING, "Tên ngân hàng không hợp lệ");
        return;
      }
      if (!/^[A-Z]+$/.test(user?.bank?.accountName)) {
        globalHandler.notify(notifyType.WARNING, "Tên tài khoản phải là chữ in hoa");
        return;
      }
      if (!/^[0-9]+$/.test(user?.bank?.accountNumber)) {
        globalHandler.notify(notifyType.WARNING, "Tên tài khoản phải là ký tự số");
        return;
      }
    }
    api({
      type: TypeHTTP.POST,
      body: { ...user },
      path: `/auth/update/${userData.user?.role === "DOCTOR" ? "doctor" : "User"
        }`,
      sendToken: true,
    })
      .then((res) => {
        userHandler.setUser(res);
        globalHandler.notify(
          notifyType.SUCCESS,
          "Cập Nhật Thông Tin Thành Công"
        );
      })
      .catch((error) => {
        globalHandler.notify(
          notifyType.FAIL,
          error.message
        );
      });
  };

  const handleUpdateAvatar = () => {
    const selectedFile = imgRef.current.files[0];
    const formData = new FormData();
    formData.append("_id", userData.user?._id);
    formData.append("image", selectedFile);
    globalHandler.notify(
      notifyType.LOADING,
      "Đang Cập Nhật Ảnh Đại Diện"
    );
    api({
      sendToken: true,
      type: TypeHTTP.POST,
      path: `/auth/update-information/${userData.user?.role === "DOCTOR"
        ? "doctors"
        : "patients"
        }`,
      body: formData,
    })
      .then((data) => {
        userHandler.setUser(data);
        imgRef.current.value = "";
        globalHandler.notify(
          notifyType.SUCCESS,
          "Cập Nhật Ảnh Đại Diện Thành Công"
        );
      })
      .catch((error) => {
        imgRef.current.value = "";
        globalHandler.notify(
          notifyType.FAIL,
          error.message
        );
      });
  };

  return (
    <div className="w-full pt-[60px] flex flex-col pb-[3%] px-[5%] background-public">
      <Navbar />
      <input
        accept=".png, .jpg, .jpeg"
        onChange={() => handleUpdateAvatar()}
        ref={imgRef}
        type="file"
        className="hidden"
      />
      <div className="flex flex-col gap-4 mt-4">
        <div className="w-full relative flex justify-around items-end">
          <div className="flex">
            <div className="aspect-square w-[12%] relative flex items-center justify-start">
              {/* <img className='rounded-full h-[100%] w-[100%]' src={userData.user?.image} /> */}
              <div
                style={{
                  backgroundImage: `url(${userData.user?.image})`,
                  backgroundSize: "cover",
                }}
                className="rounded-full w-[800px] aspect-square"
              />
              <div
                onClick={() => imgRef.current.click()}
                className="h-[30px] flex justify-center items-center rounded-full w-[30px] text-[22px] absolute right-[0px] bg-[#f0f0f0] cursor-pointer bottom-[5px]"
              >
                <i className="text-[#9a9a9a] bx bx-camera"></i>
              </div>
            </div>
            <div className="flex flex-col justify-center ml-[2rem] translate-y-[15px]">
              <div>
                <span className="text-[22px] font-semibold">
                  {userData.user?.fullName}
                </span>
              </div>
              <span className="text-[14px] font-medium text-[#5f5f5f]">
                {userData.user?.phone}
              </span>
            </div>
          </div>
          {choose !== 2 ? (
            <>
              {visibleUpdate ? (
                <button
                  onClick={() => handleUpdateUser()}
                  className="text-[white] bg-[blue] w-[200px] py-2 rounded-md font-medium text-[14px]"
                >
                  Cập Nhật
                </button>
              ) : (
                <div className="w-[200px]"></div>
              )}
            </>
          ) : (
            <div className="text-[white] w-[250px] py-2 rounded-md font-medium text-[14px]"></div>
          )}
        </div>
        <div className="w-full flex flex-col ml-10 items-start gap-1">
          <ul
            ref={listRef}
            className="flex text-[14px] font-medium gap-[1rem]"
          >
            <li
              onClick={() => setChoose(1)}
              className="item-1 px-2 cursor-pointer"
            >
              Thông Tin Cá Nhân
            </li>
            <li
              onClick={() => setChoose(2)}
              className="item-2 px-2 cursor-pointer"
            >
              Bảo Mật
            </li>
            <li
              onClick={() => setChoose(3)}
              className="item-3 px-2 cursor-pointer"
            >
              Thanh Toán
            </li>
          </ul>
          <div className="bg-[blue] transition-all h-[3px] choose"></div>
        </div>
        {choose === 1 ? (
          <UserInformation user={user} setUser={setUser} />
        ) : choose === 2 ? (
          <Password />
        ) : userData.user?.role === "DOCTOR" ? (
          <PaymentDoctor user={user} setUser={setUser} />
        ) : (
          <PaymentPatient user={user} setUser={setUser} />
        )}
      </div>
    </div>
  );
};

export default HoSo;
