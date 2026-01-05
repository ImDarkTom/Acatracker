import ical, { ICalCalendarMethod } from "ical-generator";
import { getUserFromCalendarToken } from "../../../lib/db/queries/calendarTokens";
import { getUserEvents } from "~~/server/utils/events";

export default defineEventHandler(async (event) => {
    const token = getRouterParam(event, "token");
    if (!token) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Token is required.'
        });
    }

    const user = await getUserFromCalendarToken(token);

    if (!user || !user.userId) {
        throw createError({
            status: 404,
            statusMessage: "Calendar token not found",
        });
    }

    const events = await getUserEvents(user.userId, `${getRequestProtocol(event)}://${getRequestHost(event)}`);
    const calendar = ical({ 
        name: 'Acatracker',
        description: 'Acatracker Assessments & Tasks',
        ttl: 43200, //12h
        method: ICalCalendarMethod.PUBLISH,
        prodId: { company: 'Acatracker', product: 'Acatracker Calendar 1.0', language: "EN" },
        events,
    });

    return new Response(calendar.toString(), {
        headers: {
            "Content-Type": "text/calendar",
            "Content-Disposition": 'attachment; filename="acatracker.ics"',
            "Cache-Control": "no-cache",
        }
    });
});