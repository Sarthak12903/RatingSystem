import { useState, useEffect } from "react";
import { userService } from "../services/api.jsx";
import {
  LoadingSpinner,
  Modal,
  RatingInput,
  FilterInput,
  PageTitle,
  StarRating,
  Card,
  Button,
} from "../components";

export default function UserStoresPage() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [ratingStore, setRatingStore] = useState(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await userService.getStores(1, 100);
      const storesData =
        response.data.data || response.data.stores || response.data || [];
      setStores(storesData);
      setFilteredStores(storesData);
    } catch (err) {
      console.error("Failed to fetch stores", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...stores];

    if (filters.name) {
      result = result.filter((store) =>
        store.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.address) {
      result = result.filter((store) =>
        (store.address || "")
          .toLowerCase()
          .includes(filters.address.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key] || "";
      let bVal = b[sortConfig.key] || "";
      if (typeof aVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setFilteredStores(result);
  }, [stores, filters, sortConfig]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRatingSubmit = async () => {
    if (!ratingStore) return;
    setSubmittingRating(true);

    try {
      await userService.submitRating(ratingStore.id, ratingValue);
      setRatingStore(null);
      fetchStores();
    } catch (err) {
      console.error("Failed to submit rating", err);
      alert(err.response?.data?.error || "Failed to submit rating");
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading stores..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle>Browse Stores</PageTitle>

      <Card className="mb-6">
        <div className="flex gap-4 flex-wrap">
          <FilterInput
            name="name"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <FilterInput
            name="address"
            placeholder="Filter by address"
            value={filters.address}
            onChange={handleFilterChange}
          />
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th
                  onClick={() => handleSort("name")}
                  className="text-left py-4 px-4 text-text-secondary font-medium cursor-pointer hover:text-accent-cyan"
                >
                  Name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("address")}
                  className="text-left py-4 px-4 text-text-secondary font-medium cursor-pointer hover:text-accent-cyan"
                >
                  Address{" "}
                  {sortConfig.key === "address" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th
                  onClick={() => handleSort("average_rating")}
                  className="text-left py-4 px-4 text-text-secondary font-medium cursor-pointer hover:text-accent-cyan"
                >
                  Overall Rating{" "}
                  {sortConfig.key === "average_rating" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">
                  Your Rating
                </th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr
                  key={store.id}
                  className="border-b border-gray-800 hover:bg-input/50"
                >
                  <td className="py-4 px-4">{store.name}</td>
                  <td className="py-4 px-4 text-text-secondary">
                    {store.address || "-"}
                  </td>
                  <td className="py-4 px-4">
                    <StarRating rating={store.rating} />
                  </td>
                  <td className="py-4 px-4">
                    {store.user_rating ? (
                      <span className="text-accent-cyan">
                        {store.user_rating} ⭐
                      </span>
                    ) : (
                      <span className="text-text-secondary">Not rated</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <Button
                      size="sm"
                      onClick={() => {
                        setRatingStore(store);
                        setRatingValue(store.user_rating || 5);
                      }}
                    >
                      {store.user_rating ? "Update" : "Rate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={!!ratingStore}
        onClose={() => setRatingStore(null)}
        title={ratingStore ? `Rate ${ratingStore.name}` : ""}
      >
        <div className="mb-5">
          <label className="block text-text-secondary mb-2">
            Your Rating (1-5)
          </label>
          <RatingInput value={ratingValue} onChange={setRatingValue} />
        </div>
        <div className="flex gap-3 mt-6">
          <Button onClick={handleRatingSubmit} disabled={submittingRating}>
            {submittingRating ? "Submitting..." : "Submit Rating"}
          </Button>
          <Button variant="secondary" onClick={() => setRatingStore(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
