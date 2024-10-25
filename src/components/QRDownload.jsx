import React from "react";

const QRDownload = ({ visible, hidden }) => {
  return (
    <div
      style={{
        width: visible === true ? "400px" : 0,
        height: visible === true ? "400px" : 0,
        transition: "0.5s",
      }}
      className="bg-[white] overflow-hidden z-50 rounded-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
    >
      <button onClick={() => hidden()}>
        <i className="bx bx-x absolute right-2 top-2 text-[30px] text-[#5e5e5e]"></i>
      </button>
      <div className="w-full h-full flex flex-col px-4 text-[14px] items-center py-4 gap-2">
        <span>
          Vui lòng quét mã bên dưới để tải ứng dụng nhé
        </span>
        <img src="/qr.jpg" className="w-[80%] h-[80%]" />
      </div>
    </div>
  );
};

export default QRDownload;
