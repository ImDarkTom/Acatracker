import { UserService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    const userPreferences = await UserService.getUserPreferences(event.context.user.id);

    return userPreferences;
});