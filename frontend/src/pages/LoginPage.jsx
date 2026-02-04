import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/api.jsx";
import { ErrorMessage } from "../components";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      const { token, user } = response.data;
      login(user, token);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "store_owner") {
        navigate("/store-owner/dashboard");
      } else {
        navigate("/user/stores");
      }
    } catch (err) {
      const error = err.response?.data?.error || "Login failed";
      setErrors({ general: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        <ErrorMessage message={errors.general} />

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="text-right mb-5">
            <Link
              to="/forgot-password"
              className="text-accent-cyan text-sm hover:text-accent-blue transition-colors"
            >
              Reset Password
            </Link>
          </div>

          <button
            type="submit"
            className="w-full px-5 py-3 rounded-lg font-semibold bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-glow-cyan hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-text-secondary">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-accent-cyan hover:text-accent-blue transition-colors"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
