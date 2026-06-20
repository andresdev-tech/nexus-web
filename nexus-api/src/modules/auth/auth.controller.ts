import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
    
    static async login(req: Request, res: Response) {
        try {
            const { correo_electronico, password } = req.body;

            // Extraer la IP y el User-Agent directamente desde la petición HTTP de Express
            const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'IP_DESCONOCIDA';
            const browser = req.headers['user-agent'] || 'Navegador_Desconocido';

            // Pasar los parámetros limpios al servicio
            const token = await AuthService.login(correo_electronico, password, ip, browser);
            
            return res.json({ ok: true, token });
        } catch (error) {
            return res.status(400).json({ 
                ok: false,
                error: (error as Error).message 
            });
        }
    }

    static async register(req: Request, res: Response) {
        try {
            // Desestructuración para evitar escribir req.body 8 veces
            const { 
                nombres, 
                apellidos, 
                tipo_documento, 
                numero_documento, 
                correo_electronico, 
                fecha_nacimiento, 
                password, 
                rol 
            } = req.body;

            const token = await AuthService.register(
                nombres,
                apellidos,
                Number(tipo_documento), // Asegurar que viaje como número
                numero_documento,
                correo_electronico,
                fecha_nacimiento,
                password,
                Number(rol)             // Asegurar que viaje como número
            );

            return res.status(201).json({ ok: true, token });
        } catch (error) {
            return res.status(400).json({
                ok: false,
                error: (error as Error).message
            });
        }
    }
}