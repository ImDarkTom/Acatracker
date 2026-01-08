import { deleteAssessmentById } from "~~/lib/db/queries/assessments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { parseIdParam } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const id = parseIdParam(event);

    const deleted = await deleteAssessmentById(id, event.context.user.id);

    if (!deleted) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        }));
    }

    setResponseStatus(event, 204);
});