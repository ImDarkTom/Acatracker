import { eq } from "drizzle-orm";
import db from "~~/lib/db";
import { calendarToken } from "~~/lib/db/schema";

export async function getUserByCalendarToken(token: string) {
    return await db.query.calendarToken.findFirst({
        where: eq(calendarToken.calendarToken, token),
    });
}

export async function getCalendarTokenForUser(userId: number) {
    return await db.query.calendarToken.findFirst({
        where: eq(calendarToken.userId, userId),
    });
}