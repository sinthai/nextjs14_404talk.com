"use client";

import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types/admin";
import { Mail, Calendar, Clock, FileText, MessageSquare } from "lucide-react";

interface UserDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export function UserDetailsDialog({
  open,
  onOpenChange,
  user,
}: UserDetailsDialogProps) {
  if (!user) return null;

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "suspended":
        return "secondary";
      case "banned":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "ผู้ดูแลระบบ";
      case "moderator":
        return "ผู้ดูแล";
      default:
        return "ผู้ใช้ทั่วไป";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "ใช้งานปกติ";
      case "suspended":
        return "ระงับชั่วคราว";
      case "banned":
        return "ถูกแบน";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>รายละเอียดผู้ใช้</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user.displayName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-xl font-semibold">{user.displayName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {getStatusLabel(user.status)}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">สมัครเมื่อ:</span>
              <span className="font-medium">
                {format(new Date(user.createdAt), "d MMMM yyyy", {
                  locale: th,
                })}
              </span>
            </div>

            {user.lastLoginAt && (
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">เข้าสู่ระบบล่าสุด:</span>
                <span className="font-medium">
                  {format(new Date(user.lastLoginAt), "d MMMM yyyy HH:mm", {
                    locale: th,
                  })}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">จำนวนโพสต์:</span>
              <Badge variant="secondary">{user.postCount}</Badge>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">จำนวนความคิดเห็น:</span>
              <Badge variant="secondary">{user.commentCount}</Badge>
            </div>
          </div>

          {user.bio && (
            <>
              <Separator />
              <div>
                <h4 className="mb-2 text-sm font-medium">เกี่ยวกับ</h4>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
