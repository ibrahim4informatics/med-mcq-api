import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { loginUserController, LogoutController, refreshTokenController, registerUserController, resetPasswordController, sendPasswordResetOTPController, verifyPasswordResetOTPController } from "./auth.controller";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import { LoginUserDto, RefreshTokenDto, RegisterUsertDto, ResetPasswordDto, SendPasswordResetEmailDto, VerifyPasswordResetOTPDto } from "./auth.dto";


const router = Router();

router.post("/register", bodyValidator(RegisterUsertDto), asyncHandler(registerUserController));
router.post("/login", bodyValidator(LoginUserDto), asyncHandler(loginUserController));

router.post("/refresh-token", bodyValidator(RefreshTokenDto), asyncHandler(refreshTokenController));
router.post("/logout", bodyValidator(RefreshTokenDto), asyncHandler(LogoutController));


/**
 * Forgot password routes
 */
router.post("/reset-password", bodyValidator(SendPasswordResetEmailDto), asyncHandler(sendPasswordResetOTPController));
router.post("/reset-password/verify", bodyValidator(VerifyPasswordResetOTPDto), asyncHandler(verifyPasswordResetOTPController));
router.patch("/reset-password", bodyValidator(ResetPasswordDto), asyncHandler(resetPasswordController));


export default router;