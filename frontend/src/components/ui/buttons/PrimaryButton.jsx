import { Loader2 } from "lucide-react";

export default function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = true,
  icon: Icon,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-2xl
        px-5 py-3
        text-sm font-black
        transition-all duration-200
        active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed
        bg-cyan-600
        text-white
        hover:bg-cyan-700
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        Icon && <Icon size={18} />
      )}

      {children}
    </button>
  );
}
