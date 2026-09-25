// R6: zod schema trainerName / teamName / email / confirmEmail · ชื่อทีมห้ามซ้ำกับ Pokémon ในทีม
import { z } from 'zod'

export function createRegistrationSchema(teamNames = []) {
  return z
    .object({
      trainerName: z
        .string()
        .trim()
        .min(2, 'ชื่อเทรนเนอร์ต้องมีอย่างน้อย 2 ตัวอักษร')
        .max(30, 'ชื่อเทรนเนอร์ต้องไม่เกิน 30 ตัวอักษร'),
      teamName: z
        .string()
        .trim()
        .min(3, 'ชื่อทีมต้องมีอย่างน้อย 3 ตัวอักษร')
        .max(20, 'ชื่อทีมต้องไม่เกิน 20 ตัวอักษร')
        .regex(/^[A-Za-z0-9 ]+$/, 'ชื่อทีมใช้ได้เฉพาะ A-Z, a-z, 0-9 และช่องว่าง')
        .refine(
          (val) => teamNames.every((name) => name.toLowerCase() !== val.toLowerCase()),
          'ชื่อทีมห้ามซ้ำกับชื่อ Pokémon ในทีม'
        ),
      email: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
      confirmEmail: z.email('รูปแบบอีเมลไม่ถูกต้อง'),
    })
    .refine((data) => data.email === data.confirmEmail, {
      message: 'อีเมลไม่ตรงกัน',
      path: ['confirmEmail'],
    })
}
