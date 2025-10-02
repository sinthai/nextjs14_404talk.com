"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createCommunitySchema,
  availableTopics,
  type CreateCommunityFormData,
} from "@/lib/validations/community";
import { toast } from "sonner";
import { Globe, Lock, Users, MessageSquare, FileText, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCommunityPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateCommunityFormData>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: {
      name: "",
      displayName: "",
      description: "",
      type: "public",
      contentType: "posts_and_comments",
      topics: [],
      isNSFW: false,
    },
  });

  const onSubmit = async (data: CreateCommunityFormData) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("สร้างชุมชนสำเร็จ!");
      router.push(`/c/${data.name}`);
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTopics = form.watch("topics") || [];
  const communityName = form.watch("name");

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">สร้างชุมชน</h1>
          <p className="mt-2 text-muted-foreground">
            สร้างพื้นที่สำหรับผู้คนที่มีความสนใจเหมือนกันมารวมตัวกัน
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลพื้นฐาน</CardTitle>
                <CardDescription>
                  ตั้งชื่อและอธิบายชุมชนของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อชุมชน</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-muted-foreground">
                            c/
                          </span>
                          <Input
                            {...field}
                            placeholder="myawesomecommunity"
                            className="pl-8"
                            onChange={(e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                              field.onChange(value);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        ชื่อชุมชนต้องมี 3-21 ตัวอักษร ใช้เฉพาะ a-z, 0-9, และ _
                        {communityName && (
                          <span className="mt-1 block font-medium text-primary">
                            c/{communityName}
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อที่แสดง</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="ชุมชนที่น่าสนใจของฉัน" />
                      </FormControl>
                      <FormDescription>
                        ชื่อที่จะแสดงในหน้าชุมชน (สามารถใช้ภาษาไทยได้)
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
                      <FormLabel>คำอธิบาย</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="บอกเล่าว่าชุมชนนี้เกี่ยวกับอะไร..."
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        อธิบายจุดประสงค์ของชุมชนให้คนอื่นเข้าใจ (10-500 ตัวอักษร)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ประเภทชุมชน</CardTitle>
                <CardDescription>
                  กำหนดว่าใครสามารถดูและโพสต์ในชุมชนได้บ้าง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                            <RadioGroupItem value="public" id="public" className="mt-1" />
                            <Label htmlFor="public" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span className="font-semibold">สาธารณะ</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                ทุกคนสามารถดู โพสต์ และแสดงความคิดเห็นในชุมชนนี้ได้
                              </p>
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                            <RadioGroupItem value="restricted" id="restricted" className="mt-1" />
                            <Label htmlFor="restricted" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span className="font-semibold">จำกัด</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                ทุกคนสามารถดูได้ แต่มีเฉพาะผู้ที่ได้รับอนุญาตเท่านั้นที่โพสต์ได้
                              </p>
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                            <RadioGroupItem value="private" id="private" className="mt-1" />
                            <Label htmlFor="private" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                <span className="font-semibold">ส่วนตัว</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                เฉพาะสมาชิกที่ได้รับเชิญเท่านั้นที่สามารถดูและโพสต์ได้
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ประเภทเนื้อหา</CardTitle>
                <CardDescription>
                  เลือกประเภทเนื้อหาที่อนุญาตในชุมชน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="space-y-3"
                        >
                          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                            <RadioGroupItem value="posts_and_comments" id="posts_and_comments" className="mt-1" />
                            <Label htmlFor="posts_and_comments" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span className="font-semibold">โพสต์และความคิดเห็น</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                อนุญาตให้สร้างโพสต์และแสดงความคิดเห็น
                              </p>
                            </Label>
                          </div>

                          <div className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent">
                            <RadioGroupItem value="posts_only" id="posts_only" className="mt-1" />
                            <Label htmlFor="posts_only" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-semibold">เฉพาะโพสต์</span>
                              </div>
                              <p className="mt-1 text-sm text-muted-foreground">
                                อนุญาตให้สร้างโพสต์เท่านั้น ไม่มีความคิดเห็น
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>หัวข้อ</CardTitle>
                <CardDescription>
                  เลือกหัวข้อที่เกี่ยวข้องกับชุมชนของคุณ (สูงสุด 3 หัวข้อ)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="topics"
                  render={() => (
                    <FormItem>
                      <div className="mb-4 flex flex-wrap gap-2">
                        {selectedTopics.map((topic) => (
                          <Badge key={topic} variant="default">
                            {topic}
                          </Badge>
                        ))}
                        {selectedTopics.length === 0 && (
                          <p className="text-sm text-muted-foreground">
                            ยังไม่ได้เลือกหัวข้อ
                          </p>
                        )}
                      </div>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {availableTopics.map((topic) => (
                          <FormField
                            key={topic}
                            control={form.control}
                            name="topics"
                            render={({ field }) => {
                              const isSelected = field.value?.includes(topic);
                              const isDisabled = !isSelected && (field.value?.length ?? 0) >= 3;

                              return (
                                <FormItem key={topic}>
                                  <FormControl>
                                    <div
                                      className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                                        isDisabled
                                          ? "cursor-not-allowed opacity-50"
                                          : "cursor-pointer hover:bg-accent"
                                      } ${isSelected ? "border-primary bg-primary/5" : ""}`}
                                      onClick={() => {
                                        if (isDisabled) return;

                                        const newValue = isSelected
                                          ? field.value?.filter((t) => t !== topic)
                                          : [...(field.value ?? []), topic];
                                        field.onChange(newValue);
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onCheckedChange={(checked) => {
                                          const newValue = checked
                                            ? [...(field.value ?? []), topic]
                                            : field.value?.filter((t) => t !== topic);
                                          field.onChange(newValue);
                                        }}
                                      />
                                      <Label className="flex-1 cursor-pointer text-sm">
                                        {topic}
                                      </Label>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>เนื้อหาสำหรับผู้ใหญ่</CardTitle>
                <CardDescription>
                  กำหนดว่าชุมชนนี้มีเนื้อหาที่ไม่เหมาะสมหรือไม่
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="isNSFW"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          ชุมชนนี้มีเนื้อหา 18+
                        </FormLabel>
                        <FormDescription>
                          เนื้อหาในชุมชนนี้อาจไม่เหมาะสมสำหรับผู้ที่อายุต่ำกว่า 18 ปี
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-6">
              <div>
                <h3 className="font-semibold">พร้อมสร้างชุมชนของคุณแล้วใช่ไหม?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  หลังจากสร้างแล้ว ชื่อชุมชนจะไม่สามารถแก้ไขได้
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "กำลังสร้าง..." : "สร้างชุมชน"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
