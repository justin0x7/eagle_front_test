import React from "react";

// auth
import idImage from "./images/auth/id.svg";
import secureImage from "./images/auth/secure.svg";

export const IdImage = () => <img src={idImage} alt="idImage" />;
export const SecureImage = () => <img src={secureImage} alt="secureImage" />;

// qr code
import qrcodeIconImage from "./images/icons/qr-code.svg";

export const QRCodeIconImage = () => <img src={qrcodeIconImage} width={30} height={30} alt="qrcodeIconImage" />;

// status icons
import todoIconImage from "./images/icons/todo.svg";
import doneIconImage from "./images/icons/done.svg";
import lossIconImage from "./images/icons/loss.svg";
import comingIconImage from "./images/icons/coming.svg";

export const TodoIconImage = () => <img src={todoIconImage} alt="todoIconImage" width="24" />;
export const DoneIconImage = () => <img src={doneIconImage} alt="doneIconImage" width="24" />;
export const LossIconImage = () => <img src={lossIconImage} alt="lossIconImage" width="24" />;
export const ComingIconImage = () => <img src={comingIconImage} alt="comingIconImage" width="24" />;