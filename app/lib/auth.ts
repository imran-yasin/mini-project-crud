import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "user-session";

/**
 * Creates a new user session with secure cookie.
 *
 * Stores user email in httpOnly cookie for authentication.
 * Cookie expires in 7 days.
 *
 * @param email - User's email address to store in session
 */
export async function setSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Retrieves the current user session.
 *
 * Reads the session cookie and returns user's email if authenticated.
 *
 * @returns User's email if session exists, null otherwise
 */
export async function getSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value || null;
}

/**
 * Clears the current user session.
 *
 * Removes the session cookie, effectively logging out the user.
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Requires authentication for protected routes.
 *
 * Throws error if user is not authenticated, otherwise returns user's email.
 * Use in Server Components and Server Actions to protect endpoints.
 *
 * @returns User's email if authenticated
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<string> {
  const email = await getSession();
  if (!email) {
    throw new Error("Unauthorized");
  }
  return email;
}
