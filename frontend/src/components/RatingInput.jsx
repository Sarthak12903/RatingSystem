export default function RatingInput({ value, onChange, disabled = false }) {
  return (
    <div className="flex gap-4 items-center">
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="flex-1"
        disabled={disabled}
      />
      <span className="text-3xl min-w-[60px] text-center">{value} ⭐</span>
    </div>
  );
}
