import { z } from "zod";

export const fachbereichSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(3, "Description must be at least 3 characters"),
    slug: z.string().regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens"),
  });