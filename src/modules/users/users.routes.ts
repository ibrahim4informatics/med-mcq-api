import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { deleteUserController, deleteUserProfileController, getUserByIdController, getUserProfileController, getUsersController, getUserStatsController, restoreUserController, updateUserByIdController, updateUserProfileController } from "./users.controllers";
import isAuthenticated from "../../middlewares/is-authenticated";
import validateQuery from "../../middlewares/query-validator.middleware";
import { GetUSsersQuery } from "./users.dto";
import hasRoleOfMiddleware from "../../middlewares/has-role-of.middleware";
import {bodyValidator} from "../../middlewares/body-validator.middleware";
import { LoginUserDto } from "../auth/auth.dto";
const router = Router();




router.get("/", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), validateQuery(GetUSsersQuery), asyncHandler(getUsersController));


router.get("/:user_id", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(getUserByIdController));
router.patch("/:user_id", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(updateUserByIdController));
router.delete("/:user_id", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(deleteUserController));
router.patch("/:user_id/restore", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(restoreUserController));


router.get("/profile", isAuthenticated, asyncHandler(getUserProfileController));
router.patch("/profile", isAuthenticated, asyncHandler(updateUserProfileController));
router.delete("/profile", isAuthenticated, asyncHandler(deleteUserProfileController));
router.patch("/profile/restore", isAuthenticated, bodyValidator(LoginUserDto), asyncHandler(restoreUserController));
router.get("/profile/stats", isAuthenticated, asyncHandler(getUserStatsController));
export default router;