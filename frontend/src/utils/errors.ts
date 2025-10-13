import axios from "axios";
import { errorToast } from "./toast";

export const handleError = (err: unknown): null => {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.error || err.message;
    console.error("Axios error:", message);
    errorToast(message);
  } else if (err instanceof Error) {
    console.error("Error:", err.message);
    errorToast(err.message);
  }

  return null;
};
