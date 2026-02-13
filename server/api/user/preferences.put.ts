import { updateUserPreferences } from "~~/lib/db/queries/userPreferences";
import { InsertUserPreferences } from "~~/lib/db/schema";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;
    const bodyData = await validateBody(event, InsertUserPreferences.partial());

    const updated = await updateUserPreferences(userId, bodyData);

    if (!updated) {
        throw createError({
            statusCode: 404,
            statusMessage: "User preferences not found."
        });
    }

    return updated;
});