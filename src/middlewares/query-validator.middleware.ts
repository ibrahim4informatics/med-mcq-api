import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodSchema } from "zod/v3";
import { BadRequestError } from "../shared/errors/bad-request";
import { ZodObject } from "zod";


export default (schema: ZodObject<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            throw new BadRequestError(result.error.issues.map(issue => issue.message).join(", "));
        }
        req.filters = result.data;
        next();
    }
}