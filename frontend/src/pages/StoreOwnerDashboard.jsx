import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { storeOwnerService } from "../services/api.jsx";
import { LoadingSpinner, ErrorMessage, PageTitle, Card } from "../components";

export default function StoreOwnerDashboard() {
  const { user } = useAuth();
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      if (!user?.storeId) {
        setError("No store assigned to your account");
        setLoading(false);
        return;
      }
      const response = await storeOwnerService.getStoreDetails(user.storeId);
      setStoreData(response.data);
    } catch (err) {
      setError("Failed to fetch store details");
      console.error("Failed to fetch store details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading store data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle>Store Owner Dashboard</PageTitle>

      {storeData && (
        <>
          <Card className="mb-6">
            <h3 className="text-2xl font-semibold mb-5">{storeData.name}</h3>
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-text-secondary">Email</span>
              <span>{storeData.email}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-800">
              <span className="text-text-secondary">Address</span>
              <span>{storeData.address || "Not set"}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 rounded-2xl p-6 border border-accent-cyan/30">
                <h3 className="text-text-secondary text-sm font-medium mb-2">
                  Average Rating
                </h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                  {storeData.average_rating
                    ? `${parseFloat(storeData.average_rating).toFixed(1)} ⭐`
                    : "N/A"}
                </div>
              </div>
              <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 rounded-2xl p-6 border border-accent-cyan/30">
                <h3 className="text-text-secondary text-sm font-medium mb-2">
                  Total Ratings
                </h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
                  {storeData.total_ratings || 0}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-xl font-semibold mb-6">User Ratings</h3>
            {storeData.ratings && storeData.ratings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-4 px-4 text-text-secondary font-medium">
                        User
                      </th>
                      <th className="text-left py-4 px-4 text-text-secondary font-medium">
                        Email
                      </th>
                      <th className="text-left py-4 px-4 text-text-secondary font-medium">
                        Rating
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeData.ratings.map((rating) => (
                      <tr
                        key={rating.id}
                        className="border-b border-gray-800 hover:bg-input/50"
                      >
                        <td className="py-4 px-4">{rating.user_name}</td>
                        <td className="py-4 px-4 text-text-secondary">
                          {rating.user_email}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-accent-cyan">
                            {rating.rating} ⭐
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-text-secondary">
                No ratings yet for this store.
              </p>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
