"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { mockUserProfile } from "@/lib/user-dashboard/mock-data";
import { toast } from "sonner";
import { Camera, MapPin, Globe, Twitter, Github, Linkedin } from "lucide-react";

const profileSchema = z.object({
  displayName: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร").max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร"),
  bio: z.string().max(200, "Bio ต้องไม่เกิน 200 ตัวอักษร").optional(),
  location: z.string().max(50, "ที่อยู่ต้องไม่เกิน 50 ตัวอักษร").optional(),
  website: z.string().url("กรุณากรอก URL ที่ถูกต้อง").or(z.literal("")).optional(),
  twitter: z.string().max(50).optional(),
  github: z.string().max(50).optional(),
  linkedin: z.string().max(50).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const profile = mockUserProfile;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: profile.displayName,
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      twitter: profile.socialLinks?.twitter || "",
      github: profile.socialLinks?.github || "",
      linkedin: profile.socialLinks?.linkedin || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("บันทึกโปรไฟล์สำเร็จ");
      setIsEditing(false);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">โปรไฟล์</h1>
        <p className="text-muted-foreground">จัดการข้อมูลส่วนตัวของคุณ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลส่วนตัว</CardTitle>
          <CardDescription>
            ข้อมูลนี้จะแสดงในโปรไฟล์สาธารณะของคุณ
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-3xl">
                    {profile.displayName[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">รูปโปรไฟล์</h3>
                <p className="text-sm text-muted-foreground">
                  รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 2MB
                </p>
                <Button variant="outline" size="sm" disabled>
                  อัปโหลดรูปภาพ
                </Button>
              </div>
            </div>

            <Separator />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อที่แสดง</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ชื่อของคุณ"
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        ชื่อนี้จะแสดงในโปรไฟล์และกระทู้ของคุณ
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เกี่ยวกับคุณ</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="เขียนอะไรสักหน่อยเกี่ยวกับตัวคุณ..."
                          rows={4}
                          disabled={!isEditing}
                        />
                      </FormControl>
                      <FormDescription>
                        แนะนำตัวสั้นๆ ไม่เกิน 200 ตัวอักษร
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>ที่อยู่</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="กรุงเทพ, ไทย"
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เว็บไซต์</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="https://yourwebsite.com"
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">โซเชียลมีเดีย</h3>

                  <FormField
                    control={form.control}
                    name="twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="username"
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="username"
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              placeholder="username"
                              className="pl-9"
                              disabled={!isEditing}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button type="submit">บันทึกการเปลี่ยนแปลง</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          form.reset();
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </>
                  ) : (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      แก้ไขโปรไฟล์
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
