import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = "http://localhost:5000/api/users";

// GET users
export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        {
          status: 401,
        }
      );
    }

    const response = await axios.get(
      BACKEND_URL,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    console.error("Get users error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || {
          success: false,
          message: "Failed to fetch users",
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

// CREATE user
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request.json();

    const response = await axios.post(
      BACKEND_URL,
      body,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    return NextResponse.json(
      response.data,
      {
        status: response.status,
      }
    );
  } catch (error: unknown) {
    console.error("Create user error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || {
          success: false,
          message: "Failed to create user",
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}