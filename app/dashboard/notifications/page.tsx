"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, ThumbsUp, UserPlus, CircleAlert as AlertCircle, Reply, CheckCheck } from "lucide-react";
import { mockNotifications } from "@/lib/user-dashboard/mock-data";
import type { Notification } from "@/types/user-dashboard";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const notificationIcons = {
  comment: MessageCircle,
  reply: Reply,
  vote: ThumbsUp,
  mention: Bell,
  follow: UserPlus,
  system: AlertCircle,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    toast.success("ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว");
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    toast.success("ลบการแจ้งเตือนสำเร็จ");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">การแจ้งเตือน</h1>
          <p className="text-muted-foreground">
            ติดตามกิจกรรมและการอัปเดตต่างๆ
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>การแจ้งเตือนทั้งหมด</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount} ใหม่</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                ไม่มีการแจ้งเตือน
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notificationIcons[notification.type];

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                      !notification.isRead && "bg-accent",
                      notification.actionUrl && "cursor-pointer hover:bg-accent"
                    )}
                    onClick={() => {
                      if (!notification.isRead) {
                        handleMarkAsRead(notification.id);
                      }
                    }}
                  >
                    <div
                      className={cn(
                        "mt-1 rounded-full p-2",
                        notification.type === "comment" && "bg-blue-100 text-blue-600 dark:bg-blue-900/20",
                        notification.type === "reply" && "bg-green-100 text-green-600 dark:bg-green-900/20",
                        notification.type === "vote" && "bg-orange-100 text-orange-600 dark:bg-orange-900/20",
                        notification.type === "mention" && "bg-purple-100 text-purple-600 dark:bg-purple-900/20",
                        notification.type === "follow" && "bg-pink-100 text-pink-600 dark:bg-pink-900/20",
                        notification.type === "system" && "bg-gray-100 text-gray-600 dark:bg-gray-900/20"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: th,
                          })}
                        </span>

                        <div className="flex gap-2">
                          {notification.actionUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={notification.actionUrl}>
                                ดู
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                          >
                            ลบ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
