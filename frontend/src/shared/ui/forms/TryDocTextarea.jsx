export default function TryDocTextarea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
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

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        className={`w-full resize-none rounded-2xl border bg-slate-50 px-3 py-3 text-sm font-bold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 disabled:bg-slate-100 ${
          error ? "border-red-300" : "border-slate-200"
        }`}
      />

      {error && (
        <p className="mt-1 text-xs font-bold text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}