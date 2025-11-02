import { defineConfig } from "drizzle-kit";
import env from "./lib/env";

// bun drizzle-kit generate
// bun drizzle-kit migrate
// bun drizzle-kit studio

export default defineConfig({
    out: './lib/db/migrations',
    schema: './lib/db/schema/index.ts',
    casing: "snake_case",
    dialect: 'turso',
    dbCredentials: {
        url: env.TURSO_DATABASE_URL,
        authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN,
    },
})