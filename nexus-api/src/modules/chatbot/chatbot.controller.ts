import { Request, Response, NextFunction } from "express";
import { ChatbotService } from "./chatbot.service";

export class ChatbotController {
  private service: ChatbotService;

  constructor() {
    this.service = new ChatbotService();
  }

  askQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { question } = req.body;

      const usuarioId = (req as any).user.id;

      const response =
        await this.service.askQuestion(
          usuarioId,
          question
        );

      res.status(200).json({
        success: true,
        message: "Respuesta generada correctamente",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const usuarioId = (req as any).user.id;

      const historial =
        await this.service.getHistory(
          usuarioId
        );

      res.status(200).json({
        success: true,
        data: historial,
      });
    } catch (error) {
      next(error);
    }
  };
}