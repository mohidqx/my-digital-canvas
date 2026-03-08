import { z } from "zod";

// ─── Project Schema ────────────────────────────────────────────────────────────
export const projectSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters")
    .max(80, "Title must be under 80 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be under 500 characters"),
  techStack: z
    .string()
    .trim()
    .min(1, "Add at least one technology")
    .transform((val) =>
      val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  githubUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  liveDemoUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  createdAt: z.string().optional(),
});

export type ProjectFormData = z.input<typeof projectSchema>;
export type Project = z.output<typeof projectSchema> & { id: string };

// ─── Skill Schema ──────────────────────────────────────────────────────────────
export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1).max(50),
  level: z.number().min(0).max(100).default(80),
  category: z.enum(["frontend", "backend", "devops", "design", "other"]),
  icon: z.string().optional(),
});

export type Skill = z.infer<typeof skillSchema> & { id: string };

// ─── Contact Schema ────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z.string().email("Invalid email address").max(255),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Login Schema ──────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Profile Schema ────────────────────────────────────────────────────────────
export const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  tagline: z.string().trim().max(150).optional(),
  bio: z.string().trim().max(1000).optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  resumeUrl: z.string().url().optional().or(z.literal("")),
  location: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal("")),
});

export type Profile = z.infer<typeof profileSchema>;
