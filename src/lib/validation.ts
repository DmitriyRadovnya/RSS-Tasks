import { z } from 'zod';

export const formSchema = z
  .object({
    name: z
      .string()
      .regex(/^[A-Z][a-z]*$/, 'Name must start with an uppercase letter'),
    age: z.number().min(0, 'Age cannot be negative'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(4, 'Password must be at least 8 characters')
      .regex(/[0-9]/, 'Password must contain a number')
      .regex(/[A-Z]/, 'Password must contain an uppercase letter')
      .regex(/[a-z]/, 'Password must contain a lowercase letter')
      .regex(/[!@#$%^&*]/, 'Password must contain a special character'),
    confirmPassword: z.string(),
    gender: z.enum(['Male', 'Female']),
    terms: z.boolean().refine((val) => val === true, 'You must accept T&C'),
    avatar: z
      .string()
      .min(1, 'Please select an avatar')
      .refine((base64) => {
        try {
          const decodedSize =
            (base64.length * 3) / 4 -
            (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
          return decodedSize <= 5 * 1024 * 1024;
        } catch {
          return false;
        }
      }, 'File size must be less than 5MB')
      .refine((base64) => {
        const mimeType = atob(base64).startsWith('\x89PNG')
          ? 'image/png'
          : atob(base64).startsWith('\xFF\xD8')
            ? 'image/jpeg'
            : null;
        return ['image/png', 'image/jpeg'].includes(mimeType || '');
      }, 'Only PNG or JPEG allowed'),
    country: z.string().min(1, 'Country is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<typeof formSchema>;
