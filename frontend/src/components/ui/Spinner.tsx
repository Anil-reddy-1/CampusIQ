import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 36,
  };

  const px = sizeMap[size];

  return (
    <div
      className={`spinner ${className}`}
      style={{ width: px, height: px, minWidth: px, minHeight: px }}
      role="status"
      aria-label="Loading"
    />
  );
};
