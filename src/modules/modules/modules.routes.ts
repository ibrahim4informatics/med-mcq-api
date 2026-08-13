import { Router } from "express";
import isAuthenticated from "../../middlewares/is-authenticated";
import hasRoleOfMiddleware from "../../middlewares/has-role-of.middleware";
import { bodyValidator } from "../../middlewares/body-validator.middleware";
import {
  createModuleDto,
  getAllModulesQueryDto,
  updateModuleDto,
} from "./modules.dto";
import illustrationUpload from "../../middlewares/file-upload/uploadModuleIllustration";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  createModuleController,
  deleteModuleController,
  deleteModuleIllustrationController,
  getAllModulesController,
  restoreModuleController,
  updateModuleController,
  uploadModuleIllustrationController,
  getModuleByIdController,
} from "./modules.controllers";
import queryValidatorMiddleware from "../../middlewares/query-validator.middleware";
const router = Router();

router.use(isAuthenticated);
router.post(
  "/",
  hasRoleOfMiddleware(["ADMIN"]),
  illustrationUpload.single("illustration"),
  bodyValidator(createModuleDto),
  asyncHandler(createModuleController),
);

router.get(
  "/",
  hasRoleOfMiddleware(["ADMIN", "STUDENT"]),

  queryValidatorMiddleware(getAllModulesQueryDto),
  asyncHandler(getAllModulesController),
);

router.patch(
  "/:id/restore",
  isAuthenticated,
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(restoreModuleController),
);

router.delete(
  "/:id/illustration",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(deleteModuleIllustrationController),
);
router.patch(
  "/:id/illustration",
  hasRoleOfMiddleware(["ADMIN"]),
  illustrationUpload.single("illustration"),
  asyncHandler(uploadModuleIllustrationController),
);

router.patch(
  "/:id",
  hasRoleOfMiddleware(["ADMIN"]),
  bodyValidator(updateModuleDto),
  asyncHandler(updateModuleController),
);
router.delete(
  "/:id",
  hasRoleOfMiddleware(["ADMIN"]),
  asyncHandler(deleteModuleController),
);

router.get("/:id", asyncHandler(getModuleByIdController));
export default router;
