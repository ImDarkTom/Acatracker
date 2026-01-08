import { updateTaskById } from "~~/lib/db/queries/tasks";
import { InsertTask } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { parseIdParam, validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const id = parseIdParam(event);
    const bodyData = await validateBody(event, InsertTask);

    const updated = await updateTaskById(id, bodyData, event.context.user.id);

    if (!updated) {
        throw createError({
            statusCode: 404,
            statusMessage: "Task not found."
        });
    }

    setResponseStatus(event, 204);
});