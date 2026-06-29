import { prisma } from "../../config/prisma";

export class ChatbotRepository {
  async searchDocuments(question: string) {
    return prisma.documentos_rag.findMany({
      where: {
        activo: true,
        OR: [
          {
            titulo: {
              contains: question,
              mode: "insensitive",
            },
          },
          {
            contenido: {
              contains: question,
              mode: "insensitive",
            },
          },
        ],
      },
      take: 5,
    });
  }

  async saveHistory(data: {
    usuarioId: number;
    pregunta: string;
    respuesta: string;
  }) {
    return prisma.chatbot_historial.create({
      data: {
        usuario_id: data.usuarioId,
        pregunta_usuario: data.pregunta,
        respuesta_bot: data.respuesta,
      },
    });
  }

  async getHistory(usuarioId: number){
    return prisma.chatbot_historial.findFirst({
      where: {
        usuario_id: usuarioId
      },
      orderBy: {
        creado_en:"asc",
      },
    });
  }
}