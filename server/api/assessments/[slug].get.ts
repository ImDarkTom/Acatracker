import { AssessmentsService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) throw createError({ statusCode: 400, statusMessage: "Assessment slug is required." });

    const assessment = await AssessmentsService.getOneAssessment(slug, event.context.user.id);
    return assessment;
});