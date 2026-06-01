import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // La URL se define exclusivamente aquí en Prisma 7
    url: env("DATABASE_URL") || "file:./vigia.db",
  },
});
