import { globalContext, notifyType } from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { dsKhoa } from "@/utils/chuyenKhoa";
import React, { useContext, useEffect, useState } from "react";
import { connectToGoogle } from "../firebase/firebase";
import Input from "../input";
import Select from "../select";

const UserInformation = ({ user, setUser }) => {
  const { userData, userHandler } = useContext(userContext);
  const { globalHandler } = useContext(globalContext);

  const connectGoogle = () => {
    connectToGoogle()
      .then((email) => {
        globalHandler.notify(notifyType.LOADING, "Đang Liên Kết Với Google");
        let user = {
          ...userData.user,
          email,
        };
        api({
          type: TypeHTTP.POST,
          body: { ...user },
          path: `/auth/update-email/${userData.user?.role === "DOCTOR" ? "doctor" : "User"
            }`,
          sendToken: true,
        })
          .then((res) => {
            userHandler.setUser(res);
            globalHandler.notify(notifyType.SUCCESS, "Liên Kết Thành Công");
            globalHandler.reload();
          })
          .catch((error) => {
            globalHandler.notify(notifyType.WARNING, error.message);
          });
      })
      .catch((error) => {
        globalHandler.notify(notifyType.FAIL, error.message);
      });
  };

  return (
    <div className="w-full min-h-screen">
      <div className="grid grid-cols-2 h-auto gap-x-[4rem] gap-y-[1.25rem] mt-[1rem] px-[4rem]">
        <Input
          name={"Họ và Tên"}
          onChange={(e) => setUser({ ...user, fullName: e.target.value })}
          value={user?.fullName}
        />
        <Input disabled={true} name={"Số Điện Thoại"} value={user?.phone} />
        <Input
          onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })}
          type="date"
          name={"Ngày Sinh"}
          value={user?.dateOfBirth}
        />
        <Input
          onChange={(e) => setUser({ ...user, address: e.target.value })}
          name={"Địa Chỉ"}
          value={user?.address}
        />
        <Select
          onChange={(e) =>
            setUser({ ...user, sex: e.target.value === "Nam" ? true : false })
          }
          name={"Giới Tính"}
          list={["Nam", "Nữ"]}
          value={user?.sex === true ? "Nam" : "Nữ"}
        />
        <Input
          onChange={(e) => setUser({ ...user, cccd: e.target.value })}
          name={"Căn cước công dân"}
          value={user?.cccd}
        />
        {userData.user?.role === "DOCTOR" && (
          <Select
            onChange={(e) => setUser({ ...user, specialize: e.target.value })}
            name={"Chuyên Khoa"}
            value={user?.specialize}
            list={dsKhoa}
          />
        )}
        {user?.email !== null ? (
          <div className="flex flex-col gap-2">
            <Input disabled={true} name={"Email"} value={user?.email} />
            <button
              onClick={() => connectGoogle()}
              className="text-[white] hover:scale-[1.05] shadow transition-all text-[14px] bg-[#3838f0] flex items-center gap-2 w-[350px] px-[3rem] h-[37px] rounded-lg"
            >
              <i className="bx bxl-google text-[25px] text-[white]"></i>Thay Đổi
              Tài Khoản Google Khác
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1">
            <span className="text-[15px] font-medium">Email</span>
            <button
              onClick={() => connectGoogle()}
              className="text-[white] hover:scale-[1.05] shadow transition-all text-[14px] bg-[#3838f0] flex items-center gap-2 w-[270px] px-[3rem] h-[37px] rounded-lg"
            >
              <i className="bx bxl-google text-[25px] text-[white]"></i>Liên Kết
              Với Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInformation;
