import { defineConfig } from "prisma/config";

/**
 * Prisma is used in introspection-only mode.
 * DO NOT enable migrations in this project.
 */


export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
