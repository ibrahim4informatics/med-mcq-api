import prisma from "../../config/DB"
import { UserRole } from "../../generated/prisma/enums";
import { BadRequestError } from "../../shared/errors/bad-request";
import { NotFoundError } from "../../shared/errors/not-found-error";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error";
import { hashPassword, verifyPassword } from "../../shared/services/argon.service";
import { LoginUserDto } from "../auth/auth.dto";
import { CreateUserDto, GetUsersQuery, UpdateUserProfileDto } from "./users.dto";

/**
 * Account Management Services (PROFILE OWNERS)
 */
export const getUserProfileService = async (user_id: string) => {


    //TODO: later include the count and some relations mapping as we progress
    const user = await prisma.user.findUnique({
        where: {
            id: user_id,
        },
        include: {
            _count: {
                select: {
                    sessions: {
                        where: {
                            revoked_at: null,
                            expires_at: {
                                gte: new Date()
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) throw new NotFoundError("User not found");
    return user
}

export const updateUserProfileService = async (user_id: string, data: UpdateUserProfileDto) => {
    if (!data || (!data.first_name && !data.last_name && !data.phone_number && !data.email)) {
        throw new BadRequestError("No data provided to update");
    }
    const user = await prisma.user.update({
        where: {
            id: user_id,
        },
        data: {
            ...data,
        }
    });
    return user;
}

export const deleteUserProfileService = async (user_id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: user_id,
        }
    });
    if (!user) throw new NotFoundError("User not found");
    if (user.deleted_at) throw new BadRequestError("User is already deleted");

    const deleted_user = await prisma.user.update({
        where: {
            id: user_id,
        },
        data: {
            deleted_at: new Date(),
        }
    });
    return deleted_user;
}


export const restoreUserProfileService = async (data: LoginUserDto) => {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email,
            deleted_at: {
                not: null
            }
        },
        select: {
            password: true,
            id: true,
        }
    });
    if (!user || ! await verifyPassword(data.password, data.password)) throw new UnauthorizedError("Not Authorized to restore this account");

    const restored_user = await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            deleted_at: null,
        }
    });
    return restored_user;
}


export const getUserStatsService = async (user_id: string, role: UserRole) => {
    // Later when i add questions and answers, i will add the stats here for the user, for now i will just return the count of sessions
}





/**
 * 
 * User Management Services (ADMINS)
 */
export const getUsersService = async ({ user_id, filter: { cursor, first_name, last_name, phone_number, email, status, limit = 20 } }: { user_id: string, filter: GetUsersQuery, }) => {
    const users = await prisma.user.findMany({
        where: {
            NOT: {
                id: user_id
            },
            first_name: first_name ? { contains: first_name } : undefined,
            last_name: last_name ? { contains: last_name } : undefined,
            phone_number: phone_number ? { equals: phone_number } : undefined,
            email: email ? { equals: email } : undefined,
            deleted_at: status === 'inactive' ? { not: null } : status === 'active' ? null : undefined,
        },
        take: parseInt(limit.toString()) + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? {
            id: cursor
        } : undefined,
        orderBy: {
            created_at: "desc"
        }
    });
    const has_more = users.length > limit;
    if (has_more) {
        users.pop();
    }
    const next_cursor = has_more ? users[users.length - 1].id : null;
    return { users, has_more, next_cursor }
}



export const updateUserByIdService = async (user_id: string, data: UpdateUserProfileDto) => {
    if (!data || (!data.first_name && !data.last_name && !data.phone_number && !data.email)) {
        throw new BadRequestError("No data provided to update");
    }
    const user = await prisma.user.update({
        where: {
            id: user_id,
        },
        data: {
            ...data,
        }
    });
    return user;
}

export const deleteUserByIdService = async (user_id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: user_id,
        }
    });
    if (!user) throw new NotFoundError("User not found");
    if (user.deleted_at) throw new BadRequestError("User is already deleted");

    const deleted_user = await prisma.user.update({
        where: {
            id: user_id,
        },
        data: {
            deleted_at: new Date(),
        }
    });
    return deleted_user;
}


export const getUserByIdService = async (user_id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: user_id,
        }
    });
    if (!user) throw new NotFoundError("User not found");
    return user;
}

export const restoreUserByIdService = async (user_id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: user_id,
        }
    });
    if (!user) throw new NotFoundError("User not found");
    if (!user.deleted_at) throw new BadRequestError("User is not deleted");

    const restored_user = await prisma.user.update({
        where: {
            id: user_id,
        },
        data: {
            deleted_at: null,
        }
    });
    return restored_user;
}

export const createUserService = async (data: CreateUserDto) => {
    const userExists = await prisma.user.findUnique({
        where: {
            email: data.email,
        }
    });
    if (userExists) throw new BadRequestError("User with this email already exists");

    data.password = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            ...data,
        }
    });
    return user;
}