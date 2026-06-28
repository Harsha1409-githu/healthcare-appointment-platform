export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <p className="mb-1.5 text-xs font-black text-slate-700">{label}</p>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-900 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
      />
    </label>
  );
}