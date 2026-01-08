import { updateAssessmentById } from "~~/lib/db/queries/assessments";
import { InsertAssessment } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { parseIdParam, validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const id = parseIdParam(event);
    const bodyData = await validateBody(event, InsertAssessment)

    const updated = await updateAssessmentById(id, bodyData, event.context.user.id);

    if (!updated) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        }));
    }

    setResponseStatus(event, 204);
});