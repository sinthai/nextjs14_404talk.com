import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "อีเมลเป็นข้อมูลที่จำเป็น",
    })
    .min(1, "อีเมลเป็นข้อมูลที่จำเป็น"),
  password: z
    .string({
      required_error: "รหัสผ่านเป็นข้อมูลที่จำเป็น",
    })
    .min(1, "รหัสผ่านเป็นข้อมูลที่จำเป็น"),
  rememberMe: z.boolean().default(false),
});

export type LoginSchema = z.infer<typeof loginSchema>;
