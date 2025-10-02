"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Bell, Lock, Globe } from "lucide-react";

interface Settings {
  notifications: {
    emailComments: boolean;
    emailReplies: boolean;
    emailMentions: boolean;
    emailFollowers: boolean;
    emailNewsletter: boolean;
    pushComments: boolean;
    pushReplies: boolean;
    pushMentions: boolean;
  };
  privacy: {
    showEmail: boolean;
    showProfile: boolean;
    allowFollowers: boolean;
  };
  preferences: {
    language: string;
    theme: string;
    postsPerPage: string;
  };
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      emailComments: true,
      emailReplies: true,
      emailMentions: true,
      emailFollowers: false,
      emailNewsletter: true,
      pushComments: true,
      pushReplies: true,
      pushMentions: false,
    },
    privacy: {
      showEmail: false,
      showProfile: true,
      allowFollowers: true,
    },
    preferences: {
      language: "th",
      theme: "system",
      postsPerPage: "20",
    },
  });

  const handleSave = () => {
    toast.success("บันทึกการตั้งค่าสำเร็จ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">ตั้งค่า</h1>
        <p className="text-muted-foreground">
          จัดการการตั้งค่าบัญชีและความเป็นส่วนตัว
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <div>
              <CardTitle>การแจ้งเตือน</CardTitle>
              <CardDescription>
                เลือกวิธีที่คุณต้องการรับการแจ้งเตือน
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-4 text-sm font-medium">การแจ้งเตือนทางอีเมล</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-comments" className="flex-1 cursor-pointer">
                  ความคิดเห็นใหม่
                  <p className="text-sm font-normal text-muted-foreground">
                    รับอีเมลเมื่อมีคนแสดงความคิดเห็นในกระทู้ของคุณ
                  </p>
                </Label>
                <Switch
                  id="email-comments"
                  checked={settings.notifications.emailComments}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailComments: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-replies" className="flex-1 cursor-pointer">
                  การตอบกลับ
                  <p className="text-sm font-normal text-muted-foreground">
                    รับอีเมลเมื่อมีคนตอบกลับความคิดเห็นของคุณ
                  </p>
                </Label>
                <Switch
                  id="email-replies"
                  checked={settings.notifications.emailReplies}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailReplies: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-mentions" className="flex-1 cursor-pointer">
                  การกล่าวถึง
                  <p className="text-sm font-normal text-muted-foreground">
                    รับอีเมลเมื่อมีคนกล่าวถึงคุณ
                  </p>
                </Label>
                <Switch
                  id="email-mentions"
                  checked={settings.notifications.emailMentions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailMentions: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-followers" className="flex-1 cursor-pointer">
                  ผู้ติดตามใหม่
                  <p className="text-sm font-normal text-muted-foreground">
                    รับอีเมลเมื่อมีผู้ติดตามใหม่
                  </p>
                </Label>
                <Switch
                  id="email-followers"
                  checked={settings.notifications.emailFollowers}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailFollowers: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="email-newsletter" className="flex-1 cursor-pointer">
                  จดหมายข่าว
                  <p className="text-sm font-normal text-muted-foreground">
                    รับอีเมลเกี่ยวกับข่าวสารและอัปเดตล่าสุด
                  </p>
                </Label>
                <Switch
                  id="email-newsletter"
                  checked={settings.notifications.emailNewsletter}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNewsletter: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-sm font-medium">การแจ้งเตือนแบบ Push</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-comments" className="flex-1 cursor-pointer">
                  ความคิดเห็นใหม่
                </Label>
                <Switch
                  id="push-comments"
                  checked={settings.notifications.pushComments}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushComments: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-replies" className="flex-1 cursor-pointer">
                  การตอบกลับ
                </Label>
                <Switch
                  id="push-replies"
                  checked={settings.notifications.pushReplies}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushReplies: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="push-mentions" className="flex-1 cursor-pointer">
                  การกล่าวถึง
                </Label>
                <Switch
                  id="push-mentions"
                  checked={settings.notifications.pushMentions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushMentions: checked },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            <div>
              <CardTitle>ความเป็นส่วนตัว</CardTitle>
              <CardDescription>
                ควบคุมว่าใครสามารถเห็นข้อมูลของคุณได้บ้าง
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-email" className="flex-1 cursor-pointer">
              แสดงอีเมล
              <p className="text-sm font-normal text-muted-foreground">
                อนุญาตให้ผู้อื่นเห็นอีเมลของคุณ
              </p>
            </Label>
            <Switch
              id="show-email"
              checked={settings.privacy.showEmail}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, showEmail: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-profile" className="flex-1 cursor-pointer">
              โปรไฟล์สาธารณะ
              <p className="text-sm font-normal text-muted-foreground">
                อนุญาตให้ผู้อื่นดูโปรไฟล์ของคุณ
              </p>
            </Label>
            <Switch
              id="show-profile"
              checked={settings.privacy.showProfile}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, showProfile: checked },
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allow-followers" className="flex-1 cursor-pointer">
              อนุญาตให้ติดตาม
              <p className="text-sm font-normal text-muted-foreground">
                อนุญาตให้ผู้อื่นติดตามคุณได้
              </p>
            </Label>
            <Switch
              id="allow-followers"
              checked={settings.privacy.allowFollowers}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, allowFollowers: checked },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <div>
              <CardTitle>ความชอบ</CardTitle>
              <CardDescription>
                ปรับแต่งประสบการณ์การใช้งานของคุณ
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">ภาษา</Label>
            <Select
              value={settings.preferences.language}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, language: value },
                })
              }
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="th">ภาษาไทย</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">ธีม</Label>
            <Select
              value={settings.preferences.theme}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, theme: value },
                })
              }
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">สว่าง</SelectItem>
                <SelectItem value="dark">มืด</SelectItem>
                <SelectItem value="system">ตามระบบ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="posts-per-page">จำนวนโพสต์ต่อหน้า</Label>
            <Select
              value={settings.preferences.postsPerPage}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, postsPerPage: value },
                })
              }
            >
              <SelectTrigger id="posts-per-page">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          บันทึกการเปลี่ยนแปลง
        </Button>
      </div>
    </div>
  );
}
