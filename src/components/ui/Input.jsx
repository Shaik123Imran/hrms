export default function Input({
  label,
  error,
  className = '',
  containerClassName = '',
  ...rest
}) {
  return (
    <div className={containerClassName}>
      
      {label && (
        <label className="field-label">
          {label}
        </label>
      )}

      <input
        className={`field-input ${error ? 'field-input-error' : ''} ${className}`}
        {...rest}
      />

      {error && (
        <p className="field-error">
          {error}
        </p>
      )}

    </div>
  );
}