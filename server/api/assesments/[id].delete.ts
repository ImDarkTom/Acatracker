import { deleteAssesmentById } from "~~/lib/db/queries/assesments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    const idString = getRouterParam(event, "id") as string;
    const id = parseInt(idString);

    const deleted = deleteAssesmentById(id, event.context.user.id);

    if (!deleted) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assesment not found."
        }));
    }

    setResponseStatus(event, 204);
})