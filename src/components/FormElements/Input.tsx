import React, { InputHTMLAttributes, forwardRef } from 'react';

// Define input variants
type InputVariant = 'default' | 'outlined' | 'underlined';
type InputSize = 'sm' | 'md' | 'lg';

// Extended input props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
}

// Variant and size classes
const variantClasses: Record<InputVariant, string> = {
  default: 'bg-transparent border border-stroke dark:border-dark-3 focus:border-primary dark:focus:border-primary',
  outlined: 'border-2 border-gray-300 focus:border-primary dark:border-gray-600',
  underlined: 'border-b-2 border-gray-300 focus:border-primary dark:border-gray-600 bg-transparent',
};

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  variant = 'default',
  size = 'md',
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const baseClasses = 'w-full font-medium text-dark dark:text-white outline-none transition-all';
  const errorClasses = error ? 'border-danger focus:border-danger' : '';

  const inputClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${errorClasses}
    ${className}
    ${icon ? 'pl-10' : ''}
  `.trim();

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={props.id} 
          className="mb-2.5 block text-sm font-medium text-dark dark:text-white"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            {icon}
          </span>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-xs text-danger">{error}</p>
      )}
    </div>
  );
});
