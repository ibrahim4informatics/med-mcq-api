import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createFacultyController, getAllFacultiesController } from "./faculties.controllers";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import { CreateFacultyDto, GetAllFacultiesQueryDto } from "./faculties.dto";
import isAuthenticated from "../../middlewares/is-authenticated";
import hasRoleOfMiddleware from "../../middlewares/has-role-of.middleware";
import queryValidatorMiddleware from "../../middlewares/query-validator.middleware";

const router = Router();

//? GET ALL FACULTIES
router.get("/", queryValidatorMiddleware(GetAllFacultiesQueryDto), asyncHandler(getAllFacultiesController));
//!PROTECTED WITH AUTHENTICATION AND AUTHORIZATION ADMINS ONLY 
router.post("/", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), bodyValidator(CreateFacultyDto), asyncHandler(createFacultyController));

export default router;