"use client";
import FormSignIn from "@/components/auth/FormSignIn";
import FormSignUp from "@/components/auth/FormSignUp";
import Loading from "@/components/loading";
import Wrapper from "@/components/wrapper";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { userContext } from "./UserContext";
import { api, TypeHTTP } from "@/utils/api";
import HealthResponseForm from "@/components/benh-nhan-theo-doi/HealthResponseForm";
import QRDownload from "@/components/QRDownload";

export const authContext = createContext();

const AuthContext = ({ children }) => {
  const [visibleSignUp, setVisibleSignUp] = useState(false);
  const [visibleSignIn, setVisibleSignIn] = useState(false);
  const [visibleWrapper, setVisibleWrapper] = useState(false);
  const [visibleFormCreateBaiViet, setVisibleFormCreateBaiViet] = useState(false);
  const [visibleMore, setVisibleMore] = useState(false);
  const [visibleAssessment, setVisibleAssessment] = useState(false);
  const [visibleMedicalRecord, setVisibleMedicalRecord] = useState(false);
  const [healthResponse, setHealthResponse] = useState()
  const wrapperRef = useRef();
  const [loading, setLoading] = useState(true);
  const { userData } = useContext(userContext);
  const [detailMedicalRecord, setDetailMedicalRecord] = useState()
  const [currentRoom, setCurrentRoom] = useState()
  const [rooms, setRooms] = useState([])
  const [visibleQR, setVisibleQR] = useState(false)

  useEffect(() => {
    if (userData.user && userData.user?.role === 'USER') {
      api({ type: TypeHTTP.GET, sendToken: true, path: `/rooms/get-room-patient/${userData.user._id}` })
        .then(rooms => {
          setRooms(rooms)
        })
    } else if (userData.user && userData.user?.role === 'DOCTOR') {
      api({ type: TypeHTTP.GET, sendToken: true, path: `/rooms/get-room-doctor/${userData.user._id}` })
        .then(rooms => {
          setRooms(rooms)
        })
    }
  }, [userData.user])

  const handleWaitTime = () => {
    if (!globalThis.localStorage.getItem("refreshToken"))
      return 1000;
    else {
      // while (!userData.user) { }
      return 2000;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, handleWaitTime());
  }, []);

  const showWrapper = () => {
    wrapperRef.current.style.display = "block";
    document.querySelector("body").style.overflow =
      "hidden";
    setTimeout(() => {
      wrapperRef.current.style.opacity = 1;
    }, 100);
  };

  const hiddenWrapper = () => {
    wrapperRef.current.style.opacity = 0;
    document.querySelector("body").style.overflow = "auto";
    setTimeout(() => {
      wrapperRef.current.style.display = "none";
    }, 500);
  };

  const showSignUp = () => {
    showWrapper();
    setVisibleSignUp(true);
  };

  const hiddenSignUp = () => {
    hiddenWrapper();
    setVisibleSignUp(false);
  };

  const showSignIn = () => {
    showWrapper();
    setVisibleSignIn(true);
  };

  const hiddenSignIn = () => {
    hiddenWrapper();
    setVisibleSignIn(false);
  };

  const showFormCreateBaiViet = () => {
    showWrapper();
    setVisibleFormCreateBaiViet(true);
  };

  const hiddenFormCreateBaiViet = () => {
    hiddenWrapper();
    setVisibleFormCreateBaiViet(false);
  };

  const showMedicalRecord = () => {
    showWrapper();
    setVisibleMedicalRecord(true);
  };

  const hiddenMedicalRecord = () => {
    hiddenWrapper();
    setVisibleMedicalRecord(false);
  };

  const showAssessment = () => {
    showWrapper();
    setVisibleAssessment(true);
  };

  const hiddenAssessment = () => {
    hiddenWrapper();
    setVisibleAssessment(false);
  };

  const showDetailMedicalRecord = (data) => {
    showWrapper();
    setDetailMedicalRecord(data)
  };

  const hiddenDetailMedicalRecord = () => {
    hiddenWrapper();
    setDetailMedicalRecord()
  };

  const showHealthResponse = (data) => {
    setHealthResponse(data)
  }

  const hiddenHealthResponse = () => {
    setHealthResponse()
  }

  const showQR = () => {
    showWrapper();
    setVisibleQR(true)
  };

  const hiddenQR = () => {
    hiddenWrapper();
    setVisibleQR(false)
  };

  const hidden = () => {
    hiddenWrapper();
    hiddenSignUp();
    hiddenSignIn();
    setVisibleMore(false);
    setVisibleFormCreateBaiViet(false);
    setVisibleMedicalRecord(false);
    hiddenAssessment();
    hiddenDetailMedicalRecord();
    setCurrentRoom()
    setVisibleQR(false)
  };

  const data = {
    visibleMore,
    visibleFormCreateBaiViet,
    visibleMedicalRecord,
    visibleAssessment,
    detailMedicalRecord,
    currentRoom,
    rooms,
    healthResponse
  };

  const handler = {
    showSignUp,
    hiddenSignUp,
    showSignIn,
    hiddenSignIn,
    showWrapper,
    hiddenWrapper,
    setVisibleMore,
    hiddenFormCreateBaiViet,
    showFormCreateBaiViet,
    hiddenMedicalRecord,
    showMedicalRecord,
    showAssessment,
    hiddenAssessment,
    showDetailMedicalRecord,
    hiddenDetailMedicalRecord,
    setCurrentRoom,
    setRooms,
    showHealthResponse,
    hiddenHealthResponse,
    showQR,
    hiddenQR
  };

  return (
    <authContext.Provider
      value={{ authData: data, authHandler: handler }}
    >
      <div className="z-40">
        <Wrapper wrapperRef={wrapperRef} onClick={hidden} />
        <FormSignUp
          visible={visibleSignUp}
          hidden={hiddenSignUp}
        />
        <FormSignIn
          visible={visibleSignIn}
          hidden={hiddenSignIn}
        />
        <HealthResponseForm healthResponse={healthResponse} setHealthResponse={setHealthResponse} />
        <QRDownload visible={visibleQR} hidden={hidden} />
        {children}
      </div>
      {loading && <Loading />}
    </authContext.Provider>
  );
};

export default AuthContext;
