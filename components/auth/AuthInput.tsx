"use client";

import type { LucideIcon } from "lucide-react";

type AuthInputProps = {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  rightElement?: React.ReactNode;
  error?: string;
  autoComplete?: string;
  required?: boolean;
};

export default function AuthInput({
  id,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  rightElement,
  error,
  autoComplete,
  required,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[14px] font-medium text-white/80"
      >
        {label}
      </label>

      <div
        className={`
          group
          relative
          flex
          items-center
          rounded-[13px]
          border
          bg-white/[0.055]
          transition-all
          duration-300
          focus-within:bg-white/[0.08]
          focus-within:shadow-[0_0_25px_rgba(255,128,109,0.08)]
          ${
            error
              ? "border-red-400/60 focus-within:border-red-400/80"
              : "border-white/[0.16] focus-within:border-[#ff806d]/70"
          }
        `}
      >
        <Icon
          size={18}
          strokeWidth={1.7}
          className="
            ml-4
            shrink-0
            text-white/35
            transition-colors
            duration-300
            group-focus-within:text-[#ff806d]
          "
        />

        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="
            w-full
            bg-transparent
            px-3
            py-[13px]
            text-[15px]
            text-white
            outline-none
            placeholder:text-white/35
          "
        />

        {rightElement}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-[12px] text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
