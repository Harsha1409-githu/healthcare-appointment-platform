export default function TryDocPage({
  children,
  className = "",
  maxWidth = "max-w-md",
  padding = "px-3",
}) {
  return (
    <div className={`mx-auto w-full ${maxWidth} ${padding} ${className}`}>
      {children}
    </div>
  );
}