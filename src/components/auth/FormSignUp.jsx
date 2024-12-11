import { globalContext, notifyType } from "@/context/GlobalContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import Link from "next/link";
import React, { useContext, useEffect, useRef, useState } from "react";
import { auth } from "../firebase/firebase";
import { api, TypeHTTP } from "@/utils/api";
import { userContext } from "@/context/UserContext";
import { formatPhoneByFireBase } from "@/utils/phone";
import { authContext } from "@/context/AuthContext";

const FormSignUp = ({ visible, hidden }) => {
  const { globalHandler } = useContext(globalContext);
  const { userHandler, userData } = useContext(userContext);
  const [verification, setVerification] = useState();
  const [otp, setOtp] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const { authHandler } = useContext(authContext);
  const [role, setRole] = useState()
  const [info, setInfo] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const recaptchaRef = useRef(null);
  const [individual, setIndividual] = useState({
    name: "",
    address: "",
    sex: "",
    dateOfBirth: null,
    cccd: "",
    accountNumber: "",
    bankName: "",
    accountName: "",
  });

  const handleSignOut = () => {
    globalHandler.notify(
      notifyType.LOADING,
      "Đang Đăng Xuất"
    );
    if (userData.user?.role === "DOCTOR") {
      router.push("/");
    }
    setTimeout(() => {
      globalThis.localStorage.removeItem("accessToken");
      globalThis.localStorage.removeItem("refreshToken");
      globalHandler.notify(
        notifyType.LOADING,
        "Đăng Xuất Thành Công"
      );
      userHandler.setUser(undefined);
      globalHandler.reload();
    }, 500);
  };

  useEffect(() => {
    if (userData.user?.processSignup) {
      setCurrentStep(userData.user?.processSignup + 1);
    }
    if (userData.user) {
      setInfo({
        phone: userData.user.phone,
        password: userData.user.passWord,
        confirmPassword: userData.user.passWord,
      });
    }
  }, [userData.user]);

  useEffect(() => {
    if (info.phone !== "" && currentStep === 2) {
      setTimeout(() => {
        const recaptchaContainer = recaptchaRef.current;
        if (recaptchaContainer) {
          const recaptcha = new RecaptchaVerifier(auth, recaptchaContainer, {
            size: "invisible",
            callback: (response) => {
            },
            "expired-callback": () => {
            },
          });
          signInWithPhoneNumber(
            auth,
            formatPhoneByFireBase(info.phone),
            recaptcha
          )
            .then((confirmation) => {
              setVerification(confirmation);
            })
            .catch((error) => {
              console.error("Error during phone number sign-in:", error);
            });
        }
      }, 100); // delay 100ms
    }
  }, [info.phone, currentStep]);

  useEffect(() => {
    if (currentStep > 3) {
      hidden();
    }
  }, [currentStep]);

  const handleSubmitSignUp = () => {
    if (!/^0[0-9]{9}$/.test(info.phone)) {
      globalHandler.notify(notifyType.WARNING, "Số điện thoại không hợp lệ");
      return;
    }
    if (info.password.length < 6) {
      globalHandler.notify(notifyType.WARNING, "Mật khẩu phải lớn hơn 6 ký tự");
      return;
    }
    if (info.password !== info.confirmPassword) {
      globalHandler.notify(
        notifyType.WARNING,
        "Mật khẩu xác nhận phải trùng khớp với mật khẩu"
      );
      return;
    }
    globalHandler.notify(notifyType.LOADING, "Đang đăng ký tài khoản");
    api({
      sendToken: false,
      type: TypeHTTP.POST,
      body: { phone: info.phone, passWord: info.password },
      path: "/auth/signup",
    })
      .then((res) => {
        userHandler.setUser(res.auth);
        setRole(res.role)
        globalHandler.notify(
          notifyType.SUCCESS,
          "Đăng Ký Tài Khoản Thành Công"
        );
      })
      .catch((error) => {
        globalHandler.notify(notifyType.FAIL, error.message);
      });
  };

  const handleSubmitOTPWithPhoneNumber = () => {
    if (!/^[0-9]{6}$/.test(otp)) {
      globalHandler.notify(notifyType.WARNING, "Mã xác minh phải gồm 6 ký tự số");
      return;
    }
    globalHandler.notify(notifyType.LOADING, "Đang xác thực tài khoản");
    verification
      .confirm(otp)
      .then((data) => {
        let user = { ...userData.user, processSignup: 2 };
        api({
          type: TypeHTTP.POST,
          body: { ...user },
          path: `/auth/update`,
          sendToken: false,
        })
          .then((res) => {
            globalHandler.notify(
              notifyType.SUCCESS,
              "Xác Thực Tài Khoản Thành Công"
            );
            if (role === 'CUSTOMER') {
              setTimeout(() => {
                globalThis.window.location.reload()
              }, 2000);
            } else {
              userHandler.setUser(res);
            }
          })
      })
      .catch(() => {
        globalHandler.notify(
          notifyType.FAIL,
          "Xác minh thất bại, Vui lòng thử lại"
        );
      });
  };

  const handleCompleteInfo = () => {
    const name = individual.name.trim().replace(/\s+/g, ' ');
    if (!/^[A-ZÀ-Ỹ][a-zà-ỹ]*(\s[A-ZÀ-Ỹ][a-zà-ỹ]*)*$/.test(name)) {
      globalHandler.notify(notifyType.WARNING, "Họ Tên Không Hợp Lệ");
      return;
    }
    if (
      !individual.dateOfBirth ||
      new Date().getFullYear() -
      new Date(individual.dateOfBirth).getFullYear() -
      (new Date().getMonth() < new Date(individual.dateOfBirth).getMonth() ||
        (new Date().getMonth() ===
          new Date(individual.dateOfBirth).getMonth() &&
          new Date().getDate() <
          new Date(individual.dateOfBirth).getDate())) <
      18
    ) {
      globalHandler.notify(notifyType.WARNING, "Phải trên 18 tuổi");
      return;
    }
    if (individual.sex !== true && individual.sex !== false) {
      globalHandler.notify(notifyType.WARNING, "Vui lòng chọn giới tính");
      return;
    }
    if (!/^[0-9]{9}$/.test(individual.cccd) && !/^[0-9]{12}$/.test(individual.cccd)) {
      globalHandler.notify(notifyType.WARNING, "Căn cước công dân phải chứa 9 hoặc 12 số");
      return;
    }
    if (individual.address === '') {
      globalHandler.notify(notifyType.WARNING, "Vui lòng nhập địa chỉ");
      return;
    }
    if (!/^[A-Za-z]+$/.test(individual?.bankName)) {
      globalHandler.notify(notifyType.WARNING, "Tên ngân hàng không hợp lệ");
      return;
    }
    if (!/^[A-Z]+$/.test(individual?.accountName)) {
      globalHandler.notify(notifyType.WARNING, "Tên tài khoản phải là chữ in hoa");
      return;
    }
    if (!/^[0-9]+$/.test(individual?.accountNumber)) {
      globalHandler.notify(notifyType.WARNING, "Tên tài khoản phải là ký tự số");
      return;
    }
    globalHandler.notify(
      notifyType.LOADING,
      "Đang hoàn thành thông tin cá nhân"
    );
    let user = {
      ...userData.user,
      processSignup: 3,
      image:
        "https://th.bing.com/th/id/R.be953f29410b3d18ef0e5e0fbd8d3120?rik=Dm2iDRVLgVcpdA&pid=ImgRaw&r=0",
      fullName: individual.name,
      address: individual.address,
      dateOfBirth: individual.dateOfBirth,
      bank: {
        accountNumber: individual.accountNumber,
        bankName: individual.bankName,
        accountName: individual.accountName,
      },
      sex: individual.sex,
      cccd: individual.cccd,
    };
    api({
      type: TypeHTTP.POST,
      body: { ...user },
      path: `/auth/update`,
      sendToken: false,
    }).then((res) => {
      api({
        type: TypeHTTP.POST,
        body: { _id: res._id },
        path: `/auth/generateToken`,
        sendToken: false,
      }).then((token) => {
        globalThis.localStorage.setItem("accessToken", token.accessToken);
        globalThis.localStorage.setItem("refreshToken", token.refreshToken);
        setCurrentStep(4);
        userHandler.setUser(res);
        globalHandler.notify(
          notifyType.SUCCESS,
          "Đã Hoàn Thành Thông Tin Tài Khoản"
        );
      });
    });
  };

  return (
    <div
      style={
        visible
          ? { height: "450px", width: "70%", transition: "0.3s" }
          : { height: 0, width: 0, transition: "0.3s" }
      }
      className="z-50 w-[70%] min-h-[100px] flex items-center overflow-hidden bg-[white] rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      {visible && (
        <div
          style={{
            transition: "0.5s",
            marginLeft: `-${(currentStep - 1) * 100}%`,
          }}
          className="w-[100%] flex"
        >
          <div className="min-w-[100%] h-full px-[2rem] py-[3rem] flex items-center justify-center">
            <img src="/sign.png" width={"40%"} />
            <div className="w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-3">
              <h2 className="text-[20px] font-medium mb-1">
                Đăng Ký Tài Khoản Với HealthHaven
              </h2>
              <input
                onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                value={info.phone}
                placeholder="Số Điện Thoại (+84)"
                className="text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                type="password"
                onChange={(e) => setInfo({ ...info, password: e.target.value })}
                value={info.password}
                placeholder="Mật Khẩu"
                className="text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <input
                type="password"
                onChange={(e) =>
                  setInfo({ ...info, confirmPassword: e.target.value })
                }
                value={info.confirmPassword}
                placeholder="Xác Nhận Mật Khẩu"
                className="text-[14px] w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <button
                onClick={() => handleSubmitSignUp()}
                className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] h-[37px] rounded-lg"
              >
                Đăng Ký Tài Khoản
              </button>
              {/* <span className='text-[14px]'>Hoặc</span>
                            <button className='hover:scale-[1.05] shadow transition-all text-[14px] bg-[#e9e9e9] flex items-center gap-2 w-[270px] px-[3rem] h-[37px] rounded-lg'><i className='bx bxl-google text-[25px] text-[#545454]' ></i> Đăng Ký Với Google</button> */}
              <button
                onClick={() => {
                  authHandler.hiddenSignUp();
                  setTimeout(() => {
                    authHandler.showSignIn();
                  }, 500);
                }}
                className="text-[14px] hover:underline"
              >
                Bạn đã có tài khoản?
              </button>
            </div>
          </div>
          <div className="min-w-[100%] h-full px-[2rem] py-[3rem] flex justify-center items-center">
            <img src="/sign.png" width={"40%"} />
            <div className="w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-1">
              <h2 className="text-[20px] font-medium ">
                Xác Thực Tài Khoản Với Số Điện Thoại
              </h2>
              <span className="text-[13px]">
                Một mã xác minh đã được gửi đến số điện thoại {info.phone}. Vui
                lòng nhập mã xác minh bên dưới
              </span>
              <div id="recaptcha" ref={recaptchaRef}></div>
              <input
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                placeholder="Mã Xác Thực"
                className="text-[14px] mt-2 w-[90%] h-[40px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
              />
              <button
                onClick={() => handleSubmitOTPWithPhoneNumber()}
                className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] mt-2 h-[37px] rounded-lg"
              >
                Xác Thực Tài Khoản
              </button>
              <button
                onClick={() => handleSignOut()}
                className="text-[14px] mt-2 hover:underline"
              >
                Đăng xuất tài khoản này
              </button>
            </div>
          </div>
          <div className="min-w-[100%] h-[100%] overflow-y-auto overflow-x-hidden px-[2rem] py-[3rem] flex justify-center items-center">
            <img src="/sign.png" width={"40%"} />
            <div className="w-[53%] flex flex-col items-start justify-center pl-[3rem] gap-1">
              <h2 className="text-[20px] font-medium ">
                Hoàn Thành Thông Tin Cá Nhân
              </h2>
              <span className="text-[13px]">
                Hãy bổ sung thông tin cá nhân của bạn ở bên dưới.
              </span>
              <div className="flex items-center justify-between w-[90%]">
                <input
                  onChange={(e) =>
                    setIndividual({ ...individual, name: e.target.value })
                  }
                  placeholder="Họ Và Tên"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
                <input
                  type="date"
                  onChange={(e) =>
                    setIndividual({ ...individual, dateOfBirth: e.target.value })
                  }
                  placeholder="Ngày Sinh"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <select
                  onChange={(e) =>
                    setIndividual({ ...individual, sex: Boolean(e.target.value) })
                  }
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-3"
                >
                  <option value={null}>Giới Tính</option>
                  <option value={true}>Nam</option>
                  <option value={false}>Nữ</option>
                </select>
                <input
                  onChange={(e) =>
                    setIndividual({ ...individual, cccd: e.target.value })
                  }
                  placeholder="Căn Cước Công Dân"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <input
                  onChange={(e) =>
                    setIndividual({ ...individual, address: e.target.value })
                  }
                  placeholder="Địa Chỉ"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
                <input
                  onChange={(e) =>
                    setIndividual({ ...individual, bankName: e.target.value })
                  }
                  placeholder="Tên Ngân Hàng"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
              </div>
              <div className="flex items-center justify-between w-[90%]">
                <input
                  onChange={(e) =>
                    setIndividual({
                      ...individual,
                      accountNumber: e.target.value,
                    })
                  }
                  placeholder="Số Tài Khoản"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
                <input
                  onChange={(e) =>
                    setIndividual({ ...individual, accountName: e.target.value })
                  }
                  placeholder="Tên Chủ Tài Khoản"
                  className="text-[13px] mt-1 w-[49%] h-[38px] bg-[white] border-[1px] border-[#cfcfcf] focus:outline-0 rounded-lg px-4"
                />
              </div>
              <button
                onClick={() => handleCompleteInfo()}
                className="hover:scale-[1.05] transition-all text-[14px] bg-[blue] px-[3rem] w-[270px] text-[white] mt-2 h-[37px] rounded-lg"
              >
                Xác Thực Tài Khoản
              </button>
              <button
                onClick={() => handleSignOut()}
                className="text-[14px] mt-1 hover:underline"
              >
                Đăng xuất tài khoản này
              </button>
            </div>
          </div>
          <button onClick={() => hidden()}>
            <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default FormSignUp;
