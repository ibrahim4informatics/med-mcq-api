import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../shared/errors/unauthorized-error";
import ENV from "../config/ENV";
import { verifyToken } from "../shared/services/jwt.service";
import { UserRole } from "../generated/prisma/enums";

export default (req: Request, res: Response, next: NextFunction) => {

    const accessToken = req.headers.authorization;
    if (!accessToken) throw new UnauthorizedError("Authentication is required");

    try {
        const payload = verifyToken<{ user_id: string; role: UserRole }>(accessToken.split(" ")[1], ENV.JWT_SECRET as string);
        req.user = {
            id: payload.user_id,
            role: payload.role,
        }
        next();

    }

    catch {
        throw new UnauthorizedError("Invalid access token");
    }
}