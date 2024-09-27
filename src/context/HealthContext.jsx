"use client";
import LineChart from "@/components/chart/LineChart";
import MessageIcon from "@/components/shortcut/MessageIcon";
import UpdateHealthForm from "@/components/theo-doi-suc-khoe/patient/UpdateHealthForm";
import { api, baseURL, TypeHTTP } from "@/utils/api";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import { authContext } from "./AuthContext";
import { globalContext, notifyType } from "./GlobalContext";
import { userContext } from "./UserContext";
const socket = io.connect(baseURL);

export const healthContext = createContext();

const HealthProvider = ({ children }) => {
  const { authHandler, authData } = useContext(authContext);
  const { userData } = useContext(userContext);
  const [logBook, setLogBook] = useState();
  const [rooms, setRooms] = useState([]);
  const [temporaryData, setTemporaryData] = useState();
  const pathname = usePathname();
  const [logBooks, setLogBooks] = useState([]);
  const { globalHandler } = useContext(globalContext);

  useEffect(() => {
    if (userData.user) {
      api({
        type: TypeHTTP.GET,
        path: `/healthLogBooks/findByDoctor/${userData.user._id}`,
        sendToken: true,
      }).then((logBooks) => {
        setLogBooks(logBooks);
      });
    }
  }, [userData.user]);

  // Health Socket

  useEffect(() => {
    logBooks.forEach((logBook) => {
      socket.on(
        `health-logbook-blood.update${logBook._id}`,
        (data) => {
          setLogBooks((prev) =>
            prev.map((item) => {
              if (item._id === data.data._id) {
                return data.data;
              }
              return item;
            })
          );
          globalHandler.notify(
            notifyType.HEALTH,
            `Bệnh nhân ${
              data.data.patient.fullName
            } vừa cập nhật huyết áp ( ${
              data.data.disMon[data.data.disMon.length - 1]
                .vitalSign.bloodPressure
            } )`
          );
        }
      );
      socket.on(
        `health-logbook-temperature.update${logBook._id}`,
        (data) => {
          setLogBooks((prev) =>
            prev.map((item) => {
              if (item._id === data.data._id) {
                return data.data;
              }
              return item;
            })
          );
          globalHandler.notify(
            notifyType.HEALTH,
            `Bệnh nhân ${
              data.data.patient.fullName
            } vừa cập nhật nhiệt độ ( ${
              data.data.disMon[data.data.disMon.length - 1]
                .vitalSign.temperature
            } )`
          );
        }
      );
      socket.on(
        `health-logbook-health.update${logBook._id}`,
        (data) => {
          setLogBooks((prev) =>
            prev.map((item) => {
              if (item._id === data.data._id) {
                return data.data;
              }
              return item;
            })
          );
          globalHandler.notify(
            notifyType.HEALTH,
            `Bệnh nhân ${
              data.data.patient.fullName
            } vừa cập nhật nhịp tim ( ${
              data.data.disMon[data.data.disMon.length - 1]
                .vitalSign.heartRate
            } )`
          );
        }
      );
      socket.on(
        `health-logbook-bmi.update${logBook._id}`,
        (data) => {
          setLogBooks((prev) =>
            prev.map((item) => {
              if (item._id === data.data._id) {
                return data.data;
              }
              return item;
            })
          );
          globalHandler.notify(
            notifyType.HEALTH,
            `Bệnh nhân ${
              data.data.patient.fullName
            } vừa cập nhật BMI ( ${(
              data.data.disMon[data.data.disMon.length - 1]
                .vitalSign.weight /
              ((data.data.disMon[
                data.data.disMon.length - 1
              ].vitalSign.height /
                100) *
                (data.data.disMon[
                  data.data.disMon.length - 1
                ].vitalSign.height /
                  100))
            ).toFixed(2)} )`
          );
        }
      );
      socket.on(
        `health-logbook-symptom.update${logBook._id}`,
        (data) => {
          setLogBooks((prev) =>
            prev.map((item) => {
              if (item._id === data.data._id) {
                return data.data;
              }
              return item;
            })
          );
          globalHandler.notify(
            notifyType.HEALTH,
            `Bệnh nhân ${
              data.data.patient.fullName
            } vừa cập nhật triệu chứng ( ${
              data.data.disMon[data.data.disMon.length - 1]
                .symptom
            } ${
              data.data.disMon[data.data.disMon.length - 1]
                .note !== ""
                ? `. Ghi chú:${
                    data.data.disMon[
                      data.data.disMon.length - 1
                    ].note
                  }`
                : ""
            } )`
          );
        }
      );
    });

    return () => {
      logBooks.forEach((logBook) => {
        socket.off(
          `health-logbook-blood.update${logBook._id}`
        );
        socket.off(
          `health-logbook-temperature.update${logBook._id}`
        );
        socket.off(
          `health-logbook-health.update${logBook._id}`
        );
        socket.off(
          `health-logbook-bmi.update${logBook._id}`
        );
        socket.off(
          `health-logbook-symptom.update${logBook._id}`
        );
      });
    };
  }, [logBooks]);
  useEffect(() => {
    rooms.forEach((room) => {
      socket.on(
        `health-logbook-completed.update${room._id}`,
        (data) => {
          setRooms((prev) =>
            prev.map((item) => {
              if (item._id === data._id) {
                return data;
              }
              return item;
            })
          );
        }
      );
      socket.on(
        `health-logbook-doctor.transfer${room._id}`,
        (data) => {
          setRooms((prev) =>
            prev.map((item) => {
              if (item._id === data._id) {
                return data;
              }
              return item;
            })
          );
        }
      );
    });
    return () => {
      rooms.forEach((room) => {
        socket.off(
          `health-logbook-completed.update${room._id}`
        );
        socket.off(
          `health-logbook-doctor.transfer${room._id}`
        );
      });
    };
  }, [rooms]);
  // useEffect(() => {
  //      socket.on(`health-logbook-doctor.accepted${userData.user?._id}`, (data) => {
  //         console.log(data);

  //             setRooms(prev => prev.map(item => {
  //                 if (item._id === data._id) {
  //                     return data
  //                 }
  //                 return item
  //              }))
  //     })
  //     return () => {
  //         socket.off(`health-logbook-doctor.accepted${userData.user?._id}`);
  //     }
  // },[userData.user])
  // --------

  useEffect(() => {
    if (userData.user && userData.user?.role === "USER") {
      api({
        type: TypeHTTP.GET,
        sendToken: true,
        path: `/rooms/get-room-patient/${userData.user._id}`,
      }).then((rooms) => {
        setRooms(rooms);
      });
    }
  }, [userData.user]);

  useEffect(() => {
    if (temporaryData && !logBook) {
      setTimeout(() => {
        authHandler.setCurrentRoom(temporaryData);
        setTemporaryData();
      }, 500);
    }
  }, [logBook]);

  const showUpdateHealthForm = (logBook) => {
    authHandler.showWrapper();
    setLogBook(logBook);
  };

  const hiddenUpdateHealthForm = () => {
    authHandler.hiddenWrapper();
    setLogBook();
  };

  const data = {
    temporaryData,
    logBooks,
  };
  const handler = {
    showUpdateHealthForm,
    hiddenUpdateHealthForm,
    setTemporaryData,
    setLogBooks,
  };

  return (
    <healthContext.Provider
      value={{ healthData: data, healthHandler: handler }}
    >
      {pathname !== "/cuoc-tro-chuyen" && (
        <MessageIcon rooms={rooms} />
      )}
      <LineChart
        logBook={logBook}
        setLogBook={setLogBook}
        hidden={hiddenUpdateHealthForm}
      />
      {children}
    </healthContext.Provider>
  );
};

export default HealthProvider;
