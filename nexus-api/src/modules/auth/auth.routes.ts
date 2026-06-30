import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo_electronico
 *               - password
 *             properties:
 *               correo_electronico:
 *                 type: string
 *                 example: andres40@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */

router.post("/login", AuthController.login);
router.post("/register", AuthController.register);

export default router;