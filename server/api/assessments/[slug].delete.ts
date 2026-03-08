import { deleteAssessmentBySlug } from "~~/lib/db/queries/assessments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
   const slug = getRouterParam(event, "slug");
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: "Assessment slug is required."
        });
    }

    const deleted = await deleteAssessmentBySlug(slug, event.context.user.id);

    if (!deleted) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        }));
    }

    setResponseStatus(event, 204);
});