"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Pin,
  Lock,
  Unlock,
  PinOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { mockThreads } from "@/lib/admin/mock-data";
import type { Thread } from "@/types/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function ThreadsPage() {
  const [threads, setThreads] = useState<Thread[]>(mockThreads);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState<Thread | null>(null);

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || thread.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (thread: Thread) => {
    setThreadToDelete(thread);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (threadToDelete) {
      setThreads(threads.filter((t) => t.id !== threadToDelete.id));
      toast.success("ลบกระทู้สำเร็จ");
      setThreadToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleTogglePin = (threadId: string) => {
    setThreads(
      threads.map((t) =>
        t.id === threadId ? { ...t, isPinned: !t.isPinned } : t
      )
    );
    const thread = threads.find((t) => t.id === threadId);
    toast.success(thread?.isPinned ? "ยกเลิกปักหมุดกระทู้แล้ว" : "ปักหมุดกระทู้แล้ว");
  };

  const handleToggleLock = (threadId: string) => {
    setThreads(
      threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              status: t.status === "locked" ? ("active" as const) : ("locked" as const),
            }
          : t
      )
    );
    const thread = threads.find((t) => t.id === threadId);
    toast.success(
      thread?.status === "locked" ? "ปลดล็อกกระทู้แล้ว" : "ล็อกกระทู้แล้ว"
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "locked":
        return "secondary";
      case "deleted":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "ใช้งาน";
      case "locked":
        return "ล็อก";
      case "deleted":
        return "ลบแล้ว";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">จัดการกระทู้</h1>
        <p className="text-muted-foreground">
          จัดการกระทู้และดูแลเนื้อหาที่ผู้ใช้โพสต์
        </p>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อกระทู้</TableHead>
                <TableHead>ผู้เขียน</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-center">การมองเห็น</TableHead>
                <TableHead className="text-center">โหวต</TableHead>
                <TableHead className="text-center">ความคิดเห็น</TableHead>
                <TableHead>สร้างเมื่อ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredThreads.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-muted-foreground"
                  >
                    {searchQuery || statusFilter !== "all"
                      ? "ไม่พบกระทู้ที่ค้นหา"
                      : "ยังไม่มีกระทู้"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredThreads.map((thread) => (
                  <TableRow key={thread.id}>
                    <TableCell>
                      <div className="flex max-w-md items-center gap-2">
                        {thread.isPinned && (
                          <Pin className="h-4 w-4 text-primary" />
                        )}
                        <span className="font-medium">{thread.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {thread.authorName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{thread.categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(thread.status)}>
                        {getStatusLabel(thread.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{thread.viewCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{thread.voteCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{thread.commentCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(thread.createdAt), "d MMM yyyy", {
                        locale: th,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            ดูกระทู้
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleTogglePin(thread.id)}
                          >
                            {thread.isPinned ? (
                              <>
                                <PinOff className="mr-2 h-4 w-4" />
                                ยกเลิกปักหมุด
                              </>
                            ) : (
                              <>
                                <Pin className="mr-2 h-4 w-4" />
                                ปักหมุดกระทู้
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleLock(thread.id)}
                          >
                            {thread.status === "locked" ? (
                              <>
                                <Unlock className="mr-2 h-4 w-4" />
                                ปลดล็อก
                              </>
                            ) : (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                ล็อกกระทู้
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(thread)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            ลบ
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบกระทู้</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบกระทู้ &quot;{threadToDelete?.title}&quot;?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              ลบกระทู้
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
