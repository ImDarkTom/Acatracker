import { updateAssessmentById } from "~~/lib/db/queries/assessments";
import { InsertAssessment } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    const idString = getRouterParam(event, "id") as string;
    const id = parseInt(idString);

    const result = await readValidatedBody(event, InsertAssessment.safeParse);

    if (!result.success) {
        const statusMessage = result.error.issues
            .map((issue) => `${issue.path.join('')}: ${issue.message}`)
            .join("; ");

        const statusData = result.error.issues
            .reduce((errors, issue) => {
                errors[issue.path.join('')] = issue.message;
                return errors;
            }, {} as Record<string, string>);

        return sendError(event, createError({
            status: 422,
            statusMessage,
            data: statusData,
        }));
    }

    const updated = updateAssessmentById(id, result.data, event.context.user.id);

    if (!updated) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        }));
    }

    setResponseStatus(event, 204);
});