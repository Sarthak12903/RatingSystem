export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
}) {
  const baseClasses =
    "font-semibold cursor-pointer transition-all duration-200 border-none rounded-lg";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-glow-cyan hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0",
    secondary: "bg-card text-white border border-gray-600 hover:bg-input",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:opacity-90",
    ghost:
      "bg-transparent text-danger border border-danger hover:bg-danger hover:text-white",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
