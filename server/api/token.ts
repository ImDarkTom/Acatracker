import { getCalendarTokenFromUser } from "~~/lib/db/queries/calendarTokens";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    try {
        const token = await getCalendarTokenFromUser(event.context.user.id);
        return token;
    } catch (error) {
        if (error instanceof Error) {
            throw createError({
                statusCode: 500,
                statusMessage: error.message,
            });
        } else {
            throw createError({
                statusCode: 500,
                statusMessage: "An unknown error occurred",
            });
        }
    }
});