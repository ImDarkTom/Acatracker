import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { module, task } from '.';
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

export const assessment = sqliteTable("assessment", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    releasedAt: int(),
    dueAt: int().notNull(),
    isCompleted: int({ mode: 'boolean' }),
    moduleId: int().notNull().references(() => module.id, { onDelete: 'cascade' }),
    userId: int().notNull().references(() => user.id, { onDelete: 'cascade' }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

// Each assessment can be in one module
// Each assessment can have many tasks
export const assessmentRelations = relations(assessment, ({ one, many }) => ({
    module: one(module, {
        fields: [assessment.moduleId],
        references: [module.id],
    }),
    tasks: many(task),
}));


export const InsertAssessment = createInsertSchema(assessment, {
    name: (field) => field.min(1).max(100),
    description: (field) => field.max(1000),
    moduleId: (field) => field,
    releasedAt: () => preprocessDate,
    dueAt: () => preprocessDate,
}).omit({
    id: true,
    slug: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export type AssessmentSchema = typeof assessment.$inferSelect;

export type InsertAssessment = z.infer<typeof InsertAssessment>;