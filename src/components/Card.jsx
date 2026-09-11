export default function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children && <div className="card-body">{children}</div>}
    </div>
  );
}