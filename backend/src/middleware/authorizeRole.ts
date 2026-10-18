import type {
    NextFunction,
    Request,
    Response,
} from "express";

import type { UserRole } from "./authenticateToken";

export function authorizeRole(
  ...allowedRoles: UserRole[]
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Authentication must run first.
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Check whether the user's role is permitted.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to perform this action",
      });
    }

    return next();
  };
}