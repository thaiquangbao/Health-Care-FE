import { appointmentContext } from "@/context/AppointmentContext";
import { userContext } from "@/context/UserContext";
import { api, baseURL, TypeHTTP } from "@/utils/api";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
const socket = io.connect(baseURL);
const NotificationApp = () => {
  const { userData } = useContext(userContext);
  const [lengthNotice, setLengthNotice] = useState(0);
  const [visibleUserInfo, setVisibleUserInfo] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2);
  const router = useRouter();
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);

  useEffect(() => {
    if (userData.user) {
      api({
        path: `/notices/get-by-user/${userData.user?._id}`,
        type: TypeHTTP.GET,
        sendToken: false,
      }).then((res) => {
        setNotifications(res);
        setLengthNotice(res.filter((item) => item.seen === false).length);
      });
    }
  }, [userData.user]);
  useEffect(() => {
    socket.on(`notice.create${userData.user?._id}`, (notice) => {
      setNotifications([...notifications, notice]);
      setLengthNotice(lengthNotice + 1);
    });
    return () => {
      socket.off(`notice.create${userData.user?._id}`);
    };
  }, [lengthNotice, notifications, userData.user?._id]);
  const clickNotice = (item) => {
    if (item.category === "APPOINTMENT" && userData.user?.role === "USER") {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        if (item.title.toLowerCase().trim() === "lịch hẹn") {
          api({
            sendToken: false,
            path: `/appointments/get-one/${item.attached}`,
            type: TypeHTTP.GET,
          }).then((res1) => {
            appointmentHandler.showFormDetailAppointment(res1, false);
          });
        } else {
          router.push("/cuoc-hen-cua-ban");
        }
      });
    } else if (item.category === "PAYMENT" && userData.user?.role === "USER") {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/ho-so");
      });
    } else if (
      item.category === "HEARTLOGBOOK" &&
      userData.user?.role === "USER"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/theo-doi-suc-khoe");
      });
    } else if (
      item.category === "APPOINTMENTHOME" &&
      userData.user?.role === "USER"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/kham-suc-khoe-tai-nha");
      });
    } else if (
      item.title.toLowerCase().trim() === "cảnh báo sức khỏe" &&
      userData.user?.role === "DOCTOR"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/benh-nhan-cua-toi");
      });
    } else if (
      item.category === "SCHEDULE" &&
      userData.user?.role === "DOCTOR"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/ho-so-ca-nhan-bac-si");
      });
    } else if (
      item.category === "APPOINTMENTHOME" &&
      userData.user?.role === "DOCTOR"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/phieu-dang-ky");
      });
    } else if (
      item.category === "PAYBACK" &&
      userData.user?.role === "DOCTOR"
    ) {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        router.push("/ho-so");
      });
    } else {
      api({
        type: TypeHTTP.POST,
        body: { _id: item._id, seen: true },
        sendToken: false,
        path: "/notices/update",
      }).then((res) => {
        if (item.title.toLowerCase().trim() === "lịch hẹn") {
          api({
            sendToken: false,
            path: `/appointments/get-one/${item.attached}`,
            type: TypeHTTP.GET,
          }).then((res1) => {
            appointmentHandler.showFormDetailAppointment(res1, false);
          });
        } else {
          router.push("/cuoc-hen");
        }
      });
    }
  };

  // chỉ xuất hiện 2 thông báo
  const showMoreNotifications = () => {
    setVisibleCount(notifications.length);
  };

  return (
    <div className="relative mr-3">
      {/* Icon chuông để mở danh sách thông báo */}
      <div
        className=" rounded-full cursor-pointer"
        onClick={() => setVisibleUserInfo(!visibleUserInfo)}
      >
        <span className="fa fa-bell text-[#8d8d8d] text-[22px]"></span>
        {/* Số thông báo màu đỏ */}
        <span className="absolute text-[13px] top-0 right-[-50%] inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-2 -translate-y-1/2">
          {lengthNotice}
        </span>
      </div>

      {/* Dropdown danh sách thông báo */}
      <div
        className={`z-50 w-[300px] shadow-lg overflow-hidden absolute top-[30px] right-0 bg-white rounded-md transition-all duration-500 ${
          visibleUserInfo ? "h-[315px] opacity-100" : "h-0 opacity-0"
        }`}
      >
        <div className="w-full flex flex-col">
          {/* Tiêu đề */}
          <div className="px-4 py-2 border-b">
            <span className="font-bold text-sm">Danh sách thông báo</span>
          </div>

          {/* Thông báo */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications
                .slice()
                .reverse()
                .slice(0, visibleCount)
                .map((item, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 relative border-b flex items-start cursor-pointer hover:bg-gray-200"
                    onClick={() => clickNotice(item)}
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
                        Ngày: {item.date.day}/{item.date.month}/{item.date.year}
                      </div>
                    </div>
                    {item.seen === false && (
                      <span className=" absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full mt-1 transform"></span>
                    )}
                  </div>
                ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <span className="font-bold text-blue-600">
                  Bạn chưa có thông báo nào!!!
                </span>
              </div>
            )}
          </div>
          {/* Xem tất cả */}
          {visibleCount < notifications.length && (
            <div
              className="px-4 py-2 border-t text-center cursor-pointer hover:bg-gray-200"
              onClick={showMoreNotifications}
            >
              <span className="text-blue-600">Xem tất cả</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationApp;
