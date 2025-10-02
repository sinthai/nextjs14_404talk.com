"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye, ThumbsUp, MessageCircle, Pin } from "lucide-react";
import { mockUserThreads } from "@/lib/user-dashboard/mock-data";
import type { UserThread } from "@/types/user-dashboard";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";

export default function MyThreadsPage() {
  const [threads, setThreads] = useState<UserThread[]>(mockUserThreads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || thread.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (threadId: string) => {
    setThreads(threads.filter((t) => t.id !== threadId));
    toast.success("ลบกระทู้สำเร็จ");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">ใช้งาน</Badge>;
      case "locked":
        return <Badge variant="secondary">ล็อก</Badge>;
      case "deleted":
        return <Badge variant="destructive">ลบแล้ว</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">กระทู้ของฉัน</h1>
          <p className="text-muted-foreground">
            จัดการกระทู้ทั้งหมดของคุณ
          </p>
        </div>
        <Button asChild>
          <Link href="/threads/create">
            <Plus className="mr-2 h-4 w-4" />
            สร้างกระทู้ใหม่
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหากระทู้..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="active">ใช้งาน</SelectItem>
            <SelectItem value="locked">ล็อก</SelectItem>
            <SelectItem value="deleted">ลบแล้ว</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>กระทู้ทั้งหมด ({filteredThreads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredThreads.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {searchQuery || statusFilter !== "all"
                  ? "ไม่พบกระทู้ที่ค้นหา"
                  : "คุณยังไม่มีกระทู้"}
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {thread.isPinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                          <h3 className="font-semibold">{thread.title}</h3>
                        </div>
                        {thread.excerpt && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {thread.excerpt}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/threads/${thread.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              ดูกระทู้
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/threads/${thread.slug}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              แก้ไข
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(thread.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="outline">{thread.categoryName}</Badge>
                      {getStatusBadge(thread.status)}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Eye className="h-3.5 w-3.5" />
                        {thread.viewCount}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {thread.voteCount}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {thread.commentCount}
                      </span>
                      <span className="text-muted-foreground">
                        {format(new Date(thread.createdAt), "d MMM yyyy", {
                          locale: th,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
