import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import z from "zod";
import { createInsertSchema } from "drizzle-zod";

// TODO: make sure we handle errors for if we try to insert duplicate names
export const module = sqliteTable("module", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    code: text().notNull(),
    year: int().notNull(),
    semester: int().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, (t) => [
    unique().on(t.code, t.userId),
]);

export const InsertModule = createInsertSchema(module, {
    name: (field) => field.min(1).max(100),
    code: (field) => field.min(1).max(20),
    year: (field) => field.min(1).max(10),
    semester: (field) => field.min(1).max(5),
}).omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export type InsertModule = z.infer<typeof InsertModule>;