import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api.jsx";
import { ErrorMessage, SuccessMessage, Button } from "../components";

export default function UpdatePasswordPage() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
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

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ general: "New passwords do not match" });
      return;
    }

    setLoading(true);

    try {
      await authService.updatePassword(
        formData.oldPassword,
        formData.newPassword,
      );
      setSuccessMessage("Password updated successfully");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (err) {
      setErrors({
        general: err.response?.data?.error || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-card rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8">Update Password</h2>

        <SuccessMessage message={successMessage} />
        <ErrorMessage message={errors.general} />

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-text-secondary mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter your current password"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Updating..." : "Update Password"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
