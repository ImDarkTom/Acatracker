import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

import { module, task } from '.';
import { user } from "./auth";
import z from "zod";

export const assessment = sqliteTable("assessment", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    slug: text().notNull().unique(),
    description: text(),
    releasedAt: int({ mode: 'timestamp_ms' }),
    dueAt: int({ mode: 'timestamp_ms' }).notNull(),
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
    name: z.string('A name is required.').min(1).max(100, 'Too long! (max 100 chars)'),
    description: z.string().max(1000, 'Too long! (max 1000 chars)').optional(),
    dueAt: z.coerce.date(),
    releasedAt: z.coerce.date().optional(),
}).omit({
    id: true,
    slug: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export type AssessmentSchema = typeof assessment.$inferSelect;

export type InsertAssessment = z.infer<typeof InsertAssessment>;