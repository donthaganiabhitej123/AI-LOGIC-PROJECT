import { NextResponse } from "next/server";

import axios from "axios";

const BACKEND_URL =
  "http://localhost:5000/api/files";

// ==========================================
// GET ALL FILES
// ==========================================

export async function GET() {
  try {
    const response =
      await axios.get(
        BACKEND_URL
      );

    return NextResponse.json(
      response.data,
      {
        status: response.status,
      }
    );
  } catch (error: unknown) {
    console.error(
      "Get files error:",
      error
    );

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        error.response?.data || {
          success: false,
          message:
            "Failed to fetch files",
        },
        {
          status:
            error.response?.status ||
            500,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch files",
      },
      {
        status: 500,
      }
    );
  }
}