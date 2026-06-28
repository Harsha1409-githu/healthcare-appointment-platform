export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  muted = false,
}) {
  return (
    <section id={id} className={`${muted ? "bg-white" : ""} td-section`}>
      <div className="td-section-inner">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="td-eyebrow">{eyebrow}</p>

          <h2 className="mt-4 td-heading-xl">
            {title}
          </h2>

          {subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </section>
  );
}