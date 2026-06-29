import { Loader2 } from "lucide-react";

export default function TryDocButton({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  icon: Icon,
  onClick,
  className = "",
}) {
  const variants = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-700",
    dark: "bg-slate-950 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700",
    warning: "bg-orange-500 text-white hover:bg-orange-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  const sizes = {
    sm: "h-10 px-3 text-xs",
    md: "h-12 px-4 text-sm",
    lg: "h-14 px-5 text-base",
  };

  const FinalLeftIcon = LeftIcon || Icon;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-black transition active:scale-95 disabled:pointer-events-none disabled:bg-slate-300 disabled:text-white ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <Loader2 size={17} className="animate-spin" />
      ) : FinalLeftIcon ? (
        <FinalLeftIcon size={17} />
      ) : null}

      {children}

      {!loading && RightIcon && <RightIcon size={17} />}
    </button>
  );
}