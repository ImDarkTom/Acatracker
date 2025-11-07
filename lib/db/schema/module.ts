import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const module = sqliteTable("module", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    code: text().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});