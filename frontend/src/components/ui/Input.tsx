import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm text-on-surface font-medium mb-1.5">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-4 py-2.5 text-sm
              bg-surface-container-low
              border border-outline-variant
              rounded-xl
              text-on-surface
              placeholder:text-outline/50
              smooth-transition
              focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:bg-surface
              hover:border-outline/30
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface-variant
              ${error ? 'border-error/50 focus:border-error/50 focus:ring-error/10' : ''}
              ${icon ? 'pl-11' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-error font-medium">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-on-surface-variant">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
