export default function RoleBadge({ role }) {
  const getBadgeClasses = () => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide";
    switch (role) {
      case "admin":
        return `${base} bg-danger/20 text-danger`;
      case "store_owner":
        return `${base} bg-warning/20 text-warning`;
      case "user":
      case "normal_user":
        return `${base} bg-success/20 text-success`;
      default:
        return `${base} bg-gray-500/20 text-gray-400`;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Admin";
      case "store_owner":
        return "Store Owner";
      case "user":
      case "normal_user":
        return "User";
      default:
        return role;
    }
  };

  return <span className={getBadgeClasses()}>{getRoleLabel()}</span>;
}
