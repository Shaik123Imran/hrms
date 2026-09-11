export default function Button({ variant = 'primary', size, type = 'button', className = '', children, ...props }) {
  const classNames = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classNames} {...props}>
      {children}
    </button>
  );
}