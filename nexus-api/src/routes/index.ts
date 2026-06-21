import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import chatRoutes from '../modules/chatbot/chatbot.routes'
import programsRoutes from "../modules/programas/programs.route";

const router = Router();

router.use("/auth", authRoutes);
router.use('/chat', chatRoutes);
router.use("/programs", programsRoutes);

export default router;