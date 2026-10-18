
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

type UserRole = "admin" | "user";

function redirectByRole(
  role: UserRole,
  request: NextRequest
): NextResponse {
  const destination =
    role === "admin"
      ? "/dashboard/admin"
      : "/dashboard/user";

  return NextResponse.redirect(new URL(destination, request.url));
}

export async function middleware(
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";

  const isAdminDashboard =
    pathname === "/dashboard/admin" ||
    pathname.startsWith("/dashboard/admin/");

  const isUserDashboard =
    pathname === "/dashboard/user" ||
    pathname.startsWith("/dashboard/user/");

  const isDashboard = pathname.startsWith("/dashboard");

  // Allow other public routes.
  if (!isHomePage && !isLoginPage && !isDashboard) {
    return NextResponse.next();
  }

  // Redirect logged-out visitors from Home and Dashboard to Login.
  if (!token) {
    if (isHomePage || isDashboard) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    return NextResponse.next();
  }

  const secret = process.env.JWT_SECRET;

  // Fail closed if the JWT secret is missing.
  if (!secret) {
    console.error("JWT_SECRET is not configured");

    return NextResponse.json(
      { message: "Authentication unavailable" },
      { status: 500 }
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    // Validate required JWT claims.
    if (
      typeof payload.userId !== "number" ||
      typeof payload.email !== "string" ||
      !payload.email ||
      (payload.role !== "admin" && payload.role !== "user")
    ) {
      throw new Error("Invalid JWT claims");
    }

    const role = payload.role as UserRole;

    // Home and Login redirect to the correct dashboard.
    if (isHomePage || isLoginPage) {
      return redirectByRole(role, request);
    }

    // Only admins can access admin dashboard routes.
    if (isAdminDashboard && role !== "admin") {
      return redirectByRole(role, request);
    }

    // Only users can access user dashboard routes.
    if (isUserDashboard && role !== "user") {
      return redirectByRole(role, request);
    }

    // Preserve other dashboard routes.
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);

    const response = NextResponse.redirect(
      new URL("/login", request.url)
    );

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
