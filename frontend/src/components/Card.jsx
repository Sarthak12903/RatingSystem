export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-card rounded-xl p-6 shadow-lg border border-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}
