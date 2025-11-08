import { LibsqlError } from "@libsql/client";
import { DrizzleError } from "drizzle-orm";
import slugify from "slug";
import { InsertAssesment } from "~~/lib/db/schema";
import { findUniqueSlug, insertAssesment } from "~~/lib/db/queries/assesments";
import defineAuthenticatedEventHander from "../utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
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

    const slug = await findUniqueSlug(slugify(result.data.name));

    try {
        return insertAssesment(result.data, slug, event.context.user.id);
    } catch (e) {
        const error = e as DrizzleError;
        if ((error.cause as LibsqlError).message.trim() === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: assesment.slug") {
            return sendError(event, createError({
                statusCode: 409,
                statusMessage: "Slug must be unique (the assesment name is used to generate the slug)."
            }));
        }
        throw error;
    }
});