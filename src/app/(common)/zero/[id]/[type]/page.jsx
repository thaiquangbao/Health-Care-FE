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
    });
  }, [id]);

  const endMeet = () => {
    const appId = 990593542;
    const server = "2cb25276b88aed6a8b25fb750babb23a";
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
      globalThis.window.location.href = "/cuoc-hen";
      zc.hangUp();
    }

    // chổ này là dùng để dọn dẹp dữ liệu phòng meet chứ bth tắt là nó còn chạy meet đó bên phía server zego nên là phải có chổ này

    // còn m muốn khi 1 người out thì thằng kia out luôn thì phải thêm tí socket
  };

  const myMeeting = async (element) => {
    const appId = 990593542;
    const server = "2cb25276b88aed6a8b25fb750babb23a";
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
        endMeet();
      },
    });
  };

  const checkMedicalRecord = (record) => {
    if (record) {
      if (record.diagnosisDisease === '') {
        return false
      }
      if (record.medical.length === 0) {
        return false
      }
      if (record.note === "") {
        return false
      }
      return true
    }
    return false
  }

  return (
    <div className="relative">
      {fullName !== "" && (
        <div
          style={{ width: "100%", height: "100vh" }}
          className="call-not-video"
          ref={myMeeting}
        ></div>
      )}
      {!checkMedicalRecord(appointmentData.medicalRecord) && (
        <button onClick={() => {
          authHandler.showMedicalRecord();
          globalHandler.notify(notifyType.WARNING, 'Bác sĩ cần hoàn thành thông tin bệnh nhân trước khi rời khỏi phòng')
        }} className="absolute bottom-[1.5%] left-[53.5%] rounded-xl translate-x-[-50%] h-[4.7%] w-[4.8%] z-[1]">
        </button>
      )}
      {userData.user?.role === "DOCTOR" && (
        <button
          onClick={() => authHandler.showMedicalRecord()}
          className="absolute top-2 right-2 px-4 py-2 bg-[#1dcbb6] text-[white] text-[14px] shadow-sm rounded-xl"
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
