import axios from "axios";
import { NextResponse } from "next/server";

const BACKEND_URL =
  "http://localhost:5000/api/chat/message";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await axios.post(
      BACKEND_URL,
      body
    );

    return NextResponse.json(
      response.data,
      {
        status: response.status,
      }
    );
  } catch (error: unknown) {
    console.error(
      "Send chat message error:",
      error
    );

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || {
          success: false,
          message:
            "Failed to send chat message",
        },
        {
          status:
            error.response?.status || 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to send chat message",
      },
      {
        status: 500,
      }
    );
  }
}