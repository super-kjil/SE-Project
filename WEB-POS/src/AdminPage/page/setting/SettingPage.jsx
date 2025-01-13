import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { QRCodeCanvas } from "qrcode.react";
function SettingPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-10">
      <p>Scane for more</p>

      <QRCodeCanvas
        value={"https://picturesofpeoplescanningqrcodes.tumblr.com/"}
        title={"Title for my QR Code"}
        size={200}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"}
        imageSettings={{
          src: "https://static.zpao.com/favicon.png",
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          opacity: 1,
          excavate: true,
        }}
      />
    </div>
  );
}

export default SettingPage;
