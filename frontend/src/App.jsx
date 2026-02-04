import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import UpdatePasswordPage from "./pages/UpdatePasswordPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsersPage from "./pages/AdminUsersPage.jsx";
import AdminStoresPage from "./pages/AdminStoresPage.jsx";
import AddUserPage from "./pages/AddUserPage.jsx";
import AddStorePage from "./pages/AddStorePage.jsx";
import ViewUserPage from "./pages/ViewUserPage.jsx";
import EditUserPage from "./pages/EditUserPage.jsx";
import EditStorePage from "./pages/EditStorePage.jsx";
import UserStoresPage from "./pages/UserStoresPage.jsx";
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard.jsx";
import "./styles/index.css";

function PrivateRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-black/90 border-b border-accent-cyan py-4 px-6 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent"
        >
          Rating System
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-text-secondary hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className="text-text-secondary hover:text-white transition-colors"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className="text-text-secondary hover:text-white transition-colors"
                  >
                    Stores
                  </Link>
                </>
              )}
              {user?.role === "user" && (
                <Link
                  to="/user/stores"
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  Stores
                </Link>
              )}
              {user?.role === "store_owner" && (
                <Link
                  to="/store-owner/dashboard"
                  className="text-text-secondary hover:text-white transition-colors"
                >
                  My Store
                </Link>
              )}
              <Link
                to="/update-password"
                className="text-text-secondary hover:text-white transition-colors"
              >
                Change Password
              </Link>
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">{user?.name}</span>
                <button
                  onClick={logout}
                  className="bg-transparent text-danger border border-danger px-4 py-2 rounded-lg text-sm hover:bg-danger hover:text-white transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-text-secondary hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-text-secondary hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  const getHomeRedirect = () => {
    if (!isAuthenticated) return "/login";
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "store_owner") return "/store-owner/dashboard";
    return "/user/stores";
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getHomeRedirect()} />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <LoginPage />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to={getHomeRedirect()} /> : <SignupPage />
        }
      />
      <Route
        path="/update-password"
        element={
          <PrivateRoute>
            <UpdatePasswordPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute roles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute roles={["admin"]}>
            <AdminUsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/add"
        element={
          <PrivateRoute roles={["admin"]}>
            <AddUserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <PrivateRoute roles={["admin"]}>
            <ViewUserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users/:id/edit"
        element={
          <PrivateRoute roles={["admin"]}>
            <EditUserPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <PrivateRoute roles={["admin"]}>
            <AdminStoresPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/stores/add"
        element={
          <PrivateRoute roles={["admin"]}>
            <AddStorePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/stores/:id/edit"
        element={
          <PrivateRoute roles={["admin"]}>
            <EditStorePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/user/stores"
        element={
          <PrivateRoute roles={["user"]}>
            <UserStoresPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/store-owner/dashboard"
        element={
          <PrivateRoute roles={["store_owner"]}>
            <StoreOwnerDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
