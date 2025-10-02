"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Category } from "@/types/admin";

const categorySchema = z.object({
  name: z.string().min(1, "กรุณากรอกชื่อหมวดหมู่").max(50, "ชื่อหมวดหมู่ต้องไม่เกิน 50 ตัวอักษร"),
  slug: z.string().min(1, "กรุณากรอก slug").max(50, "slug ต้องไม่เกิน 50 ตัวอักษร").regex(/^[a-z0-9-]+$/, "slug ต้องเป็นตัวอักษรพิมพ์เล็ก ตัวเลข และ - เท่านั้น"),
  description: z.string().max(200, "คำอธิบายต้องไม่เกิน 200 ตัวอักษร").optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "รูปแบบสีไม่ถูกต้อง").optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category;
  onSave: (data: CategoryFormData) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      color: category?.color || "#3b82f6",
    },
  });

  const handleSubmit = async (data: CategoryFormData) => {
    setIsSubmitting(true);
    try {
      await onSave(data);
      toast.success(category ? "แก้ไขหมวดหมู่สำเร็จ" : "สร้างหมวดหมู่สำเร็จ");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "แก้ไขหมวดหมู่" : "สร้างหมวดหมู่ใหม่"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "แก้ไขข้อมูลหมวดหมู่ของคุณ"
              : "กรอกข้อมูลเพื่อสร้างหมวดหมู่ใหม่"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อหมวดหมู่</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="เช่น การเขียนโปรแกรม"
                      onChange={(e) => {
                        field.onChange(e);
                        if (!category) {
                          form.setValue("slug", generateSlug(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="programming" />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version ของชื่อหมวดหมู่
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>คำอธิบาย (ไม่บังคับ)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="อธิบายเกี่ยวกับหมวดหมู่นี้"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สี (ไม่บังคับ)</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input {...field} type="color" className="h-10 w-20" />
                    </FormControl>
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
