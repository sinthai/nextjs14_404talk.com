import { NextRequest, NextResponse } from "next/server";
import { externalApiClient } from "@/lib/api/client";
import { handleApiError } from "@/lib/api/error-handler";
import { registrationSchema } from "@/lib/validations/registration";
import type { RegistrationRequest, RegistrationResponse } from "@/types/auth/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = registrationSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map((err) => err.message);
      return NextResponse.json(
        {
          success: false,
          message: "ข้อมูลไม่ถูกต้อง",
          errors,
        } as RegistrationResponse,
        { status: 400 }
      );
    }

    const registrationData: RegistrationRequest = {
      email: validationResult.data.email,
      password: validationResult.data.password,
      confirmPassword: validationResult.data.confirmPassword,
      displayName: validationResult.data.displayName,
      firstName: validationResult.data.firstName || undefined,
      lastName: validationResult.data.lastName || undefined,
      acceptTerms: validationResult.data.acceptTerms,
    };

    const response = await externalApiClient.post<RegistrationResponse>(
      "/auth/register",
      registrationData
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      try {
        const errorData = JSON.parse(error.message);
        return NextResponse.json(
          {
            success: false,
            message: errorData.message || "สมัครสมาชิกไม่สำเร็จ",
            errors: errorData.errors || [error.message],
          } as RegistrationResponse,
          { status: 400 }
        );
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: "สมัครสมาชิกไม่สำเร็จ",
            errors: [error.message],
          } as RegistrationResponse,
          { status: 400 }
        );
      }
    }

    return handleApiError(error);
  }
}
