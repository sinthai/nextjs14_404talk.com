"use client";

import Link from "next/link";
import { ArrowUp, MessageCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrendingPost {
  id: string;
  title: string;
  comments: number;
  upvotes: number;
}

const trendingPosts: TrendingPost[] = [
  {
    id: "1",
    title: "วิธีเริ่มต้นเรียนรู้ Next.js 14 ในปี 2024",
    comments: 156,
    upvotes: 342,
  },
  {
    id: "2",
    title: "แนะนำ Laptop สำหรับโปรแกรมเมอร์งบ 30,000 บาท",
    comments: 89,
    upvotes: 267,
  },
  {
    id: "3",
    title: "AI ที่น่าสนใจในช่วงครึ่งปีหลัง 2024",
    comments: 203,
    upvotes: 512,
  },
];

interface RecommendedCommunity {
  id: string;
  name: string;
  icon: string;
  members: string;
  description: string;
}

const recommendedCommunities: RecommendedCommunity[] = [
  {
    id: "1",
    name: "Web Development",
    icon: "🌐",
    members: "25.3k",
    description: "ชุมชนสำหรับนักพัฒนาเว็บไซต์",
  },
  {
    id: "2",
    name: "การลงทุน",
    icon: "📈",
    members: "18.7k",
    description: "แบ่งปันความรู้เรื่องการลงทุน",
  },
  {
    id: "3",
    name: "ภาษาต่างประเทศ",
    icon: "🗣️",
    members: "12.1k",
    description: "เรียนรู้และฝึกฝนภาษา",
  },
];

export function RightSidebar() {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-80 xl:block">
      <ScrollArea className="h-full py-6 pr-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">กระทู้เด่นวันนี้</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trendingPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="block rounded-lg p-2 transition-colors hover:bg-muted"
                >
                  <h4 className="mb-2 text-sm font-medium leading-tight line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {post.upvotes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {post.comments}
                    </span>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">ชุมชนแนะนำ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recommendedCommunities.map((community) => (
                <div
                  key={community.id}
                  className="rounded-lg border p-3 transition-colors hover:bg-muted"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-lg">
                        {community.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">
                          {community.name}
                        </h4>
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {community.members}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="mb-2 text-xs text-muted-foreground">
                    {community.description}
                  </p>
                  <Button size="sm" variant="outline" className="w-full text-xs">
                    เข้าร่วม
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">เกี่ยวกับ 404talk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                แพลตฟอร์มแบ่งปันความรู้และประสบการณ์
                สำหรับคนไทยที่รักการเรียนรู้
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <Link
                  href="/rules"
                  className="text-primary hover:underline"
                >
                  กฎการใช้งาน
                </Link>
                <Link
                  href="/contact"
                  className="text-primary hover:underline"
                >
                  ติดต่อเรา
                </Link>
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  นโยบายความเป็นส่วนตัว
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                © 2024 404talk.com
              </p>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
}
