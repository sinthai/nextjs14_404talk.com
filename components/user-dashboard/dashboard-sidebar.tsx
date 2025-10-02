"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  MessageCircle,
  Bookmark,
  Bell,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  notificationCount?: number;
}

const navItems = [
  {
    title: "ภาพรวม",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "โปรไฟล์",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "กระทู้ของฉัน",
    href: "/dashboard/threads",
    icon: MessageSquare,
  },
  {
    title: "ความคิดเห็น",
    href: "/dashboard/comments",
    icon: MessageCircle,
  },
  {
    title: "บุ๊กมาร์ก",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
  },
  {
    title: "การแจ้งเตือน",
    href: "/dashboard/notifications",
    icon: Bell,
    badge: true,
  },
  {
    title: "ตั้งค่า",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar({ isOpen, onClose, notificationCount = 0 }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-6 py-4 lg:justify-start">
            <h2 className="text-lg font-semibold">แดชบอร์ด</h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && notificationCount > 0 && (
                      <Badge
                        variant={isActive ? "secondary" : "default"}
                        className="ml-auto"
                      >
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          <div className="border-t p-4">
            <Link href="/" className="block">
              <Button variant="outline" className="w-full" size="sm">
                กลับสู่หน้าหลัก
              </Button>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
