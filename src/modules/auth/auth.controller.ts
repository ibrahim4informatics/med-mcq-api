import { logoutService, resetPasswordService, revokeSession, sendPasswordResetEmail, verifyPasswordResetOTPService } from "./auth.service";

export const registerUserController = async (req: Request, res: Response) => {
    const newUser = await createUserService(req.body);
    res.status(201).json(newUser);
}

export const loginUserController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { access_token, refresh_token } = await loginUserService(email, password);

    res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return res.status(200).json({
        access_token
    });
}


export const refreshTokenController = async (req: Request, res: Response) => {
    const refresh_token = req.cookies["refresh_token"];
    const access_token = await refreshTokenService({ refresh_token });
    return res.status(200).json({
        access_token,
    });
}

export const LogoutController = async (req: Request, res: Response) => {
    const refresh_token = req.cookies["refresh_token"];
    await logoutService({ refresh_token });
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Successfully logged out" });
};


export const sendPasswordResetOTPController = async (req: Request, res: Response) => {
    const data = req.body as SendPasswordResetEmailDto;
    const { otp_token } = await sendPasswordResetEmail(data);
    res.cookie("otp_token", otp_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // 10 minutes
    });
    return res.status(200).json({ message: "OTP sent to email" });
}


export const verifyPasswordResetOTPController = async (req: Request, res: Response) => {
    const data = req.body as VerifyPasswordResetOTPDto;
    const { reset_token } = await verifyPasswordResetOTPService(data);

    res.cookie("reset_token", reset_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // 10 minutes
    });
    res.clearCookie("otp_token");
    return res.status(200).json({ message: "OTP verified", reset_token });
}


export const resetPasswordController = async (req: Request, res: Response) => {
    const new_password = req.body.new_password;
    const reset_token = req.cookies["reset_token"];
    await resetPasswordService({ new_password }, reset_token);
    return res.status(200).json({ message: "Password reset successful" });
}


export const userAuthenticationStatusController = async (req: Request, res: Response) => {
    return res.status(200).json({ authenticated: true });
}

export const getUserRoleController = async (req: Request, res: Response) => {
    const user = req.user;
    return res.status(200).json({ role: user?.role });
}

import { Request, Response } from "express";
import { createUserService, loginUserService, refreshTokenService } from "./auth.service";
import { LogoutDto, ResetPasswordDto, SendPasswordResetEmailDto, VerifyPasswordResetOTPDto } from "./auth.dto";
