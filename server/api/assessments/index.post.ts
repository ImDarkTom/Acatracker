import { LibsqlError } from "@libsql/client";
import { DrizzleError } from "drizzle-orm";
import slugify from "slug";
import { InsertAssessment } from "~~/lib/db/schema";
import { findUniqueSlug, insertAssessment } from "~~/lib/db/queries/assessments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const bodyData = await validateBody(event, InsertAssessment);

    const createdSlug = await findUniqueSlug(slugify(bodyData.name));

    try {
        return insertAssessment(bodyData, createdSlug, event.context.user.id);
    } catch (e) {
        const error = e as DrizzleError;
        if ((error.cause as LibsqlError).message.trim() === "SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: assessment.slug") {
            throw createError({
                statusCode: 409,
                statusMessage: "Slug must be unique (the assessment name is used to generate the slug)."
            });
        }
        throw error;
    }
});