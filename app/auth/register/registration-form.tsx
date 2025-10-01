"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Eye, EyeOff, Loader as Loader2, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { registrationSchema } from "@/lib/validations/registration";
import { bffClient } from "@/lib/api/bff-client";
import type {
  RegistrationFormData,
  RegistrationResponse,
} from "@/types/auth/registration";

export function RegistrationForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      firstName: "",
      lastName: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setSubmitError([]);
    setSubmitSuccess(false);

    try {
      const response = await bffClient.post<RegistrationResponse>(
        "/auth/register",
        data
      );

      if (response.success) {
        setSubmitSuccess(true);
        toast.success("ยินดีต้อนรับ! สมัครสมาชิกเรียบร้อยแล้ว", {
          description: "กำลังนำคุณไปหน้าเข้าสู่ระบบ",
        });
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setSubmitError(response.errors || ["เกิดข้อผิดพลาดในการสมัครสมาชิก"]);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError([error.message]);
      } else {
        setSubmitError(["เกิดข้อผิดพลาดในการสมัครสมาชิก"]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitSuccess && (
          <Alert className="border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              สมัครสมาชิกเรียบร้อยแล้ว กำลังนำคุณไปหน้าเข้าสู่ระบบ...
            </AlertDescription>
          </Alert>
        )}

        {submitError.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-inside list-disc space-y-1">
                {submitError.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                อีเมล <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ชื่อที่แสดง <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="ชื่อที่จะแสดงในโปรไฟล์"
                  autoComplete="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อจริง</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ชื่อ"
                    autoComplete="given-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input
                    placeholder="นามสกุล"
                    autoComplete="family-name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                รหัสผ่าน <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="สร้างรหัสผ่านที่แข็งแรง"
                    autoComplete="new-password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ยืนยันรหัสผ่าน <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                    autoComplete="new-password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  ฉันยอมรับ{" "}
                  <Link
                    href="/terms"
                    className="text-primary underline hover:text-primary/80"
                  >
                    ข้อกำหนดและเงื่อนไข
                  </Link>{" "}
                  และ{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline hover:text-primary/80"
                  >
                    นโยบายความเป็นส่วนตัว
                  </Link>{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              กำลังสมัครสมาชิก...
            </>
          ) : (
            "สมัครสมาชิก"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-primary underline hover:text-primary/80"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </form>
    </Form>
  );
}
