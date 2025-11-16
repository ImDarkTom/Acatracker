import { DrizzleError } from "drizzle-orm";
import { InsertTask } from "~~/lib/db/schema";
import defineAuthenticatedEventHander from "../../utils/defineAuthenticatedEventHandler";
import { insertTask } from "../../../lib/db/queries/tasks";

export default defineAuthenticatedEventHander(async (event) => {
    const result = await readValidatedBody(event, InsertTask.safeParse);

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

    try {
        return insertTask(result.data, event.context.user.id);
    } catch (e) {
        const error = e as DrizzleError;
        throw error;
    }
});