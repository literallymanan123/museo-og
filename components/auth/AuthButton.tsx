"use client";

type AuthButtonProps = {
  children: React.ReactNode;
  type?: "submit" | "button" | "reset";
  variant?: "primary" | "ghost";
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export default function AuthButton({
  children,
  type = "submit",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}: AuthButtonProps) {
  if (variant === "ghost") {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`
          w-full
          rounded-[14px]
          border
          border-white/20
          bg-white/[0.05]
          py-[13px]
          text-[15px]
          font-medium
          text-white/80
          transition-all
          duration-300
          hover:border-white/30
          hover:bg-white/[0.09]
          hover:text-white
          active:scale-[0.985]
          disabled:cursor-not-allowed
          disabled:opacity-50
          ${className}
        `}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-[14px]
        bg-black
        py-[14px]
        text-[16px]
        font-bold
        text-white
        transition-all
        duration-500
        ease-out
        hover:bg-[#ff806d]
        hover:shadow-[0_8px_30px_rgba(255,128,109,0.28)]
        active:scale-[0.985]
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>

      {/* Light sweep animation */}
      <span
        className="
          pointer-events-none
          absolute
          -left-[100%]
          top-0
          h-full
          w-[60%]
          rotate-[15deg]
          bg-white/[0.12]
          blur-xl
          transition-all
          duration-700
          group-hover:left-[120%]
        "
      />
    </button>
  );
}
