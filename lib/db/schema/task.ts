import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { module } from "./module";

export const task = sqliteTable("task", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    module: int().notNull().references(() => module.id),
    dueAt: int().notNull(),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});