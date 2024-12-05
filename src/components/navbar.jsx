"use client";
import { appointmentContext } from "@/context/AppointmentContext";
import { authContext } from "@/context/AuthContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Logo from "./logo";
import NotificationApp from "./NotificationApp";

const Navbar = () => {
  const { globalHandler } = useContext(globalContext);
  const [scrollY, setScrollY] = useState(0);
  const navbarRef = useRef();
  const [height, setHeight] = useState(0);
  const [visibleDatKham, setVisibleDatKham] =
    useState(false);
  const { authData, authHandler } = useContext(authContext);
  const { userData, userHandler } = useContext(userContext);
  const [visibleHealth, setVisibleHealth] = useState(false);
  const [user, setUser] = useState();
  const [visibleHealthDoctor, setVisibleHealthDoctor] =
    useState(false);
  const { appointmentHandler } = useContext(
    appointmentContext
  );
  const router = useRouter();

  const handleScroll = () => {
    setScrollY(globalThis.window.scrollY);
  };

  useEffect(() => {
    if (userData.user) {
      setUser(userData.user);
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
        notifyType.LOADING,
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

  return (
    <>
      {/* <div className="w-screen h-[0px] bg-[red]"></div> */}
      <div
        ref={navbarRef}
        style={{
          background: scrollY !== 0 ? "white" : "white",
          transition: "0.5s",
        }}
        className="flex shadow-sm h-[60px] items-center justify-between w-screen fixed top-0 left-0 py-1 px-[2rem] z-[3] text-[14px] font-medium"
      >
        <Logo />
        <div className="flex gap-2 text-[14px] items-center">
          {userData.user &&
            userData.user?.processSignup === 3 && (
              <NotificationApp />
            )}
          {userData.user?.role !== 'DOCTOR' && (
            <>
              <Link href={"/bac-si-noi-bat"}>
                <button className="text-[white] bg-[#1dcbb6] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all">
                  Đặt Lịch Khám
                </button>
              </Link>
              <button
                onClick={() => authHandler.showQR()}
                className="text-[white] bg-[blue] px-3 py-2 rounded-xl hover:scale-[1.05] transition-all"
              >
                Tải Ứng Dụng Ngay
              </button>
            </>
          )}
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
        <ul className="flex flex-col pt-[0.25rem] px-[1.5rem]">
          {userData.user?.role !== "DOCTOR" ? (
            <>
              {userData.user && (
                <li
                  onClick={() => {
                    router.push("/ho-so");
                    authHandler.hiddenWrapper();
                    authHandler.setVisibleMore(false);
                  }}
                  className="flex gap-3 cursor-pointer mt-5 items-center"
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
                className="flex gap-3 cursor-pointer mt-5"
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
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="bx text-[#ed4c4c] bxs-plus-circle text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Các Dịch Vụ
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/danh-sach-thuoc");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i class='bx bxs-capsule text-[rgb(76,195,225)] text-[25px]'></i>
                <span className="text-[16px] font-medium">
                  Danh Sách Thuốc
                </span>
              </li>
              <li
                onClick={() => {
                  authHandler.setVisibleMore(false);
                  setTimeout(() => {
                    authHandler.showSmartSearching();
                  }, 1000);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="text-[#5dade2] bx bx-search text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Tìm Kiếm Thông Minh
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/bac-si-noi-bat");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
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
                      setVisibleHealth(!visibleHealth);
                    }}
                    className="flex justify-between cursor-pointer mt-5"
                  >
                    <div className="flex gap-3">
                      <i className="text-[#ff3359] fa-solid fa-notes-medical text-[23px]"></i>
                      <span className="text-[16px] font-medium">
                        Sức Khỏe
                      </span>
                    </div>
                  </li>
                  <div
                    style={{
                      height: visibleHealth ? "180px" : "0",
                      transition: "0.5s",
                    }}
                    className="flex flex-col gap-5 pl-[1.5rem] overflow-hidden"
                  >
                    <li
                      onClick={() => {
                        router.push("/ho-so-suc-khoe");
                        authHandler.hiddenWrapper();
                        authHandler.setVisibleMore(false);
                      }}
                      className="flex gap-3 cursor-pointer mt-5"
                    >
                      <i className="text-[#ff3359] fa-solid fa-clipboard text-[23px]"></i>
                      <span className="text-[16px] font-medium">
                        Hồ Sơ Sức Khỏe
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        router.push("/theo-doi-suc-khoe");
                        authHandler.hiddenWrapper();
                        authHandler.setVisibleMore(false);
                      }}
                      className="flex gap-3 cursor-pointer"
                    >
                      <i className="text-[#ff3359] fa-solid fa-heart-pulse text-[23px]"></i>
                      <span className="text-[16px] font-medium">
                        Theo Dõi Sức Khỏe
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        router.push(
                          "/kham-suc-khoe-tai-nha"
                        );
                        authHandler.hiddenWrapper();
                        authHandler.setVisibleMore(false);
                      }}
                      className="flex gap-3 cursor-pointer"
                    >
                      <i className="text-[#007bff] fa-solid fa-house-medical text-[23px]"></i>
                      <span className="text-[16px] font-medium">
                        Khám sức khỏe tại nhà
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
                        Khám sức khỏe trực tuyến
                      </span>
                    </li>
                    <li
                      onClick={() => {
                        router.push("/cuoc-tro-chuyen");
                        authHandler.hiddenWrapper();
                        authHandler.setVisibleMore(false);
                      }}
                      className="flex gap-3 cursor-pointer"
                    >
                      <i className="text-[#567fea] fa-solid fa-comments text-[23px]"></i>
                      <span className="text-[16px] font-medium">
                        Trò Chuyện
                      </span>
                    </li>
                  </div>
                </>
              )}
              <li
                onClick={() => {
                  router.push("/cong-dong");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
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
                className="flex gap-3 cursor-pointer mt-5"
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
                className="flex gap-3 cursor-pointer mt-5 items-center"
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
                  router.push("/");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="bx text-[#567fea] bxs-home text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Trang Chủ
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/thong-ke-doanh-thu");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="bx text-[#e6e635] bxs-bar-chart-alt-2 text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Thống Kê Doanh Thu
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/doanh-thu-cua-toi");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="bx text-[#3d992b] bxs-dollar-circle text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Doanh Thu Của Tôi
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/phieu-dang-ky");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="text-[#ff3359] fa-solid fa-clipboard text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Phiếu Đăng Ký
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/benh-nhan-cua-toi");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="text-[#ff3359] fa-solid fa-heart-pulse text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Bệnh Nhân Của Tôi
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/cuoc-tro-chuyen");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="text-[#567fea] fa-solid fa-comments text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Cuộc Trò Chuyện
                </span>
              </li>
              <li
                onClick={() => {
                  router.push("/ho-so-ca-nhan-bac-si");
                  authHandler.hiddenWrapper();
                  authHandler.setVisibleMore(false);
                }}
                className="flex gap-3 cursor-pointer mt-5"
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
                className="flex gap-3 cursor-pointer mt-5"
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
                className="flex gap-3 cursor-pointer mt-5"
              >
                <i className="text-[#ff7834] fa-solid fa-blog text-[23px]"></i>
                <span className="text-[16px] font-medium">
                  Cẩm Nang
                </span>
              </li>
            </>
          )}
          {!userData.user && (
            <li className="flex items-center gap-3 mt-5 justify-center">
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
              className="flex gap-3 cursor-pointer mt-5"
            >
              <i className="text-[#000000] fa-solid fa-right-from-bracket text-[23px]"></i>
              <span className="text-[16px] font-medium">
                Đăng Xuất
              </span>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
