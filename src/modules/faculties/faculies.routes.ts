import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { createFacultyController, deleteFacultyController, deleteRelatedYearController, getAllFacultiesController, getFacultyByIdController, restoreFacultyController, restoreRelatedYearController, updateFacultyController } from "./faculties.controllers";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import { CreateFacultyDto, GetAllFacultiesQueryDto } from "./faculties.dto";
import isAuthenticated from "../../middlewares/is-authenticated";
import hasRoleOfMiddleware from "../../middlewares/has-role-of.middleware";
import queryValidatorMiddleware from "../../middlewares/query-validator.middleware";

const router = Router();

//? GET ALL FACULTIES
router.get("/", queryValidatorMiddleware(GetAllFacultiesQueryDto), asyncHandler(getAllFacultiesController));
router.get("/:id", asyncHandler(getFacultyByIdController));
//!PROTECTED WITH AUTHENTICATION AND AUTHORIZATION ADMINS ONLY 
router.post("/", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), bodyValidator(CreateFacultyDto), asyncHandler(createFacultyController));
router.patch("/:id", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), bodyValidator(CreateFacultyDto.partial()), asyncHandler(updateFacultyController));
router.delete("/:id", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(deleteFacultyController));

router.delete("/:faculty_id/years/:year_id", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(deleteRelatedYearController));
router.patch("/:faculty_id/years/:year_id/restore", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(restoreRelatedYearController));


router.patch("/:id/restore", isAuthenticated, hasRoleOfMiddleware(["ADMIN"]), asyncHandler(restoreFacultyController));
export default router;