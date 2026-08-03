import { z } from "zod";

// Todo Later add the year dto from the year module and add it here as a foreign key

const CreateYearDto = z.object({
    id:z.uuid().optional(),
    name: z.string().min(1, { error: "Name is required" }),
    faculty_id: z.uuid({ error: ({ input }) => !input ? "Faculty ID is required" : "Faculty ID must be a valid UUID" }),
})


//? Data Transfer Object for creating a faculty

export const CreateFacultyDto = z.object({
    name: z.string().min(1, { error: "Name is required" }),
    years: z.array(CreateYearDto.omit({ faculty_id: true })).optional(),

});


export type CreateFacultyDto = z.infer<typeof CreateFacultyDto>;

//? Data Transfer Object for Get All Faculties Query

export const GetAllFacultiesQueryDto = z.object({
    cursor: z.uuid().optional(),
    name: z.string().optional(),
    limit: z.string().optional()
});

export type GetAllFacultiesQueryDto = z.infer<typeof GetAllFacultiesQueryDto>;