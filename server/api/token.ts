import { UserService } from "../services";

export default defineAuthenticatedEventHandler(async (event) => {
    const calendarToken = await UserService.getCalendarTokenForUser(event.context.user.id);

    return calendarToken;
});