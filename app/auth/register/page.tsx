"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { RegistrationForm } from "./registration-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
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
                  <h2 className="mb-2 text-3xl font-bold">สมัครสมาชิก</h2>
                  <p className="text-muted-foreground">
                    เข้าร่วมชุมชนแบ่งปันความรู้และประสบการณ์
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>สร้างบัญชีของคุณ</CardTitle>
                    <CardDescription>
                      กรอกข้อมูลด้านล่างเพื่อเริ่มต้นใช้งาน
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RegistrationForm />
                  </CardContent>
                </Card>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  การสมัครสมาชิกแสดงว่าคุณยอมรับ
                  <br />
                  <Link href="/terms" className="text-primary hover:underline">
                    ข้อกำหนดการใช้งาน
                  </Link>{" "}
                  และ{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
