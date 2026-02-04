import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api.jsx";
import {
  LoadingSpinner,
  RoleBadge,
  PageTitle,
  Card,
  Button,
} from "../components";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers(1, 100);
      const usersData = response.data.data || response.data || [];
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...users];

    if (filters.name) {
      result = result.filter((user) =>
        user.name.toLowerCase().includes(filters.name.toLowerCase()),
      );
    }
    if (filters.email) {
      result = result.filter((user) =>
        user.email.toLowerCase().includes(filters.email.toLowerCase()),
      );
    }
    if (filters.address) {
      result = result.filter((user) =>
        (user.address || "")
          .toLowerCase()
          .includes(filters.address.toLowerCase()),
      );
    }
    if (filters.role) {
      result = result.filter((user) => user.role === filters.role);
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key] || "";
      let bVal = b[sortConfig.key] || "";
      if (sortConfig.direction === "asc") {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });

    setFilteredUsers(result);
  }, [users, filters, sortConfig]);

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

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminService.deleteUser(id);
        fetchUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading users..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <PageTitle className="mb-0">User Management</PageTitle>
        <Link to="/admin/users/add">
          <Button>Add User</Button>
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
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="flex-1 min-w-[150px] px-4 py-2 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </select>
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
                  onClick={() => handleSort("role")}
                  className="text-left py-4 px-4 text-text-secondary font-medium cursor-pointer hover:text-accent-cyan"
                >
                  Role{" "}
                  {sortConfig.key === "role" &&
                    (sortConfig.direction === "asc" ? "▲" : "▼")}
                </th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-800 hover:bg-input/50"
                >
                  <td className="py-4 px-4">{user.name}</td>
                  <td className="py-4 px-4 text-text-secondary">
                    {user.email}
                  </td>
                  <td className="py-4 px-4 text-text-secondary">
                    {user.address || "-"}
                  </td>
                  <td className="py-4 px-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <Link to={`/admin/users/${user.id}`}>
                        <Button variant="secondary" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link to={`/admin/users/${user.id}/edit`}>
                        <Button size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
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
