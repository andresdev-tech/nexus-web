import { Router } from "express";

import { ChatbotController } from "./chatbot.controller";

import { authMiddleware } from "../../common/middlewares/auth.middleware";

const router = Router();

const controller =
  new ChatbotController();

router.post(
  "/ask",
  authMiddleware,
  controller.askQuestion
);

export default router;