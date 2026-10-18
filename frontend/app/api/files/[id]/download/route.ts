import axios from "axios";

const BACKEND_URL =
  "http://localhost:5000/api/files";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } =
      await context.params;

    const response =
      await axios.get(
        `${BACKEND_URL}/${id}/download`,
        {
          responseType:
            "arraybuffer",
        }
      );

    const headers =
      new Headers();

    // ==========================================
    // CONTENT TYPE
    // ==========================================

    headers.set(
      "Content-Type",
      String(
        response.headers[
          "content-type"
        ] ??
          "application/octet-stream"
      )
    );

    // ==========================================
    // CONTENT DISPOSITION
    // ==========================================

    const contentDisposition =
      response.headers[
        "content-disposition"
      ];

    if (contentDisposition) {
      headers.set(
        "Content-Disposition",
        String(
          contentDisposition
        )
      );
    }

    // ==========================================
    // CONTENT LENGTH
    // IMPORTANT FOR PROGRESS
    // ==========================================

    const contentLength =
      response.headers[
        "content-length"
      ];

    if (contentLength) {
      headers.set(
        "Content-Length",
        String(contentLength)
      );
    }

    // ==========================================
    // RETURN FILE
    // ==========================================

    return new Response(
      response.data,
      {
        status: 200,
        headers,
      }
    );
  } catch (error: unknown) {
    console.error(
      "Download file error:",
      error
    );

    if (axios.isAxiosError(error)) {
      return Response.json(
        {
          success: false,
          message:
            "Failed to download file",
        },
        {
          status:
            error.response?.status ??
            500,
        }
      );
    }

    return Response.json(
      {
        success: false,
        message:
          "Failed to download file",
      },
      {
        status: 500,
      }
    );
  }
}