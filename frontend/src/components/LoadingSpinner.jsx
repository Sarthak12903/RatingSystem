export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-10 h-10 border-4 border-input border-t-accent-cyan rounded-full animate-spin mb-4"></div>
      <span className="text-text-secondary">{message}</span>
    </div>
  );
}
