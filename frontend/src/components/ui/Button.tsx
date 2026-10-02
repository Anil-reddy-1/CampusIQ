import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center gap-2 font-medium rounded-xl smooth-transition focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
      primary:
        'bg-primary text-on-primary hover:bg-primary-hover shadow-sm hover:shadow-md active:scale-[0.98]',
      secondary:
        'bg-secondary text-on-secondary hover:bg-secondary-hover shadow-sm hover:shadow-md active:scale-[0.98]',
      outline:
        'bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container-low hover:border-outline/40 active:bg-surface-container',
      ghost:
        'bg-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface active:bg-surface-container',
      danger: 'bg-error text-on-error hover:opacity-90 shadow-sm hover:shadow-md active:scale-[0.98]',
    };

    const sizeClasses = {
      sm: 'px-3.5 py-2 text-sm h-9',
      md: 'px-5 py-2.5 text-sm h-10',
      lg: 'px-6 py-3 text-sm h-11',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
