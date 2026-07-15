import { type User } from "../../generated/prisma/client";

declare global {
    namespace Express {
        export interface Request {
            user?: Partial<User>;
            filters?: Record<string, any>;
        }
    }
}