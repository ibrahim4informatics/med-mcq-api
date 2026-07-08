import { LogoutDto, RefreshTokenDto, RegisterUsertDto, ResetPasswordDto, SendPasswordResetEmailDto, VerifyPasswordResetOTPDto } from "./auth.dto";
import prisma from "../../config/DB";
import { BadRequestError } from "../../shared/errors/bad-request";
import { hashPassword, verifyPassword } from "../../shared/services/argon.service";
import ENV from "../../config/ENV";
import { generateToken, verifyToken } from "../../shared/services/jwt.service";
import { hashOtp, hashToken } from "../../utils/hmacHasher";

import { generate } from "otp-generator"
import { sendEmail } from "../../shared/services/mailer.service";
import { UnauthorizedError } from "../../shared/errors/unauthorized-error";
import { ForbidenError } from "../../shared/errors/forbiden-error";
import { NotFoundError } from "../../shared/errors/not-found-error";


const forgotMailTemplate = (otp: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>OTP Verification</title>
    </head>
    <body style="margin:0; padding:0; background-color:#0b0f0c; font-family:Arial, sans-serif; color:#e6f4ea;">
        <div style="max-width:600px; margin:0 auto; padding:40px 20px;">
        <!-- Header -->
        <div style="text-align:center; margin-bottom:30px;">
        <h1 style="color:#22c55e; margin:0;">MedRev</h1>
        <p style="color:#9ca3af; margin-top:8px;">Medical Revision Platform</p>
        </div>
        <!-- Card -->
        <div style="background-color:#111827; border:1px solid #1f2937; border-radius:12px; padding:30px;">

        <h2 style="color:#ffffff; margin-top:0;">Verify Your Email</h2>

        <p style="color:#cbd5e1; line-height:1.6;">
            Use the OTP code below to complete your verification. This code is valid for <b style="color:#22c55e;">10 minutes</b>.
        </p>

        <!-- OTP Box -->
        <div style="text-align:center; margin:30px 0;">
            <div style="display:inline-block; background:#0f172a; border:1px solid #22c55e; padding:18px 30px; font-size:28px; letter-spacing:6px; color:#22c55e; border-radius:10px;">
                ${otp}
            </div>
        </div>

        <p style="color:#94a3b8; font-size:14px; line-height:1.6;">
            If you did not request this code, you can safely ignore this email. Your account remains secure.
        </p>

        <!-- Button fallback (optional reset link) -->
        <div style="text-align:center; margin-top:25px;">
            <a href="#"
            style="background:#22c55e; color:#0b0f0c; padding:12px 20px; text-decoration:none; border-radius:8px; font-weight:bold; display:inline-block;">
            Go to Platform
            </a>
        </div>

        </div>

        <!-- Footer -->
        <p style="text-align:center; color:#6b7280; font-size:12px; margin-top:20px;">
        © 2026 MedRev. All rights reserved.
        </p>
        </div>
    </body>
</html>
`
}


const getOtpByID = async (otp_id: string) => {
    const otpRecord = await prisma.otp.findFirst({
        where: {
            id: otp_id,
            expires_at: {
                gt: new Date(),
            },
            verified_at: null,
        }
    });

    if (!otpRecord) {
        throw new BadRequestError("Invalid or expired OTP");
    }
    return otpRecord;
}


export const generateOtp = () => {
    const otp = generate(6, { specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false, digits: true });
    return otp;
}

export const checkUserExists = async (email?: string, phone?: string) => {

    const conditions = [];
    if (email) conditions.push({ email });
    if (phone) conditions.push({ phone_number: phone });



    const user = await prisma.user.findFirst({
        where: {
            OR: conditions
        },
        select: {
            email: true,
            phone_number: true,
        }
    });


    return user ? { email: user.email, phone_number: user.phone_number } : null;
}



export const createSession = async (user_id: string, refresh_token: string) => {

    const session = await prisma.session.create({
        data: {
            user_id,
            refresh_token,
            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
    });
    return session;
}

export const revokeSession = async (refresh_token: string) => {
    const revokedSession = await prisma.session.updateMany({
        where: {
            refresh_token,
            revoked_at: null,
        },
        data: {
            revoked_at: new Date(),
        }
    });

    if (!revokeSession) throw new BadRequestError("Invalid refresh token");
    return true;
}



export const createUserService = async (registerUserDto: RegisterUsertDto) => {
    const userExists = await checkUserExists(registerUserDto.email, registerUserDto.phone_number);
    if (userExists && userExists.email === registerUserDto.email) throw new BadRequestError("Email is taken");
    if (userExists && userExists.phone_number === registerUserDto.phone_number) throw new BadRequestError("Phone number is taken");
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
        { user_id: user.id, role: user.role },
        ENV.JWT_SECRET!,
        ENV.JWT_EXPIRES_IN!
    );

    const refresh_token = generateToken(
        { user_id: user.id, role: user.role },
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

    if (!refresh_token) throw new UnauthorizedError("User is not logged in");

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


export const logoutService = async ({ refresh_token }: LogoutDto) => {
    const revokedSession = await revokeSession(hashToken(refresh_token));
    if (!revokedSession) throw new BadRequestError("Invalid refresh token");

}


export const sendPasswordResetEmail = async ({ email }: SendPasswordResetEmailDto) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
            email: true,
        }
    });
    if (!user) throw new BadRequestError("No user found with that email");
    const otp = generateOtp();
    const otpRecord = await prisma.otp.create({
        data: {
            user_id: user.id,
            otp: hashOtp(otp),
            expires_at: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        }
    });
    const result = await sendEmail({
        html: forgotMailTemplate(otp),
        to: user.email,
        subject: "Your password reset OTP",
    });

    if (!result) throw new BadRequestError("Failed to send OTP email");

    const otp_token = generateToken({ otp_id: otpRecord.id }, ENV.JWT_OTP_SECRET!, ENV.JWT_OTP_EXPIRES_IN!);

    return { result, otp_token };
}



export const verifyPasswordResetOTPService = async ({ otp_id, otp }: VerifyPasswordResetOTPDto) => {

    const otpRecord = await getOtpByID(otp_id);

    if (otpRecord.attempts >= 5) {

        await prisma.otp.update({
            where: {
                id: otpRecord.id,
            },
            data: {
                expires_at: new Date(), // expire immediately
            }
        });

        throw new ForbidenError("Too many attempts. OTP has been expired.");
    }

    const isOtpValid = hashOtp(otp) === otpRecord.otp;


    if (!isOtpValid) {
        await prisma.otp.update({
            where: {
                id: otpRecord.id,
            },
            data: {
                attempts: otpRecord.attempts + 1,
            }
        });
        throw new BadRequestError("Invalid OTP");
    }

    await prisma.otp.update({
        where: {
            id: otpRecord.id,
        },
        data: {
            verified_at: new Date(),
        }
    });
    return { reset_token: generateToken({ user_id: otpRecord.user_id }, ENV.JWT_RESET_PASSWORD_SECRET!, ENV.JWT_RESET_PASSWORD_EXPIRES_IN!) };
}


export const resetPasswordService = async ({ new_password }: ResetPasswordDto, reset_token: string) => {
    const payload = verifyToken<{ user_id: string }>(reset_token, ENV.JWT_RESET_PASSWORD_SECRET!);
    const user = await prisma.user.findUnique({
        where: {
            id: payload.user_id,

        },
        select: {
            id: true,
        }
    });
    if (!user) throw new NotFoundError("User not found");

    const hashedPassword = await hashPassword(new_password);
    prisma.$transaction(async (prisma) => {


        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
            }
        });

        await prisma.session.deleteMany({
            where: {
                user_id: user.id,
            }
        })


    });
}

