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

import { Request, Response } from "express";
import { createUserService, loginUserService, refreshTokenService } from "./auth.service";