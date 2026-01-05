import { forwardRef } from 'react';
import { cn } from '@/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border px-4 py-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
            'bg-white text-gray-900 placeholder:text-gray-500', // Fixed: Added text color
            startIcon && 'pl-10',
            endIcon && 'pr-10',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50 text-gray-900' // Fixed: Added text color for error state
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20 hover:border-gray-400',
            className
          )}
          {...props}
        />
        {endIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {endIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };