import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";
import { useState } from "react";
import BackButton from "@/components/ui/buttons/BackButton";
import FormInput from "@/components/InputField";
import Button from "@/components/ui/buttons/SubmitButton";

const Login = () => {
  const navigate = useNavigate();
  const { email, password, isLoading, setField, login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    await login();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-100">
      <BackButton />

      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-md">
            <User className="text-white w-6 h-6" />
          </div>
          <p className="text-gray-600 ml-4">Sign in to continue</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(val) => setField("email", val)}
            icon={Mail}
            error={
              !isEmailValid && email.length > 0 ? "Enter a valid email." : ""
            }
          />

          <FormInput
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(val) => setField("password", val)}
            icon={Lock}
            error={
              !isPasswordValid && password.length > 0
                ? "Password must be at least 6 characters."
                : ""
            }
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-900 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            }
          />
          <Button type="submit" isLoading={isLoading} disabled={!isFormValid}>
            {isLoading ? "Signing In" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
