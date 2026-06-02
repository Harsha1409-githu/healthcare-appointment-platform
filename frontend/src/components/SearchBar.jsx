export default function SearchBar({ value, onChange }) {
  return (
    <input
      className="w-full p-3 border rounded-lg"
      placeholder="Search doctors, specialization..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}