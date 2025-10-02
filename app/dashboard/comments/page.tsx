"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Edit, Trash2, Eye, ThumbsUp, Reply } from "lucide-react";
import { mockUserComments } from "@/lib/user-dashboard/mock-data";
import type { UserComment } from "@/types/user-dashboard";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";

export default function MyCommentsPage() {
  const [comments, setComments] = useState<UserComment[]>(mockUserComments);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComments = comments.filter((comment) =>
    comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comment.threadTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (commentId: string) => {
    setComments(comments.filter((c) => c.id !== commentId));
    toast.success("ลบความคิดเห็นสำเร็จ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ความคิดเห็นของฉัน</h1>
        <p className="text-muted-foreground">
          จัดการความคิดเห็นทั้งหมดของคุณ
        </p>
      </div>

      <div className="relative md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาความคิดเห็น..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ความคิดเห็นทั้งหมด ({filteredComments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComments.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {searchQuery
                  ? "ไม่พบความคิดเห็นที่ค้นหา"
                  : "คุณยังไม่มีความคิดเห็น"}
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div>
                        <Link
                          href={`/threads/${comment.threadId}`}
                          className="font-medium hover:underline"
                        >
                          {comment.threadTitle}
                        </Link>
                        {comment.parentCommentId && (
                          <Badge variant="outline" className="ml-2">
                            <Reply className="mr-1 h-3 w-3" />
                            ตอบกลับ
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm">{comment.content}</p>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {comment.voteCount}
                        </span>
                        <span>
                          {format(new Date(comment.createdAt), "d MMM yyyy HH:mm", {
                            locale: th,
                          })}
                        </span>
                        {comment.updatedAt !== comment.createdAt && (
                          <Badge variant="secondary" className="text-xs">
                            แก้ไขแล้ว
                          </Badge>
                        )}
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/threads/${comment.threadId}#comment-${comment.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            ดูความคิดเห็น
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          แก้ไข
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(comment.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          ลบ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
