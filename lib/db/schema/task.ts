import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { assessment } from '.';
import { user } from "./auth";
import z from "zod";
import { relations } from "drizzle-orm";

export const task = sqliteTable("task", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    description: text(),
    dueAt: int({ mode: 'timestamp_ms' }).notNull(),
    isCompleted: int({ mode: 'boolean' }),
    assessmentId: int().notNull().references(() => assessment.id, { onDelete: 'cascade' }),
    userId: int().notNull().references(() => user.id, { onDelete: 'cascade' }),
    createdAt: int().notNull().$default(() => Date.now()),
    updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const InsertTask = createInsertSchema(task, {
    name: z.string('A name is required').min(1).max(100),
    description: z.string().max(1000, 'Too long! (max 1000 chars)').optional(),
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