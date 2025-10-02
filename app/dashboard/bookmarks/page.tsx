"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye } from "lucide-react";
import { mockBookmarks } from "@/lib/user-dashboard/mock-data";
import type { Bookmark } from "@/types/user-dashboard";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(mockBookmarks);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.threadTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.authorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemove = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== bookmarkId));
    toast.success("ลบบุ๊กมาร์กสำเร็จ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">บุ๊กมาร์ก</h1>
        <p className="text-muted-foreground">
          กระทู้ที่คุณบันทึกไว้
        </p>
      </div>

      <div className="relative md:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="ค้นหาบุ๊กมาร์ก..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>บุ๊กมาร์กทั้งหมด ({filteredBookmarks.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBookmarks.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {searchQuery
                  ? "ไม่พบบุ๊กมาร์กที่ค้นหา"
                  : "คุณยังไม่มีบุ๊กมาร์ก"}
              </div>
            ) : (
              filteredBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent"
                >
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold">{bookmark.threadTitle}</h3>
                      {bookmark.threadExcerpt && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {bookmark.threadExcerpt}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <Badge variant="outline">{bookmark.categoryName}</Badge>
                      <span className="text-muted-foreground">
                        โดย {bookmark.authorName}
                      </span>
                      <span className="text-muted-foreground">
                        บันทึกเมื่อ{" "}
                        {format(new Date(bookmark.bookmarkedAt), "d MMM yyyy", {
                          locale: th,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/threads/${bookmark.threadId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        ดู
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(bookmark.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
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
