import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-dark-bg';
  
  const variants = {
    primary: 'bg-olive text-white hover:bg-olive-dark focus:ring-olive shadow-soft hover:shadow-medium transition-all dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-green-400 dark:focus:ring-dark-accent',
    secondary: 'bg-olive-light text-olive-dark hover:bg-olive focus:ring-olive shadow-soft dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface-hover dark:focus:ring-dark-accent',
    outline: 'border-2 border-olive text-olive hover:bg-olive-light focus:ring-olive bg-transparent dark:border-dark-border dark:text-dark-text dark:hover:bg-dark-surface dark:focus:ring-dark-accent',
    ghost: 'text-olive hover:bg-olive-light focus:ring-olive bg-transparent dark:text-dark-text dark:hover:bg-dark-surface dark:focus:ring-dark-accent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};







