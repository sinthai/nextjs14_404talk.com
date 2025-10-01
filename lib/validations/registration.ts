import { z } from "zod";

export const registrationSchema = z
  .object({
    email: z
      .string({
        required_error: "อีเมลเป็นข้อมูลที่จำเป็น",
      })
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .max(256, "อีเมลต้องไม่เกิน 256 ตัวอักษร"),
    password: z
      .string({
        required_error: "รหัสผ่านเป็นข้อมูลที่จำเป็น",
      })
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
      .regex(/[A-Z]/, "รหัสผ่านต้องมีตัวพิมพ์ใหญ่อย่างน้อย 1 ตัว")
      .regex(/[a-z]/, "รหัสผ่านต้องมีตัวพิมพ์เล็กอย่างน้อย 1 ตัว")
      .regex(/[0-9]/, "รหัสผ่านต้องมีตัวเลขอย่างน้อย 1 ตัว")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 1 ตัว"
      ),
    confirmPassword: z.string({
      required_error: "กรุณายืนยันรหัสผ่าน",
    }),
    displayName: z
      .string({
        required_error: "ชื่อที่แสดงเป็นข้อมูลที่จำเป็น",
      })
      .min(2, "ชื่อที่แสดงต้องมีอย่างน้อย 2 ตัวอักษร")
      .max(100, "ชื่อที่แสดงต้องไม่เกิน 100 ตัวอักษร"),
    firstName: z
      .string()
      .max(50, "ชื่อต้องไม่เกิน 50 ตัวอักษร")
      .optional()
      .or(z.literal("")),
    lastName: z
      .string()
      .max(50, "นามสกุลต้องไม่เกิน 50 ตัวอักษร")
      .optional()
      .or(z.literal("")),
    acceptTerms: z
      .boolean({
        required_error: "กรุณายอมรับข้อกำหนดและเงื่อนไข",
      })
      .refine((val) => val === true, {
        message: "กรุณายอมรับข้อกำหนดและเงื่อนไข",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  });

export type RegistrationSchema = z.infer<typeof registrationSchema>;
