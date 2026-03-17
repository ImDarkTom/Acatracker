import { InsertUserPreferences } from "~~/lib/db/schema";
import { UserService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    const bodyData = await validateBody(event, InsertUserPreferences.partial());

    const updated = await UserService.updateUserPreferences(event.context.user.id, bodyData);
    return updated;
});