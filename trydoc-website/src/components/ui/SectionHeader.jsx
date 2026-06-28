export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) {
  const alignment =
    align === "left" ? "text-left mx-0" : "text-center mx-auto";

  return (
    <div className={`mb-14 max-w-3xl ${alignment}`}>
      <p className="td-eyebrow">{eyebrow}</p>

      <h2 className="mt-4 td-heading-xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}