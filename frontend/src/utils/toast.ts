import { toast, ToastOptions } from "react-toastify";

export const success = (message: string, options?: ToastOptions) =>
  toast.success(message, options);
export const error = (message: string, options?: ToastOptions) =>
  toast.error(message, options);
export const info = (message: string, options?: ToastOptions) =>
  toast.info(message, options);
export const warning = (message: string, options?: ToastOptions) =>
  toast.warning(message, options);




