import { NextRequest, NextResponse } from "next/server";
import { externalApiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/error-handler";
import type { RefreshTokenRequest, RefreshTokenResponse } from "@/types/auth/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        } as RefreshTokenResponse,
        { status: 400 }
      );
    }

    const refreshData: RefreshTokenRequest = {
      refreshToken: body.refreshToken,
    };

    const response = await externalApiClient.post<RefreshTokenResponse>(
      "/auth/refresh-token",
      refreshData
    );

    if (response.success) {
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(response, { status: 400 });
  } catch (error) {
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        return NextResponse.json(
          {
            success: false,
            message: errorData.message || "Invalid refresh token",
          } as RefreshTokenResponse,
          { status: 400 }
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid refresh token",
          } as RefreshTokenResponse,
          { status: 400 }
        );
      }
    }

    return handleApiError(error);
  }
}
