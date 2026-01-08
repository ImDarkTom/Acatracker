import { deleteTaskById } from "~~/lib/db/queries/tasks";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { parseIdParam } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const id = parseIdParam(event);

    const deleted = await deleteTaskById(id, event.context.user.id);

    if (!deleted) {
        throw createError({
            statusCode: 404,
            statusMessage: "Task not found."
        });
    }

    setResponseStatus(event, 204);
});