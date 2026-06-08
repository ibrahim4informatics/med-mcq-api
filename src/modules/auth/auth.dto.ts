import { z } from 'zod';


export const RegisterUsertDto = z.object({
    first_name: z.string({ error: ({ input }) => !input ? "First name is required" : "First name must be a string" })
    .min(3, {error:"First name must be at least 3 characters long" }).max(35, {error:"First name must be at most 35 characters long" }),
    
    last_name: z.string({ error: ({ input }) => !input ? "Last name is required" : "Last name must be a string" })
    .min(3, {error:"Last name must be at least 3 characters long" }).max(35, {error:"Last name must be at most 35 characters long" }),
    email: z.email({ error: ({ input }) => !input ? "Email is required" : "Invalid email address" }),
    phone_number: z.string({ error: ({ input }) => !input ? "Phone number is required" : "Phone number must be a string" }).length(10, { error: "Phone number must be exactly 10 characters long" }),
    password: z.string({ error: ({ input }) => !input ? "Password is required" : "Password must be a string" })
    .min(8, {error:"Password must be at least 8 characters long" }).max(20, {error:"Password must be at most 20 characters long" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { error: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" }),
});

export type RegisterUsertDto = z.infer<typeof RegisterUsertDto>;



export const LoginUserDto = z.object({
    email: z.email({ error: ({ input }) => !input ? "Email is required" : "Invalid email address" }),
    password: z.string({ error: ({ input }) => !input ? "Password is required" : "Password must be a string" })
    .min(8, {error:"Password must be at least 8 characters long" }).max(20, {error:"Password must be at most 20 characters long" }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, { error: "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character" }),
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;


export const RefreshTokenDto = z.object({
    refresh_token: z.jwt({ error: ({ input }) => !input ? "Refresh token is required" : "Invalid refresh token" }),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;