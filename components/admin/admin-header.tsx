"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Sun, Moon, Bell, LogOut, Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TokenManager } from "@/lib/auth/token-manager";
import { bffClient } from "@/lib/api/bff-client";
import type { LogoutResponse } from "@/types/auth/registration";
import { toast } from "sonner";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [userData, setUserData] = useState<{ displayName: string; role: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [hasNotifications] = useState(true);

  useEffect(() => {
    const user = TokenManager.getUserData();
    if (user) {
      setUserData({ displayName: user.displayName, role: user.role });
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const refreshToken = TokenManager.getRefreshToken();
      const accessToken = TokenManager.getAccessToken();

      if (!refreshToken || !accessToken) {
        TokenManager.clearTokens();
        toast.info("ออกจากระบบเรียบร้อย");
        setTimeout(() => {
          router.push("/auth/login");
        }, 500);
        return;
      }

      await bffClient.post<LogoutResponse>(
        "/auth/logout",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      TokenManager.clearTokens();
      toast.info("ออกจากระบบเรียบร้อย");
      setTimeout(() => {
        router.push("/auth/login");
        router.refresh();
      }, 500);
    } catch (error) {
      TokenManager.clearTokens();
      toast.info("ออกจากระบบเรียบร้อย");
      setTimeout(() => {
        router.push("/auth/login");
      }, 500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-xl font-bold text-transparent">
              404talk.com
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Admin
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatar-placeholder.jpg" alt="Admin" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userData?.displayName?.[0]?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {userData && (
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{userData.displayName}</p>
                  <p className="text-xs text-muted-foreground capitalize">{userData.role}</p>
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="mr-2 h-4 w-4" />
                )}
                <span>{isLoggingOut ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
