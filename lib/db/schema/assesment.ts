import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { module } from '.';
import { user } from "./auth";
import z from "zod";

const preprocessDate = z.preprocess((arg) => {
    if (typeof arg === 'string') {
        const m = arg.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) {
            const year = Number(m[1]);
            const month = Number(m[2]) - 1;
            const day = Number(m[3]);
            return new Date(year, month, day).getTime();
        }
        const parsed = Date.parse(arg);
        return isNaN(parsed) ? arg : parsed;
    }

    if (arg instanceof Date) return arg.getTime();

    return arg;
}, z.number().int())

export const assesment = sqliteTable("assesment", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    module: int().notNull().references(() => module.id),
    releasedAt: int(),
    dueAt: int().notNull(),
    userId: int().notNull().references(() => user.id),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertAssesment = createInsertSchema(assesment, {
    name: (field) => field.min(1).max(100),
    description: (field) => field.max(1000),
    module: (field) => field,
    releasedAt: () => preprocessDate,
    dueAt: () => preprocessDate,
}).omit({
    id: true,
    slug: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export type AssesmentSchema = typeof assesment.$inferSelect;

export type InsertAssesment = z.infer<typeof InsertAssesment>;