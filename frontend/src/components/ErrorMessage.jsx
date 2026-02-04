export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="bg-danger/20 border border-danger text-danger px-4 py-3 rounded-lg text-sm mb-5">
      {message}
    </div>
  );
}
