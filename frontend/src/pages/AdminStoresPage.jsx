import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api.jsx";
import { LoadingSpinner, PageTitle, Card, Button } from "../components";

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await adminService.getStores(1, 100);
      const storesData = response.data.data || response.data || [];
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
    if (filters.email) {
      result = result.filter((store) =>
        store.email.toLowerCase().includes(filters.email.toLowerCase()),
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

  const deleteStore = async (id) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await adminService.deleteStore(id);
        fetchStores();
      } catch (err) {
        console.error("Failed to delete store", err);
      }
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
      <div className="flex justify-between items-center mb-8">
        <PageTitle className="mb-0">Store Management</PageTitle>
        <Link to="/admin/stores/add">
          <Button>Add Store</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            name="name"
            placeholder="Filter by name"
            value={filters.name}
            onChange={handleFilterChange}
            className="flex-1 min-w-[150px] px-4 py-2 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by email"
            value={filters.email}
            onChange={handleFilterChange}
            className="flex-1 min-w-[150px] px-4 py-2 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by address"
            value={filters.address}
            onChange={handleFilterChange}
            className="flex-1 min-w-[150px] px-4 py-2 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
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
                  onClick={() => handleSort("email")}
                  className="text-left py-4 px-4 text-text-secondary font-medium cursor-pointer hover:text-accent-cyan"
                >
                  Email{" "}
                  {sortConfig.key === "email" &&
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
                  Rating{" "}
                  {sortConfig.key === "average_rating" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">
                  Actions
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
                    {store.email}
                  </td>
                  <td className="py-4 px-4 text-text-secondary">
                    {store.address || "-"}
                  </td>
                  <td className="py-4 px-4">
                    {store.average_rating ? (
                      <span className="text-accent-cyan">
                        {parseFloat(store.average_rating).toFixed(1)} ⭐
                      </span>
                    ) : (
                      <span className="text-text-secondary">No ratings</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/stores/${store.id}/edit`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteStore(store.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
