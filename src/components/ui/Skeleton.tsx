import { cn } from '../../utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton = ({ className, variant = 'rectangular' }: SkeletonProps) => {
  const baseStyles = 'animate-pulse bg-olive-light dark:bg-dark-surface';
  
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} />
  );
};







