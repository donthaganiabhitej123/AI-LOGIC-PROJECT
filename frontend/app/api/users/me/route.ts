
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000/api/users/me";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        { status: 401 }
      );
    }

    const response = await axios.get(BACKEND_URL, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data ?? {
          success: false,
          message: "Unable to retrieve user details",
        },
        {
          status: error.response?.status ?? 500,
        }
      );
    }

    console.error("Get current user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
