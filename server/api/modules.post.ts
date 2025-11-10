import { LibsqlError } from "@libsql/client";
import { DrizzleError } from "drizzle-orm";
import { InsertModule } from "~~/lib/db/schema";
import { insertModule } from "~~/lib/db/queries/modules";
import defineAuthenticatedEventHander from "../utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    const result = await readValidatedBody(event, InsertModule.safeParse);

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
        return insertModule(result.data, event.context.user.id);
    } catch (e) {
        const error = e as DrizzleError;
        throw error;
    }
});