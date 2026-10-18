import axios from "axios";
import FormData from "form-data";
import { NextResponse } from "next/server";

const BACKEND_URL =
  "http://localhost:5000/api/files/upload";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File is required",
        },
        {
          status: 400,
        }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    const buffer = Buffer.from(arrayBuffer);

    const backendFormData = new FormData();

    backendFormData.append(
      "file",
      buffer,
      {
        filename: file.name,
        contentType: file.type,
      }
    );

    const response = await axios.post(
      BACKEND_URL,
      backendFormData,
      {
        headers: {
          ...backendFormData.getHeaders(),
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
    console.error(
      "File upload error:",
      error
    );

    if (axios.isAxiosError(error)) {
      console.error(
        "Backend response:",
        error.response?.data
      );

      return NextResponse.json(
        error.response?.data || {
          success: false,
          message: "File upload failed",
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
        message: "File upload failed",
      },
      {
        status: 500,
      }
    );
  }
}