import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmpassword: z.string().min(1, 'Confirm password is required'),
  }).refine((data) => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    firstname: z.string().min(1, 'First name is required').optional(),
    lastname: z.string().min(1, 'Last name is required').optional(),
    username: z.string().min(1, 'Username is required').optional(),
    email: z.string().email('Invalid email address').optional(),
  }),
});

export const contactSchema = z.object({
  body: z.object({
    firstname: z.string().min(1, 'First name is required'),
    lastname: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address').optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    isFavorite: z.boolean().optional(),
  }),
});

export const updateContactSchema = z.object({
  body: z.object({
    firstname: z.string().min(1, 'First name is required').optional(),
    lastname: z.string().min(1, 'Last name is required').optional(),
    email: z.string().email('Invalid email address').optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    isFavorite: z.boolean().optional(),
  }),
});

export const tagSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tag name is required'),
  }),
});

export const noteSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Note content is required'),
  }),
});
