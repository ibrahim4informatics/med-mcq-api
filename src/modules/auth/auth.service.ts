import { RefreshTokenDto, RegisterUsertDto } from "./auth.dto";
import prisma from "../../config/DB";
import { BadRequestError } from "../../shared/errors/bad-request";
import { hashPassword, verifyPassword } from "../../shared/services/argon.service";
import ENV from "../../config/ENV";
import { generateToken, verifyToken } from "../../shared/services/jwt.service";
import { hashToken } from "../../utils/hmacHasher";

const checkUserExists = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true
        }
    });
    return !!user;
}


const createSession = async (user_id: string, refresh_token: string) => {

    const session = await prisma.session.create({
        data: {
            user_id,
            refresh_token,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });
    return session;
}

export const createUserService = async (registerUserDto: RegisterUsertDto) => {
    const userExists = await checkUserExists(registerUserDto.email);
    if (userExists) throw new BadRequestError("Email is taken");
    const newUser = await prisma.user.create({
        data: {
            ...registerUserDto,
            password: await hashPassword(registerUserDto.password),
        },
    });
    return newUser;
}


export const findUserByEmailService = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
            password: true,
            role: true,
        }
    });
    return user;
}

export const loginUserService = async (email: string, password: string) => {
    // --------------------------------------------------
    // 1. GET USER
    // --------------------------------------------------
    const user = await findUserByEmailService(email);


    if (!user) {
        throw new BadRequestError("Invalid email or password");
    }

    // --------------------------------------------------
    // 2. VERIFY PASSWORD
    // --------------------------------------------------
    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
        throw new BadRequestError("Invalid email or password");
    }


    // --------------------------------------------------
    // 3. CHECK SESSION LIMIT (EARLY EXIT)
    // --------------------------------------------------


    const activeSessions = await prisma.session.count({
        where: {
            user_id: user.id,
            revoked_at: null,
            expires_at: {
                gt: new Date(),
            }
        }
    });

    if (activeSessions >= 3) {
        throw new BadRequestError("Too many sessions. Please logout first.");
    }

    // --------------------------------------------------
    // 4. GENERATE TOKENS ONLY AFTER CHECK
    // --------------------------------------------------
    const access_token = generateToken(
        { userId: user.id, role: user.role },
        ENV.JWT_SECRET!,
        ENV.JWT_EXPIRES_IN!
    );

    const refresh_token = generateToken(
        { userId: user.id, role: user.role },
        ENV.JWT_REFRESH_SECRET!,
        ENV.JWT_REFRESH_EXPIRES_IN!
    );

    // --------------------------------------------------
    // 5. HASH REFRESH TOKEN = SESSION ID
    // --------------------------------------------------
    const refresh_hash = hashToken(refresh_token);


    // --------------------------------------------------
    // 7. DB PERSISTENCE (optional)
    // --------------------------------------------------
    await createSession(user.id, refresh_hash);

    // --------------------------------------------------
    // 8. RETURN TOKENS
    // --------------------------------------------------
    return {
        access_token,
        refresh_token,
    };
};


export const refreshTokenService = async ({ refresh_token }: RefreshTokenDto) => {

    // --------------------------------------------------
    // 1. HASH INCOMING TOKEN
    // --------------------------------------------------

    const refresh_hash = hashToken(refresh_token);

    // --------------------------------------------------
    // 2. FIND SESSION BY HASH
    // --------------------------------------------------

    const session = await prisma.session.findFirst({
        where: {
            refresh_token: refresh_hash,
            expires_at: {
                gt: new Date(),
            }
        },
        select: {
            revoked_at: true,
        }
    });

    // --------------------------------------------------
    // 3. VALIDATE SESSION
    // --------------------------------------------------

    if (!session || session.revoked_at) throw new BadRequestError("Invalid refresh token");

    // --------------------------------------------------
    // 4. VERIFY TOKEN
    // --------------------------------------------------

    const payload = verifyToken<{ user_id: string, role: string }>(refresh_token, ENV.JWT_REFRESH_SECRET!);

    // --------------------------------------------------
    // 5. GENERATE NEW ACCESS TOKEN
    // --------------------------------------------------

    const new_access_token = generateToken(
        { user_id: payload.user_id, role: payload.role },
        ENV.JWT_SECRET!,
        ENV.JWT_EXPIRES_IN!
    );

    // --------------------------------------------------
    // 6. RETURN NEW ACCESS TOKEN
    // --------------------------------------------------
    return new_access_token;



}