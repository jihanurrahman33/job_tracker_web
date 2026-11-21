// Readable names for the actions the API records.
export const ACTION_LABELS: Record<string, string> = {
  "auth.login": "Signed in",
  "auth.login_failed": "Failed sign-in",
  "auth.login_blocked": "Sign-in blocked (too many failures)",
  "auth.login_disabled": "Sign-in refused (account disabled)",
  "auth.login_error": "Sign-in error",
  "auth.register": "Account created",
  "auth.register_conflict": "Sign-up with an existing email",
  "auth.register_blocked": "Sign-up blocked (too many)",
  "auth.register_failed": "Sign-up failed",
  "auth.logout": "Signed out",
  "admin.overview.read": "Admin viewed the overview",
  "admin.user.read": "Admin viewed the user list",
  "admin.user.update": "Admin changed a user account",
  "admin.activity.read": "Admin viewed the activity log",
  "admin.review.read": "Admin viewed the reviews",
  "admin.review.delete": "Admin removed a review",
  "security.rate_limited": "Rate limited",
  "security.unauthorized": "Unauthenticated request",
  "security.forbidden": "Forbidden request",
};

const NOUNS: Record<string, string> = {
  application: "application",
  interview: "interview",
  reminder: "reminder",
  review: "review",
  profile: "profile",
  statistics: "statistics",
};
const VERBS: Record<string, string> = {
  create: "added",
  update: "updated",
  delete: "deleted",
  read: "viewed",
};

export function actionLabel(action: string): string {
  if (ACTION_LABELS[action]) return ACTION_LABELS[action];
  const parts = action.split(".");
  if (parts[0] === "admin" && parts.length === 3) {
    return `Admin ${VERBS[parts[2]] ?? parts[2]} ${parts[1]}`;
  }
  if (parts.length === 2 && NOUNS[parts[0]] && VERBS[parts[1]]) {
    return `${NOUNS[parts[0]][0].toUpperCase()}${NOUNS[parts[0]].slice(1)} ${VERBS[parts[1]]}`;
  }
  return action;
}

/** Actions an admin should look at first. */
export function isConcerning(action: string, status: number): boolean {
  return (
    status >= 500 ||
    action === "auth.login_failed" ||
    action === "auth.login_blocked" ||
    action === "auth.register_blocked" ||
    action.startsWith("security.")
  );
}
