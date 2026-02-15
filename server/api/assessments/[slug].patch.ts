import { updateAssessmentBySlug } from "~~/lib/db/queries/assessments";
import { InsertAssessment } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: "Assessment slug is required."
        });
    }

    const bodyData = await validateBody(event, InsertAssessment.partial())

    const updated = await updateAssessmentBySlug(slug, bodyData, event.context.user.id);

    if (!updated) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        }));
    }

    setResponseStatus(event, 204);
});