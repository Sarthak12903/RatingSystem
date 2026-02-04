import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/api.jsx";
import { ErrorMessage, PageTitle, Card, Button } from "../components";

export default function AddUserPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "normal_user",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
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
      await adminService.addUser(formData);
      navigate("/admin/users");
    } catch (err) {
      const errorData = err.response?.data;
      if (Array.isArray(errorData?.errors)) {
        setErrors({ general: errorData.errors.join(", ") });
      } else {
        setErrors({ general: errorData?.error || "Failed to create user" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card>
        <PageTitle>Add New User</PageTitle>

        <ErrorMessage message={errors.general} />

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-text-secondary mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              rows="3"
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            >
              <option value="normal_user">Normal User</option>
              <option value="admin">Admin</option>
              <option value="store_owner">Store Owner</option>
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
