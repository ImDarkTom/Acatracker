import { deleteAssessmentById } from "~~/lib/db/queries/assessments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    const idString = getRouterParam(event, "id") as string;
    const id = parseInt(idString);

    const deleted = deleteAssessmentById(id, event.context.user.id);

    if (!deleted) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        }));
    }

    setResponseStatus(event, 204);
})