import axios from "axios";

export const handleError = (err: unknown): null => {
  if (axios.isAxiosError(err)) {
    const message = err.response?.data?.error || err.message;
    console.error("Axios error:", message);
  } else if (err instanceof Error) {
    console.error("Error:", err.message);
  } else {
    console.error("Unknown error:", err);
  }

  return null;
};
