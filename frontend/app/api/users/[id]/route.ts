import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000/api/users";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function forwardRequest(
  request: NextRequest,
  context: RouteContext,
  method: "PUT" | "DELETE"
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required. Please log in again.",
        },
        { status: 401 }
      );
    }

    const headers = new Headers({
      Cookie: `token=${token}`,
    });

    const options: RequestInit = {
      method,
      headers,
      cache: "no-store",
    };

    if (method === "PUT") {
      headers.set("Content-Type", "application/json");
      options.body = await request.text();
    }

    const response = await fetch(`${BACKEND_URL}/${id}`, options);
    const responseBody = await response.text();

    return new NextResponse(responseBody || null, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ??
          "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(`User ${method} proxy error:`, error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the user request.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return forwardRequest(request, context, "PUT");
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  return forwardRequest(request, context, "DELETE");
}