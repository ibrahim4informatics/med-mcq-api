import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { loginUserController, LogoutController, refreshTokenController, registerUserController, resetPasswordController, sendPasswordResetOTPController, userAuthenticationStatusController, verifyPasswordResetOTPController } from "./auth.controller";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import { LoginUserDto, LogoutDto, RefreshTokenDto, RegisterUsertDto, ResetPasswordDto, SendPasswordResetEmailDto, VerifyPasswordResetOTPDto } from "./auth.dto";
import isAuthenticated from "../../middlewares/is-authenticated";


const router = Router();

router.post("/register", bodyValidator(RegisterUsertDto), asyncHandler(registerUserController));
router.post("/login", bodyValidator(LoginUserDto), asyncHandler(loginUserController));

router.post("/refresh-token", asyncHandler(refreshTokenController));
router.delete("/logout", isAuthenticated,  asyncHandler(LogoutController));
router.get("/status", isAuthenticated, asyncHandler(userAuthenticationStatusController));


/**
 * Forgot password routes
 */
router.post("/reset-password", bodyValidator(SendPasswordResetEmailDto), asyncHandler(sendPasswordResetOTPController));
router.post("/reset-password/verify", bodyValidator(VerifyPasswordResetOTPDto), asyncHandler(verifyPasswordResetOTPController));
router.patch("/reset-password", bodyValidator(ResetPasswordDto), asyncHandler(resetPasswordController));


export default router;