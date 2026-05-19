export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "Email or password didn't match. Try again.";
  }

  if (lower.includes("user already registered")) {
    return "An account with this email already exists. Try signing in.";
  }

  if (lower.includes("email not confirmed")) {
    return "Please confirm your email before signing in. Check your inbox.";
  }

  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("failed to fetch")
  ) {
    return "Couldn't reach the server. Check your internet connection.";
  }

  if (lower.includes("password") && lower.includes("least")) {
    return "Password must be at least 6 characters.";
  }

  return message;
}
