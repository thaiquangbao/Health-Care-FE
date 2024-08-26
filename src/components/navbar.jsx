"use client";
import { appointmentContext } from "@/context/AppointmentContext";
import { authContext } from "@/context/AuthContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { set } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Logo from "./logo";

const Navbar = () => {
  const { globalHandler } = useContext(globalContext);
  const [scrollY, setScrollY] = useState(0);
  const navbarRef = useRef();
  const [height, setHeight] = useState(0);
  const [visibleDatKham, setVisibleDatKham] =
    useState(false);
  const { authData, authHandler } = useContext(authContext);
  const { userData, userHandler } = useContext(userContext);
  const [user, setUser] = useState();
  const [notifications, setNotifications] = useState([]);
  const [visibleUserInfo, setVisibleUserInfo] =
    useState(false);
  const { appointmentHandler } = useContext(
    appointmentContext
  );
  const [lengthNotice, setLengthNotice] = useState(0);
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(2);

  const handleScroll = () => {
    setScrollY(globalThis.window.scrollY);
  };

  useEffect(() => {
    if (userData.user) {
      setUser(userData.user);
      api({
        path: `/notices/get-by-user/${userData.user?._id}`,
        type: TypeHTTP.GET,
        sendToken: false,
      }).then((res) => {
        setNotifications(res);

        setLengthNotice(
          res.filter((item) => item.seen === false).length
        );
      });
    }
  }, [userData.user]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        notifyType.SUCCESS,
        "Đăng Xuất Thành Công"
      );
      userHandler.setUser(undefined);
      globalHandler.reload();
    }, 500);
  };

  useEffect(() => {
    if (authData.visibleMore) {
      authHandler.showWrapper();
    } else {
      authHandler.hiddenWrapper();
    }
  }, [authData.visibleMore]);

  useEffect(() => {
    if (navbarRef.current) {
      setHeight(navbarRef.current.offsetHeight);
    }
  }, [navbarRef.current]);
  // action click
  const clickNotice = (item) => {
    if (
      item.category === "APPOINTMENT" &&
      userData.user?.role === "USER"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/cuoc-hen-cua-ban");
      });
    } else {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("cuoc-hen");
      });
    }
  };
  // chỉ xuất hiện 2 thông báo
  const showMoreNotifications = () => {
    setVisibleCount(notifications.length);
  };
  return (
    <>
      <div
        ref={navbarRef}
        style={{
          background: scrollY !== 0 ? "white" : "0",
          transition: "0.5s",
        }}
        className="flex shadow-sm items-center justify-between w-screen fixed top-0 left-0 py-1 px-[2rem] z-[3] text-[14px] font-medium"
      >
        <Logo />
        <div className="flex gap-2 text-[14px] items-center">
          {userData.user &&
          userData.user?.processSignup === 3 ? (
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                {/* Icon chuông để mở danh sách thông báo */}
                <div
                  className="mr-5 rounded-full cursor-pointer"
                  onClick={() =>
                    setVisibleUserInfo(!visibleUserInfo)
                  }
                >
                  <span className="fa fa-bell text-gray-600 text-[20px]"></span>
                  {/* Số thông báo màu đỏ */}
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-2 -translate-y-1/2">
                    {lengthNotice}
                  </span>
                </div>

                {/* Dropdown danh sách thông báo */}
                <div
                  className={`z-50 w-[300px] shadow-lg overflow-hidden absolute top-[30px] right-0 bg-white rounded-md transition-all duration-500 ${
                    visibleUserInfo
                      ? "h-auto opacity-100"
                      : "h-0 opacity-0"
                  }`}
                >
                  <div className="w-full flex flex-col">
                    {/* Tiêu đề */}
                    <div className="px-4 py-2 border-b">
                      <span className="font-bold text-sm">
                        Danh sách thông báo
                      </span>
                    </div>

                    {/* Thông báo */}
                    <div className="max-h-64 overflow-y-auto">
                      {notifications
                        .slice()
                        .reverse()
                        .slice(0, visibleCount)
                        .map((item, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 border-b flex items-start cursor-pointer hover:bg-gray-200"
                            onClick={() =>
                              clickNotice(item)
                            }
                          >
                            <div>
                              <span className="font-bold text-blue-600">
                                {item.title}
                              </span>{" "}
                              <br />
                              <span className="text-sm text-gray-500">
                                {item.content}
                              </span>
                              <div className="text-[13px] text-gray-500">
                                Ngày: {item.date.day}/
                                {item.date.month}/
                                {item.date.year}
                              </div>
                            </div>
                            {item.seen === false && (
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-1 right-4 transform"></span>
                            )}
                          </div>
                        ))}
                    </div>
                    {/* Xem tất cả */}
                    {visibleCount <
                      notifications.length && (
                      <div
                        className="px-4 py-2 border-t text-center cursor-pointer hover:bg-gray-200"
                        onClick={showMoreNotifications}
                      >
                        <span className="text-blue-600">
                          Xem tất cả
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link href={"/bac-si-noi-bat"}>
                <button className="text-[white] bg-[#1dcbb6] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
                  Đặt Lịch Khám
                </button>
              </Link>
              <Link href={"/bac-si-noi-bat"}>
                <button className="text-[white] bg-[blue] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
                  Tải Ứng Dụng Ngay
                </button>
              </Link>
            </div>
          ) : (
            <>
              <Link href={"/bac-si-noi-bat"}>
                <button className="text-[white] bg-[#1dcbb6] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
                  Đặt Lịch Khám
                </button>
              </Link>
              <Link href={"/bac-si-noi-bat"}>
                <button className="text-[white] bg-[blue] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
                  Tải Ứng Dụng Ngay
                </button>
              </Link>
            </>
          )}
          {/* <Link href={"/bac-si-noi-bat"}>
            <button className="text-[white] bg-[#1dcbb6] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
              Đặt Lịch Khám
            </button>
          </Link>
          <Link href={"/bac-si-noi-bat"}>
            <button className="text-[white] bg-[blue] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
              Tải Ứng Dụng Ngay
            </button>
          </Link> */}
          <button
            onClick={() =>
              authHandler.setVisibleMore(
                !authData.visibleMore
              )
            }
            className="flex items-center gap-2 mr-4"
          >
            <i className="text-[25px] ml-2 text-[#494949] fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
      <div
        style={{
          right: authData.visibleMore ? 0 : "-100%",
        }}
        className="z-[49] h-screen w-[300px] bg-[white] fixed top-0 transition-all"
      >
        <button
          onClick={() => authHandler.setVisibleMore(false)}
        >
          <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
        </button>
        <ul className="flex flex-col gap-7 py-[2rem] px-[1.5rem]">
          {userData.user?.role !== "DOCTOR" ? (
            <>
              {userData.user && (
                <li
                  onClick={() => {
                    router.push("/ho-so");
                    authHandler.hiddenWrapper();
                    authHandler.setVisibleMore(false);
                  }}
                  className="flex gap-3 cursor-pointer items-center"
                >
                  <img
                    src={userData.user.image}
                    className="rounded-full"
                    width={"45px"}
                  />
                  <span className="text-[17px] font-semibold">
                    {userData.user.role === "DOCTOR" &&
                      "BS. "}
                    {userData.user.fullName}
                  </span>
                </li>
              )}
              <li
                onClick={() => {
                  router.push("/");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="bx text-[#567fea] bxs-home text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Trang Chủ
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/cac-dich-vu");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="bx text-[#ed4c4c] bxs-plus-circle text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Các Dịch Vụ
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/bac-si-noi-bat");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="text-[#4ce1c6] text-[23px] fa-solid fa-user-doctor"></i>
                <span className="text-[16px] font-medium">
                  Đội Ngũ Bác Sĩ
                </span>
              </li>
              {userData?.user?.role === "USER" && (
                <>
                  <li
                    onClick={() => {
                      router.push("/ho-so-suc-khoe");
                      authHandler.hiddenWrapper();
                      authHandler.setVisibleMore(false);
                    }}
                    className="flex gap-3 cursor-pointer"
                  >
                    <i className="text-[#ff3359] fa-solid fa-clipboard text-[23px]"></i>
                    <span className="text-[16px] font-medium">
                      Hồ Sơ Sức Khỏe
                    </span>
                  </li>
                  <li
                    onClick={() => {
                      router.push("/cuoc-hen-cua-ban");
                      authHandler.hiddenWrapper();
                      authHandler.setVisibleMore(false);
                    }}
                    className="flex gap-3 cursor-pointer"
                  >
                    <i className="text-[#ebd400] fa-solid fa-calendar-check text-[23px]"></i>
                    <span className="text-[16px] font-medium">
                      Cuộc Hẹn Của Bạn
                    </span>
                  </li>
                </>
              )}
              <li
                onClick={() => {
                  router.push("/cong-dong");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="text-[#fb3997] fa-solid fa-comment text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Thảo Luận
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/cam-nang");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="text-[#ff7834] fa-solid fa-blog text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Cẩm Nang
                </span>
              </li>
            </>
          ) : (
            <>
              <li
                onClick={() => {
                  router.push("/ho-so");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer items-center"
              >
                <img
                  src={userData.user.image}
                  className="rounded-full"
                  width={"45px"}
                />
                <span className="text-[17px] font-semibold">
                  {userData.user.role === "DOCTOR" &&
                    "BS. "}
                  {userData.user.fullName}
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/cac-cuoc-hen");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="bx text-[#567fea] bxs-home text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Các Cuộc Hẹn
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/ho-so-ca-nhan-bac-si");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="bx text-[#ed4c4c] bxs-plus-circle text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Hồ Sơ Bác Sĩ
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/cong-dong");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="text-[#fb3997] fa-solid fa-comment text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Thảo Luận
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/cam-nang");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer"
              >
                <i className="text-[#ff7834] fa-solid fa-blog text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Cẩm Nang
                </span>
              </li>
            </>
          )}
          {!userData.user && (
            <li className="flex items-center gap-3 justify-center">
              <button
                onClick={() => {
                  authHandler.setVisibleMore(false);
                  setTimeout(() => {
                    authHandler.showSignUp();
                  }, 700);
                }}
                className="text-[white] bg-[blue] w-[110px] py-2 rounded-xl hover:scale-[1.05] transition-all"
              >
                Đăng Ký
              </button>
              <button
                onClick={() => {
                  authHandler.setVisibleMore(false);
                  setTimeout(() => {
                    authHandler.showSignIn();
                  }, 700);
                }}
                className="text-[white] bg-[#1dcbb6] w-[110px] py-2 rounded-xl hover:scale-[1.05] transition-all"
              >
                Đăng Nhập
              </button>
            </li>
          )}
          {userData.user && (
            <li
              onClick={() => {
                handleSignOut();
                authHandler.hiddenWrapper();
                authHandler.setVisibleMore(false);
              }}
              className="flex gap-3 cursor-pointer"
            >
              <i className="text-[#000000] fa-solid fa-right-from-bracket text-[23px]"></i>
              <span className="text-[16px] font-medium">
                Đăng Xuất
              </span>
            </li>
          )}
        </ul>
      </div>
      <div
        style={{ height: height + "px" }}
        className="w-full z-0"
      ></div>
    </>
  );
};

export default Navbar;
