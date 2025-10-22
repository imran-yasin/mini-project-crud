"use client";

import { useFormStatus } from "react-dom";
import { SpinnerIcon } from "@/app/components/icons";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <SpinnerIcon className="h-5 w-5" />
          Signing In...
        </>
      ) : (
        "Sign In"
      )}
    </button>
  );
}

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export default function LoginForm({ action }: Props) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        />
      </div>

      <SubmitButton />
    </form>
  );
}
