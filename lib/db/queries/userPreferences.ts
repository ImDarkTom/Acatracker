import db from "..";
import { eq } from "drizzle-orm";
import { userPreferences, type UserPreferencesSchema } from "../schema";

export async function getUserPreferences(userId: number) {
    const returned = await db.query.userPreferences.findFirst({
        where: eq(userPreferences.userId, userId),
    });

    if (!returned) return undefined;
    
    return {
        totalYears: returned.totalYears,
        semestersPerYear: returned.semestersPerYear,
        currentYear: returned.currentYear,
        currentSemester: returned.currentSemester,
        weekStartsOn: returned.weekStartsOn,
    }
}

export type UserPreferencesResponse = Awaited<ReturnType<typeof getUserPreferences>>;

export async function updateUserPreferences(userId: number, newPreferences: Partial<UserPreferencesSchema>) {
    const [ updated ] = await db.update(userPreferences)
        .set(newPreferences)
        .where(
            eq(userPreferences.userId, userId),
        ).returning({
            totalYears: userPreferences.totalYears,
            semestersPerYear: userPreferences.semestersPerYear,
            currentYear: userPreferences.currentYear,
            currentSemester: userPreferences.currentSemester,
            weekStartsOn: userPreferences.weekStartsOn,
        });

    return updated;
}