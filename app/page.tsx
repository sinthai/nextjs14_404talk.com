"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
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
          <div className="container mx-auto max-w-5xl px-4 py-6 xl:pr-80">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">ฟีดหน้าแรก</h2>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>ยินดีต้อนรับสู่ 404talk.com</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    แพลตฟอร์มแบ่งปันความรู้และประสบการณ์สำหรับคนไทย
                    เริ่มต้นด้วยการสร้างกระทู้แรกของคุณ หรือเข้าร่วมชุมชนที่คุณสนใจ
                  </p>
                </CardContent>
              </Card>

              {[1, 2, 3].map((i) => (
                <Card key={i} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div>
                          <p className="text-sm font-medium">ชื่อผู้ใช้ {i}</p>
                          <p className="text-xs text-muted-foreground">
                            โพสต์เมื่อ {i} ชั่วโมงที่แล้ว
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="mt-4">
                      ตัวอย่างหัวข้อกระทู้ที่น่าสนใจ #{i}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      นี่คือตัวอย่างเนื้อหาของกระทู้
                      ซึ่งจะแสดงข้อความสั้นๆ เพื่อให้ผู้ใช้เห็นภาพรวมของเนื้อหา
                      ก่อนที่จะคลิกเข้าไปอ่านรายละเอียดเพิ่มเติม
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <span>👍 {12 * i} โหวต</span>
                      <span>💬 {5 * i} ความคิดเห็น</span>
                      <span>🔖 บันทึก</span>
                      <span>🔗 แชร์</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <RightSidebar />
      </div>
    </div>
  );
}
