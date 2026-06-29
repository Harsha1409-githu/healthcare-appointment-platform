import { Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

export default function TryDocInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  helperText = "",
  error = "",
  required = false,
  disabled = false,
  readOnly = false,
  clearable = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  prefix,
  suffix,
  maxLength,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <label className={`block ${className}`}>
      {label && (
        <div className="mb-1 flex items-center gap-1">
          <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">
            {label}
          </span>

          {required && (
            <span className="text-red-500">*</span>
          )}
        </div>
      )}

      <div
        className={`flex h-12 items-center rounded-2xl border bg-slate-50 transition ${
          error
            ? "border-red-300"
            : "border-slate-200 focus-within:border-cyan-500"
        }`}
      >
        {LeftIcon && (
          <div className="px-3 text-slate-400">
            <LeftIcon size={18} />
          </div>
        )}

        {prefix && (
          <div className="px-3 text-sm font-bold text-slate-500">
            {prefix}
          </div>
        )}

        <input
          className="flex-1 bg-transparent px-1 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400"
          value={value}
          onChange={onChange}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
        />

        {suffix && (
          <div className="px-3 text-sm font-bold text-slate-500">
            {suffix}
          </div>
        )}

        {clearable && value && (
          <button
            type="button"
            onClick={() =>
              onChange({
                target: {
                  value: "",
                },
              })
            }
            className="px-2 text-slate-400"
          >
            <X size={16} />
          </button>
        )}

        {type === "password" && (
          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="px-3 text-slate-400"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}

        {RightIcon && (
          <div className="px-3 text-slate-400">
            <RightIcon size={18} />
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-xs font-bold text-red-600">
          {error}
        </p>
      )}
    </label>
  );
}