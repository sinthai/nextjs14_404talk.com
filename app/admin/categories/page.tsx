"use client";

import { useState, useEffect } from "react";
import { Plus, Search, CreditCard as Edit, Trash2, MoveHorizontal as MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
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
import { CategoryDialog } from "@/components/admin/category-dialog";
import { categoriesApi } from "@/lib/api/admin/categories";
import type { Category, CategoryListParams } from "@/types/admin";
import { toast } from "sonner";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<CategoryListParams["sortBy"]>("sortOrder");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const params: CategoryListParams = {
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      if (statusFilter !== "all") {
        params.isActive = statusFilter === "active";
      }

      const response = await categoriesApi.list(params);

      if (response.success) {
        setCategories(response.data.items);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (error) {
      toast.error("ไม่สามารถโหลดข้อมูลหมวดหมู่ได้");
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, pageSize, searchQuery, statusFilter, sortBy, sortOrder]);

  const handleCreateCategory = () => {
    setSelectedCategory(undefined);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      toast.success("ลบหมวดหมู่สำเร็จ");
      setCategoryToDelete(null);
      fetchCategories();
    }
    setDeleteDialogOpen(false);
  };

  const handleSaveCategory = (data: any) => {
    toast.success(selectedCategory ? "แก้ไขหมวดหมู่สำเร็จ" : "สร้างหมวดหมู่สำเร็จ");
    setIsDialogOpen(false);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการหมวดหมู่</h1>
          <p className="text-muted-foreground">
            จัดการหมวดหมู่สำหรับกระทู้และบทความ
          </p>
        </div>
        <Button onClick={handleCreateCategory}>
          <Plus className="mr-2 h-4 w-4" />
          สร้างหมวดหมู่ใหม่
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>หมวดหมู่ทั้งหมด ({totalItems})</CardTitle>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาหมวดหมู่..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="active">เปิดใช้งาน</SelectItem>
                  <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sortOrder">ลำดับ</SelectItem>
                  <SelectItem value="name">ชื่อ</SelectItem>
                  <SelectItem value="postCount">จำนวนโพสต์</SelectItem>
                  <SelectItem value="createdAt">วันที่สร้าง</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              กำลังโหลด...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ชื่อหมวดหมู่</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>คำอธิบาย</TableHead>
                    <TableHead className="text-center">สถานะ</TableHead>
                    <TableHead className="text-center">จำนวนโพสต์</TableHead>
                    <TableHead>สร้างเมื่อ</TableHead>
                    <TableHead className="text-right">การจัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground">
                        {searchQuery || statusFilter !== "all"
                          ? "ไม่พบหมวดหมู่ที่ค้นหา"
                          : "ยังไม่มีหมวดหมู่"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {category.color && (
                              <div
                                className="h-4 w-4 rounded"
                                style={{ backgroundColor: category.color }}
                              />
                            )}
                            <span className="font-medium">{category.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{category.slug}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {category.description || "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={category.isActive ? "default" : "secondary"}>
                            {category.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{category.postCount}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {format(new Date(category.createdAt), "d MMM yyyy", {
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
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(category)}
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

              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    แสดง {(currentPage - 1) * pageSize + 1} ถึง{" "}
                    {Math.min(currentPage * pageSize, totalItems)} จาก {totalItems} รายการ
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      ก่อนหน้า
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber: number;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      ถัดไป
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบหมวดหมู่</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่ &quot;{categoryToDelete?.name}&quot;?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              ลบหมวดหมู่
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
