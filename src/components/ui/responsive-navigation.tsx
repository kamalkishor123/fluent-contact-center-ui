
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Menu, X } from 'lucide-react';

interface ResponsiveNavigationProps {
  children: React.ReactNode;
  className?: string;
  mobileBreakpoint?: string;
}

export const ResponsiveNavigation = ({ 
  children, 
  className,
  mobileBreakpoint = 'md'
}: ResponsiveNavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('relative', className)}>
      {/* Mobile Toggle */}
      <div className={`${mobileBreakpoint}:hidden`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="interactive"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation Content */}
      <div className={cn(
        // Mobile styles
        `${mobileBreakpoint}:block`,
        isOpen ? 'block' : 'hidden',
        // Mobile dropdown
        `absolute top-full left-0 right-0 z-50 ${mobileBreakpoint}:relative ${mobileBreakpoint}:top-auto ${mobileBreakpoint}:left-auto ${mobileBreakpoint}:right-auto`,
        'bg-card border rounded-lg shadow-lg mt-2',
        `${mobileBreakpoint}:bg-transparent ${mobileBreakpoint}:border-none ${mobileBreakpoint}:shadow-none ${mobileBreakpoint}:mt-0`,
        'animate-fade-in'
      )}>
        <div className={`p-4 ${mobileBreakpoint}:p-0`}>
          {children}
        </div>
      </div>
    </div>
  );
};

interface MobileFirstGridProps {
  children: React.ReactNode;
  cols?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export const MobileFirstGrid = ({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 4,
  className 
}: MobileFirstGridProps) => {
  const gridCols = [
    `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ');

  return (
    <div className={cn(
      'grid',
      gridCols,
      `gap-${gap}`,
      className
    )}>
      {children}
    </div>
  );
};
