import { z } from 'zod'

const userNameRegex = new RegExp(/^[A-Za-z0-9]*$/)
export const createUserFormSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(userNameRegex, 'User Name can only contain character and number')
    .min(1)
    .max(8),
  first_name: z.string().trim().min(1).max(50),
  last_name: z.string().trim().min(1).max(50),
  email: z.string().trim().email(),
  password: z.string().trim().min(1).max(50),
  department: z.string().trim(),
  role: z.string().trim(),
})
