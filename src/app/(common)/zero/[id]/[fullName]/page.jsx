"use client";
import { api, TypeHTTP } from "@/utils/api";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
const Zero = () => {
  const param = useParams();
  const { id, fullName } = param;
  useEffect(() => {
    api({
      type: TypeHTTP.GET,
      path: `/appointments/get-one/${id}`,
      sendToken: false,
    }).then((res) => {
      console.log(res);
    });
  }, []);
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
    zc.hangUp(); // chổ này là dùng để dọn dẹp dữ liệu phòng meet chứ bth tắt là nó còn chạy meet đó bên phía server zego nên là phải có chổ này
    setTimeout(() => {
      window.location.href = "/";
    }, 4000);
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
      showTextChat: false,
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
        // window.location.href = "/" // chổ này là khi bấm nút tắt m muốn chuyển sang trang nào đó
      },
    });
  };
  return (
    <div>
      <div
        style={{ width: "100%", height: "100vh" }}
        className="call-not-video"
        ref={myMeeting}
      ></div>
    </div>
  );
};

export default Zero;
