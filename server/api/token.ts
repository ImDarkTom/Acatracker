import { findAssesments } from "~~/lib/db/queries/assesments";
import { getCalendarTokenFromUser } from "~~/lib/db/queries/calendarTokens";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    return getCalendarTokenFromUser(event.context.user.id);
});