import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  style?: React.CSSProperties;
}

export const Card = ({ children, className, onClick, hover = false, style }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-surface rounded-xl shadow-soft p-6 border border-olive-light',
        'dark:bg-dark-surface dark:border-dark-border',
        hover && 'transition-all hover:scale-[1.02] hover:shadow-medium cursor-pointer dark:hover:bg-dark-surface-hover',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className }: CardHeaderProps) => {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className }: CardTitleProps) => {
  return (
    <h3 className={cn('text-xl font-semibold text-olive-dark dark:text-dark-text', className)}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className }: CardContentProps) => {
  return (
    <div className={cn('text-text-light dark:text-dark-text-muted', className)}>
      {children}
    </div>
  );
};







