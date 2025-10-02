"use client";

import { useState } from "react";
import { Search, MoveHorizontal as MoreHorizontal, Eye, UserCog, Ban, CircleCheck as CheckCircle } from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserDetailsDialog } from "@/components/admin/user-details-dialog";
import { mockUsers } from "@/lib/admin/mock-data";
import type { User } from "@/types/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  const handleChangeRole = (userId: string, newRole: User["role"]) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u
      )
    );
    toast.success("เปลี่ยนบทบาทผู้ใช้สำเร็จ");
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: "suspended" as const } : u
      )
    );
    toast.success("ระงับบัญชีผู้ใช้สำเร็จ");
  };

  const handleActivateUser = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: "active" as const } : u
      )
    );
    toast.success("เปิดใช้งานบัญชีผู้ใช้สำเร็จ");
  };

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
        return "Admin";
      case "moderator":
        return "Moderator";
      default:
        return "User";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "ใช้งาน";
      case "suspended":
        return "ระงับ";
      case "banned":
        return "แบน";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">จัดการผู้ใช้</h1>
        <p className="text-muted-foreground">
          จัดการผู้ใช้งานในระบบและตรวจสอบกิจกรรม
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="ค้นหาผู้ใช้..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="บทบาท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกบทบาท</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="สถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="active">ใช้งาน</SelectItem>
              <SelectItem value="suspended">ระงับ</SelectItem>
              <SelectItem value="banned">แบน</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ผู้ใช้ทั้งหมด ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="text-center">โพสต์</TableHead>
                <TableHead className="text-center">ความคิดเห็น</TableHead>
                <TableHead>สมัครเมื่อ</TableHead>
                <TableHead className="text-right">การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                      ? "ไม่พบผู้ใช้ที่ค้นหา"
                      : "ยังไม่มีผู้ใช้"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {user.displayName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.displayName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {getStatusLabel(user.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{user.postCount}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{user.commentCount}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "d MMM yyyy", {
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
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(user)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            ดูรายละเอียด
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, "admin")}
                            disabled={user.role === "admin"}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            เปลี่ยนเป็น Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, "moderator")}
                            disabled={user.role === "moderator"}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            เปลี่ยนเป็น Moderator
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(user.id, "user")}
                            disabled={user.role === "user"}
                          >
                            <UserCog className="mr-2 h-4 w-4" />
                            เปลี่ยนเป็น User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleSuspendUser(user.id)}
                              className="text-destructive"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              ระงับบัญชี
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleActivateUser(user.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              เปิดใช้งานบัญชี
                            </DropdownMenuItem>
                          )}
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

      <UserDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}
