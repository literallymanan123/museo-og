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
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";

type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers and underscores.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Map server field hints back to the relevant input
        if (data.field === "username") {
          setErrors({ username: data.message });
        } else if (data.field === "email") {
          setErrors({ email: data.message });
        } else {
          setErrors({
            form: data.message ?? "Something went wrong. Please try again.",
          });
        }
        return;
      }

      // Success — redirect to login with a success hint
      router.replace("/feed");
    } catch {
      setErrors({
        form: "Unable to create account. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="text-white">
      {/* Heading */}
      <div className="mb-7 text-center">
        <h1 className="text-[32px] font-bold tracking-[-0.04em]">
          create account.
        </h1>
        <p className="mt-2 text-[14px] text-white/50">
          Join Museo and explore art
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Username */}
        <AuthInput
          id="signup-username"
          label="Username"
          name="username"
          type="text"
          placeholder="Choose a username"
          value={formData.username}
          onChange={handleChange}
          icon={UserRound}
          autoComplete="username"
          error={errors.username}
        />

        {/* Email */}
        <AuthInput
          id="signup-email"
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
          id="signup-password"
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password (8+ characters)"
          value={formData.password}
          onChange={handleChange}
          icon={LockKeyhole}
          autoComplete="new-password"
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

        {/* Confirm Password */}
        <AuthInput
          id="signup-confirm-password"
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon={LockKeyhole}
          autoComplete="new-password"
          error={errors.confirmPassword}
          rightElement={
            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
              onClick={() => setShowConfirmPassword((prev) => !prev)}
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

        {/* Create Account */}
        <div className="pt-1">
          <AuthButton type="submit" disabled={isLoading}>
            {isLoading ? "Creating Account…" : "Create Account"}
          </AuthButton>
        </div>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-[14px] font-medium">
        <span className="text-white/50">Already have an account? </span>
        <Link
          href="/login"
          className="text-[#ff806d] transition duration-300 hover:text-[#ff9b8c]"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}