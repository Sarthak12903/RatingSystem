export default function PageTitle({ children, className = "" }) {
  return (
    <h2
      className={`text-3xl font-bold bg-gradient-to-r from-accent-cyan to-accent-blue bg-clip-text text-transparent mb-8 ${className}`}
    >
      {children}
    </h2>
  );
}
