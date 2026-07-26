import { Request, Response } from "express";
import { CreateUserDto, GetUsersQuery, UpdateUserProfileDto } from "./users.dto";
import { createUserService, deleteUserProfileService, getUserProfileService, getUsersService, getUserStatsService, restoreUserByIdService, restoreUserProfileService, updateUserProfileService } from "./users.services";
import { UserRole } from "../../generated/prisma/browser";
import { LoginUserDto } from "../auth/auth.dto";


/**
 * Account Management Controllers (PROFILE OWNERS)
 */
export const getUserProfileController = async (req: Request, res: Response) => {
    const user_id = req.user?.id as string;
    const user = await getUserProfileService(user_id);
    return res.status(200).json({ user });
}


export const updateUserProfileController = async (req: Request, res: Response) => {
    const user_id = req.user?.id as string;
    const data = req.body as UpdateUserProfileDto;
    const user = await updateUserProfileService(user_id, data);
    return res.status(200).json({ user });
}



export const deleteUserProfileController = async (req: Request, res: Response) => {
    const user_id = req.user?.id as string;
    const deleted_user = await deleteUserProfileService(user_id);
    return res.status(200).json({ deleted_user });
}

export const restoreUserProfileController = async (req: Request, res: Response) => {
    const data = req.body as LoginUserDto;
    const restored_user = await restoreUserProfileService(data);
    return res.status(200).json({ restored_user });
}


export const getUserStatsController = async (req: Request, res: Response) => {
    const user_id = req.user?.id as string;
    const role = req.user?.role as UserRole;
    const stats = await getUserStatsService(user_id, role);
    return res.status(200).json({ stats });
}


/**
 * Admin Controllers (ADMIN ONLY)
 */

export const getUsersController = async (req: Request, res: Response) => {
    const filters = req.query as unknown;
    const user_id = req.user?.id as string;
    const { users, has_more, next_cursor } = await getUsersService({ user_id, filter: filters as GetUsersQuery });
    return res.status(200).json({ users, has_more, next_cursor });
}


export const getUserByIdController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id as string;
    const user = await getUserProfileService(user_id);
    return res.status(200).json({ user });
}


export const updateUserByIdController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id as string;
    const data = req.body as UpdateUserProfileDto;
    const user = await updateUserProfileService(user_id, data);
    return res.status(200).json({ user });
}

export const deleteUserController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id as string;
    const deleted_user = await deleteUserProfileService(user_id);
    return res.status(200).json({ deleted_user });
}

export const restoreUserController = async (req: Request, res: Response) => {
    const user_id = req.params.user_id as string;
    const restored_user = await restoreUserByIdService(user_id);
    return res.status(200).json({ restored_user });
}


export const createUserController = async (req: Request, res: Response) => {
    const data = req.body as CreateUserDto;
    const user = await createUserService(data);
    return res.status(201).json({ user });
}