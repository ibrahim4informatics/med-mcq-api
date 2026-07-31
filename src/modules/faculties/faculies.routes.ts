import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createFacultyController } from "./faculties.controllers";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import { CreateFacultyDto } from "./faculties.dto";
import isAuthenticated from "../../middlewares/is-authenticated";
import hasRoleOfMiddleware from "../../middlewares/has-role-of.middleware";

const router = Router();

//!PROTECTED WITH AUTHENTICATION AND AUTHORIZATION ADMINS ONLY 
router.post("/", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), bodyValidator(CreateFacultyDto), asyncHandler(createFacultyController));

export default router;