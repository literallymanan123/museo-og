"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export default function LoginForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    // Clear the field error as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors((previous) => ({ ...previous, [name]: undefined }));
    }
  }

  function validate(): FormErrors {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
    }

    return newErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({ form: "Incorrect email or password." });
        } else if (response.status === 400) {
          setErrors({ form: data.message ?? "Invalid request." });
        } else {
          setErrors({
            form:
              data.message ??
              "Something went wrong. Please try again.",
          });
        }
        return;
      }

      router.replace("/feed");
    } catch {
      setErrors({
        form: "Unable to connect. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleContinueAsGuest() {
    sessionStorage.setItem("guest", "true");
    router.replace("/feed");
  }

  return (
    <div className="text-white">
      {/* Heading */}
      <div className="mb-8 text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.04em]">
          welcome back.
        </h1>
        <p className="mt-2 text-[14px] text-white/50">
          Sign in to your Museo account
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Email */}
        <AuthInput
          id="login-email"
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          autoComplete="email"
          error={errors.email}
        />

        {/* Password */}
        <AuthInput
          id="login-password"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          icon={LockKeyhole}
          autoComplete="current-password"
          error={errors.password}
          rightElement={
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((prev) => !prev)}
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
          }
        />

        {/* Form-level error banner */}
        {errors.form && (
          <div
            role="alert"
            className="
              rounded-[10px]
              border
              border-red-400/30
              bg-red-400/[0.08]
              px-4
              py-3
              text-center
              text-[13px]
              text-red-400
            "
          >
            {errors.form}
          </div>
        )}

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[13px] text-[#ff806d] transition duration-300 hover:text-[#ff9b8c]"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In */}
        <AuthButton type="submit" disabled={isLoading}>
          {isLoading ? "Signing in…" : "Sign In"}
        </AuthButton>

        {/* Continue as Guest */}
        <AuthButton
          type="button"
          variant="ghost"
          onClick={handleContinueAsGuest}
        >
          Continue as Guest
        </AuthButton>
      </form>

      {/* Sign Up link */}
      <p className="mt-6 text-center text-[14px] font-medium">
        <span className="text-white/50">Don&apos;t have an account? </span>
        <Link
          href="/signup"
          className="text-[#ff806d] transition duration-300 hover:text-[#ff9b8c]"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}