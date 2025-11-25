import { int, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import z from "zod";

export const calendarToken = sqliteTable("calendarToken", {
    userId: int().notNull().unique().references(() => user.id),
    calendarToken: text().notNull().$defaultFn(() => crypto.randomUUID()),
}, (table) => [
    primaryKey({ columns: [table.userId, table.calendarToken] })
]);

export const InsertCalendarToken = createInsertSchema(calendarToken).omit({
    calendarToken: true,
});

export type CalendarTokenSchema = typeof calendarToken.$inferSelect;

export type InsertCalendarToken = z.infer<typeof InsertCalendarToken>;