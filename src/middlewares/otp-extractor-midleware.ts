import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../shared/errors/unauthorized-error";
import { verifyToken } from "../shared/services/jwt.service";
import ENV from "../config/ENV";

export default function otpExtractorMiddleware(req: Request, res: Response, next: NextFunction) {
    const otp_token = req.cookies["otp_token"];
    if (!otp_token) {
        throw new UnauthorizedError("Invalid or missing OTP token");
    }
    try {
        const payload = verifyToken(otp_token, ENV.JWT_OTP_SECRET!);
        req.body.otp_id = payload.otp_id;
        next();
    } catch (error) {
        throw new UnauthorizedError("Invalid OTP token");
    }
}