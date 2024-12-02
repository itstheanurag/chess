import React, { useState } from "react";
import { toast } from "react-toastify";
import { loginUser, registerUser } from "../utils/http";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isLogin) {
        response = await loginUser(formData.username, formData.password);
      } else {
        response = await registerUser(formData.username, formData.password);
      }

      console.log(response)

      setMessage(response.message || "Success!");
      toast.success(response.message || "Operation successful!");
      if (isLogin && response.data?.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken); 
        localStorage.setItem("refreshToken", response.data.refreshToken); 
      }
    } catch (error: any) {
      setMessage(error);
      toast.error(error || "Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          {isLogin ? "Welcome Back!" : "Create an Account"}
        </h1>
        {message && (
          <p
            className={`text-center mb-4 ${message.includes("Success") ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Username field for registration and login */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline focus:outline-none"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
