import { Router } from "express";
import isAuthenticated from "../../middlewares/is-authenticated";
import queryValidatorMiddleware from "../../middlewares/query-validator.middleware";
import { getChaptersQueryDto } from "./chapters.dto";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  deleteChapterController,
  getChapterByIdController,
  getChaptersController,
  updateChapterController,
  createChapterController,
  restoreChapterController
} from "./chapters.controllers";
import hasRoleOfMiddleware from "../../middlewares/has-role-of.middleware";

const router = Router();

router.use(isAuthenticated);

router.get(
  "/",
  queryValidatorMiddleware(getChaptersQueryDto),
  asyncHandler(getChaptersController),
);

router.post(
  "/",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(createChapterController),
);

router.patch(
  "/:id/restore",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(restoreChapterController),
);

router.get(
  "/:id",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(getChapterByIdController),
);

router.patch(
  "/:id",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(updateChapterController),
);

router.delete(
  "/:id",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(deleteChapterController),
);

export default router;
