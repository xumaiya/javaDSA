import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 dark:bg-opacity-80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-surface dark:bg-dark-surface rounded-xl shadow-strong w-full border border-olive-light dark:border-dark-border',
          sizes[size],
          'max-h-[90vh] overflow-y-auto'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) ? (
          <div className="flex items-center justify-between p-6 border-b border-olive-light dark:border-dark-border">
            {title && (
              <h2 className="text-xl font-semibold text-olive-dark dark:text-dark-text">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="text-olive hover:text-olive-dark dark:text-dark-text-muted dark:hover:text-dark-text transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
        ) : null}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

