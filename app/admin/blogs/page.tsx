"use client";

import { useState } from "react";
import { Plus, Search, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2, Eye } from "lucide-react";
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
import { mockBlogPosts } from "@/lib/admin/mock-data";
import type { BlogPost } from "@/types/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(mockBlogPosts);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPost | null>(null);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || blog.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (blog: BlogPost) => {
    setBlogToDelete(blog);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (blogToDelete) {
      setBlogs(blogs.filter((b) => b.id !== blogToDelete.id));
      toast.success("ลบบทความสำเร็จ");
      setBlogToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handlePublish = (blogId: string) => {
    setBlogs(
      blogs.map((b) =>
        b.id === blogId
          ? {
              ...b,
              status: "published" as const,
              publishedAt: new Date().toISOString(),
            }
          : b
      )
    );
    toast.success("เผยแพร่บทความสำเร็จ");
  };

  const handleUnpublish = (blogId: string) => {
    setBlogs(
      blogs.map((b) =>
        b.id === blogId
          ? {
              ...b,
              status: "draft" as const,
              publishedAt: undefined,
            }
          : b
      )
    );
    toast.success("ยกเลิกการเผยแพร่บทความสำเร็จ");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "published":
        return "เผยแพร่แล้ว";
      case "draft":
        return "แบบร่าง";
      case "scheduled":
        return "จัดตารางแล้ว";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการบทความ</h1>
          <p className="text-muted-foreground">
            จัดการบทความและเนื้อหาทั้งหมดในระบบ
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          สร้างบทความใหม่
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาบทความ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="สถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกสถานะ</SelectItem>
            <SelectItem value="published">เผยแพร่แล้ว</SelectItem>
            <SelectItem value="draft">แบบร่าง</SelectItem>
            <SelectItem value="scheduled">จัดตารางแล้ว</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>บทความทั้งหมด ({filteredBlogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อบทความ</TableHead>
                <TableHead>ผู้เขียน</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-center">จำนวนผู้เข้าชม</TableHead>
                <TableHead>เผยแพร่เมื่อ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    {searchQuery || statusFilter !== "all"
                      ? "ไม่พบบทความที่ค้นหา"
                      : "ยังไม่มีบทความ"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <div className="font-medium">{blog.title}</div>
                        {blog.excerpt && (
                          <p className="mt-1 truncate text-sm text-muted-foreground">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {blog.authorName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{blog.categoryName}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(blog.status)}>
                        {getStatusLabel(blog.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{blog.viewCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {blog.publishedAt
                        ? format(new Date(blog.publishedAt), "d MMM yyyy", {
                            locale: th,
                          })
                        : "-"}
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
                            ดูบทความ
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            แก้ไข
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {blog.status === "published" ? (
                            <DropdownMenuItem
                              onClick={() => handleUnpublish(blog.id)}
                            >
                              ยกเลิกการเผยแพร่
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handlePublish(blog.id)}
                            >
                              เผยแพร่บทความ
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(blog)}
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
            <AlertDialogTitle>ยืนยันการลบบทความ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบบทความ &quot;{blogToDelete?.title}&quot;?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              ลบบทความ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
