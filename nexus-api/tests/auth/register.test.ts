import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { datetimeRegex } from "zod";

describe("POST /api/v1/auth/register", () => {
  it("Debe registrar un nuevo usuario", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({
        nombres: "Juan",
        apellidos: "Perez",
        tipo_documento: 3,
        numero_documento: "12345678",
        correo_electronico: "JuanPerez@gmail.com",
        fecha_nacimiento: new Date(1989, 0, 1),
        password: "password123",
        rol: 2
      });

    console.log("=== RESPUESTA DEL REGISTRO ===");
    console.log(response.body);
    console.log("Status:", response.status);
    console.log("==========================");

    expect(response.status).toBe(201);
  });
});