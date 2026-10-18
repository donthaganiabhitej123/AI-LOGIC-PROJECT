import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      body
    );

    const data = response.data;

    const cookieStore = await cookies();

    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });

    return NextResponse.json({
      success: true,
      message: data.message,
      token: data.token,
      user: data.user,
    });
  } catch (error: unknown) {
    console.error("Login error:", error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || {
          success: false,
          message: "Login failed",
        },
        {
          status: error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}