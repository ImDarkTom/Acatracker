import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { assessment } from '.';
import { user } from "./auth";
import z from "zod";
import { relations } from "drizzle-orm";

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

export const task = sqliteTable("task", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    dueAt: int().notNull(),
    isCompleted: int({ mode: 'boolean' }),
    assessmentId: int().notNull().references(() => assessment.id, { onDelete: 'cascade' }),
    userId: int().notNull().references(() => user.id, { onDelete: 'cascade' }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertTask = createInsertSchema(task, {
    name: (field) => field.min(1).max(100),
    description: (field) => field.max(1000),
    dueAt: () => preprocessDate,
}).omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export const taskRelations = relations(task, ({ one }) => ({
    assessment: one(assessment, {
        fields: [task.assessmentId],
        references: [assessment.id],
    }),
}));


export type TaskSchema = typeof task.$inferSelect;

export type InsertTask = z.infer<typeof InsertTask>;