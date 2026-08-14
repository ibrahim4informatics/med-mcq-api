import { z } from "zod";

export const createChapterDto = z.object({
  title: z.string().min(1, "Title is required"),
  module_id: z.uuid({
    error: ({ input }) => (!input ? "Module is required" : "Invalid module id"),
  }),
  order: z.number().int().min(1, "Order must be a positive integer"),
});

export type CreateChapterDto = z.infer<typeof createChapterDto>;

export const getChaptersQueryDto = z.object({
  module_id: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type GetChaptersQueryDto = z.infer<typeof getChaptersQueryDto>;
