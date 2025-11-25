import ical from "ical-generator";
import { getUserFromCalendarToken } from "../../../lib/db/queries/calendarTokens";
import { getUserEvents } from "~~/server/utils/events";

type Event = {
    summary: string;
    start: Date;
    end: Date;
    description?: string;
    location?: string;
    url?: string;
};

export default defineEventHandler(async (event) => {
    const token = getRouterParam(event, "token") as string;

    const user = await getUserFromCalendarToken(token);

    if (!user || !user.userId) {
        return sendError(event, createError({
            status: 404,
            statusMessage: "Calendar token not found",
        }));
    }

    const events = await getUserEvents(user.userId);

    const calendar = ical({ name: 'events' });

    events.map((event) => calendar.createEvent(event));

    return calendar.toString();
});