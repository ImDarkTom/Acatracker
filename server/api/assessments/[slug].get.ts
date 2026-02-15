import { getAssessmentWithTasks } from "~~/lib/db/queries/assessments";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: "Assessment slug is required."
        });
    }

    const assessment = await getAssessmentWithTasks(slug, event.context.user.id);
    if (!assessment) {
        throw createError({
            statusCode: 404,
            statusMessage: "Assessment not found.",
        });
    }

    return assessment;
});