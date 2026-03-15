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