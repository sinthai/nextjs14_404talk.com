"use client";

import { useState } from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute
      options={{
        requireAuth: true,
        allowedRoles: ["admin"],
        redirectTo: "/auth/login",
      }}
    >
      <div className="min-h-screen">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <div className="flex">
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <main className="min-h-[calc(100vh-4rem)] flex-1 lg:pl-72">
            <div className="container mx-auto px-4 py-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
