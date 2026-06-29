export default function TryDocSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select",
  error = "",
  required = false,
  disabled = false,
  className = "",
}) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <p className="mb-1 text-[10px] font-black uppercase text-slate-500">
          {label}
        </p>
      )}

      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`h-12 w-full rounded-2xl border bg-slate-50 px-3 text-sm font-black text-slate-800 outline-none transition focus:border-cyan-500 disabled:bg-slate-100 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs font-bold text-red-600">{error}</p>}
    </label>
  );
}