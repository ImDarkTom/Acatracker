import { getUserPreferences } from "~~/lib/db/queries/userPreferences";

export default defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user;
    
    const userPreferences = await getUserPreferences(user.id);
    if (!userPreferences) {
        throw createError({
            status: 400,
            statusMessage: "User preferences not found.",
        });
    }

    return userPreferences;
});