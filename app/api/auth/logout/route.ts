import { NextRequest, NextResponse } from "next/server";
import { externalApiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/error-handler";
import type { LogoutRequest, LogoutResponse } from "@/types/auth/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get("Authorization");

    if (!body.refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        } as LogoutResponse,
        { status: 400 }
      );
    }

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        } as LogoutResponse,
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    const logoutData: LogoutRequest = {
      refreshToken: body.refreshToken,
    };

    const response = await externalApiClient.post<LogoutResponse>(
      "/auth/logout",
      logoutData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        const statusCode = errorData.status || 400;
        return NextResponse.json(
          {
            success: false,
            message: errorData.message || "เกิดข้อผิดพลาดในการออกจากระบบ",
          } as LogoutResponse,
          { status: statusCode }
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "เกิดข้อผิดพลาดในการออกจากระบบ",
          } as LogoutResponse,
          { status: 500 }
        );
      }
    }

    return handleApiError(error);
  }
}
