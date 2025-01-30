import React, { ReactNode } from 'react';

// Card variant types
type CardVariant = 'default' | 'elevated' | 'outlined';
type CardSize = 'sm' | 'md' | 'lg';

// Card props interface
interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  className?: string;
  title?: string;
  footer?: ReactNode;
  onClick?: () => void;
}

// Variant and size classes
const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white dark:bg-gray-dark shadow-default',
  elevated: 'bg-white dark:bg-gray-dark shadow-lg hover:shadow-xl transition-shadow',
  outlined: 'bg-white dark:bg-gray-dark border border-stroke dark:border-dark-3',
};

const sizeClasses: Record<CardSize, string> = {
  sm: 'p-4 rounded-md',
  md: 'p-6 rounded-lg',
  lg: 'p-8 rounded-xl',
};

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  title,
  footer,
  onClick,
}) => {
  const baseClasses = 'flex flex-col overflow-hidden';
  const interactiveClasses = onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : '';

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${interactiveClasses}
    ${className}
  `.trim();

  return (
    <div 
      className={combinedClasses} 
      onClick={onClick}
    >
      {title && (
        <div className="border-b border-stroke dark:border-dark-3 px-6 py-4">
          <h3 className="text-xl font-semibold text-dark dark:text-white">
            {title}
          </h3>
        </div>
      )}
      
      <div className="flex-grow p-6">
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-stroke dark:border-dark-3 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
};
