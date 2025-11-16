import { deleteModuleById } from "~~/lib/db/queries/modules";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    const idString = getRouterParam(event, "id") as string;
    const id = parseInt(idString);

    const deleted = deleteModuleById(id, event.context.user.id);

    if (!deleted) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Module not found."
        }));
    }

    setResponseStatus(event, 204);
})