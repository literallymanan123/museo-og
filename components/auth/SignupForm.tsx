"use client";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      router.push("/login");
    } catch {
      setError(
        "Unable to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-white">

      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-center text-[32px] font-bold tracking-[-0.04em]">
          sign up.
        </h1>

        <p className="mt-2 text-center text-[14px] text-white/45">
          Create your Museo account
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

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
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
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
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="mb-2 block text-[14px] font-medium text-white/80">
            Email
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
            <Mail
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
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
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              className="
                w-full
                bg-transparent
                px-3
                py-[13px]
                pr-12
                text-[15px]
                text-white
                outline-none
                placeholder:text-white/35
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previous) => !previous
                )
              }
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
                <EyeOff
                  size={18}
                  strokeWidth={1.6}
                />
              ) : (
                <Eye
                  size={18}
                  strokeWidth={1.6}
                />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="mb-2 block text-[14px] font-medium text-white/80">
            Confirm Password
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
              name="confirmPassword"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={
                formData.confirmPassword
              }
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              className="
                w-full
                bg-transparent
                px-3
                py-[13px]
                pr-12
                text-[15px]
                text-white
                outline-none
                placeholder:text-white/35
              "
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  (previous) => !previous
                )
              }
              className="
                absolute
                right-4
                text-white/40
                transition
                duration-300
                hover:text-[#ff806d]
              "
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={18}
                  strokeWidth={1.6}
                />
              ) : (
                <Eye
                  size={18}
                  strokeWidth={1.6}
                />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-[13px] text-red-400">
            {error}
          </p>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isLoading}
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
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <span className="relative z-10">
            {isLoading
              ? "Creating Account..."
              : "Create Account"}
          </span>

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

      {/* Bottom Link */}
      <div className="mt-6 text-center text-[14px] font-medium">
        <span className="text-white/50">
          Already have an account?{" "}
        </span>

        <Link
          href="/login"
          className="
            text-[#ff806d]
            transition
            duration-300
            hover:text-[#ff9b8c]
          "
        >
          Login
        </Link>
      </div>

    </div>
  );
}