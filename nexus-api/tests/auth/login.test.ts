import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("POST /api/v1/auth/login", () => {
  it("Debe iniciar sesion con credenciales validas", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        correr_electronico: "andresjll40@gmail.com",
        password: "1234567890",
      });

    console.log("=== RESPUESTA DEL LOGIN ===");
    console.log(response.body);
    console.log("Status:", response.status);
    console.log("==========================");

    expect(response.status).toBe(200);
  });
});