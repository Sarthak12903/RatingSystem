import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../services/api.jsx";
import { ErrorMessage, PageTitle, Card, Button } from "../components";

export default function AddStorePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [storeOwners, setStoreOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const fetchStoreOwners = async () => {
    try {
      const response = await adminService.getUsers(1, 100);
      const usersData = response.data.data || response.data || [];
      const owners = usersData.filter((user) => user.role === "store_owner");
      setStoreOwners(owners);
    } catch (err) {
      console.error("Failed to fetch store owners", err);
    }
  };

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
      await adminService.addStore(formData);
      navigate("/admin/stores");
    } catch (err) {
      const errorData = err.response?.data;
      if (Array.isArray(errorData?.errors)) {
        setErrors({ general: errorData.errors.join(", ") });
      } else {
        setErrors({ general: errorData?.error || "Failed to create store" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card>
        <PageTitle>Add New Store</PageTitle>

        <ErrorMessage message={errors.general} />

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-text-secondary mb-2">Store Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter store name"
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
              placeholder="Enter store email"
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
              placeholder="Enter store address"
              rows="3"
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan resize-none"
            />
          </div>

          <div className="mb-5">
            <label className="block text-text-secondary mb-2">
              Store Owner
            </label>
            <select
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
            >
              <option value="">Select Owner</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Store"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/stores")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
