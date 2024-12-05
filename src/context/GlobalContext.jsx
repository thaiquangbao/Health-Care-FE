"use client";
import ChatBot from "@/components/chatbot/ChatBot";
import Notification from "@/components/notification";
import MessageIcon from "@/components/shortcut/MessageIcon";
import { api, TypeHTTP } from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { appointmentContext } from "./AppointmentContext";
import { userContext } from "./UserContext";
export const globalContext = createContext();

export const notifyType = {
  SUCCESS: "success",
  FAIL: "fail",
  WARNING: "warning",
  LOADING: "loading",
  HEALTH: "health",
  NONE: "none",
};

const GlobalProvider = ({ children }) => {
  const [info, setInfo] = useState({
    status: notifyType.NONE,
    message: "",
  });
  const { userHandler, userData } = useContext(userContext);
  const pathname = usePathname();
  const router = useRouter();
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);
  const notify = (status, message) =>
    setInfo({ status, message });

  const reload = () => {
    setTimeout(() => {
      globalThis.window.location.reload();
    }, 1000);
  };

  useEffect(() => {
    if (info.status !== notifyType.NONE) {
      if (info.status !== notifyType.LOADING) {
        setTimeout(() => {
          setInfo({ status: notifyType.NONE, message: "" });
        }, 3000);
      }
    }
  }, [info.status]);

  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      sendToken: true,
      path: "/auth/userByToken",
    })
      .then((user) => {
        if (user.role === "ADMIN") {
          notify(
            notifyType.FAIL,
            "Tài khoản của bạn không đủ quyền để truy cập"
          );
          globalThis.localStorage.removeItem("accessToken");
          globalThis.localStorage.removeItem(
            "refreshToken"
          );
        } else {
          userHandler.setUser(user);
        }
      })
      .catch((error) => {
        globalThis.localStorage.removeItem("accessToken");
        globalThis.localStorage.removeItem("refreshToken");
        // notify(notifyType.FAIL, error.message)
      });
  }, [pathname]);

  useEffect(() => {
    const accessToken = globalThis.localStorage.getItem('accessToken')
    const pathnames = [
      "cam-nang",
      "chi-tiet-cam-nang",
      "cong-dong",
      "chi-tiet-cau-hoi",
      "cac-dich-vu", // sửa ở đây
      "bac-si-noi-bat", // sửa ở đây
      "ho-so-dang-ky", // sửa ở đây
      "zero", // sửa ở đây
      "ho-so-bac-si", // sửa ở đây
      "dich-vu",
      "zego",
      "meet",
      "danh-sach-thuoc"
    ];
    const patientPathnames = [
      "/cac-dich-vu",
      "/bac-si-noi-bat",
      "/cuoc-hen-cua-ban",
      "/ho-so-bac-si",
      "/ho-so-suc-khoe",
      "/theo-doi-suc-khoe",
      "/kham-suc-khoe-tai-nha",
      "/zero", // sửa ở đây
      "/ho-so-dang-ky-tai-nha",// sửa ở đây
      "/ho-so-dang-ky", // sửa ở đây
      "/ho-so-dang-ky-theo-doi-suc-khoe", // sửa ở đây
      "/ho-so", // sửa ở đây
      "/kham-tong-quat", // sửa ở đây // thiếu url khám theo loại bệnh
      "/",
    ];
    const doctorPathname = [
      "/thong-ke-doanh-thu",
      "/doanh-thu-cua-toi",
      "/phieu-dang-ky",
      "/benh-nhan-cua-toi",
      "/cuoc-tro-chuyen",
      "/ho-so-ca-nhan-bac-si",
      "/them-cam-nang",
      "/ho-so",
      "/"
    ];
    if (pathname.includes("location")) {

    } else {
      if (userData.user) {
        //nếu là admin
        if (userData.user.role === "ADMIN") {
          notify(
            notifyType.FAIL,
            "Vui Lòng đăng nhập bằng tài khoản người sử dụng"
          );
          userHandler.setUser();
          globalThis.localStorage.removeItem("accessToken");
          globalThis.localStorage.removeItem("refreshToken");
        }
        // nêú là patient
        else if (userData.user.role === "USER") {
          if (!pathnames.includes(pathname.split("/")[1]) && !patientPathnames.includes('/' + pathname.split("/")[1])) {
            router.push('/')
          }
        }
        // nếu là doctor
        else {
          if (!pathnames.includes(pathname.split("/")[1]) && !doctorPathname.includes('/' + pathname.split("/")[1])) {
            router.push("/phieu-dang-ky");
          }
        }
      } else {
        if (!pathnames.includes(pathname.split("/")[1])) {
          router.push("/");
        }
      }
    }
  }, [pathname, userData.user]);

  const data = {};
  const handler = {
    notify,
    reload,
  };

  return (
    <globalContext.Provider
      value={{ globalData: data, globalHandler: handler }}
    >
      <Notification
        status={info.status}
        message={info.message}
        setInfomation={setInfo}
      />
      {!pathname.includes("zero") && <ChatBot />}
      {children}
    </globalContext.Provider>
  );
};

export default GlobalProvider;
