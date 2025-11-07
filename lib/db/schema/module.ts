import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

// TODO: make sure we handle errors for if we try to insert duplicate names
export const module = sqliteTable("module", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    code: text().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
}, (t) => [
    unique().on(t.name, t.userId),
]);