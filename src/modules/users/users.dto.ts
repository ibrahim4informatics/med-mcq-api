

import {  z } from 'zod';
import { UserRole } from '../../generated/prisma/enums';
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


export const CreateUserDto = z.object({
    first_name: z.string().min(1, { error: "First name is required" }),
    last_name: z.string().min(1, { error: "Last name is required" }),
    phone_number: z.string().regex(/^(07|05|06)[0-9]{8}$/, { message: "Phone number must be a valid Rwandan phone number" }),
    email: z.string().email({ message: "Email must be a valid email address" }),
    password: z.string().min(6, { error: "Password must be at least 6 characters long" }),
    role: z.enum(UserRole, { error: "Role must be either ADMIN or USER" }),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

