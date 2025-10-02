"use client";

import { Users, FileText, MessageSquare, FolderTree, TrendingUp, CircleAlert as AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/admin/stat-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { mockStats, mockActivityLogs, mockChartData } from "@/lib/admin/mock-data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">ภาพรวมของระบบและสถิติต่างๆ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="ผู้ใช้ทั้งหมด"
          value={mockStats.totalUsers}
          description={`+${mockStats.newUsersToday} วันนี้`}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="กระทู้ทั้งหมด"
          value={mockStats.totalThreads}
          description={`+${mockStats.newThreadsToday} วันนี้`}
          icon={MessageSquare}
          trend={{ value: 8.2, isPositive: true }}
        />
        <StatCard
          title="บทความทั้งหมด"
          value={mockStats.totalBlogs}
          description="เผยแพร่แล้ว"
          icon={FileText}
        />
        <StatCard
          title="หมวดหมู่"
          value={mockStats.totalCategories}
          description="หมวดหมู่ที่ใช้งาน"
          icon={FolderTree}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ผู้ใช้ออนไลน์
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">ออนไลน์ในขณะนี้</p>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              รายงานปัญหา
            </CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.reportedContent}</div>
            <p className="text-xs text-muted-foreground">รอการตรวจสอบ</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>สถิติการเติบโต (7 วันล่าสุด)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData}>
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
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                name="ผู้ใช้ใหม่"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="threads"
                name="กระทู้ใหม่"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="blogs"
                name="บทความใหม่"
                stroke="#10b981"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>กิจกรรมล่าสุด</CardTitle>
            <p className="text-sm text-muted-foreground">
              กิจกรรมของแอดมินและมอเดอเรเตอร์
            </p>
          </div>
          <Button variant="outline" size="sm">
            ดูทั้งหมด
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>การกระทำ</TableHead>
                <TableHead>รายละเอียด</TableHead>
                <TableHead>เวลา</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActivityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {log.userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{log.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.action === "created"
                          ? "default"
                          : log.action === "updated"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {log.action === "created"
                        ? "สร้าง"
                        : log.action === "updated"
                        ? "แก้ไข"
                        : "ลบ"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-sm">
                    {log.details}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(log.timestamp), {
                      addSuffix: true,
                      locale: th,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
