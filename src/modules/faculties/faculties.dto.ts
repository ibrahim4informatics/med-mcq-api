import { z } from "zod";

// Todo Later add the year dto from the year module and add it here as a foreign key

const CreateYearDto = z.object({
    name: z.string().min(1, { error: "Name is required" }),
    faculty_id: z.uuid({ error: ({ input }) => !input ? "Faculty ID is required" : "Faculty ID must be a valid UUID" }),
})

export const CreateFacultyDto = z.object({
    name: z.string().min(1, { error: "Name is required" }),
    years: z.array(CreateYearDto).optional(),

});


export type CreateFacultyDto = z.infer<typeof CreateFacultyDto>;