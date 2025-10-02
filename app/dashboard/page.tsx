"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  Eye,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { mockUserProfile, mockDashboardStats, mockUserThreads } from "@/lib/user-dashboard/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";

export default function DashboardOverviewPage() {
  const profile = mockUserProfile;
  const stats = mockDashboardStats;
  const recentThreads = mockUserThreads.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ยินดีต้อนรับ, {profile.displayName}!</h1>
        <p className="text-muted-foreground">ภาพรวมกิจกรรมและสถิติของคุณ</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-3xl">
                {profile.displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{profile.displayName}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>

              {profile.bio && (
                <p className="text-sm">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">เข้าร่วมเมื่อ</span>
                  <span className="font-medium">
                    {format(new Date(profile.joinedAt), "MMMM yyyy", { locale: th })}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {profile.stats.threads} กระทู้
                </Badge>
                <Badge variant="secondary">
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {profile.stats.comments} ความคิดเห็น
                </Badge>
                <Badge variant="secondary">
                  <ThumbsUp className="mr-1 h-3 w-3" />
                  {profile.stats.likes} ไลค์
                </Badge>
              </div>
            </div>

            <div>
              <Link href="/dashboard/profile">
                <Button>แก้ไขโปรไฟล์</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              กระทู้ทั้งหมด
            </CardTitle>
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalThreads}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              +2 ในเดือนนี้
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ความคิดเห็น
            </CardTitle>
            <MessageCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              +18 ในเดือนนี้
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ไลค์ที่ได้รับ
            </CardTitle>
            <ThumbsUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              +45 ในเดือนนี้
            </p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              จำนวนการเข้าชม
            </CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              +234 ในเดือนนี้
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>กิจกรรมล่าสุด (7 วัน)</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                กระทู้และความคิดเห็นของคุณ
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.recentActivity}>
              <defs>
                <linearGradient id="threads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="comments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Area
                type="monotone"
                dataKey="threads"
                name="กระทู้"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#threads)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="comments"
                name="ความคิดเห็น"
                stroke="hsl(var(--secondary))"
                fillOpacity={1}
                fill="url(#comments)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>กระทู้ล่าสุด</CardTitle>
            <Link href="/dashboard/threads">
              <Button variant="ghost" size="sm">
                ดูทั้งหมด
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentThreads.map((thread) => (
              <div
                key={thread.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{thread.title}</h3>
                    {thread.isPinned && (
                      <Badge variant="secondary" className="text-xs">
                        ปักหมุด
                      </Badge>
                    )}
                  </div>
                  {thread.excerpt && (
                    <p className="text-sm text-muted-foreground">{thread.excerpt}</p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline">{thread.categoryName}</Badge>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {thread.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {thread.voteCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      {thread.commentCount}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/threads/${thread.slug}`}>ดู</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
