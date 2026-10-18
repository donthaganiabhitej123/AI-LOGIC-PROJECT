
import type {
  NextFunction,
  Request,
  Response,
} from "express";
import jwt from "jsonwebtoken";

export type UserRole = "admin" | "user";

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: UserRole;
}

// Make the authenticated user available to Express routes.
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

function getToken(req: Request): string | undefined {
  // Prefer a Bearer token if the frontend sends one.
  const authorization = req.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7).trim() || undefined;
  }

  // Otherwise, read the existing token cookie.
  const cookieHeader = req.headers.cookie;

  const tokenCookie = cookieHeader
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("token="));

  if (!tokenCookie) {
    return undefined;
  }

  const value = tokenCookie.slice("token=".length);

  try {
    return decodeURIComponent(value);
  } catch {
    return undefined;
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = getToken(req);
  console.log("token reached");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      success: false,
      message: "Authentication service unavailable",
    });
  }

  try {
    const payload = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload === "string" ||
      typeof payload.userId !== "number" ||
      !Number.isSafeInteger(payload.userId) ||
      payload.userId < 1 ||
      typeof payload.email !== "string" ||
      !payload.email ||
      (payload.role !== "admin" && payload.role !== "user")
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    return next();
  } catch(error) {
    if (error instanceof jwt.TokenExpiredError) {
    console.error("JWT ERROR: Token has expired");
  } else if (error instanceof jwt.JsonWebTokenError) {
    console.error(
      "JWT VERIFICATION ERROR:",
      error.name,
      error.message
    );
  } else {
    console.error("Unexpected JWT error:", error);
  }
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
