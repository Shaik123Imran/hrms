export default function Card({
  title,
  subtitle,
  action,
  children,
  className = '',
  bodyClassName = '',
}) {
  return (
    <section className={`surface-card animate-in ${className}`}>
      
    {(title || subtitle || action) && (
    <header className="flex items-center justify-between gap-3 border-b border-ink-100 px-5 py-4">
        <div>
            {title && (
                <h3 className="text-sm font-semibold text-ink-800">
                    {title}
                </h3>
            )}

            {subtitle && (
                <p className="mt-0.5 text-xs text-ink-400">
                {subtitle}
                </p>
            )}
        </div>
        {action && ( <div> {action}</div>
        )}
        </header>
      )}
      <div className={`p-5 ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}