# NEXUS BOT

## Descripción
Nexus es un Bot asistente universitario para que los estudiantes puedan consultar sus dudas académicas de manera rápida y eficiente. El bot utiliza inteligencia artificial para entender las preguntas de los estudiantes y proporcionar respuestas precisas y útiles con un estilo de comunicación cercano y amigable, implementando un sistema de RAG (Retrieval-Augmented Generation) para acceder a información actualizada y relevante que esta almacenada en la base de datos.

## Estructura del proyecto
- **docs/**: Documentación
- **nexus-api/**: API
- **nexus-app/**: Aplicación web
- **README.md**: Este archivo
- **.gitignore**: Archivos y carpetas ignorados por git
- **docker-compose.yml**: Configuración de Docker


## Tecnologías utilizadas

- **database/**: PostgreSQL, Prisma
- **docs/**: Markdown, PDFs, Diagramas
- **nexus-api/**: Node.js, Express, TypeScript
- **nexus-app/**: Next.js, TypeScript, TailwindCSS

## Autores
- Jhon Alexander Lenis - Desarrollador frontend
- Andres Jaramillo - Desarrollador backend
- Mariana Bastidas - Diseñadora UI/UX

## Estructura Backend
nexus-api/
├── src/
│   ├── common/
│   │   ├── errors/
│   │   ├── types/
│   │   ├── utils/
│   │   └── middlewares/
│   ├── config/
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── swagger.config.ts
│   │   ├── database.ts
│   │   └── prisma.ts
│   ├── docs/
│   ├── modules/
│   │   ├── auth/
│   │   ├── chatbot/
│   │   ├── inscripciones/
│   │   ├── pass-reset/
│   │   ├── programas/
│   │   ├── search/
│   │   └── usuarios/
│   ├── routes/
│   │   └── index.ts
│   ├── app.ts
│   └── server.ts
├── tests/
├── .env.example
├── .gitignore
├── eslint.config.js
├── nodemon.json
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
├── README.md
├── README_BACKEND.md
└── tsconfig.json

