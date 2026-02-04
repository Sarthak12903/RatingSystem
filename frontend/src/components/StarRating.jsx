export default function StarRating({ rating, showNumber = true }) {
  const numRating = parseFloat(rating) || 0;

  if (numRating === 0) {
    return <span className="text-text-muted">No ratings</span>;
  }

  return (
    <span className="flex items-center gap-1">
      {showNumber && <span>{numRating.toFixed(1)}</span>}
      <span className="text-yellow-400">★</span>
    </span>
  );
}
