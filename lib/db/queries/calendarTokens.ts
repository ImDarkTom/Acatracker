import db from "..";
import { eq } from "drizzle-orm";
import { calendarToken } from "../schema";

export async function getUserFromCalendarToken(token: string) {
    return db.query.calendarToken.findFirst({
        where: eq(calendarToken.calendarToken, token),
    });
}