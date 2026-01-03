'use client';

import * as React from 'react';
import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> {
  label: string;
  error?: string | null;
  onChange: (value: string) => void;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      type = 'text',
      error,
      value,
      onChange,
      className,
      onBlur,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={cn('group space-y-2', className)}>
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-white/60"
        >
          {label}
        </label>

        <div className="relative">
          <Input
            ref={ref}
            id={id}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            className={cn(
              'h-11 w-full rounded-lg border bg-white/[0.15] px-4 text-base text-white backdrop-blur-[4px] placeholder:text-white/60 focus:border-white/60 focus:bg-white/[0.25] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              error ? 'border-neon-red' : 'border-white/30'
            )}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors hover:text-white active:scale-97"
            >
              {showPassword ? (
                <MdVisibilityOff size={20} />
              ) : (
                <MdVisibility size={20} />
              )}
            </button>
          )}
        </div>

        {error && (
          <p className="overflow-hidden text-xs font-medium text-neon-red drop-shadow-[0_0_4px_rgba(0,0,0,0.8)] duration-200 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
