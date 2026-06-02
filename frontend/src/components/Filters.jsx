export default function Filters({ filters, setFilters }) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="border p-2"
        onChange={(e) =>
          setFilters({ ...filters, city: e.target.value })
        }
      >
        <option value="">All Cities</option>
        <option value="Chennai">Chennai</option>
        <option value="Mumbai">Mumbai</option>
      </select>

      <select
        className="border p-2"
        onChange={(e) =>
          setFilters({ ...filters, specialization: e.target.value })
        }
      >
        <option value="">Specialization</option>
        <option value="Cardiology">Cardiology</option>
        <option value="Dermatology">Dermatology</option>
      </select>

      <input
        type="range"
        min="200"
        max="2000"
        onChange={(e) =>
          setFilters({ ...filters, fee: e.target.value })
        }
      />
    </div>
  );
}