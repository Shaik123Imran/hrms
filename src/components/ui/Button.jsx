import { Loader2 } from 'lucide-react';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

export default function Button({
  children,
  variant = 'primary',
  size,
  icon: Icon,
  loading = false,
  className = '',
  type = 'button',
  disabled,
  ...rest
}) {
  let buttonClass = 'btn-primary';
  if (variant === 'secondary') { 
    buttonClass = 'btn-secondary'; 
  } else if (variant === 'ghost') { 
    buttonClass = 'btn-ghost'; 
  } else if (variant === 'danger') {
     buttonClass = 'btn-danger'; 
    }
  if (size === 'sm') { 
    buttonClass = buttonClass + ' btn-sm'; 
  }
  if (className) { 
    buttonClass = buttonClass + ' ' + className; 

  }
  return (
    <button type={type} className={buttonClass} disabled= {loading || disabled} {...rest} > 
    {loading && ( 
      <Loader2 className="h-4 w-4 animate-spin" /> 
    )} 
    {!loading && Icon && ( 
      <Icon className="h-4 w-4" /> 
    )} 
    {children} 
    </button>
  );
}