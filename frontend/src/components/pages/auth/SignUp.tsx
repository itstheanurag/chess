import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";
import BackButton from "@/components/ui/buttons/BackButton";
import FormInput from "@/components/InputField";
import Button from "@/components/ui/buttons/Button";

const Register: React.FC = () => {
  const { username, email, password, isLoading, setField, register } =
    useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isUsernameValid = username.trim().length > 2;
  const isFormValid = isUsernameValid && isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    await register();
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-100">
      <BackButton />

      <div className="bg-white rounded-lg shadow-lg border border-gray-300 p-8 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center shadow-md">
            <User className="text-white w-6 h-6" />
          </div>
          <p className="text-gray-600 ml-4">Create an account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Username */}
          <FormInput
            placeholder="Username"
            value={username}
            onChange={(val) => setField("username", val)}
            icon={User}
            error={
              !isUsernameValid && username.length > 0
                ? "Username must be at least 3 characters."
                : undefined
            }
          />

          {/* Email */}
          <FormInput
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(val) => setField("email", val)}
            icon={Mail}
            error={
              !isEmailValid && email.length > 0
                ? "Enter a valid email."
                : undefined
            }
          />

          {/* Password */}
          <FormInput
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(val) => setField("password", val)}
            icon={Lock}
            error={
              !isPasswordValid && password.length > 0
                ? "Password must be at least 6 characters."
                : undefined
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
            {isLoading ? "Creating Acount" : "Create an account"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
