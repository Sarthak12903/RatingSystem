export default function SuccessMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-success/20 border border-success text-success px-4 py-3 rounded-lg text-sm mb-5">
      {message}
    </div>
  );
}
