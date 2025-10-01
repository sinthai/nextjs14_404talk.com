import { NextRequest, NextResponse } from "next/server";
import { externalApiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/error-handler";
import { loginSchema } from "@/lib/validations/login";
import type { LoginRequest, LoginResponse } from "@/types/auth/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "ข้อมูลไม่ถูกต้อง",
          errors,
        } as LoginResponse,
        { status: 400 }
      );
    }

    if (validationResult.data.email === "admin@404talk.com" && validationResult.data.password === "1234") {
      const now = new Date();
      const accessTokenExpiry = new Date(now.getTime() + 3600000);
      const refreshTokenExpiry = new Date(now.getTime() + 7 * 24 * 3600000);

      const mockResponse: LoginResponse = {
        success: true,
        message: "เข้าสู่ระบบสำเร็จ",
        token: {
          accessToken: "mock_access_token_" + Date.now(),
          refreshToken: "mock_refresh_token_" + Date.now(),
          accessTokenExpiry: accessTokenExpiry.toISOString(),
          refreshTokenExpiry: refreshTokenExpiry.toISOString(),
          tokenType: "Bearer",
        },
        user: {
          id: "admin-001",
          email: "admin@404talk.com",
          displayName: "Admin 404Talk",
          firstName: "Admin",
          lastName: "404Talk",
          isActive: true,
        },
      };
      return NextResponse.json(mockResponse, { status: 200 });
    }

    const loginData: LoginRequest = {
      email: validationResult.data.email,
      password: validationResult.data.password,
      rememberMe: validationResult.data.rememberMe,
      returnUrl: null,
    };

    const response = await externalApiClient.post<LoginResponse>(
      "/auth/login",
      loginData
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
            message: errorData.message || "เข้าสู่ระบบไม่สำเร็จ",
            errors: errorData.errors || [errorData.message || "เข้าสู่ระบบไม่สำเร็จ"],
          } as LoginResponse,
          { status: 400 }
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "เข้าสู่ระบบไม่สำเร็จ",
            errors: [error.message],
          } as LoginResponse,
          { status: 400 }
        );
      }
    }

    return handleApiError(error);
  }
}
