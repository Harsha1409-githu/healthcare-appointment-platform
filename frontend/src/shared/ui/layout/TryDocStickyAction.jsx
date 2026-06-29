export default function TryDocStickyAction({
  children,
  className = "",
}) {
  return (
    <div
      className={`sticky bottom-0 z-30 -mx-3 mt-4 border-t border-slate-100 bg-white/95 px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}