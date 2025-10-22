import { redirect } from "next/navigation";
import { setSession, getSession } from "../lib/auth";
import { loginSchema } from "@/app/schemas";
import { ZodError } from "zod";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/app/projects");
  }

  async function handleLogin(formData: FormData) {
    "use server";

    try {
      const email = formData.get("email") as string;

      const validatedData = loginSchema.parse({ email });

      await setSession(validatedData.email);
    } catch (error) {
      if (error instanceof ZodError) {
        return { error: error.issues[0].message };
      }
      return { error: "An unexpected error occurred" };
    }

    redirect("/app/projects");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email to continue
            </p>
          </div>

          <LoginForm action={handleLogin} />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mock authentication - enter any valid email
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
