"use client";

import { Eye, EyeOff, UserRound, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="text-white">

      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-center text-[32px] font-bold tracking-[-0.04em]">
          login.
        </h1>
      </div>

      <form className="space-y-6">

        {/* Username */}
        <div>
          <label className="mb-2 block text-[14px] font-medium text-white/80">
            Username
          </label>

          <div
            className="
              group
              relative
              flex
              items-center
              rounded-[13px]
              border
              border-white/[0.16]
              bg-white/[0.055]
              transition-all
              duration-300
              focus-within:border-[#ff806d]/70
              focus-within:bg-white/[0.08]
              focus-within:shadow-[0_0_25px_rgba(255,128,109,0.08)]
            "
          >
            <UserRound
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
              type="text"
              placeholder="Enter your username"
              className="
                w-full
                bg-transparent
                px-3
                py-[15px]
                text-[15px]
                text-white
                outline-none
                placeholder:text-white/35
              "
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-[14px] font-medium text-white/80">
            Password
          </label>

          <div
            className="
              group
              relative
              flex
              items-center
              rounded-[13px]
              border
              border-white/[0.16]
              bg-white/[0.055]
              transition-all
              duration-300
              focus-within:border-[#ff806d]/70
              focus-within:bg-white/[0.08]
              focus-within:shadow-[0_0_25px_rgba(255,128,109,0.08)]
            "
          >
            <LockKeyhole
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
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="
                w-full
                bg-transparent
                px-3
                py-[15px]
                pr-12
                text-[15px]
                text-white
                outline-none
                placeholder:text-white/35
              "
            />

            <button
              type="button"
              onClick={() => setShowPassword((previous) => !previous)}
              className="
                absolute
                right-4
                text-white/40
                transition
                duration-300
                hover:text-[#ff806d]
              "
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.6} />
              ) : (
                <Eye size={18} strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <label className="flex cursor-pointer items-center gap-3 text-[14px] font-medium text-white/75">
          <input
            type="checkbox"
            className="
              h-[18px]
              w-[18px]
              cursor-pointer
              appearance-none
              rounded-[5px]
              border
              border-white/30
              bg-white/[0.04]
              transition
              checked:border-[#ff806d]
              checked:bg-[#ff806d]
            "
          />

          Remember Me
        </label>

        {/* Login Button */}
        <button
          type="submit"
          className="
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
          "
        >
          <span className="relative z-10 transition-colors duration-500">
            Login
          </span>

          {/* Subtle light sweep */}
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
      </form>

      {/* Bottom Links */}
      <div className="mt-8 flex items-center justify-between text-[14px] font-medium">
        <Link
          href="/forgot-password"
          className="
            text-[#ff806d]
            transition
            duration-300
            hover:text-[#ff9b8c]
          "
        >
          Forgot Password?
        </Link>

        <Link
          href="/signup"
          className="
            text-[#ff806d]
            transition
            duration-300
            hover:text-[#ff9b8c]
          "
        >
          New Account?
        </Link>
      </div>

    </div>
  );
}