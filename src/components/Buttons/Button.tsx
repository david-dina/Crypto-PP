import React, { ReactNode } from 'react';
import Link from 'next/link';

// Define variant types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Button props interface
interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
}

// Variant and size classes
const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border border-primary text-primary hover:bg-primary-light',
  text: 'bg-transparent text-primary hover:bg-primary-light',
  danger: 'bg-danger text-white hover:bg-danger-dark',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  href,
  type = 'button',
  disabled = false,
  onClick,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none';
  const disabledClasses = 'opacity-50 cursor-not-allowed';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? disabledClasses : ''}
    ${className}
  `.trim();

  // If href is provided, render as a link
  if (href) {
    return (
      <Link 
        href={href} 
        className={combinedClasses}
        aria-disabled={disabled}
      >
        {children}
      </Link>
    );
  }

  // Otherwise, render as a button
  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
