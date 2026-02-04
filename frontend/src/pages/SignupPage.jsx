import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { authService } from "../services/api.jsx";
import { ErrorMessage } from "../components";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await authService.signup(
        formData.name,
        formData.email,
        formData.password,
        formData.address,
      );
      const { token, user } = response.data;
      login(user, token);
      navigate("/user/stores");
    } catch (err) {
      const errorData = err.response?.data;
      if (Array.isArray(errorData?.errors)) {
        setErrors({ general: errorData.errors.join(", ") });
      } else {
        setErrors({ general: errorData?.error || "Signup failed" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8">Sign Up</h2>

        <ErrorMessage message={errors.general} />

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address (optional)"
              rows="3"
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-5 py-3 rounded-lg font-semibold bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-glow-cyan hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-accent-cyan hover:text-accent-blue transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
