import { z } from "zod";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "ชื่อชุมชนต้องมีอย่างน้อย 3 ตัวอักษร")
    .max(21, "ชื่อชุมชนต้องไม่เกิน 21 ตัวอักษร")
    .regex(/^[a-zA-Z0-9_]+$/, "ชื่อชุมชนสามารถใช้ได้เฉพาะตัวอักษร ตัวเลข และ _ เท่านั้น")
    .refine((val) => !val.startsWith("_"), "ชื่อชุมชนต้องไม่ขึ้นต้นด้วย _"),

  displayName: z
    .string()
    .min(1, "กรุณากรอกชื่อที่แสดง")
    .max(50, "ชื่อที่แสดงต้องไม่เกิน 50 ตัวอักษร"),

  description: z
    .string()
    .min(10, "คำอธิบายต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(500, "คำอธิบายต้องไม่เกิน 500 ตัวอักษร"),

  type: z.enum(["public", "restricted", "private"], {
    required_error: "กรุณาเลือกประเภทชุมชน",
  }),

  contentType: z.enum(["posts_and_comments", "posts_only"], {
    required_error: "กรุณาเลือกประเภทเนื้อหา",
  }),

  topics: z
    .array(z.string())
    .min(1, "กรุณาเลือกหัวข้ออย่างน้อย 1 หัวข้อ")
    .max(3, "สามารถเลือกได้สูงสุด 3 หัวข้อ"),

  isNSFW: z.boolean().default(false),
});

export type CreateCommunityFormData = z.infer<typeof createCommunitySchema>;

export const availableTopics = [
  "เทคโนโลยี",
  "การเขียนโปรแกรม",
  "การออกแบบ",
  "ธุรกิจ",
  "การตลาด",
  "การศึกษา",
  "วิทยาศาสตร์",
  "สุขภาพ",
  "กีฬา",
  "เกม",
  "ภาพยนตร์",
  "ดนตรี",
  "ศิลปะ",
  "อาหาร",
  "ท่องเที่ยว",
  "แฟชั่น",
  "ความงาม",
  "ไลฟ์สไตล์",
  "การเงิน",
  "การลงทุน",
];
