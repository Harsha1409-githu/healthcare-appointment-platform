export default function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="td-card td-card-hover">
      <div className="td-icon">
        <Icon size={26} />
      </div>

      <h3 className="mt-6 text-2xl font-black tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-base leading-7 text-slate-600">
        {text}
      </p>
    </div>
  );
}