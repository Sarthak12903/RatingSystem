import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../services/api.jsx";
import { LoadingSpinner, PageTitle, Card, Button } from "../components";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageTitle>Admin Dashboard</PageTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 rounded-2xl p-6 border border-accent-cyan/30">
          <h3 className="text-text-secondary text-sm font-medium mb-2">
            Total Users
          </h3>
          <div className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            {stats.totalUsers}
          </div>
        </div>
        <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 rounded-2xl p-6 border border-accent-cyan/30">
          <h3 className="text-text-secondary text-sm font-medium mb-2">
            Total Stores
          </h3>
          <div className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            {stats.totalStores}
          </div>
        </div>
        <div className="bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 rounded-2xl p-6 border border-accent-cyan/30">
          <h3 className="text-text-secondary text-sm font-medium mb-2">
            Total Ratings
          </h3>
          <div className="text-4xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent">
            {stats.totalRatings}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold mb-3">User Management</h3>
          <p className="text-text-secondary mb-5">
            Manage all users in the system
          </p>
          <Link to="/admin/users">
            <Button>Manage Users</Button>
          </Link>
        </Card>
        <Card>
          <h3 className="text-xl font-semibold mb-3">Store Management</h3>
          <p className="text-text-secondary mb-5">
            Manage all stores and their owners
          </p>
          <Link to="/admin/stores">
            <Button>Manage Stores</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
