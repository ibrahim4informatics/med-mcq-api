import { z } from "zod";

export const createModuleDto = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required").optional(),
  year_id: z.uuid({
    error: ({ input }) => (!input ? "Year is required" : "Invalid year id"),
  }),
  chapters: z
    .array(
      z.object({
        title: z.string().min(1, "Title is required"),
      }),
    )
    .optional(),
});

export type CreateModuleDto = z.infer<typeof createModuleDto>;

export const getAllModulesQueryDto = z.object({
  cursor: z.uuid().optional(),
  limit: z.string().optional(),
  name: z.string().optional(),
  year_id: z.string().optional(),
});

export type GetAllModulesQueryDto = z.infer<typeof getAllModulesQueryDto>;

export const updateModuleDto = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  year_id: z
    .uuid({
      error: ({ input }) => (!input ? "Year is required" : "Invalid year id"),
    })
    .optional(),
  chapters: z
    .array(
      z.object({
        id: z.number().optional(),
        title: z.string().min(1, "Title is required"),
      }),
    )
    .optional(),
});

export type UpdateModuleDto = z.infer<typeof updateModuleDto>;