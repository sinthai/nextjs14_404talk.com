"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Search, Plus, Bell, MessageSquare, Sun, Moon, Menu, User, Bookmark, Settings, LogOut, Loader as Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TokenManager } from "@/lib/auth/token-manager";
import { toast } from "sonner";
import { bffClient } from "@/lib/api/bff-client";
import type { LogoutResponse } from "@/types/auth/registration";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [hasNotifications] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<{ displayName: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = TokenManager.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (authenticated) {
        const user = TokenManager.getUserData();
        if (user) {
          setUserData({ displayName: user.displayName });
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const refreshToken = TokenManager.getRefreshToken();
      const accessToken = TokenManager.getAccessToken();

      if (!refreshToken || !accessToken) {
        TokenManager.clearTokens();
        setIsAuthenticated(false);
        setUserData(null);
        toast.info("ออกจากระบบเรียบร้อย", {
          description: "แล้วพบกันใหม่ รักษาสุขภาพด้วยนะ",
        });
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
      setIsAuthenticated(false);
      setUserData(null);
      toast.info("ออกจากระบบเรียบร้อย", {
        description: "แล้วพบกันใหม่ รักษาสุขภาพด้วยนะ",
      });
      setTimeout(() => {
        router.push("/auth/login");
        router.refresh();
      }, 500);
    } catch (error) {
      TokenManager.clearTokens();
      setIsAuthenticated(false);
      setUserData(null);
      toast.info("ออกจากระบบเรียบร้อย", {
        description: "แล้วพบกันใหม่ รักษาสุขภาพด้วยนะ",
      });
      setTimeout(() => {
        router.push("/auth/login");
      }, 500);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4">
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

          <Link href="/" className="flex items-center">
            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl font-bold text-transparent">
              404talk.com
            </h1>
          </Link>
        </div>

        <div className="hidden flex-1 md:flex md:max-w-xl">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ค้นหากระทู้, ชุมชน..."
              className="w-full pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button className="hidden gap-2 md:flex" size="default">
            <Plus className="h-4 w-4" />
            <span>สร้างกระทู้</span>
          </Button>

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
            className="hidden md:flex"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
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

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatar-placeholder.jpg" alt="Profile" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userData?.displayName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userData && (
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{userData.displayName}</p>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>โปรไฟล์ของฉัน</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/saved" className="flex cursor-pointer items-center">
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>กระทู้ที่บันทึก</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex cursor-pointer items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>ตั้งค่า</span>
                  </Link>
                </DropdownMenuItem>
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
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild size="sm">
                <Link href="/auth/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">สมัครสมาชิก</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
