import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'error' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                {
                    'bg-brand-100 text-brand-800': variant === 'default',
                    'bg-success-50 text-success-500': variant === 'success',
                    'bg-accent-100 text-accent-700': variant === 'warning',
                    'bg-red-100 text-red-700': variant === 'error',
                    'text-slate-500 border border-slate-200': variant === 'outline',
                },
                className
            )}
            {...props}
        />
    );
}
