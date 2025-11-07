import { LibsqlError } from "@libsql/client";
import { DrizzleError, eq } from "drizzle-orm";
import slugify from "slug";
import { customAlphabet } from "nanoid";
import db from "~~/lib/db";
import { InsertAssesment, assesment } from "~~/lib/db/schema";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvqxyz", 5);

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

    // TODO: optimise this by getting all slugs beginning with the name, so we don't have to re-query
    let slug = slugify(result.data.name);
    let existing = !!(await db.query.assesment.findFirst({
        where: eq(assesment.slug, slug),
    }));

    while (existing) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;

        existing = !!(await db.query.assesment.findFirst({
            where: eq(assesment.slug, idSlug),
        }));

        if (!existing) {
            slug = idSlug;
        }
    }

    try {
        const [ created ] = await db.insert(assesment).values({
            ...result.data,
            slug: slug,
            userId: event.context.user.id,
        }).returning();

        return created;
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