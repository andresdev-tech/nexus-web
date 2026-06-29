import { Router } from "express";

import { ChatbotController } from "./chatbot.controller";

import { authMiddleware } from "../../common/middlewares/auth.middleware";

const router = Router();

const controller =
  new ChatbotController();

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: Asistente Virtual
 */

/**
 * @swagger
 * /chat/ask:
 *   post:
 *     summary: Enviar mensaje al chatbot
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 example: ¿Qué es un framework?
 *     responses:
 *       200:
 *         description: Respuesta generada
 */

router.post(
  "/ask",
  authMiddleware,
  controller.askQuestion
);

export default router;