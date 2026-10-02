import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'default';
  size?: 'sm' | 'md';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'neutral', size = 'md', className = '', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full smooth-transition';

    const variantClasses = {
      success: 'bg-success-light text-secondary',
      warning: 'bg-warning-light text-tertiary',
      error: 'bg-error-container text-error',
      info: 'bg-primary-light text-primary',
      neutral: 'bg-surface-container text-on-surface-variant',
      default: 'bg-surface-container text-on-surface-variant',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[11px] tracking-wide font-semibold',
      md: 'px-2.5 py-0.5 text-xs font-medium',
    };

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
