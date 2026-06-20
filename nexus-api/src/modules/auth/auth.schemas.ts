import { z } from 'zod';

export const LoginSchema = z.object({
    correo_electronico: z.string().email(),
    password: z.string().min(6),
});

export const RegisterSchema = z.object({
  nombres: z.string().min(2).max(100),
  apellidos: z.string().min(2).max(100),
  tipo_documento: z.number().int().positive(),
  numero_documento: z.string().min(5).max(20),
  correo_electronico: z.string().email(),
  password: z.string().min(6),
  rol: z.number().int().positive(),
});