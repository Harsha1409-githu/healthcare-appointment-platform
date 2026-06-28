export default function Button({
  children,
  href,
  variant = "primary",
  className = "",
}) {
  const styles = {
    primary: "td-primary-btn",
    secondary: "td-secondary-btn",
    dark: "inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-950 px-7 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-cyan-600 active:scale-95",
  };

  return (
    <a href={href} className={`${styles[variant]} ${className}`}>
      {children}
    </a>
  );
}