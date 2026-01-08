import { updateModuleById } from "~~/lib/db/queries/modules";
import { InsertModule } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { parseIdParam, validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const id = parseIdParam(event);
    const bodyData = await validateBody(event, InsertModule);

    const updated = updateModuleById(id, bodyData, event.context.user.id);

    if (!updated) {
        throw createError({
            statusCode: 404,
            statusMessage: "Module not found."
        });
    }

    setResponseStatus(event, 204);
});