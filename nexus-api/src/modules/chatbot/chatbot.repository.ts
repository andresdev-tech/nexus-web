import { prisma } from "../../config/prisma";

export class ChatbotRepository {
  async searchDocuments(question: string) {

    const stopWords = new Set(['de', 'el', 'la', 'los', 'las', 'un', 'una', 'sobre', 'que', 'necesito', 'informacion', 'como', 'que', 'es', 'en', 'y', 'a', 'por']);

    const palabrasClave = question
      .toLowerCase()
      .replace(/[?!.,]/g, '') // quita signos de puntuación
      .split(' ')
      .filter(palabra => palabra.length > 2 && !stopWords.has(palabra)); // quita palabras vacías

    // Si no hay palabras clave tras limpiar, volvemos al comportamiento original
    if (palabrasClave.length === 0) {
      return prisma.documentos_rag.findMany({
        where: { activo: true, contenido: { contains: question, mode: "insensitive" } },
        take: 5,
      });
    }

    // 2. Creamos un montón de condiciones "OR" dinámicamente para cada palabra
    const orConditions = palabrasClave.map(palabra => ({
      contenido: {
        contains: palabra,
        mode: "insensitive" as const,
      }
    }));


    // 3. Ejecutamos la búsqueda
    return prisma.documentos_rag.findMany({
      where: {
        activo: true,
        OR: orConditions,
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
    return prisma.chatbot_historial.findMany({
      where: {
        usuario_id: usuarioId
      },
      orderBy: {
        creado_en:"asc",
      },
      select: {
        id: true,
        pregunta_usuario: true,
        respuesta_bot: true,
        creado_en: true,
      },
    });
  }
}