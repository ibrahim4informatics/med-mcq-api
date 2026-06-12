import { logoutService, resetPasswordService, revokeSession, sendPasswordResetEmail, verifyPasswordResetOTPService } from "./auth.service";

export const registerUserController = async (req: Request, res: Response) => {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
}

export const loginUserController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { access_token, refresh_token } = await loginUserService(email, password);
    return res.status(200).json({
        access_token,
        refresh_token,
    });
}


export const refreshTokenController = async (req: Request, res: Response) => {
    const body = req.body;
    const access_token = await refreshTokenService(body);
    return res.status(200).json({
        access_token,
    });
}

export const LogoutController = async (req: Request, res: Response) => {
    const body = req.body as LogoutDto;
    await logoutService(body);
    return res.status(200).json({ message: "Successfully logged out" });
};


export const sendPasswordResetOTPController = async (req: Request, res: Response) => {
    const data = req.body as SendPasswordResetEmailDto;
    const { id } = await sendPasswordResetEmail(data);
    return res.status(200).json({ message: "OTP sent to email", id });
}


export const verifyPasswordResetOTPController = async (req: Request, res: Response) => {
    const data = req.body as VerifyPasswordResetOTPDto;
    const { reset_token } = await verifyPasswordResetOTPService(data);
    return res.status(200).json({ message: "OTP verified", reset_token });
}


export const resetPasswordController = async (req: Request, res: Response) => {
    const data = req.body as ResetPasswordDto;
    await resetPasswordService(data);
    return res.status(200).json({ message: "Password reset successful" });
}

import { Request, Response } from "express";
import { createUserService, loginUserService, refreshTokenService } from "./auth.service";
import { LogoutDto, ResetPasswordDto, SendPasswordResetEmailDto, VerifyPasswordResetOTPDto } from "./auth.dto";
