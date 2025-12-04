// authSignOut.ts
import { supabase } from "../supabaseClient";

export type AuthProvider = "google" | "github" | "email" | "unknown";

/**
 * Figure out how the user logged in (google / github / email).
 * This reads Supabase's user object app_metadata.
 */
export const getCurrentProvider = async (): Promise<AuthProvider> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return "unknown";
  }

  // Supabase usually stores the provider here for OAuth logins
  const provider = (data.user.app_metadata?.provider ||
    data.user.user_metadata?.provider) as string | undefined;

  if (provider === "google") return "google";
  if (provider === "github") return "github";
  if (provider === "email") return "email";

  // If you store provider in your own "adb" table, you could query it here instead.
  return "unknown";
};

/**
 * Base function that actually calls Supabase signOut.
 */
const signOutSupabase = async () => {
  const { error } = await supabase.auth.signOut(); // global scope by default :contentReference[oaicite:1]{index=1}
  if (error) {
    throw error;
  }
};

/**
 * Google OAuth sign out
 * Add any extra Google cleanup here if you’re using a native Google SDK.
 */
export const signOutGoogle = async (): Promise<void> => {
  // Example: if you ever add Google SDK, revoke tokens here.
  await signOutSupabase();
};

/**
 * GitHub OAuth sign out
 * If you store GitHub access tokens in your own table/backend, revoke them there.
 */
export const signOutGithub = async (): Promise<void> => {
  // Example: call your backend to revoke the GitHub token.
  await signOutSupabase();
};

/**
 * Regular email/password account sign out
 */
export const signOutRegular = async (): Promise<void> => {
  await signOutSupabase();
};
