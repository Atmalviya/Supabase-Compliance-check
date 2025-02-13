import { memo } from 'react';
import { twMerge } from 'tailwind-merge';

export const LoadingSpinner = memo(({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className={twMerge(
        'animate-spin rounded-full border-b-2 border-indigo-600',
        sizes[size],
        className
      )} />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner'; 