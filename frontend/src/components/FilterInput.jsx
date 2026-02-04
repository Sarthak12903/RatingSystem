export default function FilterInput({
  name,
  placeholder,
  value,
  onChange,
  className = "",
}) {
  return (
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`flex-1 min-w-[200px] px-4 py-3 bg-input border border-gray-700 rounded-lg text-white focus:outline-none focus:border-accent-cyan ${className}`}
    />
  );
}
