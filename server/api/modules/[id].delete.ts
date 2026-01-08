import { deleteModuleById } from "~~/lib/db/queries/modules";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { parseIdParam } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const id = parseIdParam(event);

    const deleted = await deleteModuleById(id, event.context.user.id);

    if (!deleted) {
        throw createError({
            statusCode: 404,
            statusMessage: "Module not found."
        });
    }

    setResponseStatus(event, 204);
});