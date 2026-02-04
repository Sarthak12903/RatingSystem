import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../services/api.jsx";
import {
  LoadingSpinner,
  ErrorMessage,
  RoleBadge,
  PageTitle,
  Card,
  Button,
} from "../components";

export default function ViewUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await adminService.getUserById(id);
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading user..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-8">
        <ErrorMessage message="User not found" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Card>
        <PageTitle>User Details</PageTitle>

        <div className="flex justify-between py-3 border-b border-gray-800">
          <span className="text-text-secondary">Name</span>
          <span>{user.name}</span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-800">
          <span className="text-text-secondary">Email</span>
          <span>{user.email}</span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-800">
          <span className="text-text-secondary">Address</span>
          <span>{user.address || "Not provided"}</span>
        </div>

        <div className="flex justify-between py-3 border-b border-gray-800">
          <span className="text-text-secondary">Role</span>
          <RoleBadge role={user.role} />
        </div>

        {user.stores && user.stores.length > 0 && (
          <div className="py-3 border-b border-gray-800">
            <span className="text-text-secondary block mb-3">Owned Stores</span>
            <div className="space-y-2">
              {user.stores.map((store) => (
                <div
                  key={store.id}
                  className="flex justify-between items-center bg-input/50 rounded-lg px-4 py-2"
                >
                  <span>{store.name}</span>
                  <span className="text-accent-cyan">
                    {store.average_rating
                      ? `${store.average_rating} ⭐`
                      : "No ratings"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.ratings && user.ratings.length > 0 && (
          <div className="py-3 border-b border-gray-800">
            <span className="text-text-secondary block mb-3">
              Given Ratings
            </span>
            <div className="space-y-2">
              {user.ratings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex justify-between items-center bg-input/50 rounded-lg px-4 py-2"
                >
                  <span>{rating.store_name}</span>
                  <span className="text-accent-cyan">{rating.rating} ⭐</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <Button onClick={() => navigate(`/admin/users/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="secondary" onClick={() => navigate("/admin/users")}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}
