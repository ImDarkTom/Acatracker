import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const module = sqliteTable("module", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});