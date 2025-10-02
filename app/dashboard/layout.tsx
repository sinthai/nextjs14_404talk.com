"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/user-dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/user-dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex">
        <DashboardSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          notificationCount={2}
        />

        <main className="min-h-[calc(100vh-4rem)] flex-1 lg:pl-64">
          <div className="container mx-auto px-4 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
