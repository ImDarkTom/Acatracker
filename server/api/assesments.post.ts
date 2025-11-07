import db from "~~/lib/db";
import { InsertAssesment, assesment } from "~~/lib/db/schema";

export default defineEventHandler(async (event) => {
    if (!event.context.user) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        }));
    }

    const result = await readValidatedBody(event, InsertAssesment.safeParse);

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

    const [ created ] = await db.insert(assesment).values({
        ...result.data,
        userId: event.context.user.id,
    }).returning();

    return created;
});