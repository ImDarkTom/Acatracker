import { AssessmentsService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
   const slug = getRouterParam(event, "slug");
    if (!slug) throw createError({ statusCode: 400, statusMessage: "Assessment slug is required." });

    await AssessmentsService.deleteAssessment(slug, event.context.user.id);
    setResponseStatus(event, 204); // No Content
});