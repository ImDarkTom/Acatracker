import { UserPreferencesSchema } from "~~/lib/db/schema";
import { UserRepository } from "../repositories";

export async function getUserIdFromCalendarToken(calendarToken: string) {
    const user = await UserRepository.getUserByCalendarToken(calendarToken);

    if (!user) throw createError({
        status: 404,
        statusMessage: "Calendar token not found.",
    });
    
    return user.userId;
}

export async function getCalendarTokenForUser(userId: number) {
    const calendarToken = await UserRepository.getCalendarTokenForUser(userId);

    if (!calendarToken) throw createError({
        statusCode: 404,
        statusMessage: "Calendar token not found."
    });

    return calendarToken.calendarToken;
}

export async function getUserPreferences(userId: number) {
    const userPreferences = await UserRepository.getUserPreferences(userId);

    if (!userPreferences) throw createError({
        status: 400,
        statusMessage: "User preferences not found.",
    });

    return userPreferences;
}

export async function updateUserPreferences(userId: number, updatedPreferences: Partial<UserPreferencesSchema>) {
    const newPreferences = await UserRepository.updateUserPreferences(userId, updatedPreferences);

    if (!newPreferences) throw createError({
        status: 400,
        statusMessage: "User preferences not found.",
    });

    return newPreferences;
}