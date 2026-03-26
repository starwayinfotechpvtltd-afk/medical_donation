interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  centered?: boolean;
}

export function SectionHeading({
  title,
  subtitle,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-12`}>
      {subtitle && (
        <p className="text-emerald-500 font-semibold text-sm uppercase tracking-wide mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-balance">{title}</h2>
      {description && (
        <p className="text-slate-600 text-lg max-w-2xl mx-auto text-balance">{description}</p>
      )}
    </div>
  );
}
