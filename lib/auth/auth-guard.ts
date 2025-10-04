import { TokenManager } from "./token-manager";

export type UserRole = "admin" | "moderator" | "user";

export interface AuthGuardOptions {
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const AuthGuard = {
  canAccess(options: AuthGuardOptions = {}): {
    allowed: boolean;
    reason?: string;
    redirectTo?: string;
  } {
    const { requireAuth = true, allowedRoles, redirectTo = "/auth/login" } = options;

    if (!requireAuth) {
      return { allowed: true };
    }

    if (!TokenManager.isAuthenticated()) {
      return {
        allowed: false,
        reason: "Not authenticated",
        redirectTo,
      };
    }

    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = TokenManager.getUserRole() as UserRole;
      if (!userRole || !allowedRoles.includes(userRole)) {
        return {
          allowed: false,
          reason: "Insufficient permissions",
          redirectTo: "/",
        };
      }
    }

    return { allowed: true };
  },

  requireRole(role: UserRole): boolean {
    const userRole = TokenManager.getUserRole();
    return userRole === role;
  },

  requireAnyRole(roles: UserRole[]): boolean {
    const userRole = TokenManager.getUserRole() as UserRole;
    return roles.includes(userRole);
  },
};
