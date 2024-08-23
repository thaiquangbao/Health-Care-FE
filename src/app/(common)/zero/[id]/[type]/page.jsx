"use client";
import FormAssessment from "@/components/appointment/FormAssessment";
import FormRecordPatient from "@/components/appointment/FormRecordPatient";
import { appointmentContext } from "@/context/AppointmentContext";
import { authContext } from "@/context/AuthContext";
import {
  globalContext,
  notifyType,
} from "@/context/GlobalContext";
import { userContext } from "@/context/UserContext";
import { api, TypeHTTP } from "@/utils/api";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import {
  useParams,
  usePathname,
  useRouter,
} from "next/navigation";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
const Zero = () => {
  const param = useParams();
  const { id, type } = param;
  const { userData } = useContext(userContext);
  const { authHandler, authData } = useContext(authContext);
  const { appointmentHandler, appointmentData } =
    useContext(appointmentContext);
  const [fullName, setFullName] = useState("");
  const [visibleStatusUpdated, setVisibleStatusUpdated] =
    useState(false);
  const { globalHandler } = useContext(globalContext);
  const router = useRouter();
  useEffect(() => {
    if (userData.user) {
      setFullName(userData.user.fullName);
    }
  }, [userData.user]);
  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      path: `/appointments/get-one/${id}`,
      sendToken: false,
    }).then((res) => {
      appointmentHandler.setCurrentAppointment(res);
      localStorage.setItem(
        "appointmentData",
        JSON.stringify(res)
      );
    });
  }, [id]);

  const endMeet = () => {
    const appId = 9941651;
    const server = "0a4c93dcfcc779f9ce39d72e555284b4";
    const kitToken =
      ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        server,
        id,
        Date.now().toString(),
        fullName
      );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    if (type === "patient") {
      authHandler.showAssessment();
      zc.hangUp();
    } else {
      setTimeout(() => {
        window.location.href = "/cuoc-hen";
        //router.replace("/cuoc-hen");
        zc.hangUp();
      }, 4000);
    }

    // chổ này là dùng để dọn dẹp dữ liệu phòng meet chứ bth tắt là nó còn chạy meet đó bên phía server zego nên là phải có chổ này

    // còn m muốn khi 1 người out thì thằng kia out luôn thì phải thêm tí socket
  };

  const myMeeting = async (element) => {
    const appId = 9941651;
    const server = "0a4c93dcfcc779f9ce39d72e555284b4";
    const kitToken =
      ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        server,
        id,
        Date.now().toString(),
        fullName
      ); // fullName chổ này không được để trống nha truyền đại cái j zô i
    const zc = ZegoUIKitPrebuilt.create(kitToken);

    zc.joinRoom({
      turnOnMicrophoneWhenJoining: true,
      turnOnCameraWhenJoining: true,
      showMyCameraToggleButton: true,
      showMyMicrophoneToggleButton: true,
      showAudioVideoSettingsButton: true,
      showScreenSharingButton: true,
      showTextChat: true,
      showUserList: false,
      maxUsers: 2,
      layout: "Auto",
      showLayoutButton: false,
      showPreJoinView: false,
      showRoomTimer: true,
      showLeavingView: false,
      scenario: {
        mode: "OneONoneCall",
      },

      container: element,

      onLeaveRoom: () => {
        // khi rời muốn lamf j đó thì ở đây
        //authHandler.showAssessment();
        endMeet();
        // window.location.href = "/" // chổ này là khi bấm nút tắt m muốn chuyển sang trang nào đó
      },
    });
  };
  return (
    <div>
      {fullName !== "" && (
        <div
          style={{ width: "100%", height: "100vh" }}
          className="call-not-video"
          ref={myMeeting}
        ></div>
      )}
      {userData.user?.role === "DOCTOR" && (
        <button
          onClick={() => authHandler.showMedicalRecord()}
          className="absolute top-2 right-2 px-4 py-2 bg-[white] shadow-sm rounded-xl"
        >
          {visibleStatusUpdated && (
            <span
              className="font-bold"
              style={{ color: "green" }}
            >
              ✔️
            </span>
          )}
          Hồ Sơ Bệnh Nhân
        </button>
      )}
      {userData.user?.role === "DOCTOR" && (
        <FormRecordPatient
          setVisibleStatusUpdated={setVisibleStatusUpdated}
          visible={authData.visibleMedicalRecord}
          hidden={authHandler.hiddenMedicalRecord}
        />
      )}
      <FormAssessment
        visible={authData.visibleAssessment}
        hidden={authHandler.hiddenAssessment}
      />
    </div>
  );
};

export default Zero;
