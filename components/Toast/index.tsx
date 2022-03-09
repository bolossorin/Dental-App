import { toast, ToastPosition } from "react-toastify";

type ToastTypes = "info" | "warning" | "success" | "error";

interface IToastMessage {
  type: ToastTypes;
  message: string;
  position?: ToastPosition;
  autoClose?: number;
}
export type ISetNotofication = (arg: IToastMessage) => unknown;

const ToastMessage = ({ type, message, position, autoClose }: IToastMessage) =>
  toast[type](message, {
    position: position || "bottom-center",
    autoClose: autoClose ? autoClose * 1000 : 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });

ToastMessage.dismiss = toast.dismiss;

export default ToastMessage;
