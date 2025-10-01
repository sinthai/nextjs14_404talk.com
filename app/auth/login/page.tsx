"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        <LeftSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="min-h-[calc(100vh-4rem)] flex-1 lg:pl-72">
          <div className="container mx-auto max-w-5xl px-4 py-12 xl:pr-80">
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-3xl font-bold">ยินดีต้อนรับกลับ</h2>
                  <p className="text-muted-foreground">
                    เข้าสู่ระบบเพื่อดำเนินการต่อ
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>เข้าสู่ระบบ</CardTitle>
                    <CardDescription>
                      กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LoginForm />
                  </CardContent>
                </Card>

                <div className="mt-8 space-y-4 text-center text-sm text-muted-foreground">
                  <p>
                    ยังไม่มีบัญชี?{" "}
                    <Link href="/auth/register" className="text-primary hover:underline">
                      สมัครสมาชิกฟรี
                    </Link>
                  </p>
                  <p>
                    มีปัญหาในการเข้าสู่ระบบ?{" "}
                    <Link href="/help" className="text-primary hover:underline">
                      ติดต่อฝ่ายสนับสนุน
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
