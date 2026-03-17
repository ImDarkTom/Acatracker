import { InsertAssessment } from "~~/lib/db/schema";
import { AssessmentsService } from "~~/server/services";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const slug = getRouterParam(event, "slug");
    if (!slug) throw createError({ statusCode: 400, statusMessage: "Assessment slug is required." })

    const bodyData = await validateBody(event, InsertAssessment.partial())

    await AssessmentsService.updateAssessment(slug, bodyData, event.context.user.id);
    setResponseStatus(event, 204); // No Content
});