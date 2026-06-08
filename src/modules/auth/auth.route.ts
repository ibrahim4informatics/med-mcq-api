import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { loginUserController, refreshTokenController, registerUserController } from "./auth.controller";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import { LoginUserDto, RefreshTokenDto, RegisterUsertDto } from "./auth.dto";


const router = Router();

router.post("/register", bodyValidator(RegisterUsertDto), asyncHandler(registerUserController));
router.post("/login", bodyValidator(LoginUserDto), asyncHandler(loginUserController));

router.post("/refresh-token", bodyValidator(RefreshTokenDto), asyncHandler(refreshTokenController));
// router.post("/logout");

export default router;