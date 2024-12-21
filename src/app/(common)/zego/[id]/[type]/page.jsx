"use client";
import FormAssessment from "@/components/appointment/FormAssessment";
import FormRecordPatient from "@/components/appointment/FormRecordPatient";
import useWindowWidth from "@/components/UseWindowWidth";
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
  useRef,
  useState,
} from "react";
const Zego = () => {
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
  const [offset, setOffset] = useState();
  const width = useWindowWidth();

  useEffect(() => {
    const element = document.querySelector(
      ".QeMJj1LEulq1ApqLHxuM"
    );
    if (element) {
      const rect = element.getBoundingClientRect();
      const position = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
      setOffset(position);
    }
  }, [document.querySelector(".QeMJj1LEulq1ApqLHxuM")]);

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

  const endMeet = async () => {
    const appId = 2063127223;
    const server = "4169814335cb55bbcdb9a3f63f38dfb8";
    const kitToken =
      ZegoUIKitPrebuilt.generateKitTokenForTest(
        appId,
        server,
        id,
        Date.now().toString(),
        fullName
      );
    const zc = ZegoUIKitPrebuilt.create(kitToken);
    if (width <= 768) {
      zc.hangUp();
    } else {
      if (type === "patient") {
        authHandler.showAssessment();
        zc.hangUp();
      } else {
        const res = await api({
          path: `/medicalRecords/check-appointment`,
          type: TypeHTTP.POST,
          body: { appointment: id },
          sendToken: false,
        });
        api({
          path: `/medicalRecords/send-mail/${res._id}`,
          type: TypeHTTP.POST,
          sendToken: false,
        });
        globalThis.window.location.href = deploy;
        zc.hangUp();
      }
    }
  };

  const myMeeting = async (element) => {
    const appId = 2063127223;
    const server = "4169814335cb55bbcdb9a3f63f38dfb8";
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
      if (record.diagnosisDisease === "") {
        return false;
      }
      if (record.medical.length === 0) {
        return false;
      }
      if (record.note === "") {
        return false;
      }
      return true;
    }
    return false;
  };

  return (
    <div className="relative">
      {fullName !== "" && (
        <div
          style={{ width: "100%", height: "100vh" }}
          className="call-not-video"
          ref={myMeeting}
        ></div>
      )}
      {offset &&
        !checkMedicalRecord(
          appointmentData.medicalRecord
        ) &&
        type !== "patient" && (
          <button
            onClick={() => {
              authHandler.showMedicalRecord();
              globalHandler.notify(
                notifyType.WARNING,
                "Bác sĩ cần hoàn thành thông tin bệnh nhân trước khi rời khỏi phòng"
              );
            }}
            style={{
              width: offset.width + "px",
              height: offset.height + "px",
              top: offset.top + "px",
              left: offset.left + "px",
            }}
            className="fixed z-30"
          ></button>
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

export default Zego;
