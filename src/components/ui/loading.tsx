
import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export const LoadingSkeleton = ({ className, lines = 1 }: LoadingSkeletonProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-muted rounded animate-shimmer"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
};

interface LoadingCardProps {
  title?: boolean;
  content?: number;
  className?: string;
}

export const LoadingCard = ({ title = true, content = 3, className }: LoadingCardProps) => {
  return (
    <div className={cn('card-enhanced p-6 animate-fade-in', className)}>
      {title && (
        <div className="h-6 bg-muted rounded w-1/3 mb-4 animate-shimmer" />
      )}
      <div className="space-y-3">
        {Array.from({ length: content }).map((_, i) => (
          <div 
            key={i} 
            className="h-4 bg-muted rounded animate-shimmer"
            style={{ 
              width: `${Math.random() * 40 + 60}%`,
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({ visible, message = 'Loading...', className }: LoadingOverlayProps) => {
  if (!visible) return null;

  return (
    <div className={cn(
      'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in',
      className
    )}>
      <div className="flex flex-col items-center gap-3 p-6 rounded-lg bg-card shadow-lg border">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};
