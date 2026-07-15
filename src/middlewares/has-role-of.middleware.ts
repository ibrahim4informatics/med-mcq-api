import { NextFunction, Request, Response } from "express";
import { UserRole } from "../generated/prisma/enums";
import { ForbidenError } from "../shared/errors/forbiden-error";
export default (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user_role = req.user?.role;
        if (!user_role || !roles.includes(user_role)) {
            throw new ForbidenError("You are not authorized to perform this action");
        }
        next();
    }
}