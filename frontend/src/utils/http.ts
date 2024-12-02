import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post("/api/v1/auth/register", {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.message|| "Something went wrong during registration.";
  
    throw errorMessage;
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await axios.post("/api/v1/auth/login", {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage = error.message || "Something went wrong during login.";
    throw errorMessage; 
  }
};
