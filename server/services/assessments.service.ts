import { customAlphabet } from "nanoid";
import { InsertAssessment } from "~~/lib/db/schema";
import slugify from "slug";
import { DrizzleError } from "drizzle-orm";
import { LibsqlError } from "@libsql/client";
import { AssessmentsRepository } from "../repositories";

// Create
export async function createAssessment(data: InsertAssessment, userId: number) {
    const createdSlug = await findUniqueSlug(slugify(data.name));

    try {
        return AssessmentsRepository.insertAssessment(data, createdSlug, userId);
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
}

// Read
export async function getOneAssessment(slug: string, userId: number) {
    const assessment = await AssessmentsRepository.getAssessmentWithTasks(slug, userId);

    if (!assessment) {
        throw createError({
            statusCode: 404,
            statusMessage: "Assessment not found.",
        });
    }

    return assessment;
}

export async function getAllAssessmentsForUser(userId: number) {
    const assessments = await AssessmentsRepository.findAssessments(userId);
    return assessments;
}

// Update
export async function updateAssessment(slug: string, newAssessment: Partial<InsertAssessment>, userId: number) {
    const updated = AssessmentsRepository.updateAssessmentBySlug(slug, newAssessment, userId);

    if (!updated) {
        throw createError({
            statusCode: 404,
            statusMessage: "Assessment not found."
        });
    }

    return updated;
}

// Delete
export async function deleteAssessment(slug: string, userId: number) {
    const deleted = await AssessmentsRepository.deleteAssessmentBySlug(slug, userId);

    if (!deleted) throw createError({ statusCode: 404, statusMessage: 'Assessment not found.' });

    return deleted;
}



// Util
const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvqxyz", 5);
async function findUniqueSlug(slug: string): Promise<string> {
    // TODO: optimise this by getting all slugs beginning with the name, so we don't have to re-query
    let existing = !!(await AssessmentsRepository.findAssessmentBySlug(slug));

    while (existing) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;

        existing = !!(await AssessmentsRepository.findAssessmentBySlug(idSlug));

        if (!existing) {
            return idSlug;
        }
    }

    return slug;
}
