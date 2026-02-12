import z from "zod";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { sqliteTable, text, integer, int } from "drizzle-orm/sqlite-core";

import { user } from "./auth";

export const userPreferences = sqliteTable("userPreferences", {
    userId: int().notNull().references(() => user.id, { onDelete: 'cascade' }),
    totalYears: int().notNull().default(4),
    semestersPerYear: int().notNull().default(2),
    currentYear: int().notNull().default(1),
    currentSemester: int().notNull().default(1),
    weekStartsOn: int().notNull().default(1),
    updatedAt: integer()
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .$onUpdate(() => Date.now())
        .notNull(),
});

export type UserPreferencesSchema = typeof userPreferences.$inferSelect;

export const InsertUserPreferences = createInsertSchema(userPreferences, {
    totalYears: (field) => field.min(1).max(16),
    semestersPerYear: (field) => field.min(1).max(8),
    currentYear: (field) => field.min(1).max(16),
    currentSemester: (field) => field.min(1).max(8),
    weekStartsOn: (field) => field.min(0).max(5) // 0 is Sunday, 1 is Monday, and so on
}).omit({
    userId: true,
    updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof InsertUserPreferences>;