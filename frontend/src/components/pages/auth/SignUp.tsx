import { useAuthStore } from "@/stores";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const { username, email, password, isLoading, setField, register } =
    useAuthStore();
  const navigate = useNavigate();

  const isEmailValid = /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = username && isEmailValid && isPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    await register();
    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={username}
        onChange={(e) => setField("username", e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setField("email", e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setField("password", e.target.value)}
        placeholder="Password"
      />
      <button disabled={!isFormValid || isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
};

export default Register;
