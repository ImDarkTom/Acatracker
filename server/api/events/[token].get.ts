import ical, { ICalCalendarMethod } from "ical-generator";
import { EventsService, UserService } from "~~/server/services";

export default defineEventHandler(async (event) => {
    const token = getRouterParam(event, "token");
    if (!token) throw createError({
        statusCode: 400,
        statusMessage: 'Token is required.'
    });

    const userId = await UserService.getUserIdFromCalendarToken(token);
    const events = await EventsService.getUserEvents(userId, `${getRequestProtocol(event)}://${getRequestHost(event)}`);

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