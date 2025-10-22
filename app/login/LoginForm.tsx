"use client";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  SpinnerIcon,
  AlertTriangleIcon,
  MailIcon,
} from "@/app/components/icons";
import { loginSchema } from "@/app/schemas";
import { ZodError } from "zod";

function SubmitButton({ isRedirecting }: { isRedirecting: boolean }) {
  const { pending } = useFormStatus();
  const isLoading = pending || isRedirecting;

  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="h-5 w-5" />
          {isRedirecting ? "Redirecting..." : "Signing In..."}
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

type Props = {
  action: (formData: FormData) => Promise<{ error?: string }>;
};

export default function LoginForm({ action }: Props) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError("");

    // Client-side validation
    try {
      const emailValue = formData.get("email") as string;
      loginSchema.parse({ email: emailValue });
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.issues[0].message);
        return;
      }
    }

    // Server-side action with transition
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        // Success - show redirecting state
        setIsRedirecting(true);
      }
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <MailIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={handleEmailChange}
            disabled={isRedirecting}
            placeholder="you@example.com"
            className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-blue-500"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        </div>
        {error && (
          <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <AlertTriangleIcon className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      <SubmitButton isRedirecting={isRedirecting} />
    </form>
  );
}
