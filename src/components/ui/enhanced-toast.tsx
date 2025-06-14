
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import { Button } from './button';

export interface EnhancedToastProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  className?: string;
}

const variantStyles = {
  success: {
    bg: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
    descColor: 'text-green-700 dark:text-green-300'
  },
  error: {
    bg: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
    icon: XCircle,
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
    descColor: 'text-red-700 dark:text-red-300'
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800',
    icon: AlertCircle,
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
    descColor: 'text-amber-700 dark:text-amber-300'
  },
  info: {
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
    descColor: 'text-blue-700 dark:text-blue-300'
  }
};

export const EnhancedToast = ({
  variant = 'info',
  title,
  description,
  action,
  onClose,
  className
}: EnhancedToastProps) => {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className={cn(
        'relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm animate-slide-in-right',
        styles.bg,
        className
      )}
    >
      <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', styles.iconColor)} />
      
      <div className="flex-1 space-y-1">
        <h3 className={cn('text-sm font-medium', styles.titleColor)}>
          {title}
        </h3>
        {description && (
          <p className={cn('text-sm', styles.descColor)}>
            {description}
          </p>
        )}
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="mt-2 h-8 text-xs"
          >
            {action.label}
          </Button>
        )}
      </div>
      
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-black/10 dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
