

import { email, z } from 'zod';


export const GetUSsersQuery = z.object({
    cursor: z.uuid().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().regex(/^(07|05|06)[0-9]{8}$/).optional(),
    email: z.email().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20)
});

export type GetUsersQuery = z.infer<typeof GetUSsersQuery>;


export const UpdateUserProfileDto = z.object({
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone_number: z.string().regex(/^(07|05|06)[0-9]{8}$/).optional(),
    email: z.email().optional(),
});

export type UpdateUserProfileDto = z.infer<typeof UpdateUserProfileDto>;


