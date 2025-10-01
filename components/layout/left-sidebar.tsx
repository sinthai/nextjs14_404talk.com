"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Chrome as Home, Sparkles, TrendingUp, Heart, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { title: "หน้าแรก", href: "/", icon: Home },
  { title: "มาใหม่", href: "/new", icon: Sparkles },
  { title: "ยอดนิยม", href: "/popular", icon: TrendingUp },
  { title: "กำลังติดตาม", href: "/following", icon: Heart },
];

interface Community {
  id: string;
  name: string;
  icon: string;
  members: string;
}

const popularCommunities: Community[] = [
  { id: "1", name: "เทคโนโลยี", icon: "💻", members: "12.5k" },
  { id: "2", name: "การเงิน", icon: "💰", members: "8.2k" },
  { id: "3", name: "การศึกษา", icon: "📚", members: "15.1k" },
  { id: "4", name: "สุขภาพ", icon: "🏥", members: "6.8k" },
  { id: "5", name: "ท่องเที่ยว", icon: "✈️", members: "9.3k" },
];

interface Category {
  name: string;
  emoji: string;
}

const categories: Category[] = [
  { name: "เทคโนโลยี", emoji: "💻" },
  { name: "เกม", emoji: "🎮" },
  { name: "แก็ดเจ็ต", emoji: "📱" },
  { name: "DIY", emoji: "🔧" },
  { name: "คำถาม-คำตอบ", emoji: "💡" },
  { name: "ออกแบบ", emoji: "🎨" },
];

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeftSidebar({ isOpen, onClose }: LeftSidebarProps) {
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
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-72 border-r bg-background transition-transform duration-300 lg:sticky lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />

          <div className="px-3">
            <h3 className="mb-3 px-3 text-sm font-semibold">ชุมชนยอดนิยม</h3>
            <div className="space-y-1">
              {popularCommunities.map((community) => (
                <div
                  key={community.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm">
                      {community.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{community.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {community.members} สมาชิก
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    เข้าร่วม
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="mt-2 w-full justify-start px-3 text-sm"
              asChild
            >
              <Link href="/communities">ดูชุมชนทั้งหมด</Link>
            </Button>
          </div>

          <Separator className="my-4" />

          <div className="px-3">
            <h3 className="mb-3 px-3 text-sm font-semibold">หมวดหมู่</h3>
            <div className="space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/category/${encodeURIComponent(category.name)}`}
                  onClick={() => onClose()}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                >
                  <span>{category.emoji}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 px-3">
            <Button className="w-full gap-2" variant="outline">
              <Plus className="h-4 w-4" />
              สร้างชุมชน
            </Button>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
