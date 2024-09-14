import React, { useEffect } from "react";

const HealthResponseForm = ({
  healthResponse,
  setHealthResponse,
}) => {
  // AI tu van suc khoe
  // phai import authHandler
  // bat form
  // authHandler.showHealthResponse(data)

  useEffect(() => {
    setTimeout(() => {
      setHealthResponse();
    }, 7000);
  }, [healthResponse]);

  return (
    <div
      style={{
        padding: healthResponse ? "10px 20px" : 0,
        transition: "0.5s",
      }}
      className="fixed max-w-[500px] bottom-[55px] right-[72px] bg-[#f9f9f9] text-[black] text-[14px] shadow-2xl rounded-lg z-[47] p-4"
    >
      {healthResponse?.message}
      {healthResponse && (
        <div
          style={{ transform: "rotate(180deg)" }}
          className="absolute bottom-[0px] right-[-5px] transform translate-x-2 translate-y-2 w-0 h-0 border-t-[10px] border-[#f9f9f9] border-l-[10px] border-l-transparent"
        ></div>
      )}
    </div>
  );
};

export default HealthResponseForm;
