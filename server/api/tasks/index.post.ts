import { DrizzleError } from "drizzle-orm";
import { InsertTask } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "../../utils/defineAuthenticatedEventHandler";
import { insertTask } from "../../../lib/db/queries/tasks";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const bodyData = await validateBody(event, InsertTask);

    try {
        return insertTask(bodyData, event.context.user.id);
    } catch (e) {
        const error = e as DrizzleError;
        throw error;
    }
});