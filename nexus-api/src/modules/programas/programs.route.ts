import { Router } from "express";
import { ProgramasController } from "./programs.controller";

import { authMiddleware } from "../../common/middlewares/auth.middleware";
import { roleMiddleware } from "../../common/middlewares/role.middleware";

import { Roles } from "../../common/constants/roles";

const router = Router();

router.get(
  "/",
  authMiddleware,
  ProgramasController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  ProgramasController.getById
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
  ]),
  ProgramasController.create
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
  ]),
  ProgramasController.update
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([
    Roles.SUPER_ADMIN,
    Roles.ADMIN,
  ]),
  ProgramasController.delete
);

export default router;